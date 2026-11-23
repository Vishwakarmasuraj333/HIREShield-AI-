"""
Development Database Seeder for HireShield AI.
Seeds clearly labeled synthetic test accounts and illustrative assessment records.
"""
from datetime import datetime, timezone, timedelta
from app.models.database import engine, Base, SessionLocal
from app.models.entities import User, JobAssessment, RiskIndicator, ModelVersion
from app.core.security import get_password_hash

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    print("Checking and seeding standard development accounts...")

    # 1. Admin User
    admin = db.query(User).filter(User.email == "admin@hireshield.ai").first()
    if not admin:
        admin = User(
            email="admin@hireshield.ai",
            hashed_password=get_password_hash("Admin@12345"),
            full_name="HireShield Administrator",
            role="ADMIN",
            is_active=True
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)
        print("Created Admin: admin@hireshield.ai / Admin@12345")
    else:
        print("Admin user already exists.")

    # 2. Standard Test User (Student)
    student = db.query(User).filter(User.email == "student@university.edu").first()
    if not student:
        student = User(
            email="student@university.edu",
            hashed_password=get_password_hash("Student@12345"),
            full_name="Aarav Sharma (M.Sc. IT)",
            role="USER",
            is_active=True
        )
        db.add(student)
        db.commit()
        db.refresh(student)
        print("Created Student: student@university.edu / Student@12345")
    else:
        print("Student user already exists.")

    # 3. Model Version Metadata
    mv = db.query(ModelVersion).filter(ModelVersion.version_tag == "v1.0.0-emscad-nlp").first()
    if not mv:
        model_v = ModelVersion(
            version_tag="v1.0.0-emscad-nlp",
            algorithm="Calibrated LinearSVC (Sublinear TF-IDF)",
            dataset_name="EMSCAD (University of the Aegean Benchmark)",
            dataset_size=17880,
            scam_class_recall=0.7606,
            scam_class_precision=0.8852,
            f1_score=0.8182,
            roc_auc=0.9691,
            pr_auc=0.8681,
            artifact_path="ml/artifacts/model.joblib",
            is_active=True
        )
        db.add(model_v)
        db.commit()
        print("Seeded active ModelVersion record.")

    # 4. Illustrative Assessments
    if db.query(JobAssessment).filter(JobAssessment.user_id == student.id).count() == 0:
        # Sample A: Critical Risk - Advance Fee Internship Scam
        crit_assessment = JobAssessment(
            user_id=student.id,
            job_title="Remote Python Data Entry & Research Intern",
            company_name="Apex Global Technologies LLC",
            company_url="http://apex-quick-jobs.xyz",
            recruiter_email="hiring.apexglobal@gmail.com",
            salary_text="$45/hour (Immediate Joining)",
            experience_level="Freshers / No experience required",
            description_excerpt="We are looking for immediate data entry assistants. Selected candidates must pay a mandatory $150 refundable onboarding laptop security deposit via crypto or gift card before contract dispatch.",
            risk_score=92.5,
            risk_category="CRITICAL",
            ml_prediction=1,
            ml_probability=0.89,
            model_version="v1.0.0-emscad-nlp",
            created_at=datetime.now(timezone.utc) - timedelta(days=2)
        )
        db.add(crit_assessment)
        db.commit()
        db.refresh(crit_assessment)

        crit_ind1 = RiskIndicator(
            assessment_id=crit_assessment.id,
            code="ADVANCE_PAYMENT_DEMAND",
            title="Mandatory Onboarding Deposit Requested",
            severity="CRITICAL",
            description="Candidate is instructed to transfer a refundable laptop security deposit prior to signing an agreement.",
            evidence_snippet="pay a mandatory $150 refundable onboarding laptop security deposit"
        )
        crit_ind2 = RiskIndicator(
            assessment_id=crit_assessment.id,
            code="PUBLIC_EMAIL_DOMAIN",
            title="Recruiter Using Free Gmail Address",
            severity="HIGH",
            description="Purported corporate employer uses generic public email instead of dedicated corporate domain.",
            evidence_snippet="hiring.apexglobal@gmail.com"
        )
        db.add_all([crit_ind1, crit_ind2])

        # Sample B: Low Risk - Legitimate Senior React Developer
        low_assessment = JobAssessment(
            user_id=student.id,
            job_title="Junior Frontend Engineer (React/TypeScript)",
            company_name="CloudScale Systems Inc.",
            company_url="https://cloudscale.io/careers",
            recruiter_email="talent@cloudscale.io",
            salary_text="$65,000 - $75,000 per annum",
            experience_level="Entry-level (0-2 years)",
            description_excerpt="Join our core platform engineering team building next-generation cloud monitoring tools. Key requirements include proficiency with modern React, TypeScript, HTML/CSS, and RESTful APIs.",
            risk_score=14.2,
            risk_category="LOW",
            ml_prediction=0,
            ml_probability=0.04,
            model_version="v1.0.0-emscad-nlp",
            created_at=datetime.now(timezone.utc) - timedelta(hours=18)
        )
        db.add(low_assessment)

        # Sample C: Moderate Risk - Obscure Company with Telegram Contact
        mod_assessment = JobAssessment(
            user_id=student.id,
            job_title="Remote Technical Content Assistant",
            company_name="",
            company_url="",
            recruiter_email="hr@telegram-writers-agency.com",
            salary_text="$25/hour",
            experience_level="Any",
            description_excerpt="Looking for quick writers to produce online summaries. Direct message us on Telegram @ContentManager to start today without delay.",
            risk_score=52.0,
            risk_category="MODERATE",
            ml_prediction=1,
            ml_probability=0.55,
            model_version="v1.0.0-emscad-nlp",
            created_at=datetime.now(timezone.utc) - timedelta(hours=6)
        )
        db.add(mod_assessment)
        db.commit()
        db.refresh(mod_assessment)

        mod_ind = RiskIndicator(
            assessment_id=mod_assessment.id,
            code="UNOFFICIAL_INTERVIEW_CHANNEL",
            title="Informal Chat-Based Recruitment Channel",
            severity="HIGH",
            description="Directing applicants exclusively to personal messaging apps (e.g., Telegram) without corporate tracking.",
            evidence_snippet="Direct message us on Telegram @ContentManager"
        )
        db.add(mod_ind)
        db.commit()
        print("Sample student assessments successfully seeded!")

    db.close()

if __name__ == "__main__":
    seed()
