import Link from 'next/link';

interface PropertyCardProps {
  listing: any;
  onSave?: (id: string) => void;
  isSaved?: boolean;
}

export function PropertyCard({ listing, onSave, isSaved }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const primaryImage = listing.media?.[0]?.url || '/placeholder-property.jpg';
  const propertyTypeLabel = listing.propertyType.replace('_', ' ');
  const listingTypeLabel = listing.listingType === 'SALE' ? 'For Sale' : 'For Rent';

  return (
    <div className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
      <Link href={`/listings/${listing.id}`}>
        <div className="relative h-48 overflow-hidden bg-gray-200">
          {primaryImage && (
            <img
              src={primaryImage}
              alt={listing.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          )}
          <div className="absolute top-2 left-2">
            <span className="rounded bg-primary-600 px-2 py-1 text-xs font-medium text-white">
              {listingTypeLabel}
            </span>
          </div>
          {onSave && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onSave(listing.id);
              }}
              className="absolute top-2 right-2 rounded-full bg-white p-2 shadow-md hover:bg-gray-100"
            >
              <svg
                className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                fill={isSaved ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/listings/${listing.id}`}>
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{listing.title}</h3>
            <p className="text-sm text-gray-600">
              {listing.locality?.name}, {listing.city?.name}
            </p>
          </div>

          <div className="mb-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary-600">
              {formatPrice(listing.price)}
            </span>
            {listing.listingType === 'RENT' && (
              <span className="text-sm text-gray-500">/month</span>
            )}
          </div>

          <div className="mb-3 flex items-center gap-4 text-sm text-gray-600">
            {listing.bhk && (
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                {listing.bhk} BHK
              </span>
            )}
            {listing.bathrooms && (
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                  />
                </svg>
                {listing.bathrooms} Bath
              </span>
            )}
            {listing.carpetArea && (
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
                {listing.carpetArea} sqft
              </span>
            )}
          </div>

          <div className="flex items-center justify-between border-t pt-3">
            <span className="text-xs text-gray-500 capitalize">{propertyTypeLabel}</span>
            <span className="text-xs text-gray-500">{listing.viewCount || 0} views</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
