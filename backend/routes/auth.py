from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models import User
from services.auth_dependencies import get_current_user
from services.auth_service import create_access_token, verify_password
from services.user_service import create_user, get_user_by_email, serialize_user


router = APIRouter(prefix="/api/auth", tags=["auth"])
DbSession = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]


class RegisterRequest(BaseModel):
    email: str
    password: str
    display_name: str | None = None


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: DbSession):
    email = payload.email.strip().lower()

    if "@" not in email or len(email) > 255:
        raise HTTPException(status_code=400, detail="Invalid email")

    if len(payload.password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters",
        )

    if get_user_by_email(db, email):
        raise HTTPException(status_code=409, detail="Email already registered")

    user = create_user(
        db,
        email=email,
        password=payload.password,
        display_name=payload.display_name,
    )

    return {
        "access_token": create_access_token(user.id),
        "token_type": "bearer",
        "user": serialize_user(user),
    }


@router.post("/login")
def login(payload: LoginRequest, db: DbSession):
    user = get_user_by_email(db, payload.email)

    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(status_code=403, detail="User is inactive")

    return {
        "access_token": create_access_token(user.id),
        "token_type": "bearer",
        "user": serialize_user(user),
    }


@router.get("/me")
def me(current_user: CurrentUser):
    return serialize_user(current_user)
