'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function TeamsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
  });
  const [addMemberForm, setAddMemberForm] = useState({
    userId: '',
    role: 'AGENT',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user?.role !== 'BROKER') {
      router.push('/dashboard');
      return;
    }
    loadTeams();
  }, [isAuthenticated, user]);

  const loadTeams = async () => {
    try {
      const data = await api.getTeams();
      setTeams(data);
    } catch (error) {
      console.error('Failed to load teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createTeam(createForm);
      alert('Team created successfully!');
      setShowCreateModal(false);
      setCreateForm({ name: '', description: '' });
      loadTeams();
    } catch (error: any) {
      alert(error.message || 'Failed to create team');
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamId) return;

    try {
      await api.addTeamMember(selectedTeamId, addMemberForm);
      alert('Member added successfully!');
      setShowAddMemberModal(false);
      setAddMemberForm({ userId: '', role: 'AGENT' });
      setSelectedTeamId(null);
      loadTeams();
    } catch (error: any) {
      alert(error.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (teamId: string, memberId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;

    try {
      await api.removeTeamMember(teamId, memberId);
      alert('Member removed successfully!');
      loadTeams();
    } catch (error: any) {
      alert(error.message || 'Failed to remove member');
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (!confirm('Are you sure you want to delete this team? This action cannot be undone.')) return;

    try {
      await api.deleteTeam(teamId);
      alert('Team deleted successfully!');
      loadTeams();
    } catch (error: any) {
      alert(error.message || 'Failed to delete team');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading teams...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Teams</h1>
            <p className="mt-2 text-gray-600">Manage your broker teams and agents</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
          >
            + Create Team
          </button>
        </div>

        {/* Teams List */}
        {teams.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 mb-4">You don't have any teams yet.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Create Your First Team
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div key={team.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{team.name}</h2>
                    {team.description && (
                      <p className="text-sm text-gray-600 mt-1">{team.description}</p>
                    )}
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${team.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {team.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Members:</span>
                    <span className="font-medium">{team._count?.members || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Listings:</span>
                    <span className="font-medium">{team._count?.listings || 0}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Team Members:</h3>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {team.members?.map((member: any) => (
                      <div key={member.id} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{member.user.name}</p>
                          <p className="text-xs text-gray-500">{member.role}</p>
                        </div>
                        {team.ownerId === user?.id && member.role !== 'OWNER' && (
                          <button
                            onClick={() => handleRemoveMember(team.id, member.userId)}
                            className="text-red-600 hover:text-red-800 text-xs"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedTeamId(team.id);
                      setShowAddMemberModal(true);
                    }}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                  >
                    Add Member
                  </button>
                  <button
                    onClick={() => router.push(`/broker/teams/${team.id}`)}
                    className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 text-sm"
                  >
                    View Details
                  </button>
                  {team.ownerId === user?.id && (
                    <button
                      onClick={() => handleDeleteTeam(team.id)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Team Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-4">Create New Team</h2>
              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Create Team
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Member Modal */}
        {showAddMemberModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-4">Add Team Member</h2>
              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter user ID to add"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={addMemberForm.userId}
                    onChange={(e) => setAddMemberForm({ ...addMemberForm, userId: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={addMemberForm.role}
                    onChange={(e) => setAddMemberForm({ ...addMemberForm, role: e.target.value })}
                  >
                    <option value="AGENT">Agent</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Add Member
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddMemberModal(false);
                      setSelectedTeamId(null);
                    }}
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
    </div>
  );
}
