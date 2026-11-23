"""
Administrative Management API Endpoints for HireShield AI.
User lifecycle control, platform audit logging, and administrative oversight.
Guarded by strict RBAC (admin role enforcement).
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.entities import User, AuditLog, JobAssessment
from app.schemas.schemas import (
    UserResponse,
    UserStatusUpdate,
    AuditLogResponse
)
from app.api.v1.deps import get_db, get_current_admin

router = APIRouter()

@router.get("/users", response_model=List[UserResponse])
def list_system_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    users = db.query(User).order_by(desc(User.created_at)).offset(skip).limit(limit).all()
    return [UserResponse.model_validate(u) for u in users]

@router.patch("/users/{user_id}/status", response_model=UserResponse)
def update_user_status(
    user_id: str,
    status_in: UserStatusUpdate,
    request: Request,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User record not found."
        )

    # Protect against self-lockout
    if user.id == admin.id and not status_in.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Administrators cannot deactivate their own account."
        )

    user.is_active = status_in.is_active
    db.commit()
    db.refresh(user)

    # Audit log
    audit = AuditLog(
        user_id=admin.id,
        action="ADMIN_UPDATE_USER_STATUS",
        resource_type="USER",
        resource_id=user_id,
        ip_address=request.client.host if request.client else None,
        details_json=f'{{"target_user": "{user.email}", "is_active": {user.is_active}}}'
    )
    db.add(audit)
    db.commit()

    return UserResponse.model_validate(user)

@router.get("/audit-logs", response_model=List[AuditLogResponse])
def get_audit_logs(
    limit: int = Query(50, ge=1, le=200),
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    logs = db.query(AuditLog).order_by(desc(AuditLog.created_at)).limit(limit).all()
    return [AuditLogResponse.model_validate(l) for l in logs]
