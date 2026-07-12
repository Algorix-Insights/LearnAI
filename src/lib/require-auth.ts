import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { AUTH_COOKIE, PENDING_OTP_COOKIE } from '@/lib/auth';

export async function requireAuth() {
    const cookieStore = await cookies();

    if (cookieStore.get(AUTH_COOKIE)?.value) {
        return;
    }

    if (cookieStore.get(PENDING_OTP_COOKIE)?.value) {
        redirect('/otp');
    }

    redirect('/login');
}
