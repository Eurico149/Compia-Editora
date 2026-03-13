from fastapi import APIRouter, Depends
from dependencies.security import verify_access
from controllers import user_controller, pedido_controller

admin_router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    dependencies=[Depends(verify_access(['admin']))]
)

@admin_router.get("/users")
def get_all_users():
    return user_controller.get_all()

@admin_router.get("/users/email/{email}")
def get_user_by_email(email: str):
    return user_controller.get_by_email(email)

@admin_router.get("/users/{uid}")
def get_user(uid: str):
    return user_controller.get(uid)

@admin_router.patch("/users/{uid}/role/{role}")
def change_user_role(uid: str, role: str):
    return user_controller.change_role(uid, role)

@admin_router.delete("/users/{uid}")
def delete_user(uid: str):
    return user_controller.delete(uid)

@admin_router.get("/pedidos")
async def get_all_pedidos():
    return pedido_controller.get_all()

@admin_router.get("/pedidos/{uid}")
async def get_pedido(uid: str):
    return pedido_controller.get(uid)
