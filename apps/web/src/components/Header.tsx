'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container-custom flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            Housing Platform
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/search?listingType=SALE" className="text-sm font-medium hover:text-primary-600">
              Buy
            </Link>
            <Link href="/search?listingType=RENT" className="text-sm font-medium hover:text-primary-600">
              Rent
            </Link>
            {isAuthenticated && user?.role === 'OWNER' && (
              <Link href="/list-property" className="text-sm font-medium hover:text-primary-600">
                List Property
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {user?.role === 'OWNER' && (
                <Link
                  href="/dashboard"
                  className="text-sm font-medium hover:text-primary-600"
                >
                  Dashboard
                </Link>
              )}
              <Link
                href="/saved"
                className="text-sm font-medium hover:text-primary-600"
              >
                Saved
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Hi, {user?.name}</span>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium hover:text-primary-600"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
