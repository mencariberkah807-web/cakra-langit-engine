from typing import Annotated

from fastapi import Depends, HTTPException, status

from database.models import User
from services.auth_dependencies import get_current_user


CurrentAdmin = Annotated[User, Depends(get_current_user)]


def require_admin(current_user: CurrentAdmin) -> User:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    return current_user


AdminUser = Annotated[User, Depends(require_admin)]
