from fastapi import HTTPException
from dtos import PedidoDTO
from exceptions import CompiaException
from services import pedido_service
import os


async def get_all():
    try:
        return await pedido_service.get_all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def get_all_by_user_uid(current_user: dict):
    try:
        return await pedido_service.get_all_by_user_uid(current_user.get("uid"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def get(uid: str):
    try:
        return await pedido_service.get(uid)
    except CompiaException as ce:
        raise HTTPException(status_code=400, detail=str(ce))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def create(pedido_dto: PedidoDTO, current_user: dict):
    try:
        cont = sum(item.quantidade for item in pedido_dto.produtos)
        frete = await pedido_service.calcular_frete(os.getenv("MELHOR_ENVIO_CEP_BASE"), pedido_dto.endereco.cep, cont)

        if isinstance(frete, list) and len(frete) > 0:

            opcao_valida = next((opcao for opcao in frete if "error" not in opcao and "price" in opcao), None)

            if opcao_valida:
                valor_frete = float(opcao_valida['price'])
            else:
                raise HTTPException(status_code=400, detail="Nenhuma opção de frete disponível para este CEP.")
        else:
            raise HTTPException(status_code=400, detail="Erro ao calcular o frete ou formato de resposta inesperado.")

        pedido = await pedido_service.create(pedido_dto, current_user, valor_frete)
        return pedido
    except CompiaException as ce:
        raise HTTPException(status_code=400, detail=str(ce))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
