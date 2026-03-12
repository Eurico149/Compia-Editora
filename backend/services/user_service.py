from firebase_admin import auth
from exceptions import CompiaException
import os


def get_all():
    page = auth.list_users()
    users = [
        {
            "uid": user.uid,
            "email": user.email,
            "role": user.custom_claims.get("role") if user.custom_claims else "cliente"
        }
        for user in page.users
    ]
    return users


def get_by_email(user_email: str):
    user = auth.get_user_by_email(user_email)
    return user


def get_by_uid(uid: str):
    user = auth.get_user(uid)
    return user


def change_role(uid: str, role: str):
    user = auth.get_user(uid)
    if user.uid == os.getenv("COMPIA_ADM_UID"):
        raise CompiaException("Prohibited to change role of the main administrator")

    auth.set_custom_user_claims(uid, {"role": role})


def delete(uid: str):
    user = auth.get_user(uid)
    if user.uid == os.getenv("COMPIA_ADM_UID"):
        raise CompiaException("Prohibited to delete the main administrator")

    auth.delete_user(uid)
