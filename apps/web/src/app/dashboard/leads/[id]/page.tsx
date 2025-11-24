'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

type ActivityType = 'NOTE' | 'CALL' | 'EMAIL' | 'MEETING' | 'SITE_VISIT' | 'STATUS_CHANGE' | 'ASSIGNMENT';

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  duration?: number;
  scheduledAt?: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface Lead {
  id: string;
  name: string;
  email?: string;
  phone: string;
  message?: string;
  status: string;
  source: string;
  pipelineStage: string;
  createdAt: string;
  listing?: {
    id: string;
    title: string;
    price: number;
    city: any;
    locality: any;
  };
  project?: {
    id: string;
    name: string;
    city: any;
    locality: any;
  };
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  activities: Activity[];
}

const activityTypeLabels: Record<ActivityType, string> = {
  NOTE: 'Note',
  CALL: 'Call',
  EMAIL: 'Email',
  MEETING: 'Meeting',
  SITE_VISIT: 'Site Visit',
  STATUS_CHANGE: 'Status Change',
  ASSIGNMENT: 'Assignment',
};

const activityTypeIcons: Record<ActivityType, string> = {
  NOTE: '📝',
  CALL: '📞',
  EMAIL: '📧',
  MEETING: '🤝',
  SITE_VISIT: '🏠',
  STATUS_CHANGE: '🔄',
  ASSIGNMENT: '👤',
};

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [newActivity, setNewActivity] = useState({
    type: 'NOTE' as ActivityType,
    title: '',
    description: '',
    duration: undefined as number | undefined,
    scheduledAt: '',
  });
  const [submittingActivity, setSubmittingActivity] = useState(false);

  useEffect(() => {
    if (user) {
      fetchLeadDetails();
    }
  }, [user, params.id]);

  const fetchLeadDetails = async () => {
    try {
      const response = await api.get(`/leads/${params.id}`);
      setLead(response.data);
    } catch (error) {
      console.error('Error fetching lead details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingActivity(true);

    try {
      await api.post(`/leads/${params.id}/activities`, {
        type: newActivity.type,
        title: newActivity.title,
        description: newActivity.description || undefined,
        duration: newActivity.duration || undefined,
        scheduledAt: newActivity.scheduledAt || undefined,
      });

      setShowActivityModal(false);
      setNewActivity({
        type: 'NOTE',
        title: '',
        description: '',
        duration: undefined,
        scheduledAt: '',
      });
      fetchLeadDetails();
    } catch (error) {
      console.error('Error adding activity:', error);
    } finally {
      setSubmittingActivity(false);
    }
  };

  const updateLeadStatus = async (status: string) => {
    try {
      await api.patch(`/leads/${params.id}/status`, { status });
      fetchLeadDetails();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white shadow rounded-lg p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">Lead not found</p>
            <button
              onClick={() => router.back()}
              className="mt-4 text-blue-600 hover:text-blue-700"
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 mb-4 flex items-center"
          >
            ← Back to Leads
          </button>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">{lead.name}</h1>
            <div className="flex gap-2">
              <select
                value={lead.status}
                onChange={(e) => updateLeadStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="CONVERTED">Converted</option>
                <option value="LOST">Lost</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lead Information */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{lead.phone}</p>
                </div>
                {lead.email && (
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{lead.email}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Source</p>
                  <p className="font-medium capitalize">{lead.source}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span
                    className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                      lead.status === 'NEW'
                        ? 'bg-blue-100 text-blue-800'
                        : lead.status === 'CONTACTED'
                          ? 'bg-yellow-100 text-yellow-800'
                          : lead.status === 'QUALIFIED'
                            ? 'bg-purple-100 text-purple-800'
                            : lead.status === 'CONVERTED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {lead.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Created</p>
                  <p className="font-medium">{formatDate(lead.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Property/Project Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Property Details</h2>
              {lead.listing && (
                <div>
                  <p className="font-medium text-lg mb-2">{lead.listing.title}</p>
                  <p className="text-2xl font-bold text-blue-600 mb-2">
                    {formatCurrency(lead.listing.price)}
                  </p>
                  <p className="text-gray-600">
                    {lead.listing.locality?.name}, {lead.listing.city?.name}
                  </p>
                  <button
                    onClick={() => router.push(`/listings/${lead.listing?.id}`)}
                    className="mt-3 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    View Property →
                  </button>
                </div>
              )}
              {lead.project && (
                <div>
                  <p className="font-medium text-lg mb-2">{lead.project.name}</p>
                  <p className="text-gray-600">
                    {lead.project.locality?.name}, {lead.project.city?.name}
                  </p>
                  <button
                    onClick={() => router.push(`/projects/${lead.project?.id}`)}
                    className="mt-3 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    View Project →
                  </button>
                </div>
              )}
            </div>

            {lead.message && (
              <div className="bg-white shadow rounded-lg p-6 mt-6">
                <h2 className="text-xl font-semibold mb-4">Initial Message</h2>
                <p className="text-gray-700">{lead.message}</p>
              </div>
            )}
          </div>

          {/* Activity Timeline */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Activity Timeline</h2>
                <button
                  onClick={() => setShowActivityModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Activity
                </button>
              </div>

              <div className="space-y-4">
                {lead.activities.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No activities yet. Add your first activity above.
                  </p>
                ) : (
                  lead.activities.map((activity) => (
                    <div key={activity.id} className="flex gap-4 pb-4 border-b last:border-0">
                      <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                        {activityTypeIcons[activity.type]}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{activity.title}</p>
                            <p className="text-sm text-gray-600">
                              {activityTypeLabels[activity.type]} by {activity.user.name}
                            </p>
                          </div>
                          <p className="text-sm text-gray-500">
                            {formatDate(activity.createdAt)}
                          </p>
                        </div>
                        {activity.description && (
                          <p className="mt-2 text-gray-700">{activity.description}</p>
                        )}
                        {activity.duration && (
                          <p className="mt-1 text-sm text-gray-600">
                            Duration: {activity.duration} minutes
                          </p>
                        )}
                        {activity.scheduledAt && (
                          <p className="mt-1 text-sm text-gray-600">
                            Scheduled: {formatDate(activity.scheduledAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Activity Modal */}
      {showActivityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Add Activity</h3>
            <form onSubmit={handleAddActivity}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Activity Type
                  </label>
                  <select
                    value={newActivity.type}
                    onChange={(e) =>
                      setNewActivity({ ...newActivity, type: e.target.value as ActivityType })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="NOTE">Note</option>
                    <option value="CALL">Call</option>
                    <option value="EMAIL">Email</option>
                    <option value="MEETING">Meeting</option>
                    <option value="SITE_VISIT">Site Visit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newActivity.title}
                    onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newActivity.description}
                    onChange={(e) =>
                      setNewActivity({ ...newActivity, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows={3}
                  />
                </div>

                {(newActivity.type === 'CALL' || newActivity.type === 'MEETING') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={newActivity.duration || ''}
                      onChange={(e) =>
                        setNewActivity({
                          ...newActivity,
                          duration: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                )}

                {(newActivity.type === 'MEETING' || newActivity.type === 'SITE_VISIT') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Scheduled Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={newActivity.scheduledAt}
                      onChange={(e) =>
                        setNewActivity({ ...newActivity, scheduledAt: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowActivityModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  disabled={submittingActivity}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                  disabled={submittingActivity}
                >
                  {submittingActivity ? 'Adding...' : 'Add Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
