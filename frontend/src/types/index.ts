export type RiskCategory = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: "USER" | "ADMIN";
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RiskIndicator {
  id?: string;
  code: string;
  title: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  description: string;
  evidence_snippet?: string;
}

export interface Assessment {
  id: string;
  job_title: string;
  company_name?: string;
  company_url?: string;
  recruiter_email?: string;
  salary_text?: string;
  experience_level?: string;
  description_excerpt: string;
  risk_score: number;
  risk_category: RiskCategory;
  ml_prediction: number;
  ml_probability: number;
  model_version: string;
  created_at: string;
  indicators: RiskIndicator[];
  positive_signals: string[];
  recommended_actions: string[];
  disclaimer: string;
}

export interface AssessmentListItem {
  id: string;
  job_title: string;
  company_name?: string;
  risk_score: number;
  risk_category: RiskCategory;
  ml_prediction: number;
  created_at: string;
}

export interface AssessmentListResponse {
  total: number;
  page: number;
  page_size: number;
  items: AssessmentListItem[];
}

export interface RiskCategoryCount {
  category: RiskCategory;
  count: number;
  percentage: number;
}

export interface AnalyticsOverview {
  total_assessments: number;
  high_risk_count: number;
  critical_risk_count: number;
  low_risk_count: number;
  moderate_risk_count: number;
  average_risk_score: number;
  categories: RiskCategoryCount[];
  recent_activity: {
    id: string;
    job_title: string;
    company_name: string;
    risk_score: number;
    risk_category: RiskCategory;
    created_at: string;
  }[];
}

export interface ModelVersion {
  id: string;
  version_tag: string;
  algorithm: string;
  dataset_name: string;
  dataset_size: number;
  scam_class_recall: number;
  scam_class_precision: number;
  f1_score: number;
  roc_auc: number;
  pr_auc: number;
  is_active: boolean;
  created_at: string;
}

export interface ModelEvaluation {
  model_version: string;
  algorithm: string;
  dataset_name: string;
  metrics: {
    accuracy: number;
    scam_recall: number;
    scam_precision: number;
    scam_f1: number;
    macro_f1: number;
    roc_auc: number;
    pr_auc: number;
  };
  confusion_matrix: {
    true_negatives: number;
    false_positives: number;
    false_negatives: number;
    true_positives: number;
  };
  top_scam_indicators: { feature: string; weight: number }[];
  top_legitimate_indicators: { feature: string; weight: number }[];
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  ip_address?: string;
  details_json?: string;
  created_at: string;
}
