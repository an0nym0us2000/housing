'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const STEPS = ['Basic Info', 'Location', 'Property Details', 'Amenities', 'Photos', 'Review'];

export default function ListPropertyPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<any[]>([]);
  const [localities, setLocalities] = useState<any[]>([]);
  const [amenities, setAmenities] = useState<any[]>([]);

  // Form data
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    title: '',
    description: '',
    listingType: 'SALE',
    propertyType: 'APARTMENT',

    // Step 2: Location
    cityId: '',
    localityId: '',
    address: '',
    landmark: '',
    pincode: '',

    // Step 3: Property Details
    bhk: '',
    bathrooms: '',
    balconies: '',
    carpetArea: '',
    builtUpArea: '',
    plotArea: '',
    price: '',
    pricePerSqft: '',
    furnishing: 'UNFURNISHED',
    facing: '',
    floor: '',
    totalFloors: '',
    ageOfProperty: '',
    availableFrom: '',
    parking: '',

    // Step 4: Amenities
    selectedAmenities: [] as string[],

    // Step 5: Photos
    photos: [''] as string[],
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadCities();
    loadAmenities();
  }, [isAuthenticated]);

  useEffect(() => {
    if (formData.cityId) {
      loadLocalities(formData.cityId);
    }
  }, [formData.cityId]);

  const loadCities = async () => {
    try {
      const data = await api.getCities();
      setCities(data);
    } catch (error) {
      console.error('Failed to load cities:', error);
    }
  };

  const loadLocalities = async (cityId: string) => {
    try {
      const data = await api.getLocalities(cityId);
      setLocalities(data);
    } catch (error) {
      console.error('Failed to load localities:', error);
    }
  };

  const loadAmenities = async () => {
    try {
      const data = await api.getAmenities();
      setAmenities(data);
    } catch (error) {
      console.error('Failed to load amenities:', error);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAmenityToggle = (amenityId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedAmenities: prev.selectedAmenities.includes(amenityId)
        ? prev.selectedAmenities.filter((id) => id !== amenityId)
        : [...prev.selectedAmenities, amenityId],
    }));
  };

  const addPhotoField = () => {
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ''],
    }));
  };

  const removePhotoField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handlePhotoChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.map((photo, i) => (i === index ? value : photo)),
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!(
          formData.title &&
          formData.description &&
          formData.listingType &&
          formData.propertyType
        );
      case 1:
        return !!(formData.cityId && formData.localityId);
      case 2:
        return !!formData.price;
      case 3:
        return true; // Amenities are optional
      case 4:
        return true; // Photos are optional
      case 5:
        return true; // Review step
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    } else {
      alert('Please fill in all required fields');
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (submitForReview: boolean = false) => {
    setLoading(true);
    try {
      // Prepare listing data
      const listingData: any = {
        title: formData.title,
        description: formData.description,
        listingType: formData.listingType,
        propertyType: formData.propertyType,
        cityId: formData.cityId,
        localityId: formData.localityId,
        price: parseFloat(formData.price),
        status: 'DRAFT',
      };

      // Optional fields
      if (formData.address) listingData.address = formData.address;
      if (formData.landmark) listingData.landmark = formData.landmark;
      if (formData.pincode) listingData.pincode = formData.pincode;
      if (formData.bhk) listingData.bhk = parseInt(formData.bhk);
      if (formData.bathrooms) listingData.bathrooms = parseInt(formData.bathrooms);
      if (formData.balconies) listingData.balconies = parseInt(formData.balconies);
      if (formData.carpetArea) listingData.carpetArea = parseFloat(formData.carpetArea);
      if (formData.builtUpArea) listingData.builtUpArea = parseFloat(formData.builtUpArea);
      if (formData.plotArea) listingData.plotArea = parseFloat(formData.plotArea);
      if (formData.pricePerSqft) listingData.pricePerSqft = parseFloat(formData.pricePerSqft);
      if (formData.furnishing) listingData.furnishing = formData.furnishing;
      if (formData.facing) listingData.facing = formData.facing;
      if (formData.floor) listingData.floor = parseInt(formData.floor);
      if (formData.totalFloors) listingData.totalFloors = parseInt(formData.totalFloors);
      if (formData.ageOfProperty) listingData.ageOfProperty = formData.ageOfProperty;
      if (formData.availableFrom)
        listingData.availableFrom = new Date(formData.availableFrom).toISOString();
      if (formData.parking) listingData.parking = parseInt(formData.parking);

      // Photos
      const validPhotos = formData.photos.filter((url) => url.trim() !== '');
      if (validPhotos.length > 0) {
        listingData.media = validPhotos.map((url, index) => ({
          url,
          type: 'IMAGE',
          order: index,
        }));
      }

      // Amenities
      if (formData.selectedAmenities.length > 0) {
        listingData.amenities = formData.selectedAmenities;
      }

      const listing = await api.createListing(listingData);

      // Submit for review if requested
      if (submitForReview) {
        await api.submitListing(listing.id);
        alert('Listing created and submitted for review!');
      } else {
        alert('Listing saved as draft!');
      }

      router.push('/dashboard');
    } catch (error: any) {
      console.error('Failed to create listing:', error);
      alert(error.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                placeholder="e.g., Spacious 3BHK Apartment in Koramangala"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={6}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                placeholder="Describe your property in detail..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Listing Type *
                </label>
                <select
                  value={formData.listingType}
                  onChange={(e) => handleChange('listingType', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                  required
                >
                  <option value="SALE">For Sale</option>
                  <option value="RENT">For Rent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type *
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => handleChange('propertyType', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                  required
                >
                  <option value="APARTMENT">Apartment</option>
                  <option value="VILLA">Villa</option>
                  <option value="INDEPENDENT_HOUSE">Independent House</option>
                  <option value="PLOT">Plot</option>
                  <option value="COMMERCIAL">Commercial</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Location</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <select
                  value={formData.cityId}
                  onChange={(e) => handleChange('cityId', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                  required
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Locality *</label>
                <select
                  value={formData.localityId}
                  onChange={(e) => handleChange('localityId', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                  required
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                placeholder="Building/Society name, Street"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Landmark</label>
                <input
                  type="text"
                  value={formData.landmark}
                  onChange={(e) => handleChange('landmark', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Nearby landmark"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => handleChange('pincode', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="560001"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Property Details</h2>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">BHK</label>
                <select
                  value={formData.bhk}
                  onChange={(e) => handleChange('bhk', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="">Select</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4 BHK</option>
                  <option value="5">5+ BHK</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                <input
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => handleChange('bathrooms', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Balconies</label>
                <input
                  type="number"
                  value={formData.balconies}
                  onChange={(e) => handleChange('balconies', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carpet Area (sqft)
                </label>
                <input
                  type="number"
                  value={formData.carpetArea}
                  onChange={(e) => handleChange('carpetArea', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Built-up Area (sqft)
                </label>
                <input
                  type="number"
                  value={formData.builtUpArea}
                  onChange={(e) => handleChange('builtUpArea', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plot Area (sqft)
                </label>
                <input
                  type="number"
                  value={formData.plotArea}
                  onChange={(e) => handleChange('plotArea', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Sqft (₹)
                </label>
                <input
                  type="number"
                  value={formData.pricePerSqft}
                  onChange={(e) => handleChange('pricePerSqft', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Furnishing</label>
                <select
                  value={formData.furnishing}
                  onChange={(e) => handleChange('furnishing', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="UNFURNISHED">Unfurnished</option>
                  <option value="SEMI_FURNISHED">Semi Furnished</option>
                  <option value="FULLY_FURNISHED">Fully Furnished</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facing</label>
                <select
                  value={formData.facing}
                  onChange={(e) => handleChange('facing', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="">Select</option>
                  <option value="NORTH">North</option>
                  <option value="SOUTH">South</option>
                  <option value="EAST">East</option>
                  <option value="WEST">West</option>
                  <option value="NORTH_EAST">North East</option>
                  <option value="NORTH_WEST">North West</option>
                  <option value="SOUTH_EAST">South East</option>
                  <option value="SOUTH_WEST">South West</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Floor</label>
                <input
                  type="number"
                  value={formData.floor}
                  onChange={(e) => handleChange('floor', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Floors</label>
                <input
                  type="number"
                  value={formData.totalFloors}
                  onChange={(e) => handleChange('totalFloors', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Parking</label>
                <input
                  type="number"
                  value={formData.parking}
                  onChange={(e) => handleChange('parking', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age of Property
                </label>
                <select
                  value={formData.ageOfProperty}
                  onChange={(e) => handleChange('ageOfProperty', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="">Select</option>
                  <option value="0_1_YEAR">0-1 Year</option>
                  <option value="1_3_YEARS">1-3 Years</option>
                  <option value="3_5_YEARS">3-5 Years</option>
                  <option value="5_10_YEARS">5-10 Years</option>
                  <option value="10_PLUS_YEARS">10+ Years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available From
                </label>
                <input
                  type="date"
                  value={formData.availableFrom}
                  onChange={(e) => handleChange('availableFrom', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Amenities</h2>
            <p className="text-gray-600">Select the amenities available in your property</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {amenities.map((amenity) => (
                <label
                  key={amenity.id}
                  className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={formData.selectedAmenities.includes(amenity.id)}
                    onChange={() => handleAmenityToggle(amenity.id)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{amenity.name}</div>
                    <div className="text-xs text-gray-500 capitalize">
                      {amenity.category.toLowerCase()}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {amenities.length === 0 && (
              <p className="text-center text-gray-500 py-8">Loading amenities...</p>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Photos</h2>
            <p className="text-gray-600">
              Add photo URLs for your property (upload feature coming soon)
            </p>

            <div className="space-y-4">
              {formData.photos.map((photo, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={photo}
                    onChange={(e) => handlePhotoChange(index, e.target.value)}
                    className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="https://example.com/photo.jpg"
                  />
                  {formData.photos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePhotoField(index)}
                      className="px-4 py-2 text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addPhotoField}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              + Add Another Photo
            </button>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> You can use image hosting services like Imgur or direct image
                URLs. Direct file upload will be available in future updates.
              </p>
            </div>
          </div>
        );

      case 5:
        const selectedCity = cities.find((c) => c.id === formData.cityId);
        const selectedLocality = localities.find((l) => l.id === formData.localityId);
        const selectedAmenitiesList = amenities.filter((a) =>
          formData.selectedAmenities.includes(a.id)
        );

        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Review Your Listing</h2>
            <p className="text-gray-600">Please review all details before submitting</p>

            <div className="bg-white border rounded-lg p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Title:</span>
                    <p className="font-medium">{formData.title}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <p className="font-medium capitalize">
                      {formData.propertyType.replace('_', ' ')} for {formData.listingType}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-gray-500">Description:</span>
                  <p className="text-gray-700 mt-1">{formData.description}</p>
                </div>
              </div>

              {/* Location */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Location</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">City:</span>
                    <p className="font-medium">{selectedCity?.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Locality:</span>
                    <p className="font-medium">{selectedLocality?.name}</p>
                  </div>
                  {formData.address && (
                    <div className="col-span-2">
                      <span className="text-gray-500">Address:</span>
                      <p className="font-medium">{formData.address}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Property Details */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Property Details</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Price:</span>
                    <p className="font-medium">₹{parseInt(formData.price).toLocaleString()}</p>
                  </div>
                  {formData.bhk && (
                    <div>
                      <span className="text-gray-500">BHK:</span>
                      <p className="font-medium">{formData.bhk} BHK</p>
                    </div>
                  )}
                  {formData.carpetArea && (
                    <div>
                      <span className="text-gray-500">Carpet Area:</span>
                      <p className="font-medium">{formData.carpetArea} sqft</p>
                    </div>
                  )}
                  {formData.furnishing && (
                    <div>
                      <span className="text-gray-500">Furnishing:</span>
                      <p className="font-medium capitalize">
                        {formData.furnishing.replace('_', ' ').toLowerCase()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Amenities */}
              {selectedAmenitiesList.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAmenitiesList.map((amenity) => (
                      <span
                        key={amenity.id}
                        className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                      >
                        {amenity.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Photos */}
              {formData.photos.filter((p) => p).length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Photos</h3>
                  <p className="text-sm text-gray-600">
                    {formData.photos.filter((p) => p).length} photo(s) added
                  </p>
                </div>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Your listing will be saved as a draft. You can submit it for
                review after saving, or edit it later from your dashboard.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={index} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      index <= currentStep
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div
                    className={`text-xs mt-2 text-center ${
                      index <= currentStep ? 'text-primary-600 font-medium' : 'text-gray-500'
                    }`}
                  >
                    {step}
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 ${
                      index < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between gap-4">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex gap-4">
              {currentStep === STEPS.length - 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleSubmit(false)}
                    disabled={loading}
                    className="px-6 py-2 border border-primary-600 rounded-md text-primary-600 hover:bg-primary-50 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save as Draft'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSubmit(true)}
                    disabled={loading}
                    className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Save & Submit for Review'}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
