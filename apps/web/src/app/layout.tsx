import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';

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
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
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
                      <li><a href="/search?listingType=SALE" className="hover:text-primary-600">Buy Property</a></li>
                      <li><a href="/search?listingType=RENT" className="hover:text-primary-600">Rent Property</a></li>
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
        </AuthProvider>
      </body>
    </html>
  );
}
