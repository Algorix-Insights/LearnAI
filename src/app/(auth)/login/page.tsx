"use client";
export default function LoginPage() {
	return (
		<main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#f5f3ff_0%,_#eff2ff_38%,_#f8fbff_68%,_#eef2ff_100%)]  text-slate-900 ">
			{/* <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center justify-center"> */}
				<section className="grid w-full overflow-hidden rounded-[2rem] bg-white/90 shadow-[0_24px_80px_rgba(88,75,255,0.22)] ring-1 ring-white/70 backdrop-blur-xl lg:grid-cols-[1.08fr_0.92fr]">
					<div className="relative min-h-[18rem] overflow-hidden bg-[linear-gradient(145deg,#7c3aed_0%,#4338ca_28%,#4f46e5_54%,#c084fc_100%)] p-5 text-white sm:p-7 lg:min-h-full lg:p-8">
						<div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.55)_0,rgba(255,255,255,0.15)_16%,transparent_40%),radial-gradient(circle_at_80%_28%,rgba(255,255,255,0.38)_0,rgba(255,255,255,0.08)_15%,transparent_34%),radial-gradient(circle_at_26%_78%,rgba(18,14,88,0.58)_0,rgba(18,14,88,0.14)_28%,transparent_60%)] opacity-95" />
						<div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-cyan-300/35 blur-3xl" />
						<div className="absolute -right-8 top-28 h-44 w-44 rounded-full bg-fuchsia-300/30 blur-3xl" />
						<div className="absolute -bottom-14 left-8 h-48 w-48 rounded-full bg-indigo-950/35 blur-3xl" />

						<div className="relative flex h-full min-h-[18rem] flex-col justify-between rounded-[1.5rem] border border-white/20 bg-white/10 p-5 backdrop-blur-sm sm:p-6 lg:min-h-[34rem] lg:p-7">
							<div className="text-4xl font-semibold leading-none tracking-tight">*</div>

							<div className="max-w-sm space-y-3">
								<p className="text-sm font-medium text-white/85 sm:text-base">You can easily</p>
								<h1 className="max-w-[13ch] text-3xl font-semibold leading-[1.02] tracking-tight text-white sm:text-4xl lg:text-[2.8rem]">
									Get access your personal hub for clarity and productivity
								</h1>
								<p className="max-w-md text-sm leading-6 text-white/75 sm:text-base">
									Organize your tasks, ideas, and progress in one calm space built to keep you focused.
								</p>
							</div>

							<div className="flex items-center justify-between text-xs text-white/60 sm:text-sm">
								<span>LearnAI</span>
								<span>Smart learning workspace</span>
							</div>
						</div>
					</div>

					<div className="flex items-center px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
						<div className="w-full max-w-md">
							<div className="mb-8 flex items-center gap-3">
								{/* <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600/10 text-2xl font-bold text-indigo-600 ring-1 ring-indigo-100">
									*
								</div> */}
								<div>
									<p className="text-sm font-medium uppercase tracking-[0.28em] text-indigo-500">Bienvenido de nuevo</p>
									<h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Iniciar Sesión</h2>
								</div>
							</div>

							<p className="max-w-md text-sm leading-6 text-slate-500 sm:text-[0.96rem]">
								Access your tasks, notes, and projects anytime, anywhere, and keep everything flowing in one place.
							</p>

							<form className="mt-8 space-y-5">
								<label className="block space-y-2">
									<span className="text-sm font-medium text-slate-700">Your email</span>
									<input
										type="email"
										name="email"
										placeholder="faraz.hadiet786@gmail.com"
										className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
									/>
								</label>

								<label className="block space-y-2">
									<span className="text-sm font-medium text-slate-700">Password</span>
									<div className="relative">
										<input
											type="password"
											name="password"
											placeholder="Enter your password"
											className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
										/>
										<span className="absolute inset-y-0 right-4 flex items-center text-slate-400">o</span>
									</div>
								</label>

								<button
									type="submit"
									className="mt-1 inline-flex h-12 w-full items-center justify-center rounded-xl bg-[linear-gradient(135deg,#5b4bff_0%,#4338ca_100%)] text-sm font-semibold text-white shadow-[0_16px_30px_rgba(67,56,202,0.35)] transition hover:translate-y-[-1px] hover:shadow-[0_20px_36px_rgba(67,56,202,0.42)]"
								>
									Get Started
								</button>
							</form>

							<div className="mt-8 flex items-center gap-4 text-xs uppercase tracking-[0.28em] text-slate-400">
								<span className="h-px flex-1 bg-slate-200" />
								<span>or continue with</span>
								<span className="h-px flex-1 bg-slate-200" />
							</div>

							<div className="mt-6 grid grid-cols-1 gap-3">
								{/* <button className="flex h-10 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
									Be
								</button> */}
								<button className="flex h-10 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
									G
								</button>
								{/* <button className="flex h-10 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
									f
								</button> */}
							</div>

							<p className="mt-7 text-center text-sm text-slate-500">
								Don&apos;t have an account? <a href="/register" className="font-semibold text-indigo-600 transition hover:text-indigo-500">Sign up</a>
							</p>
						</div>
					</div>
				</section>
			{/* </div> */}
		</main>
	);
}
