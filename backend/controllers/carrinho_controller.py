from fastapi import HTTPException
from dtos import ItemPedidoDTO
from exceptions import CompiaException
from services import carrinho_service


async def add(itemDTO: ItemPedidoDTO, current_user: dict):
    try:
        return await carrinho_service.add(itemDTO, current_user.get("uid"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def remove(produto_uuid: str, current_user: dict):
    try:
        return await carrinho_service.remove(produto_uuid, current_user.get("uid"))
    except CompiaException as ce:
        raise HTTPException(status_code=400, detail=str(ce))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def get(current_user: dict):
    try:
        return await carrinho_service.get(current_user.get("uid"))
    except CompiaException as ce:
        raise HTTPException(status_code=400, detail=str(ce))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def decrement(itemDTO: ItemPedidoDTO, current_user: dict):
    try:
        return await carrinho_service.decrement(itemDTO, current_user.get("uid"))
    except CompiaException as ce:
        raise HTTPException(status_code=400, detail=str(ce))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
