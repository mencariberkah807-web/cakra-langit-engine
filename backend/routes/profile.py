from datetime import date, time
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models import Profile, User
from engines.location_engine import find_location_by_id
from services.auth_dependencies import get_current_user


router = APIRouter(prefix="/api/profile", tags=["profile"])
DbSession = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]


class ProfileUpdateRequest(BaseModel):
    display_name: str | None = None
    birth_date: date | None = None
    birth_time: time | None = None
    birth_time_unknown: bool = False
    birth_location_id: str | None = None


def serialize_profile(profile: Profile) -> dict:
    location = find_location_by_id(profile.birth_location_id) if profile.birth_location_id else None
    return {
        "display_name": profile.display_name,
        "birth_date": profile.birth_date.isoformat() if profile.birth_date else None,
        "birth_time": profile.birth_time.strftime("%H:%M:%S") if profile.birth_time else None,
        "birth_time_unknown": profile.birth_time_unknown,
        "birth_location_id": profile.birth_location_id,
        "birth_timezone": profile.birth_timezone,
        "birth_location": location,
    }


@router.get("")
def get_profile(current_user: CurrentUser, db: DbSession):
    profile = current_user.profile
    if profile is None:
        profile = Profile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return {
        "user": {
            "id": current_user.id,
            "email": current_user.email,
            "role": current_user.role,
            "is_active": current_user.is_active,
        },
        "profile": serialize_profile(profile),
    }


@router.put("")
def update_profile(payload: ProfileUpdateRequest, current_user: CurrentUser, db: DbSession):
    profile = current_user.profile
    if profile is None:
        profile = Profile(user_id=current_user.id)
        db.add(profile)

    if payload.birth_time_unknown:
        payload.birth_time = None

    location = None
    if payload.birth_location_id:
        location = find_location_by_id(payload.birth_location_id)
        if not location:
            raise HTTPException(status_code=400, detail="Birth location not found")

    profile.display_name = payload.display_name.strip() if payload.display_name else None
    profile.birth_date = payload.birth_date
    profile.birth_time = payload.birth_time
    profile.birth_time_unknown = payload.birth_time_unknown
    profile.birth_location_id = payload.birth_location_id
    profile.birth_timezone = location["timezone"] if location else None

    db.commit()
    db.refresh(profile)
    return {"profile": serialize_profile(profile)}
