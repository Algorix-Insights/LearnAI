"use client";
import Link from 'next/link'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '@/components/InputField';
import { Button } from '@/components/Button';
import { useMutation } from '@tanstack/react-query';
import { AuthService } from '@/services/Auth';
import { useRouter } from 'next/navigation';
import { SignInFormData, signInSchema } from '@/features/auth/signIn';
import { getAuthToken, storePendingOtpEmail } from '@/lib/auth-client';
import { useEffect } from 'react';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function LoginPage() {
	const router = useRouter();

	useEffect(() => {
		if (getAuthToken()) {
			router.replace('/home');
		}
	}, [router]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignInFormData>({
		resolver: zodResolver(signInSchema),
	});

	const [showOtpNotice, setShowOtpNotice] = useState(false);

	const {
		mutate: sendOtp,
		isPending: isSendingOtp,
	} = useMutation({
		mutationFn: AuthService.sendOtp,
		onSuccess: () => {
			setShowOtpNotice(true);
		}
	});

	const {
		mutate: loginUser,
		isPending: isLoggingIn,
		isError: isLoginError,
		isSuccess: isLoginSuccess
	} = useMutation({
		mutationFn: AuthService.login,
		onSuccess: (_data, variables) => {
			const userEmail = variables.email;
			storePendingOtpEmail(userEmail);

			sendOtp({ email: userEmail, shouldCreateUser: false });
		}
	});

	const onSubmit = (data: SignInFormData) => {
		loginUser({
			email: data.email,
			password: data.password
		});
	};

	return (
		<>
		<section className="grid w-full min-h-screen overflow-hidden shadow-[0_24px_80px_rgba(88,75,255,0.22)] ring-1 ring-white/70 backdrop-blur-xl lg:grid-cols-[1.08fr_0.92fr]">

			{/* Left Content */}
			<div className="relative min-h-[18rem] overflow-hidden bg-[linear-gradient(145deg,#7c3aed_0%,#4338ca_28%,#4f46e5_54%,#c084fc_100%)] p-5 text-white sm:p-7 lg:min-h-full lg:p-8">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.55)_0,rgba(255,255,255,0.15)_16%,transparent_40%),radial-gradient(circle_at_80%_28%,rgba(255,255,255,0.38)_0,rgba(255,255,255,0.08)_15%,transparent_34%),radial-gradient(circle_at_26%_78%,rgba(18,14,88,0.58)_0,rgba(18,14,88,0.14)_28%,transparent_60%)] opacity-95" />
				<div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-cyan-300/35 blur-3xl" />
				<div className="absolute -right-8 top-28 h-44 w-44 rounded-full bg-fuchsia-300/30 blur-3xl" />
				<div className="absolute -bottom-14 left-8 h-48 w-48 rounded-full bg-indigo-950/35 blur-3xl" />

				<div className="relative flex h-full min-h-[18rem] flex-col justify-between rounded-[1.5rem] border border-white/20 bg-white/10 p-5 backdrop-blur-sm sm:p-6 lg:min-h-[34rem] lg:p-7">
					<div className="text-[9rem] font-semibold leading-none tracking-tight">*</div>

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

			{/* Right Content */}
			<div className="flex items-center justify-center px-5 py-8 sm:px-8 lg:px-10">
				<div className="w-full max-w-lg">
					<h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Iniciar Sesión</h2>

					{
						isLoginError && (
							<p className="mt-2 text-sm text-red-500">
								Error al iniciar sesión. Por favor, inténtalo de nuevo.
							</p>
						)
					}

					{
						isLoginSuccess && (
							<p className="mt-2 text-sm text-green-500">
								Sesión iniciada exitosamente. Redirigiendo...
							</p>
						)
					}

					<form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>

						<InputField
							id="email"
							label="Email"
							placeholder="name@example.com"
							type="email"
							{...register('email')}
							error={errors.email?.message}
						/>

						<InputField
							id="password"
							label="Contraseña"
							placeholder="Contraseña"
							type="password"
							{...register('password')}
							error={errors.password?.message}
						/>

						<Button
							type="submit"
							variant="primary"
							disabled={isLoggingIn || isSendingOtp}
							className="mt-1 w-full "
						>
							{isLoggingIn || isSendingOtp ? 'Procesando...' : 'Iniciar Sesión'}
						</Button>
					</form>

					<p className="mt-7 text-center text-sm text-slate-500">
						No tienes una cuenta? <Link href="/register" className="font-semibold text-indigo-500 transition hover:text-indigo-600">Regístrate</Link>
					</p>
				</div>
			</div>
		</section>

		<Dialog open={showOtpNotice} onOpenChange={setShowOtpNotice}>
            <DialogContent className="bg-white p-8 gap-5 sm:max-w-md">
                <DialogHeader className="gap-5">
                    <DialogTitle className="text-[color:var(--app-primary)] text-xl font-semibold">Código enviado</DialogTitle>
                    <DialogDescription className="text-sm">
                        Te enviamos un código de verificación a tu correo.
						Revisa tu bandeja de entrada o spam.
                    </DialogDescription>
                </DialogHeader>
                <Button variant="primary" className="w-full mt-2" onClick={() => router.push('/otp')}>
                    Continuar
                </Button>
            </DialogContent>
        </Dialog>

		</>
	);
}