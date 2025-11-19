import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Housing Platform - Find Your Perfect Home',
  description: 'Complete real estate marketplace for buying, renting, and selling properties',
  keywords: ['real estate', 'housing', 'property', 'buy', 'rent', 'sell'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
            <div className="container-custom flex h-16 items-center justify-between">
              <div className="flex items-center gap-8">
                <a href="/" className="text-2xl font-bold text-primary-600">
                  Housing Platform
                </a>
                <nav className="hidden md:flex items-center gap-6">
                  <a href="/buy" className="text-sm font-medium hover:text-primary-600">
                    Buy
                  </a>
                  <a href="/rent" className="text-sm font-medium hover:text-primary-600">
                    Rent
                  </a>
                  <a href="/sell" className="text-sm font-medium hover:text-primary-600">
                    Sell
                  </a>
                </nav>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="/login"
                  className="text-sm font-medium hover:text-primary-600"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                >
                  Sign Up
                </a>
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t bg-gray-50 py-12">
            <div className="container-custom">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Housing Platform</h3>
                  <p className="text-sm text-gray-600">
                    Your trusted real estate marketplace
                  </p>
                </div>
                <div>
                  <h4 className="mb-4 font-semibold">For Buyers</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><a href="/buy" className="hover:text-primary-600">Buy Property</a></li>
                    <li><a href="/rent" className="hover:text-primary-600">Rent Property</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-4 font-semibold">For Owners</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><a href="/list-property" className="hover:text-primary-600">List Property</a></li>
                    <li><a href="/dashboard" className="hover:text-primary-600">Dashboard</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-4 font-semibold">Company</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><a href="/about" className="hover:text-primary-600">About Us</a></li>
                    <li><a href="/contact" className="hover:text-primary-600">Contact</a></li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 border-t pt-8 text-center text-sm text-gray-600">
                © 2025 Housing Platform. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
