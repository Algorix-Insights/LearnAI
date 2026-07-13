"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/Button"
import { useMutation } from "@tanstack/react-query"
import { AuthService } from "@/services/Auth"
import { useEffect, useState } from "react"
import { clearPendingOtpSession, getAuthToken, getPendingOtpEmail, storeAuthToken } from "@/lib/auth-client"
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp"

const slotClassName = "w-12 h-14 bg-zinc-900 border-zinc-700/80 text-zinc-100 text-xl font-semibold rounded-xl shadow-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500 aria-invalid:border-rose-500/80 aria-invalid:bg-rose-950/20 aria-invalid:text-rose-200"

export default function InputOTPInvalid() {
    const [value, setValue] = useState("")
    const [email, setEmail] = useState('')
    const router = useRouter()

    useEffect(() => {
        const authToken = getAuthToken()
        if (authToken) {
            router.replace('/home')
            return
        }

        const storedEmail = getPendingOtpEmail()
        if (storedEmail) {
            setEmail(storedEmail)
            return
        }

        router.replace('/login')
    }, [router])

    const {
        mutate: verifyOtp,
        isPending: isVerifyingOtp,
        isError: isVerifyOtpError,
        isSuccess: isVerifyOtpSuccess
    } = useMutation({
        mutationFn: AuthService.verifyOtp,
        onSuccess: (data) => {
            if (data?.access_token) {
                storeAuthToken(data.access_token)
            }

            clearPendingOtpSession()
            router.replace('/home')
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || value.length !== 8) {
            return
        }
        verifyOtp({ email, token: value })
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full p-6">
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center min-h-[250px] max-w-xl bg-zinc-950 p-6 rounded-2xl border border-zinc-800 shadow-2xl w-full">
                <div className="mb-6 text-center">
                    <h3 className="text-lg font-medium text-zinc-100 tracking-wide">
                        Verificación de Seguridad
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                        Introduce el código de 8 dígitos enviado a tu correo ({email})
                    </p>
                </div>

                {isVerifyOtpError && (
                    <p className="text-sm text-red-500 mb-4">
                        Código inválido. Por favor, inténtalo de nuevo.
                    </p>
                )}

                {isVerifyOtpSuccess && (
                    <p className="text-sm text-green-500 mb-4">
                        Código verificado con éxito. Redirigiendo...
                    </p>
                )}

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

                <Button
                    type="submit"
                    variant="primary"
                    disabled={isVerifyingOtp || !email || value.length !== 8}
                    className="mt-6 w-full h-12 rounded-xl text-sm font-medium tracking-wide"
                >
                    <span className="text-sm font-medium text-zinc-100 tracking-wide">
                        {isVerifyingOtp ? 'Verificando...' : 'Verificar'}
                    </span>
                </Button>
            </form>
        </div>
    )
}   