'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function BuilderProjectsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user?.role !== 'BUILDER') {
      router.push('/dashboard');
      return;
    }
    loadProjects();
  }, [isAuthenticated, user]);

  const loadProjects = async () => {
    try {
      const data = await api.getMyProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      UPCOMING: 'bg-purple-100 text-purple-800',
      UNDER_CONSTRUCTION: 'bg-blue-100 text-blue-800',
      READY_TO_MOVE: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace(/_/g, ' ')}
      </span>
    );
  };

  const getModerationBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project? This will delete all towers and units.')) return;

    try {
      await api.deleteProject(id);
      alert('Project deleted successfully!');
      loadProjects();
    } catch (error: any) {
      alert(error.message || 'Failed to delete project');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
            <p className="mt-2 text-gray-600">Manage your builder projects and inventory</p>
          </div>
          <button
            onClick={() => router.push('/builder/projects/create')}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
          >
            + Create Project
          </button>
        </div>

        {/* Projects List */}
        {projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 mb-4">You don't have any projects yet.</p>
            <button
              onClick={() => router.push('/builder/projects/create')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Create Your First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Project Image */}
                {project.images && project.images.length > 0 ? (
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={project.images[0]}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-semibold text-gray-900">{project.name}</h2>
                    {getStatusBadge(project.projectStatus)}
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                  </div>

                  <div className="mb-3 text-sm text-gray-600">
                    <p>📍 {project.city?.name}</p>
                    {project.locality && <p className="text-xs">{project.locality.name}</p>}
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Towers:</span>
                      <span className="ml-1 font-medium">{project._count?.towers || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Units:</span>
                      <span className="ml-1 font-medium">{project._count?.units || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Leads:</span>
                      <span className="ml-1 font-medium">{project._count?.leads || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Campaigns:</span>
                      <span className="ml-1 font-medium">{project._count?.campaigns || 0}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-xs font-medium text-gray-600">Status: </span>
                    {getModerationBadge(project.moderationStatus)}
                    {project.isPublished && (
                      <span className="ml-2 px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Published
                      </span>
                    )}
                  </div>

                  {project.priceMin && project.priceMax && (
                    <div className="mb-4 text-sm">
                      <span className="text-gray-600">Price Range: </span>
                      <span className="font-semibold text-gray-900">
                        ₹{(project.priceMin / 10000000).toFixed(2)}Cr - ₹{(project.priceMax / 10000000).toFixed(2)}Cr
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/builder/projects/${project.id}`)}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                    >
                      Manage
                    </button>
                    <button
                      onClick={() => router.push(`/projects/${project.slug}`)}
                      className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 text-sm"
                    >
                      View Public
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
