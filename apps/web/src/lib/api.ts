const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    const headers = this.getHeaders();

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async register(data: {
    email: string;
    name: string;
    password: string;
    role?: string;
    phone?: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(email: string, password: string) {
    return this.request<{ accessToken: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser() {
    return this.request<any>('/users/me');
  }

  // Locations
  async getCities(query?: string) {
    const params = query ? `?q=${encodeURIComponent(query)}` : '';
    return this.request<any[]>(`/locations/cities${params}`);
  }

  async getLocalities(cityId: string, query?: string) {
    const params = query ? `?q=${encodeURIComponent(query)}` : '';
    return this.request<any[]>(`/locations/cities/${cityId}/localities${params}`);
  }

  // Amenities
  async getAmenities(category?: string) {
    const params = category ? `?category=${category}` : '';
    return this.request<any[]>(`/amenities${params}`);
  }

  // Listings
  async getListings(params?: Record<string, any>) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<{ data: any[]; meta: any }>(`/listings${queryString}`);
  }

  async getListing(id: string) {
    return this.request<any>(`/listings/${id}`);
  }

  async getMyListings(params?: Record<string, any>) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<{ data: any[]; meta: any }>(`/listings/my-listings${queryString}`);
  }

  async createListing(data: any) {
    return this.request<any>('/listings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateListing(id: string, data: any) {
    return this.request<any>(`/listings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteListing(id: string) {
    return this.request<any>(`/listings/${id}`, {
      method: 'DELETE',
    });
  }

  async submitListing(id: string) {
    return this.request<any>(`/listings/${id}/submit`, {
      method: 'POST',
    });
  }

  // Leads
  async createLead(data: any) {
    return this.request<any>('/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyLeads() {
    return this.request<any[]>('/leads/my-leads');
  }

  async getLeadStats() {
    return this.request<any>('/leads/stats');
  }

  // Saved Listings
  async saveListing(listingId: string) {
    return this.request<any>(`/saved-listings/${listingId}`, {
      method: 'POST',
    });
  }

  async unsaveListing(listingId: string) {
    return this.request<any>(`/saved-listings/${listingId}`, {
      method: 'DELETE',
    });
  }

  async getSavedListings() {
    return this.request<any[]>('/saved-listings');
  }

  async isSaved(listingId: string) {
    return this.request<{ isSaved: boolean }>(`/saved-listings/${listingId}/status`);
  }

  // Visits
  async createVisit(data: any) {
    return this.request<any>('/visits', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyVisitsAsVisitor(params?: Record<string, any>) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<{ data: any[]; meta: any }>(`/visits/my-visits-as-visitor${queryString}`);
  }

  async getMyVisitsAsOwner(params?: Record<string, any>) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<{ data: any[]; meta: any }>(`/visits/my-visits-as-owner${queryString}`);
  }

  async getVisit(id: string) {
    return this.request<any>(`/visits/${id}`);
  }

  async confirmVisit(id: string, data?: any) {
    return this.request<any>(`/visits/${id}/confirm`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    });
  }

  async rescheduleVisit(id: string, data: any) {
    return this.request<any>(`/visits/${id}/reschedule`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async cancelVisit(id: string, reason: string) {
    return this.request<any>(`/visits/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ cancellationReason: reason }),
    });
  }

  async completeVisit(id: string, feedback?: string, rating?: number) {
    return this.request<any>(`/visits/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify({ feedback, rating }),
    });
  }

  async getVisitStats() {
    return this.request<any>('/visits/stats');
  }

  // Teams
  async createTeam(data: any) {
    return this.request<any>('/teams', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTeams() {
    return this.request<any[]>('/teams');
  }

  async getTeam(id: string) {
    return this.request<any>(`/teams/${id}`);
  }

  async updateTeam(id: string, data: any) {
    return this.request<any>(`/teams/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteTeam(id: string) {
    return this.request<any>(`/teams/${id}`, {
      method: 'DELETE',
    });
  }

  async addTeamMember(teamId: string, data: any) {
    return this.request<any>(`/teams/${teamId}/members`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async removeTeamMember(teamId: string, memberId: string) {
    return this.request<any>(`/teams/${teamId}/members/${memberId}`, {
      method: 'DELETE',
    });
  }

  async updateTeamMemberRole(teamId: string, memberId: string, role: string) {
    return this.request<any>(`/teams/${teamId}/members/${memberId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }

  async getTeamStats(teamId: string) {
    return this.request<any>(`/teams/${teamId}/stats`);
  }

  // Tasks
  async createTask(data: any) {
    return this.request<any>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTasks(params?: Record<string, any>) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<{ data: any[]; meta: any }>(`/tasks${queryString}`);
  }

  async getMyTasks(params?: Record<string, any>) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<{ data: any[]; meta: any }>(`/tasks/my-tasks${queryString}`);
  }

  async getTask(id: string) {
    return this.request<any>(`/tasks/${id}`);
  }

  async updateTask(id: string, data: any) {
    return this.request<any>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteTask(id: string) {
    return this.request<any>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  async getTaskStats() {
    return this.request<any>('/tasks/stats');
  }
}

export const api = new ApiClient();
