import {
  AuthResponse,
  User,
  Assessment,
  AssessmentListResponse,
  AnalyticsOverview,
  ModelVersion,
  ModelEvaluation,
  AuditLog
} from "../types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

class ApiClient {
  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("hireshield_token");
  }

  public setToken(token: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("hireshield_token", token);
    }
  }

  public removeToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("hireshield_token");
      localStorage.removeItem("hireshield_user");
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.detail || "An unexpected error occurred.";
      throw new Error(errorMsg);
    }

    return data as T;
  }

  // Auth Endpoints
  async register(payload: { email: string; password: string; full_name: string }): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async login(payload: { email: string; password: string }): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async getMe(): Promise<User> {
    return this.request<User>("/auth/me");
  }

  // Assessment Endpoints
  async createAssessment(payload: {
    job_title: string;
    job_description: string;
    company_name?: string;
    company_url?: string;
    recruiter_email?: string;
    salary_text?: string;
    experience_level?: string;
  }): Promise<Assessment> {
    return this.request<Assessment>("/assessments", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async listAssessments(params?: {
    page?: number;
    page_size?: number;
    category?: string;
    search?: string;
  }): Promise<AssessmentListResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.page_size) query.append("page_size", params.page_size.toString());
    if (params?.category) query.append("category", params.category);
    if (params?.search) query.append("search", params.search);

    const qs = query.toString();
    return this.request<AssessmentListResponse>(`/assessments${qs ? `?${qs}` : ""}`);
  }

  async getAssessment(id: string): Promise<Assessment> {
    return this.request<Assessment>(`/assessments/${id}`);
  }

  async deleteAssessment(id: string): Promise<void> {
    return this.request<void>(`/assessments/${id}`, {
      method: "DELETE",
    });
  }

  getReportDownloadUrl(assessmentId: string): string {
    const token = this.getToken();
    return `${API_BASE}/assessments/${assessmentId}/report${token ? `?token=${encodeURIComponent(token)}` : ""}`;
  }

  async downloadReport(assessmentId: string, filename = "HireShield-Report.pdf"): Promise<void> {
    const token = this.getToken();
    const res = await fetch(`${API_BASE}/assessments/${assessmentId}/report`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) {
      throw new Error("Failed to download PDF report");
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  // Analytics Endpoints
  async getAnalyticsOverview(): Promise<AnalyticsOverview> {
    return this.request<AnalyticsOverview>("/analytics/overview");
  }

  // Models Endpoints
  async getActiveModel(): Promise<ModelVersion> {
    return this.request<ModelVersion>("/models/active");
  }

  async getModelEvaluations(): Promise<ModelEvaluation> {
    return this.request<ModelEvaluation>("/models/evaluations");
  }

  // Admin Endpoints
  async listUsers(skip = 0, limit = 50): Promise<User[]> {
    return this.request<User[]>(`/admin/users?skip=${skip}&limit=${limit}`);
  }

  async updateUserStatus(userId: string, isActive: boolean): Promise<User> {
    return this.request<User>(`/admin/users/${userId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ is_active: isActive }),
    });
  }

  async getAuditLogs(limit = 50): Promise<AuditLog[]> {
    return this.request<AuditLog[]>(`/admin/audit-logs?limit=${limit}`);
  }
}

export const api = new ApiClient();
