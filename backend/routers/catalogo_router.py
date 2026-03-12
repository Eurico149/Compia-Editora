from fastapi import APIRouter
from models import Produto
from controllers import catalogo_controller


catalogo_router = APIRouter(prefix="/catalogo", tags=["catalogo"])


@catalogo_router.get("/")
async def get_catalogo(): return await catalogo_controller.get()

@catalogo_router.get("/tag/{tag}")
async def get_catalogo_by_tag(tag: str): return await catalogo_controller.get_by_tag(tag)

@catalogo_router.get("/ref/{ref}")
async def get_catalogo_by_ref(ref: str): return await catalogo_controller.get_by_ref(ref)
