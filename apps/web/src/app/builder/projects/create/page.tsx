'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function CreateProjectPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [cities, setCities] = useState<any[]>([]);
  const [localities, setLocalities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cityId: '',
    localityId: '',
    address: '',
    pincode: '',
    latitude: '',
    longitude: '',
    projectType: 'APARTMENT',
    projectStatus: 'UNDER_CONSTRUCTION',
    reraNumber: '',
    totalArea: '',
    totalTowers: '',
    totalUnits: '',
    launchDate: '',
    possessionDate: '',
    priceMin: '',
    priceMax: '',
    amenities: '',
    features: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user?.role !== 'BUILDER') {
      router.push('/dashboard');
      return;
    }
    loadCities();
  }, [isAuthenticated, user]);

  const loadCities = async () => {
    try {
      const data = await api.getCities();
      setCities(data);
    } catch (error) {
      console.error('Failed to load cities:', error);
    }
  };

  const handleCityChange = async (cityId: string) => {
    setFormData({ ...formData, cityId, localityId: '' });
    if (cityId) {
      try {
        const data = await api.getLocalities(cityId);
        setLocalities(data);
      } catch (error) {
        console.error('Failed to load localities:', error);
      }
    } else {
      setLocalities([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const projectData: any = {
        name: formData.name,
        description: formData.description,
        cityId: formData.cityId,
        address: formData.address,
        projectType: formData.projectType,
        projectStatus: formData.projectStatus,
      };

      if (formData.localityId) projectData.localityId = formData.localityId;
      if (formData.pincode) projectData.pincode = formData.pincode;
      if (formData.latitude) projectData.latitude = parseFloat(formData.latitude);
      if (formData.longitude) projectData.longitude = parseFloat(formData.longitude);
      if (formData.reraNumber) projectData.reraNumber = formData.reraNumber;
      if (formData.totalArea) projectData.totalArea = parseFloat(formData.totalArea);
      if (formData.totalTowers) projectData.totalTowers = parseInt(formData.totalTowers);
      if (formData.totalUnits) projectData.totalUnits = parseInt(formData.totalUnits);
      if (formData.launchDate) projectData.launchDate = formData.launchDate;
      if (formData.possessionDate) projectData.possessionDate = formData.possessionDate;
      if (formData.priceMin) projectData.priceMin = parseFloat(formData.priceMin);
      if (formData.priceMax) projectData.priceMax = parseFloat(formData.priceMax);

      if (formData.amenities) {
        projectData.amenities = formData.amenities.split(',').map(a => a.trim()).filter(Boolean);
      }
      if (formData.features) {
        projectData.features = formData.features.split(',').map(f => f.trim()).filter(Boolean);
      }

      const project = await api.createProject(projectData);
      alert('Project created successfully! It will be reviewed by admin before being published.');
      router.push(`/builder/projects/${project.id}`);
    } catch (error: any) {
      alert(error.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
            <p className="mt-2 text-gray-600">Add a new builder project to the platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Prestige Lakeside Habitat"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your project, its unique features, and what makes it special..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Type *
                    </label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    >
                      <option value="APARTMENT">Apartment</option>
                      <option value="VILLA">Villa</option>
                      <option value="PLOT">Plot</option>
                      <option value="COMMERCIAL">Commercial</option>
                      <option value="MIXED_USE">Mixed Use</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Status *
                    </label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.projectStatus}
                      onChange={(e) => setFormData({ ...formData, projectStatus: e.target.value })}
                    >
                      <option value="UPCOMING">Upcoming</option>
                      <option value="UNDER_CONSTRUCTION">Under Construction</option>
                      <option value="READY_TO_MOVE">Ready to Move</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.cityId}
                    onChange={(e) => handleCityChange(e.target.value)}
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}, {city.state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Locality
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.localityId}
                    onChange={(e) => setFormData({ ...formData, localityId: e.target.value })}
                    disabled={!formData.cityId}
                  >
                    <option value="">Select Locality</option>
                    {localities.map((locality) => (
                      <option key={locality.id} value={locality.id}>
                        {locality.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Full address of the project"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 560066"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Project Configuration */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Configuration</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RERA Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., PRM/KA/RERA/1251/446/PR/171120/002426"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.reraNumber}
                    onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Area (in acres)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 25.5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.totalArea}
                    onChange={(e) => setFormData({ ...formData, totalArea: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Towers/Blocks
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 12"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.totalTowers}
                    onChange={(e) => setFormData({ ...formData, totalTowers: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Units
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 1200"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.totalUnits}
                    onChange={(e) => setFormData({ ...formData, totalUnits: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Launch Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.launchDate}
                    onChange={(e) => setFormData({ ...formData, launchDate: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Possession
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.possessionDate}
                    onChange={(e) => setFormData({ ...formData, possessionDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 5000000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.priceMin}
                    onChange={(e) => setFormData({ ...formData, priceMin: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 15000000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.priceMax}
                    onChange={(e) => setFormData({ ...formData, priceMax: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Features & Amenities</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amenities
                  </label>
                  <input
                    type="text"
                    placeholder="Swimming Pool, Gym, Clubhouse, Children Play Area (comma separated)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.amenities}
                    onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Features
                  </label>
                  <input
                    type="text"
                    placeholder="24x7 Security, Power Backup, Lift, Parking (comma separated)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Creating Project...' : 'Create Project'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
