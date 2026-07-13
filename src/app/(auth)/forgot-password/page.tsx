'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/Button';
import InputField from '@/components/InputField';
import {
  type ForgotPasswordFormData,
  forgotPasswordSchema,
} from '@/features/auth/recoverySchemas';
import { useCountdown } from '@/hooks/use-countdown';
import { storePendingOtpEmail } from '@/lib/auth-client';
import { AuthService } from '@/services/Auth';
import { ApiClientError } from '@/services/api';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const {
    isActive: isCooldownActive,
    remainingSeconds,
    start: startCooldown,
  } = useCountdown();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const {
    mutate: requestRecovery,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: AuthService.forgotPassword,
    onSuccess: (_response, variables) => {
      storePendingOtpEmail(variables.email, 'recovery', 'recovery');
      router.push('/reset-password');
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

  const onSubmit = (data: ForgotPasswordFormData) => {
    if (isCooldownActive) return;
    requestRecovery({ email: data.email });
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
            <p className="text-sm font-medium text-white/85 sm:text-base">
              Recupera tu acceso
            </p>
            <h1 className="max-w-[13ch] text-3xl font-semibold leading-[1.02] tracking-tight text-white sm:text-4xl lg:text-[2.8rem]">
              Vuelve a tu espacio de aprendizaje
            </h1>
            <p className="max-w-md text-sm leading-6 text-white/75 sm:text-base">
              Recibirás un código seguro para crear una nueva contraseña.
            </p>
          </div>
          <div className="flex items-center justify-between text-xs text-white/60 sm:text-sm">
            <span>LearnAI</span>
            <span>Recuperación segura</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-8 sm:px-8 lg:px-10">
        <div className="w-full max-w-lg">
          <p className="text-sm font-semibold text-indigo-500">Seguridad</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Recuperar contraseña
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Ingresa correo asociado a tu cuenta. Enviaremos código de recuperación.
          </p>

          {isError ? (
            <p className="mt-4 text-sm text-red-500" role="alert">
              {error instanceof Error
                ? error.message
                : 'No fue posible iniciar la recuperación.'}
              {isCooldownActive
                ? ` Intenta de nuevo en ${remainingSeconds}s.`
                : ''}
            </p>
          ) : null}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <InputField
              id="email"
              label="Email"
              placeholder="name@example.com"
              type="email"
              autoComplete="email"
              disabled={isPending}
              {...register('email')}
              error={errors.email?.message}
            />

            <Button
              type="submit"
              variant="primary"
              disabled={isPending || isCooldownActive}
              className="mt-1 w-full"
            >
              {isPending
                ? 'Enviando…'
                : isCooldownActive
                  ? `Espera ${remainingSeconds}s`
                  : 'Enviar código'}
            </Button>
          </form>

          <p className="mt-5 min-h-5 text-center text-sm text-slate-500" aria-live="polite" role="status">
            {isPending ? 'Solicitando código de recuperación…' : ''}
          </p>

          <p className="mt-3 text-center text-sm text-slate-500">
            <Link
              href="/login"
              className="font-semibold text-indigo-500 transition hover:text-indigo-600"
            >
              Volver a iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
