import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parseSetCookie } from 'cookie';
import { checkServerSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes/:path*'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = await cookieStore.get('accessToken')?.value;
  const refreshToken = await cookieStore.get('refreshToken')?.value;

  const { pathname } = request.nextUrl;

  const isPublicRoute = publicRoutes.some((route) => {
    return pathname.startsWith(route);
  });

  const isPrivateRoute = privateRoutes.some((route) => {
    return pathname.startsWith(route);
  });

  if (!accessToken) {
    if (refreshToken) {
      const data = await checkServerSession();
      const setCookie = data.headers['set-cookie'];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

        for (const cookieStr of cookieArray) {
          const parsed = parseSetCookie(cookieStr);

          if (parsed.value) {
            cookieStore.set(parsed.name, parsed.value, parsed);
          }
        }

        if (isPublicRoute) {
          return NextResponse.redirect(new URL('/', request.url), {
            headers: {
              Cookie: cookieStore.toString()
            }
          });
        }

        if (isPrivateRoute) {
          return NextResponse.next({
            headers: {
              Cookie: cookieStore.toString()
            }
          });
        }
      }
    }

    if (isPublicRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  if (isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isPrivateRoute) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/profile/:path*', '/sign-in', '/sign-up', '/notes/:path*']
};
