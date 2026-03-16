"use client";

import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { selectIsAuthenticated } from "@/redux/features/auth/authSlice";

/**
 * Protected routes that require authentication.
 * Add route prefixes here as new pages are created.
 */
const PROTECTED_ROUTES = ["/dashboard", "/checkout"];

/**
 * Auth routes that authenticated users should be redirected away from.
 */
const AUTH_ROUTES = ["/auth/signin", "/auth/signup"];

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Client-side route protection component.
 * Wrap protected layouts with this component.
 *
 * - Unauthenticated users visiting protected routes -> redirect to /auth/signin
 * - Authenticated users visiting auth routes -> redirect to /
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
      pathname.startsWith(route),
    );
    const isAuthRoute = AUTH_ROUTES.some((route) =>
      pathname.startsWith(route),
    );

    if (!isAuthenticated && isProtectedRoute) {
      router.replace(`/auth/signin?redirect=${encodeURIComponent(pathname)}`);
    } else if (isAuthenticated && isAuthRoute) {
      router.replace("/");
    }
  }, [isAuthenticated, pathname, router]);

  // Don't render protected content until auth check passes
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (!isAuthenticated && isProtectedRoute) {
    return null;
  }

  return <>{children}</>;
}
