from fastapi import HTTPException, status
from firebase_admin.auth import UserNotFoundError
from exceptions import CompiaException
from services import user_service


def get_all():
    try:
        users = user_service.get_all()
        return {
            "users": users
        }
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


def get_by_email(email: str):
    try:
        user = user_service.get_by_email(email)
        return {
            "uid": user.uid,
            "email": user.email,
            "role": user.custom_claims.get("role") if user.custom_claims else "cliente"
        }
    except UserNotFoundError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid email format")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


def get(uid: str):
    try:
        user = user_service.get_by_uid(uid)
        return {
            "uid": user.uid,
            "email": user.email,
            "role": user.custom_claims.get("role") if user.custom_claims else "cliente"
        }
    except UserNotFoundError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


def change_role(uid: str, new_role: str):
    try:
        user_service.change_role(uid, new_role)
        return {
            "message": f"Role changed to {new_1role}"
        }
    except UserNotFoundError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    except CompiaException as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


def delete(uid: str):
    try:
        user_service.delete(uid)
        return {
            "message": f"User '{uid}' deleted successfully"
        }
    except UserNotFoundError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    except CompiaException as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
