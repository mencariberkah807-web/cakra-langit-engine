from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models import SiteSettings
from routes.auth import get_current_user

router = APIRouter(prefix="/api/site", tags=["site-settings"])
admin_router = APIRouter(prefix="/api/admin/site", tags=["admin-site-settings"])


class SiteSettingsResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    site_name: str
    tagline: str | None = None
    logo: str | None = None
    favicon: str | None = None
    hero_image: str | None = None
    hero_title: str | None = None
    hero_description: str | None = None
    primary_cta_label: str | None = None
    secondary_cta_label: str | None = None
    feature_1_title: str | None = None
    feature_1_description: str | None = None
    feature_2_title: str | None = None
    feature_2_description: str | None = None
    feature_3_title: str | None = None
    feature_3_description: str | None = None
    feature_4_title: str | None = None
    feature_4_description: str | None = None
    login_image: str | None = None
    page_title: str | None = None
    meta_description: str | None = None


class SiteSettingsUpdate(BaseModel):
    site_name: str | None = None
    tagline: str | None = None
    logo: str | None = None
    favicon: str | None = None
    hero_image: str | None = None
    hero_title: str | None = None
    hero_description: str | None = None
    primary_cta_label: str | None = None
    secondary_cta_label: str | None = None
    feature_1_title: str | None = None
    feature_1_description: str | None = None
    feature_2_title: str | None = None
    feature_2_description: str | None = None
    feature_3_title: str | None = None
    feature_3_description: str | None = None
    feature_4_title: str | None = None
    feature_4_description: str | None = None
    login_image: str | None = None
    page_title: str | None = None
    meta_description: str | None = None


def get_or_create_settings(db: Session) -> SiteSettings:
    settings = db.query(SiteSettings).order_by(SiteSettings.id.asc()).first()
    if settings is None:
        settings = SiteSettings(site_name="Cakra Langit")
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


def require_admin(current_user=Depends(get_current_user)):
    if getattr(current_user, "role", None) != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user


@router.get("/settings", response_model=SiteSettingsResponse)
def read_site_settings(db: Session = Depends(get_db)):
    return get_or_create_settings(db)


@admin_router.get("/settings", response_model=SiteSettingsResponse)
def read_admin_site_settings(
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
):
    return get_or_create_settings(db)


@admin_router.put("/settings", response_model=SiteSettingsResponse)
def update_site_settings(
    payload: SiteSettingsUpdate,
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
):
    settings = get_or_create_settings(db)
    updates = payload.model_dump(exclude_unset=True)

    for key, value in updates.items():
        if key == "site_name" and value is not None:
            value = value.strip()
            if not value:
                raise HTTPException(status_code=400, detail="site_name cannot be empty")
        setattr(settings, key, value)

    db.add(settings)
    db.commit()
    db.refresh(settings)
    return settings
