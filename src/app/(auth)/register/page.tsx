"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/Button';
import InputField from '@/components/InputField';
import { establishSession } from '@/features/auth/session';
import { SignUpFormData, signUpSchema } from '@/features/auth/signUpSchema';
import { useCountdown } from '@/hooks/use-countdown';
import { storePendingOtpEmail } from '@/lib/auth-client';
import { AuthService } from '@/services/Auth';
import { ApiClientError } from '@/services/api';

type RegisterResult =
  | { flow: 'authenticated' }
  | { flow: 'otp'; email: string };

function getErrorMessage(error: unknown) {
  if (error instanceof ApiClientError || error instanceof Error) {
    return error.message;
  }

  return 'Error al registrar el usuario. Por favor, inténtalo de nuevo.';
}

export default function RegisterPage() {
  const router = useRouter();
  const {
    isActive: isCooldownActive,
    remainingSeconds,
    start: startCooldown,
  } = useCountdown();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      mode: 'password',
      name: '',
      lastname: '',
      email: '',
      password: '',
      repeatPassword: '',
    },
  });

  const mode = watch('mode');

  const {
    mutate: registerUser,
    isPending,
    isError,
    error,
    reset: resetRegistration,
  } = useMutation<RegisterResult, unknown, SignUpFormData>({
    mutationFn: async (data) => {
      const session = await AuthService.register({
        name: data.name,
        last_name: data.lastname,
        email: data.email,
        ...(data.mode === 'password'
          ? { password: data.password ?? '' }
          : {}),
      });

      if (Boolean(session.access_token)) {
        await establishSession(session);
        return { flow: 'authenticated' };
      }

      return { flow: 'otp', email: data.email };
    },
    onSuccess: (result) => {
      if (result.flow === 'authenticated') {
        router.replace('/home');
        return;
      }

      storePendingOtpEmail(result.email, 'register', 'email');
      router.push('/otp');
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

  const changeMode = (nextMode: SignUpFormData['mode']) => {
    setValue('mode', nextMode, { shouldValidate: false });
    clearErrors();
    resetRegistration();
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
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Registrarse
          </h2>

          <div
            className="mt-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1"
            role="group"
            aria-label="Método de registro"
          >
            <button
              type="button"
              disabled={isPending || isCooldownActive}
              aria-pressed={mode === 'password'}
              onClick={() => changeMode('password')}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                mode === 'password'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Con contraseña
            </button>
            <button
              type="button"
              disabled={isPending || isCooldownActive}
              aria-pressed={mode === 'passwordless'}
              onClick={() => changeMode('passwordless')}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                mode === 'passwordless'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sin contraseña
            </button>
          </div>

          {isError && (
            <p className="mt-3 text-sm text-red-500" role="alert">
              {getErrorMessage(error)}
              {isCooldownActive ? ` Intenta de nuevo en ${remainingSeconds}s.` : ''}
            </p>
          )}

          <form
            className="mt-6 space-y-5"
            onSubmit={handleSubmit((data) => registerUser(data))}
          >
            <input type="hidden" {...register('mode')} />

            <InputField
              id="name"
              label="Nombre"
              placeholder="Nombre"
              type="text"
              autoComplete="given-name"
              {...register('name')}
              error={errors.name?.message}
            />

            <InputField
              id="lastname"
              label="Apellido"
              placeholder="Apellido"
              type="text"
              autoComplete="family-name"
              {...register('lastname')}
              error={errors.lastname?.message}
            />

            <InputField
              id="email"
              label="Email"
              placeholder="name@example.com"
              type="email"
              autoComplete="email"
              {...register('email')}
              error={errors.email?.message}
            />

            {mode === 'password' ? (
              <>
                <InputField
                  id="password"
                  label="Contraseña"
                  placeholder="Contraseña"
                  type="password"
                  autoComplete="new-password"
                  {...register('password')}
                  error={errors.password?.message}
                />

                <InputField
                  id="repeatPassword"
                  label="Repetir Contraseña"
                  placeholder="Repetir Contraseña"
                  type="password"
                  autoComplete="new-password"
                  {...register('repeatPassword')}
                  error={errors.repeatPassword?.message}
                />
              </>
            ) : (
              <p className="text-sm leading-6 text-slate-500">
                Enviaremos un código por email para completar registro.
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={isPending || isCooldownActive}
              className="mt-1 w-full"
            >
              {isPending
                ? 'Procesando...'
                : isCooldownActive
                  ? `Espera ${remainingSeconds}s`
                  : mode === 'passwordless'
                    ? 'Enviar código'
                    : 'Registrarse'}
            </Button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">
            ¿Ya tienes una cuenta?{' '}
            <Link
              href="/login"
              className="font-semibold text-indigo-500 transition hover:text-indigo-600"
            >
              Inicia Sesión
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
