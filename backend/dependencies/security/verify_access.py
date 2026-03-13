from fastapi import Depends, HTTPException, status
from typing import List
from .firebase_conf import get_firebase_user


def verify_access(allowed_roles: List[str]):

    def role_checker(current_user: dict = Depends(get_firebase_user)):
        user_role = current_user.get("role", "cliente")

        if user_role not in allowed_roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)

    return role_checker
