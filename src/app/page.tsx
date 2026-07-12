import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { AUTH_COOKIE, PENDING_OTP_COOKIE } from '@/lib/auth';

export default async function HomePage() {
  const cookieStore = await cookies();

  if (cookieStore.get(AUTH_COOKIE)?.value) {
    redirect('/home');
  }

  if (cookieStore.get(PENDING_OTP_COOKIE)?.value) {
    redirect('/otp');
  }

  redirect('/login');
}
