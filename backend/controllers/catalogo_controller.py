from fastapi import HTTPException
from models import Produto
from services import catalogo_service


async def get():
    try:
        produtos = await catalogo_service.get()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return produtos


async def get_by_tag(tag: str):
    try:
        produtos = await catalogo_service.get_by_tag(tag)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if not produtos:
        raise HTTPException(status_code=404, detail=f"products with tag '{tag}' not found")

    return produtos


async def get_by_ref(ref: str):
    try:
        produtos = await catalogo_service.get_by_ref(ref)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if not produtos:
        raise HTTPException(status_code=404, detail="products not found")

    return produtos
