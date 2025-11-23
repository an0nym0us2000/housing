'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const listingId = params.id as string;

  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    message: '',
  });
  const [visitForm, setVisitForm] = useState({
    scheduledAt: '',
    visitorName: user?.name || '',
    visitorPhone: user?.phone || '',
    visitorEmail: user?.email || '',
    message: '',
  });

  useEffect(() => {
    loadListing();
    if (isAuthenticated) {
      checkIfSaved();
    }
  }, [listingId]);

  const loadListing = async () => {
    try {
      const data = await api.getListing(listingId);
      setListing(data);
    } catch (error) {
      console.error('Failed to load listing:', error);
      alert('Listing not found');
      router.push('/search');
    } finally {
      setLoading(false);
    }
  };

  const checkIfSaved = async () => {
    try {
      const response = await api.isSaved(listingId);
      setIsSaved(response.isSaved);
    } catch (error) {
      console.error('Failed to check saved status:', error);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      if (isSaved) {
        await api.unsaveListing(listingId);
        setIsSaved(false);
        alert('Removed from saved listings');
      } else {
        await api.saveListing(listingId);
        setIsSaved(true);
        alert('Added to saved listings');
      }
    } catch (error: any) {
      console.error('Failed to save listing:', error);
      alert(error.message || 'Failed to save listing');
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createLead({
        listingId,
        name: contactForm.name,
        email: contactForm.email,
        phone: contactForm.phone,
        message: contactForm.message,
        source: 'PHONE_REVEAL',
      });
      alert('Your inquiry has been sent to the owner!');
      setShowContactForm(false);
    } catch (error: any) {
      console.error('Failed to send inquiry:', error);
      alert(error.message || 'Failed to send inquiry');
    }
  };

  const handleVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      await api.createVisit({
        listingId,
        scheduledAt: visitForm.scheduledAt,
        visitorName: visitForm.visitorName,
        visitorPhone: visitForm.visitorPhone,
        visitorEmail: visitForm.visitorEmail,
        message: visitForm.message,
      });
      alert('Visit scheduled successfully! The owner will be notified.');
      setShowVisitModal(false);
      setVisitForm({
        scheduledAt: '',
        visitorName: user?.name || '',
        visitorPhone: user?.phone || '',
        visitorEmail: user?.email || '',
        message: '',
      });
    } catch (error: any) {
      console.error('Failed to schedule visit:', error);
      alert(error.message || 'Failed to schedule visit');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return null;
  }

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const propertyTypeLabel = listing.propertyType.replace('_', ' ');
  const listingTypeLabel = listing.listingType === 'SALE' ? 'For Sale' : 'For Rent';
  const isOwner = user?.id === listing.userId;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm">
          <Link href="/" className="text-primary-600 hover:text-primary-700">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/search" className="text-primary-600 hover:text-primary-700">
            Search
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{listing.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {listing.media && listing.media.length > 0 ? (
                <div className="aspect-video bg-gray-200">
                  <img
                    src={listing.media[0].url}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No images available</span>
                </div>
              )}
              {listing.media && listing.media.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-4">
                  {listing.media.slice(1, 5).map((media: any, index: number) => (
                    <div key={index} className="aspect-video bg-gray-200 rounded overflow-hidden">
                      <img
                        src={media.url}
                        alt={`Property ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
                  <p className="text-lg text-gray-600 mt-1">
                    {listing.locality?.name}, {listing.city?.name}
                  </p>
                </div>
                <button onClick={handleSave} className="p-2 rounded-full hover:bg-gray-100">
                  <svg
                    className={`h-6 w-6 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
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
              </div>

              <div className="flex items-center gap-2 mb-6">
                <span className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-800">
                  {listingTypeLabel}
                </span>
                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 capitalize">
                  {propertyTypeLabel}
                </span>
              </div>

              <div className="mb-6">
                <div className="text-3xl font-bold text-primary-600">
                  {formatPrice(listing.price)}
                  {listing.listingType === 'RENT' && (
                    <span className="text-lg text-gray-500 font-normal">/month</span>
                  )}
                </div>
                {listing.pricePerSqft && (
                  <p className="text-sm text-gray-600 mt-1">₹{listing.pricePerSqft}/sqft</p>
                )}
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b">
                {listing.bhk && (
                  <div>
                    <p className="text-sm text-gray-500">Bedrooms</p>
                    <p className="text-lg font-semibold text-gray-900">{listing.bhk} BHK</p>
                  </div>
                )}
                {listing.bathrooms && (
                  <div>
                    <p className="text-sm text-gray-500">Bathrooms</p>
                    <p className="text-lg font-semibold text-gray-900">{listing.bathrooms}</p>
                  </div>
                )}
                {listing.carpetArea && (
                  <div>
                    <p className="text-sm text-gray-500">Carpet Area</p>
                    <p className="text-lg font-semibold text-gray-900">{listing.carpetArea} sqft</p>
                  </div>
                )}
                {listing.furnishing && (
                  <div>
                    <p className="text-sm text-gray-500">Furnishing</p>
                    <p className="text-lg font-semibold text-gray-900 capitalize">
                      {listing.furnishing.replace('_', ' ').toLowerCase()}
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
              </div>
            </div>

            {/* Amenities */}
            {listing.amenities && listing.amenities.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {listing.amenities.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <svg
                        className="h-5 w-5 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{item.amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              {isOwner ? (
                <div className="text-center py-6">
                  <p className="text-gray-600 mb-4">This is your property</p>
                  <Link
                    href="/dashboard"
                    className="block w-full rounded-md bg-primary-600 px-4 py-2 text-center text-white hover:bg-primary-700"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              ) : showContactForm ? (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Contact Owner</h3>
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Your Phone"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Message (optional)"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      rows={3}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
                  >
                    Send Inquiry
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <div className="text-center mb-4">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 mb-3">
                      <span className="text-2xl font-bold text-primary-600">
                        {listing.user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{listing.user?.name}</h3>
                    <p className="text-sm text-gray-500">Property Owner</p>
                  </div>

                  <button
                    onClick={() => setShowContactForm(true)}
                    className="w-full rounded-md bg-primary-600 px-4 py-3 text-white font-medium hover:bg-primary-700 mb-2"
                  >
                    Contact Owner
                  </button>

                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        router.push('/login');
                        return;
                      }
                      setShowVisitModal(true);
                    }}
                    className="w-full rounded-md border-2 border-primary-600 px-4 py-3 text-primary-600 font-medium hover:bg-primary-50 mb-2"
                  >
                    Schedule Visit
                  </button>

                  <p className="text-xs text-center text-gray-500 mt-4">
                    By contacting, you agree to our Terms & Conditions
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Visit Scheduling Modal */}
        {showVisitModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Schedule Property Visit</h3>
                  <button
                    onClick={() => setShowVisitModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleVisitSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Visit Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={visitForm.scheduledAt}
                      onChange={(e) => setVisitForm({ ...visitForm, scheduledAt: e.target.value })}
                      min={new Date().toISOString().slice(0, 16)}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={visitForm.visitorName}
                      onChange={(e) => setVisitForm({ ...visitForm, visitorName: e.target.value })}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Phone *
                    </label>
                    <input
                      type="tel"
                      value={visitForm.visitorPhone}
                      onChange={(e) => setVisitForm({ ...visitForm, visitorPhone: e.target.value })}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Email
                    </label>
                    <input
                      type="email"
                      value={visitForm.visitorEmail}
                      onChange={(e) => setVisitForm({ ...visitForm, visitorEmail: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message (Optional)
                    </label>
                    <textarea
                      value={visitForm.message}
                      onChange={(e) => setVisitForm({ ...visitForm, message: e.target.value })}
                      rows={3}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Any special requests or questions..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowVisitModal(false)}
                      className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
                    >
                      Schedule Visit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
