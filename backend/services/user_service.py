from sqlalchemy import select
from sqlalchemy.orm import Session

from database.models import Profile, User
from services.auth_service import hash_password


def get_user_by_email(db: Session, email: str) -> User | None:
    normalized = email.strip().lower()
    return db.scalar(select(User).where(User.email == normalized))


def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.get(User, user_id)


def create_user(
    db: Session,
    email: str,
    password: str,
    display_name: str | None = None,
) -> User:
    user = User(
        email=email.strip().lower(),
        password_hash=hash_password(password),
        is_active=True,
    )
    db.add(user)
    db.flush()

    profile = Profile(
        user_id=user.id,
        display_name=display_name.strip() if display_name else None,
    )
    db.add(profile)
    db.commit()
    db.refresh(user)
    return user


def serialize_user(user: User) -> dict:
    return {
        "id": user.id,
        "email": user.email,
        "is_active": user.is_active,
        "display_name": user.profile.display_name if user.profile else None,
    }
