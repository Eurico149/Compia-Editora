from fastapi import HTTPException
from dtos import ItemPedidoDTO
from services import carrinho_service


async def add(itemDTO: ItemPedidoDTO, current_user: dict):
    try:
        return await carrinho_service.add(itemDTO, current_user.get("uid"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))