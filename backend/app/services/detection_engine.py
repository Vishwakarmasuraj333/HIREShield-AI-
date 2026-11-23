"""
Detection and Risk Assessment Engine for HireShield AI.
Combines genuine NLP machine learning output with transparent, evidence-based rule indicators.
Maintains clear demarcation between statistical ML probabilities and deterministic heuristics.
"""
import re
from typing import Dict, Any, List, Optional
from urllib.parse import urlparse
from app.ml.inference import ml_engine
from app.core.config import settings

# Common free / generic email domains often abused in recruiter impersonation
PUBLIC_EMAIL_DOMAINS = {
    "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com",
    "protonmail.com", "mail.com", "zoho.com", "yandex.com", "icloud.com",
    "gmx.com", "fastmail.com", "inbox.com"
}

# Suspicious messaging platforms often used in lieu of formal applicant tracking systems
UNOFFICIAL_MESSAGING_KEYWORDS = [
    "telegram", "whatsapp", "signal", "google chat", "wire app", "skype interview only"
]

class RiskAssessmentEngine:
    def __init__(self):
        self.ml = ml_engine

    def assess_job(
        self,
        job_title: str,
        job_description: str,
        company_name: Optional[str] = None,
        company_url: Optional[str] = None,
        recruiter_email: Optional[str] = None,
        salary_text: Optional[str] = None,
        experience_level: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Executes complete hybrid risk assessment.
        Returns risk_score (0-100), risk_category, indicators, positive signals, ML predictions, and guidance.
        """
        # 1. Run Genuine ML Inference
        ml_result = self.ml.predict(
            job_title=job_title,
            company_name=company_name,
            job_description=job_description
        )
        ml_proba = ml_result["probability"]
        ml_pred = ml_result["prediction"]

        # 2. Extract Rule-Based Indicators & Evidence
        indicators: List[Dict[str, Any]] = []
        positive_signals: List[str] = []
        heuristic_score = 0.0

        full_text = f"{job_title} {job_description}".lower()

        # Rule 1: Demands for Upfront Registration Fees, Equipment Deposits, or Training Charges
        fee_patterns = [
            r"(registration|application|processing|training|laptop|onboarding|equipment)\s*(?:[a-z0-9\$\-_/]+\s*){0,3}(fee|deposit|charge|cost|amount|payment)",
            r"(pay|transfer|send|wire|deposit)\s*(?:[a-z0-9\$\-_/]+\s*){0,4}(refundable|non-refundable|deposit|fee|sum|\$|₹|rs|inr|money|payment|crypto|bitcoin|usdt)",
            r"(refundable|non-refundable)\s*(?:[a-z0-9\$\-_/]+\s*){0,3}(deposit|fee|charge|payment)",
            r"buy\s*gift\s*card",
            r"(gift\s*card|crypto|bitcoin|usdt)\s*(?:for|via|payment|deposit|transfer)?"
        ]
        fee_matches = []
        for pat in fee_patterns:
            m = re.search(pat, full_text)
            if m:
                fee_matches.append(m.group(0))

        if fee_matches:
            indicators.append({
                "code": "ADVANCE_PAYMENT_DEMAND",
                "title": "Upfront Payment or Deposit Demanded",
                "severity": "CRITICAL",
                "description": "Legitimate employers never require candidates to pay registration, equipment, training, or application fees during recruitment.",
                "evidence_snippet": f"Detected solicitation: '{fee_matches[0]}'"
            })
            heuristic_score += 45.0
        else:
            positive_signals.append("No requests for registration, equipment, or upfront processing fees detected.")

        # Rule 2: Solicitations for Sensitive Personal / Financial Records
        sensitive_patterns = [
            r"(bank\s*account\s*number|routing\s*number|credit\s*card|debit\s*card|cvv|pin|otp|password)",
            r"(social\s*security|ssn|aadhaar|pan\s*card\s*number)\s*(copy|scan|submission|details)?",
            r"send\s*your\s*banking\s*details"
        ]
        sensitive_matches = []
        for pat in sensitive_patterns:
            m = re.search(pat, full_text)
            if m:
                sensitive_matches.append(m.group(0))

        if sensitive_matches:
            indicators.append({
                "code": "SENSITIVE_DATA_SOLICITATION",
                "title": "Premature Financial or Identity Data Request",
                "severity": "CRITICAL",
                "description": "Requesting bank details, OTPs, or government IDs before a formal interview or signed contract is a hallmark of identity theft.",
                "evidence_snippet": f"Detected request: '{sensitive_matches[0]}'"
            })
            heuristic_score += 35.0

        # Rule 3: Free Public Email Domain for a Claimed Corporate Employer
        if recruiter_email:
            email_clean = recruiter_email.strip().lower()
            if "@" in email_clean:
                email_domain = email_clean.split("@")[-1]
                if email_domain in PUBLIC_EMAIL_DOMAINS:
                    is_corp_name = company_name and len(company_name.strip()) > 2
                    indicators.append({
                        "code": "PUBLIC_EMAIL_DOMAIN",
                        "title": "Recruiter Using Free Public Email Domain",
                        "severity": "HIGH",
                        "description": f"The recruiter contact ({recruiter_email}) uses a free public provider (@{email_domain}) rather than an official corporate domain.",
                        "evidence_snippet": f"Contact address: {recruiter_email}"
                    })
                    heuristic_score += 25.0
                elif company_url:
                    parsed_url = urlparse(company_url)
                    url_domain = parsed_url.netloc.replace("www.", "").lower()
                    if url_domain and url_domain not in email_domain and email_domain not in url_domain:
                        indicators.append({
                            "code": "DOMAIN_MISMATCH",
                            "title": "Recruiter Email and Website Domain Mismatch",
                            "severity": "MEDIUM",
                            "description": f"Recruiter email domain (@{email_domain}) does not match the company website domain ({url_domain}).",
                            "evidence_snippet": f"Email: @{email_domain} vs Website: {url_domain}"
                        })
                        heuristic_score += 15.0
                else:
                    positive_signals.append(f"Recruiter email appears to use a dedicated custom domain (@{email_domain}).")

        # Rule 4: Suspicious Off-Platform Messaging Channels
        messaging_matches = [kw for kw in UNOFFICIAL_MESSAGING_KEYWORDS if kw in full_text]
        if messaging_matches:
            indicators.append({
                "code": "UNOFFICIAL_INTERVIEW_CHANNEL",
                "title": "Informal Chat-Based Recruitment Channel",
                "severity": "HIGH",
                "description": "Directing applicants exclusively to personal messaging apps (e.g., Telegram, WhatsApp) without corporate tracking is a common recruitment scam tactic.",
                "evidence_snippet": f"Keywords found: {', '.join(messaging_matches)}"
            })
            heuristic_score += 20.0

        # Rule 5: Guaranteed Selection & Suspicious Urgency Claims
        urgency_patterns = [
            r"(100%|guaranteed|immediate)\s*(selection|placement|job\s*offer|hire)",
            r"no\s*interview\s*(needed|required)",
            r"(limited\s*slots|act\s*fast|urgent\s*hiring\s*today|immediate\s*joining\s*bonus)"
        ]
        urgency_matches = []
        for pat in urgency_patterns:
            m = re.search(pat, full_text)
            if m:
                urgency_matches.append(m.group(0))

        if urgency_matches:
            indicators.append({
                "code": "GUARANTEED_OFFER_URGENCY",
                "title": "Unrealistic Placement Guarantee or High-Pressure Urgency",
                "severity": "HIGH",
                "description": "Legitimate organizations evaluate candidate competency through interviews and technical reviews; guaranteed hiring without assessment indicates predatory behavior.",
                "evidence_snippet": f"Urgency claim: '{urgency_matches[0]}'"
            })
            heuristic_score += 20.0

        # Rule 6: Missing Company Credentials / Information
        if not company_name or len(company_name.strip()) < 2:
            indicators.append({
                "code": "ANONYMOUS_EMPLOYER",
                "title": "Anonymous or Missing Hiring Company Name",
                "severity": "MEDIUM",
                "description": "The posting conceals the true identity of the employer, impeding independent verification of corporate legitimacy.",
                "evidence_snippet": "No company name provided."
            })
            heuristic_score += 15.0
        elif company_url:
            positive_signals.append(f"Company identity disclosed ({company_name}) with an associated web URL.")

        # Rule 7: Salary and Compensation Anomalies
        salary_text_combined = f"{salary_text or ''} {job_description}".lower()
        excessive_pay_match = re.search(r"(\$|₹|€|£)\s*([0-9]{3,6})\s*(per\s*day|per\s*hour|/hr|daily)", salary_text_combined)
        if excessive_pay_match and ("data entry" in full_text or "intern" in full_text or "typing" in full_text or "fresher" in full_text):
            indicators.append({
                "code": "EXCESSIVE_COMPENSATION_PROMISE",
                "title": "Disproportionate Compensation for Entry-Level Work",
                "severity": "MEDIUM",
                "description": "Offering abnormally high compensation for basic clerical, entry-level, or typing roles is commonly used to lure unsuspecting job seekers.",
                "evidence_snippet": f"Rate highlighted: '{excessive_pay_match.group(0)}'"
            })
            heuristic_score += 15.0

        # Rule 8: Technical Specificity & Job Structure Reassurance
        if len(job_description) > 300 and ("requirements" in full_text or "qualifications" in full_text or "responsibilities" in full_text):
            positive_signals.append("Job description features detailed operational responsibilities and structured candidate qualifications.")

        # 3. Transparent Combined Risk Score Computation
        # ML model outputs calibrated scam probability (0.0 to 1.0) -> scaled to 0-100
        ml_score = ml_proba * 100.0

        # Heuristic score is capped at 100
        heuristic_score = min(heuristic_score, 100.0)

        # Combined transparent heuristic: 50% ML + 50% Rule Heuristics
        # With safeguard: Critical rule violations (e.g. advance fee or sensitive data) enforce a floor of 75/85
        has_critical = any(ind["severity"] == "CRITICAL" for ind in indicators)
        has_high = any(ind["severity"] == "HIGH" for ind in indicators)

        base_combined = (settings.ML_RISK_WEIGHT * ml_score) + (settings.HEURISTIC_RISK_WEIGHT * heuristic_score)

        if has_critical:
            final_risk_score = max(base_combined, 82.0)
        elif has_high and heuristic_score >= 40.0:
            final_risk_score = max(base_combined, 65.0)
        else:
            final_risk_score = base_combined

        final_risk_score = round(min(max(final_risk_score, 0.0), 100.0), 1)

        # 4. Categorization
        if final_risk_score >= 80.0:
            risk_category = "CRITICAL"
        elif final_risk_score >= 60.0:
            risk_category = "HIGH"
        elif final_risk_score >= 30.0:
            risk_category = "MODERATE"
        else:
            risk_category = "LOW"

        # 5. Tailored Recommended Action Checklist
        recommended_actions = [
            "Never transfer funds, purchase gift cards, or pay for equipment as a condition of employment.",
            "Verify the posting directly on the organization's verified careers portal before submitting sensitive files.",
            "Inspect recruiter identity via professional networks (e.g., LinkedIn) and corporate email headers."
        ]
        if has_critical:
            recommended_actions.insert(0, "CRITICAL WARNING: Cease communications if the counterparty requests payment or banking OTPs.")
        if any(ind["code"] == "PUBLIC_EMAIL_DOMAIN" for ind in indicators):
            recommended_actions.append("Request that the recruiter message you from an official corporate email domain.")

        # 6. Academic Disclaimer
        disclaimer = (
            "HireShield AI is an intelligent decision-support screening aid, not a legally binding guarantee. "
            "Evaluations represent statistical risk indicators derived from natural language processing and deterministic heuristics. "
            "Candidates are strongly advised to perform independent verification of employer credentials."
        )

        return {
            "risk_score": final_risk_score,
            "risk_category": risk_category,
            "ml_prediction": ml_pred,
            "ml_probability": round(ml_proba, 4),
            "ml_model_version": ml_result.get("model_version", settings.ACTIVE_MODEL_VERSION),
            "indicators": indicators,
            "positive_signals": positive_signals,
            "recommended_actions": recommended_actions,
            "disclaimer": disclaimer
        }

# Global engine instance
risk_engine = RiskAssessmentEngine()
