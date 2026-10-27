import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PRIVATE = ["/hoje", "/reflexao", "/audios", "/conta", "/comecar"];
const GUEST_ONLY = ["/", "/entrar"];

// Renova a sessão do Supabase em cada navegação e faz o redirecionamento
// inicial. A autorização real acontece de novo nas páginas, actions e RLS.
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.next({ request });

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers ?? {}).forEach(([k, v]) => response.headers.set(k, v));
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims?.sub);
  const path = request.nextUrl.pathname;

  const redirectTo = (target: string) => {
    const res = NextResponse.redirect(new URL(target, request.url));
    response.cookies.getAll().forEach((c) => res.cookies.set(c));
    return res;
  };

  if (!signedIn && PRIVATE.some((p) => path === p || path.startsWith(`${p}/`))) {
    return redirectTo(`/entrar?next=${encodeURIComponent(path)}`);
  }
  if (signedIn && GUEST_ONLY.includes(path)) {
    return redirectTo("/hoje");
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|audio/|favicon.ico|icon|apple-icon|manifest.webmanifest|.*\\.(?:svg|png|jpg|m4a)$).*)"],
};
