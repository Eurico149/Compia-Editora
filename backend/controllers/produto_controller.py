from fastapi import HTTPException
from starlette.responses import StreamingResponse
from dtos import ProdutoDTO
from exceptions import CompiaException
from services import produto_service


async def get(uid: str):
    try:
        return await produto_service.get(uid)
    except CompiaException as ce:
        raise HTTPException(status_code=404, detail=str(ce))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def list_all():
    try:
        return await produto_service.list_all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def list_by_tag(tag: str):
    try:
        return await produto_service.list_by_tag(tag)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def list_by_ref(ref: str):
    try:
        return await produto_service.list_by_ref(ref)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def change(produto_dto: ProdutoDTO):
    try:
        return await produto_service.change(produto_dto)
    except CompiaException as ce:
        raise HTTPException(status_code=404, detail=str(ce))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def create(produto_dto: ProdutoDTO):
    try:
        return await produto_service.create(produto_dto)
    except CompiaException as ce:
        raise HTTPException(status_code=400, detail=str(ce))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def delete(uid: str):
    try:
        await produto_service.delete(uid)
    except CompiaException as ce:
        raise HTTPException(status_code=404, detail=str(ce))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def get_ebook(produto_uuid: str, user: dict):
    try:
        produto = await produto_service.get_user_ebook(user.get("uid"), produto_uuid)

        arquivo_memoria = produto_service.generate_ebook(produto.content)
        return StreamingResponse(
            arquivo_memoria,
            media_type="text/plain",
            headers={"Content-Disposition": f"attachment; filename={produto.name}.txt"}
        )
    except CompiaException as ce:
        raise HTTPException(status_code=404, detail=str(ce))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
