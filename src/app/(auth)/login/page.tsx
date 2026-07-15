"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/Button';
import InputField from '@/components/InputField';
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp';
import { establishSession } from '@/features/auth/session';
import { SignInFormData, signInSchema } from '@/features/auth/signIn';
import { useCountdown } from '@/hooks/use-countdown';
import { AuthService } from '@/services/Auth';
import { ApiClientError } from '@/services/api';

function getErrorMessage(error: unknown) {
  if (error instanceof ApiClientError || error instanceof Error) {
    return error.message;
  }

  return 'Error al iniciar sesión. Por favor, inténtalo de nuevo.';
}

const slotClassName =
  "h-11 w-8 rounded-lg border-slate-300 bg-white text-lg font-semibold text-slate-900 shadow-sm transition-all duration-200 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/50 aria-invalid:border-rose-300 aria-invalid:bg-rose-50 aria-invalid:text-rose-600 sm:h-14 sm:w-12 sm:rounded-xl sm:text-xl";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [otpEmail, setOtpEmail] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const {
    isActive: isCooldownActive,
    remainingSeconds,
    start: startCooldown,
  } = useCountdown();

  const {
    isActive: isResendCooldownActive,
    remainingSeconds: resendRemaining,
    start: startResendCooldown,
  } = useCountdown();

  const {
    isActive: isVerifyCooldownActive,
    remainingSeconds: verifyRemaining,
    start: startVerifyCooldown,
  } = useCountdown();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('reset') === 'success') {
      setStatusMessage('Contraseña actualizada. Inicia sesión nuevamente.');
    }
  }, []);

  const {
    mutate: authenticate,
    isPending,
    isError,
    error,
    reset: resetAuthentication,
  } = useMutation<void, unknown, SignInFormData>({
    mutationFn: async (data) => {
      await AuthService.login({
        email: data.email,
        password: data.password,
      });
      await AuthService.sendOtp({ email: data.email });
      setOtpEmail(data.email);
    },
    onSuccess: () => {
      setStep('otp');
      startResendCooldown(60);
    },
    onError: (requestError) => {
      if (
        requestError instanceof ApiClientError &&
        requestError.retryAfterSeconds
      ) {
        startCooldown(requestError.retryAfterSeconds);
      }
    },
  });

  const {
    mutate: verifyOtp,
    isPending: isVerifyingOtp,
    isError: isVerifyError,
    error: verifyError,
    reset: resetVerification,
  } = useMutation<void, unknown, string>({
    mutationFn: async (token) => {
      const session = await AuthService.verifyOtp({ email: otpEmail, token, type: 'email' });
      if (!session.access_token) {
        throw new Error('La API no devolvió una sesión válida.');
      }
      await establishSession(session);
    },
    onSuccess: () => {
      router.replace('/home');
    },
    onError: (requestError) => {
      if (
        requestError instanceof ApiClientError &&
        requestError.retryAfterSeconds
      ) {
        startVerifyCooldown(requestError.retryAfterSeconds);
      }
    },
  });

  const {
    mutate: resendOtp,
    isPending: isResendingOtp,
  } = useMutation<void, unknown, void>({
    mutationFn: async () => {
      await AuthService.sendOtp({ email: otpEmail });
    },
    onSuccess: () => {
      setOtpValue('');
      startResendCooldown(60);
    },
    onError: (requestError) => {
      if (
        requestError instanceof ApiClientError &&
        requestError.retryAfterSeconds
      ) {
        startResendCooldown(requestError.retryAfterSeconds);
      }
    },
  });

  const isSubmitDisabled = isPending || isCooldownActive;

  const clearRequestError = () => {
    if (isError) resetAuthentication();
  };

  const onSubmit = (data: SignInFormData) => {
    if (isSubmitDisabled) return;
    authenticate(data);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue.length !== 6 || isVerifyingOtp || isResendingOtp || isVerifyCooldownActive) return;
    verifyOtp(otpValue);
  };

  const goBackToCredentials = () => {
    setStep('credentials');
    setOtpValue('');
    resetVerification();
  };

  return (
    <section className="grid min-h-screen w-full overflow-hidden shadow-[0_24px_80px_rgba(88,75,255,0.22)] ring-1 ring-white/70 backdrop-blur-xl lg:grid-cols-[1.08fr_0.92fr]">
      <div className="relative min-h-[18rem] overflow-hidden bg-[linear-gradient(145deg,#7c3aed_0%,#4338ca_28%,#4f46e5_54%,#c084fc_100%)] p-5 text-white sm:p-7 lg:min-h-full lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.55)_0,rgba(255,255,255,0.15)_16%,transparent_40%),radial-gradient(circle_at_80%_28%,rgba(255,255,255,0.38)_0,rgba(255,255,255,0.08)_15%,transparent_34%),radial-gradient(circle_at_26%_78%,rgba(18,14,88,0.58)_0,rgba(18,14,88,0.14)_28%,transparent_60%)] opacity-95" />
        <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-cyan-300/35 blur-3xl" />
        <div className="absolute -right-8 top-28 h-44 w-44 rounded-full bg-fuchsia-300/30 blur-3xl" />
        <div className="absolute -bottom-14 left-8 h-48 w-48 rounded-full bg-indigo-950/35 blur-3xl" />

        <div className="relative flex h-full min-h-[18rem] flex-col justify-between rounded-[1.5rem] border border-white/20 bg-white/10 p-5 backdrop-blur-sm sm:p-6 lg:min-h-[34rem] lg:p-7">
          <div aria-hidden="true" className="text-[9rem] font-semibold leading-none tracking-tight">*</div>

          <div className="max-w-sm space-y-3">
            <p className="text-sm font-medium text-white/85 sm:text-base">Fácil y rápido</p>
            <h1 className="max-w-[13ch] text-3xl font-semibold leading-[1.02] tracking-tight text-white sm:text-4xl lg:text-[2.8rem]">
              Accede a tu espacio personal para claridad y productividad
            </h1>
            <p className="max-w-md text-sm leading-6 text-white/75 sm:text-base">
              Organiza tus tareas, ideas y progreso en un espacio tranquilo diseñado para mantenerte enfocado.
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-white/60 sm:text-sm">
            <span>LearnAI</span>
            <span>Espacio Personal</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-8 sm:px-8 lg:px-10">
        <div className="w-full max-w-lg">
          {step === 'credentials' ? (
            <>
              <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Iniciar Sesión
              </h2>

              {isError && (
                <div
                  className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
                  role="alert"
                >
                  <p className="font-medium">No pudimos iniciar sesión</p>
                  <p className="mt-0.5 text-red-600">
                    {getErrorMessage(error)}
                    {isCooldownActive ? ` Intenta de nuevo en ${remainingSeconds}s.` : ''}
                  </p>
                </div>
              )}

              {statusMessage ? (
                <p className="mt-3 text-sm text-emerald-700" role="status">
                  {statusMessage}
                </p>
              ) : null}

              <form
                id="login-form"
                className="mt-6 space-y-5"
                onSubmit={handleSubmit(onSubmit)}
                aria-busy={isPending}
                noValidate
              >
                <InputField
                  id="email"
                  label="Email"
                  placeholder="name@example.com"
                  type="email"
                  autoComplete="email"
                  disabled={isSubmitDisabled}
                  {...register('email', { onChange: clearRequestError })}
                  error={errors.email?.message}
                />

                <InputField
                  id="password"
                  label="Contraseña"
                  placeholder="Contraseña"
                  type="password"
                  autoComplete="current-password"
                  disabled={isSubmitDisabled}
                  {...register('password', { onChange: clearRequestError })}
                  error={errors.password?.message}
                />
                <div className="-mt-2 text-right">
                  <Link
                    href="/forgot-password"
                    aria-disabled={isPending}
                    className={`text-sm font-semibold text-indigo-500 transition hover:text-indigo-600 ${
                      isPending ? 'pointer-events-none opacity-50' : ''
                    }`}
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitDisabled}
                  className="mt-1 w-full"
                >
                  {isPending ? (
                    <>
                      <span
                        aria-hidden="true"
                        className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                      />
                      Iniciando sesión…
                    </>
                  ) : isCooldownActive ? (
                    `Espera ${remainingSeconds}s`
                  ) : (
                    'Iniciar Sesión'
                  )}
                </Button>

                <p
                  className="min-h-5 text-center text-sm text-slate-500"
                  aria-live="polite"
                  role="status"
                >
                  {isPending ? 'Validando tus credenciales de forma segura…' : ''}
                </p>
              </form>

              <p className="mt-7 text-center text-sm text-slate-500">
                ¿No tienes una cuenta?{' '}
                <Link
                  href="/register"
                  className="font-semibold text-indigo-500 transition hover:text-indigo-600"
                >
                  Regístrate
                </Link>
              </p>
            </>
          ) : (
            <form onSubmit={handleOtpSubmit} className="flex flex-col items-center">
              <h2 className="mt-1 self-start text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Verificación
              </h2>

              <p className="mt-4 self-start text-sm text-slate-500">
                Hemos enviado un código de 6 dígitos a{' '}
                <strong className="text-slate-700">{otpEmail}</strong>
              </p>

              {isVerifyError && (
                <p className="mt-4 self-start text-sm text-red-500" role="alert">
                  {verifyError instanceof Error
                    ? verifyError.message
                    : 'Código inválido. Por favor, inténtalo de nuevo.'}
                  {isVerifyCooldownActive
                    ? ` Intenta de nuevo en ${verifyRemaining}s.`
                    : ''}
                </p>
              )}

              <InputOTP
                maxLength={9}
                value={otpValue}
                onChange={(nextValue) => {
                  setOtpValue(nextValue);
                  if (isVerifyError) resetVerification();
                }}
                aria-label="Código de verificación"
                className="mt-6 gap-1 sm:gap-3"
              >
                <InputOTPGroup className="gap-1 sm:gap-2.5">
                  <InputOTPSlot index={0} aria-invalid={isVerifyError} className={slotClassName} />
                  <InputOTPSlot index={1} aria-invalid={isVerifyError} className={slotClassName} />
                  <InputOTPSlot index={2} aria-invalid={isVerifyError} className={slotClassName} />
                  <InputOTPSlot index={3} aria-invalid={isVerifyError} className={slotClassName} />
                </InputOTPGroup>
                <InputOTPSeparator className="mx-0 hidden font-light text-slate-400 sm:flex" />
                <InputOTPGroup className="gap-1 sm:gap-2.5">
                  <InputOTPSlot index={4} aria-invalid={isVerifyError} className={slotClassName} />
                  <InputOTPSlot index={5} aria-invalid={isVerifyError} className={slotClassName} />
                  <InputOTPSlot index={6} aria-invalid={isVerifyError} className={slotClassName} />
                  <InputOTPSlot index={7} aria-invalid={isVerifyError} className={slotClassName} />
                </InputOTPGroup>
              </InputOTP>

              <Button
                type="submit"
                variant="primary"
                disabled={isVerifyingOtp || isResendingOtp || isVerifyCooldownActive || otpValue.length !== 6}
                className="mt-6 w-full"
              >
                {isVerifyingOtp
                  ? 'Verificando...'
                  : isVerifyCooldownActive
                    ? `Espera ${verifyRemaining}s`
                    : 'Verificar'}
              </Button>

              <button
                type="button"
                disabled={isResendingOtp || isVerifyingOtp || isResendCooldownActive}
                onClick={() => resendOtp()}
                className="mt-4 text-sm font-semibold text-indigo-500 transition hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isResendingOtp
                  ? 'Reenviando…'
                  : isResendCooldownActive
                    ? `Reenviar en ${resendRemaining}s`
                    : 'Reenviar código'}
              </button>

              <button
                type="button"
                onClick={goBackToCredentials}
                className="mt-3 text-sm text-slate-500 transition hover:text-slate-700"
              >
                Volver atrás
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
