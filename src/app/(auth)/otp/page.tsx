"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/Button"
import { useMutation } from "@tanstack/react-query"
import { AuthService } from "@/services/Auth"
import { useEffect, useState } from "react"
import { clearPendingOtpSession, getAuthToken, getPendingOtpEmail, storeAuthToken, storeUserId } from "@/lib/auth-client"
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp"
import { useCountdown } from "@/hooks/use-countdown"
import { ApiClientError } from "@/services/api"

const slotClassName = "w-12 h-14 bg-zinc-900 border-zinc-700/80 text-zinc-100 text-xl font-semibold rounded-xl shadow-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500 aria-invalid:border-rose-500/80 aria-invalid:bg-rose-950/20 aria-invalid:text-rose-200"

export default function InputOTPInvalid() {
    const [value, setValue] = useState("")
    const [email, setEmail] = useState('')
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
        const authToken = getAuthToken()
        if (authToken) {
            router.replace('/home')
            return
        }

        const storedEmail = getPendingOtpEmail()
        if (storedEmail) {
            setEmail(storedEmail)
            startResendCooldown(60)
            return
        }

        router.replace('/login')
    }, [router, startResendCooldown])

    const {
        mutate: resendOtp,
        isPending: isResendingOtp,
        isError: isResendOtpError,
        error: resendOtpError,
    } = useMutation({
        mutationFn: AuthService.sendOtp,
        onSuccess: () => {
            setValue('')
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
    } = useMutation({
        mutationFn: async (payload: Parameters<typeof AuthService.verifyOtp>[0]) => {
            const session = await AuthService.verifyOtp(payload)
            if (!session.access_token) {
                throw new Error('La API no devolvió una sesión válida.')
            }
            return session
        },
        onSuccess: (data) => {
            storeAuthToken(data.access_token, data.expires_in ?? undefined)
            storeUserId(data.user_id)
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
        // CAMBIO: Validación actualizada a longitud de 8 dígitos
        if (!email || value.length !== 8) {
            return
        }
        verifyOtp({ email, token: value })
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full p-6">
            {/* CAMBIO: Se amplió el max-w-xl a max-w-2xl para dar holgura a los 8 slots */}
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center min-h-[250px] max-w-2xl bg-zinc-950 p-6 rounded-2xl border border-zinc-800 shadow-2xl w-full">
                <div className="mb-6 text-center">
                    <h3 className="text-lg font-medium text-zinc-100 tracking-wide">
                        Verificación de Seguridad
                    </h3>
                    {/* CAMBIO: Texto descriptivo actualizado a 8 dígitos */}
                    <p className="text-xs text-zinc-400 mt-1">
                        Introduce el código de 8 dígitos enviado a tu correo ({email})
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

                {/* CAMBIO: maxLength ahora es 8 y se reestructuraron los grupos a pares (2-2-2-2) */}
                <InputOTP maxLength={8} value={value} onChange={setValue} className="gap-3">
                    <InputOTPGroup className="gap-2.5">
                        <InputOTPSlot index={0} aria-invalid={isVerifyOtpError} className={slotClassName} />
                        <InputOTPSlot index={1} aria-invalid={isVerifyOtpError} className={slotClassName} />
                    </InputOTPGroup>

                    <InputOTPSeparator className="text-zinc-600 font-light mx-1" />

                    <InputOTPGroup className="gap-2.5">
                        <InputOTPSlot index={2} aria-invalid={isVerifyOtpError} className={slotClassName} />
                        <InputOTPSlot index={3} aria-invalid={isVerifyOtpError} className={slotClassName} />
                    </InputOTPGroup>

                    <InputOTPSeparator className="text-zinc-600 font-light mx-1" />

                    <InputOTPGroup className="gap-2.5">
                        <InputOTPSlot index={4} aria-invalid={isVerifyOtpError} className={slotClassName} />
                        <InputOTPSlot index={5} aria-invalid={isVerifyOtpError} className={slotClassName} />
                    </InputOTPGroup>

                    <InputOTPSeparator className="text-zinc-600 font-light mx-1" />

                    <InputOTPGroup className="gap-2.5">
                        <InputOTPSlot index={6} aria-invalid={isVerifyOtpError} className={slotClassName} />
                        <InputOTPSlot index={7} aria-invalid={isVerifyOtpError} className={slotClassName} />
                    </InputOTPGroup>
                </InputOTP>

                {/* CAMBIO: Deshabilitar el botón si la longitud no es exactamente 8 */}
                <Button
                    type="submit"
                    variant="primary"
                    disabled={isVerifyingOtp || isVerifyCooldownActive || !email || value.length !== 8}
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
                    disabled={isResendingOtp || isResendCooldownActive || !email}
                    onClick={() => resendOtp({ email })}
                    className="mt-4 text-sm font-medium text-indigo-300 transition hover:text-indigo-200 disabled:cursor-not-allowed disabled:text-zinc-500"
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