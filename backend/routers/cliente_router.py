from fastapi import Depends, APIRouter
from controllers import pedido_controller
from dependencies.security import verify_access, get_firebase_user
from dtos import PedidoDTO


cliente_router = APIRouter(
    prefix="/cliente",
    tags=["cliente"],
    dependencies=[Depends(verify_access(['cliente', 'editor', 'admin']))]
)


@cliente_router.post("/pedido")
async def create_pedido(pedidoDTO: PedidoDTO, current_user: dict = Depends(get_firebase_user)):
    return await pedido_controller.create(pedidoDTO, current_user)


