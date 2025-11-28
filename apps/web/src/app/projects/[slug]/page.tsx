'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const slug = params.slug as string;

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    message: '',
  });

  useEffect(() => {
    if (slug) {
      loadProject();
    }
  }, [slug]);

  const loadProject = async () => {
    try {
      const data = await api.getProjectBySlug(slug);
      setProject(data);
    } catch (error) {
      console.error('Failed to load project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createLead({
        projectId: project.id,
        name: leadForm.name,
        email: leadForm.email,
        phone: leadForm.phone,
        message: leadForm.message,
        source: 'WEBSITE_FORM',
      });
      alert('Your inquiry has been sent successfully! The builder will contact you soon.');
      setShowLeadModal(false);
      setLeadForm({ name: '', email: '', phone: '', message: '' });
    } catch (error: any) {
      alert(error.message || 'Failed to submit inquiry');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Project not found</p>
          <button onClick={() => router.push('/')} className="text-blue-600 hover:underline">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      {project.images && project.images.length > 0 ? (
        <div className="h-96 bg-gray-200 overflow-hidden">
          <img src={project.images[0]} alt={project.name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="h-96 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400 text-xl">No image available</span>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
                  <p className="text-gray-600">
                    📍 {project.locality?.name ? `${project.locality.name}, ` : ''}
                    {project.city?.name}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    project.projectStatus === 'READY_TO_MOVE'
                      ? 'bg-green-100 text-green-800'
                      : project.projectStatus === 'UNDER_CONSTRUCTION'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {project.projectStatus.replace(/_/g, ' ')}
                </span>
              </div>

              {project.priceMin && project.priceMax && (
                <div className="mb-4">
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{(project.priceMin / 10000000).toFixed(2)}Cr - ₹
                    {(project.priceMax / 10000000).toFixed(2)}Cr
                  </span>
                </div>
              )}

              <p className="text-gray-700 leading-relaxed">{project.description}</p>
            </div>

            {/* Project Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Details</h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {project.projectType && (
                  <div>
                    <p className="text-sm text-gray-600">Project Type</p>
                    <p className="font-medium">{project.projectType}</p>
                  </div>
                )}
                {project.totalArea && (
                  <div>
                    <p className="text-sm text-gray-600">Total Area</p>
                    <p className="font-medium">{project.totalArea} acres</p>
                  </div>
                )}
                {project.totalTowers && (
                  <div>
                    <p className="text-sm text-gray-600">Total Towers</p>
                    <p className="font-medium">{project.totalTowers}</p>
                  </div>
                )}
                {project.totalUnits && (
                  <div>
                    <p className="text-sm text-gray-600">Total Units</p>
                    <p className="font-medium">{project.totalUnits}</p>
                  </div>
                )}
                {project.possessionDate && (
                  <div>
                    <p className="text-sm text-gray-600">Possession</p>
                    <p className="font-medium">
                      {new Date(project.possessionDate).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                )}
                {project.reraNumber && (
                  <div>
                    <p className="text-sm text-gray-600">RERA</p>
                    <p className="font-medium text-xs">{project.reraNumber}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Amenities */}
            {project.amenities && project.amenities.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {project.amenities.map((amenity: string, index: number) => (
                    <div key={index} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {project.features && project.features.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {project.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center">
                      <span className="text-blue-500 mr-2">•</span>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Towers */}
            {project.towers && project.towers.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Towers</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {project.towers.map((tower: any) => (
                    <div key={tower.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900">{tower.name}</h3>
                      <p className="text-sm text-gray-600">{tower.totalFloors} floors</p>
                      <p className="text-sm text-gray-600">{tower._count?.units || 0} units</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              {/* Builder Info */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Builder</h3>
                <p className="font-medium text-gray-900">
                  {project.builder?.builderCompany || project.builder?.name}
                </p>
                {project.builder?.establishedYear && (
                  <p className="text-sm text-gray-600">Est. {project.builder.establishedYear}</p>
                )}
              </div>

              {/* Contact Button */}
              <button
                onClick={() => setShowLeadModal(true)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 font-medium mb-4"
              >
                Get in Touch
              </button>

              {/* Quick Stats */}
              <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Project ID:</span>
                  <span className="font-medium">{project.id.slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Posted:</span>
                  <span className="font-medium">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Modal */}
      {showLeadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Contact Builder</h2>
            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={leadForm.email}
                  onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={leadForm.phone}
                  onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows={3}
                  placeholder="I'm interested in this project..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={leadForm.message}
                  onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowLeadModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
