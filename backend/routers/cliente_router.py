from fastapi import Depends, APIRouter
from controllers import pedido_controller, carrinho_controller
from dependencies.security import verify_access, get_firebase_user
from dtos import PedidoDTO
from dtos.ItemPedidoDTO import ItemPedidoDTO


cliente_router = APIRouter(
    prefix="/cliente",
    tags=["cliente"],
    dependencies=[Depends(verify_access(['cliente', 'editor', 'admin']))]
)


@cliente_router.post("/pedido")
async def create_pedido(pedidoDTO: PedidoDTO, current_user: dict = Depends(get_firebase_user)):
    return await pedido_controller.create(pedidoDTO, current_user)

@cliente_router.get("/pedidos")
async def get_pedidos(current_user: dict = Depends(get_firebase_user)):
    return await pedido_controller.get_all_by_user_uid(current_user)

@cliente_router.post("/carrinho")
async def add_to_carrinho(itemDTO: ItemPedidoDTO, current_user: dict = Depends(get_firebase_user)):
    return await carrinho_controller.add(itemDTO, current_user)


