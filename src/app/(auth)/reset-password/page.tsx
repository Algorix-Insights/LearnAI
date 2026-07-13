'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/Button';
import InputField from '@/components/InputField';
import {
  type ResetPasswordFormData,
  resetPasswordSchema,
} from '@/features/auth/recoverySchemas';
import { useCountdown } from '@/hooks/use-countdown';
import {
  clearAuthSession,
  clearPendingOtpSession,
  getPendingAuthChallenge,
  type PendingAuthChallenge,
} from '@/lib/auth-client';
import { AuthService } from '@/services/Auth';
import { ApiClientError } from '@/services/api';

export default function ResetPasswordPage() {
  const router = useRouter();
  const recoveryTokenRef = useRef<string | null>(null);
  const [challenge, setChallenge] = useState<PendingAuthChallenge | null>(null);
  const [progressMessage, setProgressMessage] = useState('');
  const {
    isActive: isCooldownActive,
    remainingSeconds,
    start: startCooldown,
  } = useCountdown();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const pendingChallenge = getPendingAuthChallenge();
    if (
      !pendingChallenge ||
      pendingChallenge.intent !== 'recovery' ||
      pendingChallenge.type !== 'recovery'
    ) {
      router.replace('/forgot-password');
      return;
    }

    setChallenge(pendingChallenge);
  }, [router]);

  const {
    mutate: resetPassword,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async (formData: ResetPasswordFormData) => {
      if (!challenge) {
        throw new Error('La solicitud de recuperación expiró. Solicita otro código.');
      }

      try {
        if (challenge.expiresAt <= Date.now()) {
          throw new Error(
            'La solicitud de recuperación expiró. Solicita otro código.',
          );
        }

        let recoveryAccessToken = recoveryTokenRef.current;
        if (!recoveryAccessToken) {
          setProgressMessage('Verificando código…');
          const recoverySession = await AuthService.verifyOtp({
            email: challenge.email,
            token: formData.token,
            type: 'recovery',
          });

          if (!recoverySession.access_token) {
            throw new Error('La API no devolvió un token de recuperación válido.');
          }

          recoveryAccessToken = recoverySession.access_token;
          recoveryTokenRef.current = recoveryAccessToken;
        }

        setProgressMessage('Actualizando contraseña…');
        await AuthService.resetPassword(
          { password: formData.password },
          recoveryAccessToken,
        );
      } finally {
        // Recovery JWT must never become an application session.
        clearAuthSession({ clearPending: false });
      }
    },
    onSuccess: () => {
      recoveryTokenRef.current = null;
      clearPendingOtpSession();
      setProgressMessage('Contraseña actualizada. Redirigiendo…');
      router.replace('/login?reset=success');
    },
    onError: (resetError) => {
      setProgressMessage('');
      if (
        resetError instanceof ApiClientError &&
        (resetError.status === 401 || resetError.status === 403)
      ) {
        recoveryTokenRef.current = null;
      }
      if (
        resetError instanceof ApiClientError &&
        resetError.retryAfterSeconds
      ) {
        startCooldown(resetError.retryAfterSeconds);
      }
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!challenge || isCooldownActive) return;
    resetPassword(data);
  };

  if (!challenge) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-slate-500" role="status">
        Verificando solicitud de recuperación…
      </div>
    );
  }

  return (
    <section className="grid min-h-screen w-full overflow-hidden shadow-[0_24px_80px_rgba(88,75,255,0.22)] ring-1 ring-white/70 backdrop-blur-xl lg:grid-cols-[1.08fr_0.92fr]">
      <div className="relative min-h-[18rem] overflow-hidden bg-[linear-gradient(145deg,#7c3aed_0%,#4338ca_28%,#4f46e5_54%,#c084fc_100%)] p-5 text-white sm:p-7 lg:min-h-full lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.55)_0,rgba(255,255,255,0.15)_16%,transparent_40%),radial-gradient(circle_at_80%_28%,rgba(255,255,255,0.38)_0,rgba(255,255,255,0.08)_15%,transparent_34%),radial-gradient(circle_at_26%_78%,rgba(18,14,88,0.58)_0,rgba(18,14,88,0.14)_28%,transparent_60%)] opacity-95" />
        <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-cyan-300/35 blur-3xl" />
        <div className="absolute -right-8 top-28 h-44 w-44 rounded-full bg-fuchsia-300/30 blur-3xl" />
        <div className="absolute -bottom-14 left-8 h-48 w-48 rounded-full bg-indigo-950/35 blur-3xl" />

        <div className="relative flex h-full min-h-[18rem] flex-col justify-between rounded-[1.5rem] border border-white/20 bg-white/10 p-5 backdrop-blur-sm sm:p-6 lg:min-h-[34rem] lg:p-7">
          <div className="text-[9rem] font-semibold leading-none tracking-tight">*</div>
          <div className="max-w-sm space-y-3">
            <p className="text-sm font-medium text-white/85 sm:text-base">
              Último paso
            </p>
            <h1 className="max-w-[13ch] text-3xl font-semibold leading-[1.02] tracking-tight text-white sm:text-4xl lg:text-[2.8rem]">
              Protege de nuevo tu cuenta
            </h1>
            <p className="max-w-md text-sm leading-6 text-white/75 sm:text-base">
              Verifica código recibido y elige una contraseña única.
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
          <p className="text-sm font-semibold text-indigo-500">{challenge.email}</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Nueva contraseña
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Usa código de 6 dígitos enviado a tu correo.
          </p>

          {isError ? (
            <p className="mt-4 text-sm text-red-500" role="alert">
              {error instanceof Error
                ? error.message
                : 'No fue posible actualizar la contraseña.'}
              {isCooldownActive
                ? ` Intenta de nuevo en ${remainingSeconds}s.`
                : ''}
            </p>
          ) : null}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <InputField
              id="token"
              label="Código de recuperación"
              placeholder="123456"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              disabled={isPending}
              {...register('token')}
              error={errors.token?.message}
            />

            <InputField
              id="password"
              label="Nueva contraseña"
              placeholder="Nueva contraseña"
              type="password"
              autoComplete="new-password"
              maxLength={256}
              disabled={isPending}
              {...register('password')}
              error={errors.password?.message}
            />

            <InputField
              id="repeatPassword"
              label="Confirmar contraseña"
              placeholder="Repite la nueva contraseña"
              type="password"
              autoComplete="new-password"
              maxLength={256}
              disabled={isPending}
              {...register('repeatPassword')}
              error={errors.repeatPassword?.message}
            />

            <Button
              type="submit"
              variant="primary"
              disabled={isPending || isCooldownActive}
              className="mt-1 w-full"
            >
              {isPending
                ? 'Actualizando…'
                : isCooldownActive
                  ? `Espera ${remainingSeconds}s`
                  : 'Actualizar contraseña'}
            </Button>
          </form>

          <p className="mt-5 min-h-5 text-center text-sm text-slate-500" aria-live="polite" role="status">
            {progressMessage}
          </p>

          <p className="mt-3 text-center text-sm text-slate-500">
            <Link
              href="/forgot-password"
              className="font-semibold text-indigo-500 transition hover:text-indigo-600"
            >
              Solicitar otro código
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
