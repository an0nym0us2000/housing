export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-20">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Find Your Dream Home
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-600">
              Search thousands of properties for sale and rent across India. Your perfect home
              is just a search away.
            </p>

            {/* Search Box */}
            <div className="mx-auto max-w-4xl">
              <div className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-xl sm:flex-row">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Enter city, locality, or landmark"
                    className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <button className="rounded-md bg-primary-600 px-8 py-3 font-medium text-white hover:bg-primary-700">
                  Search
                </button>
              </div>

              {/* Quick Filters */}
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <button className="rounded-full border border-gray-300 bg-white px-6 py-2 text-sm font-medium hover:border-primary-600 hover:text-primary-600">
                  Buy
                </button>
                <button className="rounded-full border border-gray-300 bg-white px-6 py-2 text-sm font-medium hover:border-primary-600 hover:text-primary-600">
                  Rent
                </button>
                <button className="rounded-full border border-gray-300 bg-white px-6 py-2 text-sm font-medium hover:border-primary-600 hover:text-primary-600">
                  Commercial
                </button>
                <button className="rounded-full border border-gray-300 bg-white px-6 py-2 text-sm font-medium hover:border-primary-600 hover:text-primary-600">
                  New Projects
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container-custom">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                <svg
                  className="h-8 w-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Wide Selection</h3>
              <p className="text-gray-600">
                Thousands of verified properties across all major cities
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                <svg
                  className="h-8 w-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Verified Listings</h3>
              <p className="text-gray-600">
                All properties are verified by our team before publishing
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                <svg
                  className="h-8 w-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Quick & Easy</h3>
              <p className="text-gray-600">
                Find and connect with property owners in minutes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16">
        <div className="container-custom text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">
            Ready to List Your Property?
          </h2>
          <p className="mb-8 text-lg text-primary-100">
            Reach thousands of verified buyers and tenants
          </p>
          <a
            href="/list-property"
            className="inline-block rounded-md bg-white px-8 py-3 font-medium text-primary-600 hover:bg-gray-100"
          >
            List Property for Free
          </a>
        </div>
      </section>
    </div>
  );
}
