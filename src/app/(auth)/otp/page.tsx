"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/Button"
import { useMutation } from "@tanstack/react-query"
import { AuthService } from "@/services/Auth"
import { useEffect, useRef, useState } from "react"
import {
    clearPendingOtpSession,
    getPendingAuthChallenge,
    storePendingAuthChallenge,
    type PendingAuthChallenge,
} from "@/lib/auth-client"
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp"
import { useCountdown } from "@/hooks/use-countdown"
import { ApiClientError } from "@/services/api"
import { establishSession } from "@/features/auth/session"
import type { OtpVerificationType } from "@/services/contracts"

const slotClassName = "h-11 w-8 rounded-lg border-zinc-700/80 bg-zinc-900 text-lg font-semibold text-zinc-100 shadow-sm transition-all duration-200 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/50 aria-invalid:border-rose-500/80 aria-invalid:bg-rose-950/20 aria-invalid:text-rose-200 sm:h-14 sm:w-12 sm:rounded-xl sm:text-xl"

export default function InputOTPInvalid() {
    const [value, setValue] = useState("")
    const [challenge, setChallenge] = useState<PendingAuthChallenge | null>(null)
    const [hashError, setHashError] = useState<string | null>(null)
    const hashVerificationStarted = useRef(false)
    const router = useRouter()
    const {
        isActive: isResendCooldownActive,
        remainingSeconds: resendRemainingSeconds,
        start: startResendCooldown,
    } = useCountdown()
    const {
        isActive: isVerifyCooldownActive,
        remainingSeconds: verifyRemainingSeconds,
        start: startVerifyCooldown,
    } = useCountdown()

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search)
        const tokenHash = searchParams.get('token_hash')

        if (tokenHash && !hashVerificationStarted.current) {
            hashVerificationStarted.current = true
            const requestedType = searchParams.get('type')
            if (requestedType === 'recovery') {
                setHashError('Este enlace de recuperación no puede iniciar una sesión normal. Solicita un código nuevo para cambiar tu contraseña.')
                return
            }
            const allowedTypes: OtpVerificationType[] = [
                'email',
                'invite',
                'email_change',
            ]
            const type = allowedTypes.includes(requestedType as OtpVerificationType)
                ? requestedType as OtpVerificationType
                : 'email'

            void AuthService.verifyOtp({ token_hash: tokenHash, type })
                .then(establishSession)
                .then(() => {
                    clearPendingOtpSession()
                    router.replace('/home')
                })
                .catch((error: unknown) => {
                    setHashError(
                        error instanceof Error
                            ? error.message
                            : 'El enlace de verificación no es válido o ya fue utilizado.',
                    )
                    if (error instanceof ApiClientError && error.retryAfterSeconds) {
                        startVerifyCooldown(error.retryAfterSeconds)
                    }
                })
            return
        }

        const pendingChallenge = getPendingAuthChallenge()
        if (!pendingChallenge) {
            router.replace('/login')
            return
        }

        if (
            pendingChallenge.intent === 'recovery' ||
            pendingChallenge.type === 'recovery'
        ) {
            router.replace('/reset-password')
            return
        }

        setChallenge(pendingChallenge)
        startResendCooldown(60)
    }, [router, startResendCooldown, startVerifyCooldown])

    const {
        mutate: resendOtp,
        isPending: isResendingOtp,
        isError: isResendOtpError,
        error: resendOtpError,
    } = useMutation({
        mutationFn: AuthService.sendOtp,
        onSuccess: () => {
            setValue('')
            if (challenge) {
                storePendingAuthChallenge({
                    email: challenge.email,
                    intent: challenge.intent,
                    type: challenge.type,
                })
            }
            startResendCooldown(60)
        },
        onError: (error) => {
            if (error instanceof ApiClientError && error.retryAfterSeconds) {
                startResendCooldown(error.retryAfterSeconds)
            }
        },
    })

    const {
        mutate: verifyOtp,
        isPending: isVerifyingOtp,
        isError: isVerifyOtpError,
        error: verifyOtpError,
        reset: resetVerification,
    } = useMutation({
        mutationFn: async (payload: Parameters<typeof AuthService.verifyOtp>[0]) => {
            const session = await AuthService.verifyOtp(payload)
            if (!session.access_token) {
                throw new Error('La API no devolvió una sesión válida.')
            }
            const verifiedSession = await establishSession(session)
            return verifiedSession
        },
        onSuccess: () => {
            clearPendingOtpSession()
            router.replace('/home')
        },
        onError: (error) => {
            if (error instanceof ApiClientError && error.retryAfterSeconds) {
                startVerifyCooldown(error.retryAfterSeconds)
            }
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (
            !challenge ||
            value.length !== 6 ||
            isVerifyingOtp ||
            isResendingOtp ||
            isVerifyCooldownActive
        ) {
            return
        }
        verifyOtp({
            email: challenge.email,
            token: value,
            type: challenge.type,
        })
    }

    if (!challenge && hashError) {
        return (
            <div className="grid min-h-screen place-items-center p-6">
                <div className="max-w-md rounded-2xl border border-rose-200 bg-white p-6 text-center shadow-xl">
                    <p className="text-sm text-rose-600" role="alert">{hashError}</p>
                    <button
                        type="button"
                        onClick={() => router.replace('/login')}
                        className="mt-5 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white"
                    >
                        Volver a iniciar sesión
                    </button>
                </div>
            </div>
        )
    }

    if (!challenge) {
        return (
            <div className="grid min-h-screen place-items-center text-sm text-slate-500" role="status">
                Verificando código pendiente…
            </div>
        )
    }

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="flex min-h-[250px] w-full max-w-xl flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950 p-4 shadow-2xl sm:p-6">
                <div className="mb-6 text-center">
                    <h1 className="text-lg font-medium text-zinc-100 tracking-wide">
                        Verificación de Seguridad
                    </h1>
                    <p className="text-xs text-zinc-400 mt-1">
                        Introduce el código de 6 dígitos enviado a tu correo ({challenge.email})
                    </p>
                </div>

                {isVerifyOtpError && (
                    <p className="text-sm text-red-500 mb-4" role="alert">
                        {verifyOtpError instanceof Error
                            ? verifyOtpError.message
                            : 'Código inválido. Por favor, inténtalo de nuevo.'}
                        {isVerifyCooldownActive
                            ? ` Intenta de nuevo en ${verifyRemainingSeconds}s.`
                            : ''}
                    </p>
                )}

                {isResendOtpError && (
                    <p className="text-sm text-red-500 mb-4" role="alert">
                        {resendOtpError instanceof Error
                            ? resendOtpError.message
                            : 'No fue posible reenviar el código.'}
                    </p>
                )}

                <InputOTP
                    maxLength={9}
                    value={value}
                    onChange={(nextValue) => {
                        setValue(nextValue)
                        if (isVerifyOtpError) resetVerification()
                    }}
                    aria-label="Código de verificación"
                    className="gap-1 sm:gap-3"
                >
                    <InputOTPGroup className="gap-1 sm:gap-2.5">
                        <InputOTPSlot index={0} aria-invalid={isVerifyOtpError} className={slotClassName} />
                        <InputOTPSlot index={1} aria-invalid={isVerifyOtpError} className={slotClassName} />
                        <InputOTPSlot index={2} aria-invalid={isVerifyOtpError} className={slotClassName} />
                        <InputOTPSlot index={3} aria-invalid={isVerifyOtpError} className={slotClassName} />

                    </InputOTPGroup>
                    <InputOTPSeparator className="mx-0 hidden font-light text-zinc-600 sm:flex" />
                    <InputOTPGroup className="gap-1 sm:gap-2.5">
                        <InputOTPSlot index={4} aria-invalid={isVerifyOtpError} className={slotClassName} />
                        <InputOTPSlot index={5} aria-invalid={isVerifyOtpError} className={slotClassName} />
                        <InputOTPSlot index={6} aria-invalid={isVerifyOtpError} className={slotClassName} />
                        <InputOTPSlot index={7} aria-invalid={isVerifyOtpError} className={slotClassName} />
                    </InputOTPGroup>
                </InputOTP>

                <Button
                    type="submit"
                    variant="primary"
                    disabled={isVerifyingOtp || isResendingOtp || isVerifyCooldownActive || value.length !== 6}
                    className="mt-6 w-full h-12 rounded-xl text-sm font-medium tracking-wide"
                >
                    <span className="text-sm font-medium text-zinc-100 tracking-wide">
                        {isVerifyingOtp
                            ? 'Verificando...'
                            : isVerifyCooldownActive
                                ? `Espera ${verifyRemainingSeconds}s`
                                : 'Verificar'}
                    </span>
                </Button>

                <button
                    type="button"
                    disabled={isResendingOtp || isVerifyingOtp || isResendCooldownActive}
                    onClick={() => resendOtp({
                        email: challenge.email,
                        should_create_user: false,
                    })}
                    className="mt-4 text-sm font-medium text-indigo-300 transition hover:text-indigo-200 disabled:cursor-not-allowed disabled:text-zinc-500"
                    aria-live="polite"
                >
                    {isResendingOtp
                        ? 'Reenviando…'
                        : isResendCooldownActive
                            ? `Reenviar en ${resendRemainingSeconds}s`
                            : 'Reenviar código'}
                </button>
            </form>
        </div>
    )
}
