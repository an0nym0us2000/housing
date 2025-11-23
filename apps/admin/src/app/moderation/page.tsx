'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function ModerationPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [pendingListings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      loadPendingListings();
    }
  }, [isAuthenticated, isAdmin]);

  const loadPendingListings = async () => {
    setLoading(true);
    try {
      const response = await api.getListings({ status: 'UNDER_REVIEW' });
      setListings(response.data || response);
    } catch (error) {
      console.error('Failed to load pending listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (listingId: string) => {
    if (!confirm('Are you sure you want to approve this listing?')) {
      return;
    }

    setActionLoading(true);
    try {
      await api.approveListing(listingId);
      alert('Listing approved successfully!');
      loadPendingListings();
      setSelectedListing(null);
    } catch (error: any) {
      console.error('Failed to approve listing:', error);
      alert(error.message || 'Failed to approve listing');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectClick = (listing: any) => {
    setSelectedListing(listing);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setActionLoading(true);
    try {
      await api.rejectListing(selectedListing.id, rejectReason);
      alert('Listing rejected successfully');
      setShowRejectModal(false);
      setSelectedListing(null);
      setRejectReason('');
      loadPendingListings();
    } catch (error: any) {
      console.error('Failed to reject listing:', error);
      alert(error.message || 'Failed to reject listing');
    } finally {
      setActionLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-600">Access denied. Admin privileges required.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pending listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Content Moderation</h1>
        <p className="mt-1 text-sm text-gray-600">
          Review and approve property listings submitted by users
        </p>
      </div>

      {/* Stats */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <svg
            className="h-6 w-6 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="font-medium text-gray-900">
              {pendingListings.length} listing{pendingListings.length !== 1 ? 's' : ''} pending
              review
            </p>
            <p className="text-sm text-gray-600">Review listings to make them visible to buyers</p>
          </div>
        </div>
      </div>

      {/* Pending Listings */}
      {pendingListings.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">All caught up!</h3>
          <p className="mt-2 text-sm text-gray-500">
            There are no listings pending review at the moment
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingListings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-lg border overflow-hidden">
              <div className="p-6">
                <div className="flex gap-6">
                  {/* Image */}
                  <div className="flex-shrink-0">
                    {listing.media && listing.media[0] ? (
                      <img
                        src={listing.media[0].url}
                        alt={listing.title}
                        className="w-48 h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                        <svg
                          className="h-12 w-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{listing.title}</h3>
                        <p className="text-gray-600 mt-1">
                          {listing.locality?.name}, {listing.city?.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary-600">
                          {formatPrice(listing.price)}
                        </p>
                        {listing.listingType === 'RENT' && (
                          <p className="text-sm text-gray-500">/month</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Type</p>
                        <p className="font-medium text-gray-900 capitalize">
                          {listing.propertyType.replace('_', ' ')}
                        </p>
                      </div>
                      {listing.bhk && (
                        <div>
                          <p className="text-sm text-gray-500">BHK</p>
                          <p className="font-medium text-gray-900">{listing.bhk} BHK</p>
                        </div>
                      )}
                      {listing.carpetArea && (
                        <div>
                          <p className="text-sm text-gray-500">Area</p>
                          <p className="font-medium text-gray-900">{listing.carpetArea} sqft</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-500">Submitted</p>
                        <p className="font-medium text-gray-900">{formatDate(listing.updatedAt)}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Description</p>
                      <p className="text-gray-700 line-clamp-2">{listing.description}</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-2">Owner</p>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-600">
                            {listing.user?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{listing.user?.name}</p>
                          <p className="text-xs text-gray-500">{listing.user?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Amenities */}
                    {listing.amenities && listing.amenities.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-2">Amenities</p>
                        <div className="flex flex-wrap gap-2">
                          {listing.amenities.slice(0, 5).map((item: any) => (
                            <span
                              key={item.id}
                              className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700"
                            >
                              {item.amenity.name}
                            </span>
                          ))}
                          {listing.amenities.length > 5 && (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700">
                              +{listing.amenities.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                      <button
                        onClick={() => handleApprove(listing.id)}
                        disabled={actionLoading}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 font-medium"
                      >
                        <svg
                          className="h-5 w-5 inline mr-2"
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
                        Approve Listing
                      </button>
                      <button
                        onClick={() => handleRejectClick(listing)}
                        disabled={actionLoading}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 font-medium"
                      >
                        <svg
                          className="h-5 w-5 inline mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Reject Listing
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Listing</h3>
              <p className="text-sm text-gray-600 mb-4">
                Please provide a reason for rejecting this listing. The owner will be notified.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                placeholder="e.g., Inappropriate content, missing information, etc."
              />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowRejectModal(false)}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectSubmit}
                  disabled={actionLoading || !rejectReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading ? 'Rejecting...' : 'Reject Listing'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
