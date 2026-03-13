from fastapi import Depends, APIRouter
from controllers import pedido_controller, carrinho_controller, produto_controller
from dependencies.security import verify_access, get_firebase_user
from dtos import PedidoDTO
from dtos.ItemPedidoDTO import ItemPedidoDTO
from models import Endereco

cliente_router = APIRouter(
    prefix="/cliente",
    tags=["cliente"],
    dependencies=[Depends(verify_access(['cliente', 'editor', 'admin']))]
)


@cliente_router.post("/pedido")
async def create_pedido(endereco: Endereco, current_user: dict = Depends(get_firebase_user)):
    return await pedido_controller.create(endereco, current_user)

@cliente_router.get("/pedidos")
async def get_pedidos(current_user: dict = Depends(get_firebase_user)):
    return await pedido_controller.get_all_by_user_uid(current_user)

@cliente_router.post("/carrinho")
async def add_to_carrinho(itemDTO: ItemPedidoDTO, current_user: dict = Depends(get_firebase_user)):
    return await carrinho_controller.add(itemDTO, current_user)

@cliente_router.delete("/carrinho/{produto_uuid}")
async def remove_from_carrinho(produto_uuid: str, current_user: dict = Depends(get_firebase_user)):
    return await carrinho_controller.remove(produto_uuid, current_user)

@cliente_router.get("/carrinho")
async def get_carrinho(current_user: dict = Depends(get_firebase_user)):
    return await carrinho_controller.get(current_user)

@cliente_router.post("/carrinho/decrement")
async def decrement_carrinho(itemDTO: ItemPedidoDTO, current_user: dict = Depends(get_firebase_user)):
    return await carrinho_controller.decrement(itemDTO, current_user)

@cliente_router.get("/ebook/{produto_uuid}")
async def get_ebook(produto_uuid: str, current_user: dict = Depends(get_firebase_user)):
    return await produto_controller.get_ebook(produto_uuid, current_user)
