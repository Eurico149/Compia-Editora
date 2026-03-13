from fastapi import APIRouter
from controllers import produto_controller


catalogo_router = APIRouter(
    prefix="/catalogo",
    tags=["catalogo"]
)


@catalogo_router.get("/")
async def get_catalogo():
    return await produto_controller.list_all()

@catalogo_router.get("/{uid}")
async def get_produto(uid: str):
    return await produto_controller.get(uid)

@catalogo_router.get("/tag/{tag}")
async def get_catalogo_by_tag(tag: str):
    return await produto_controller.list_by_tag(tag)

@catalogo_router.get("/ref/{ref}")
async def get_catalogo_by_ref(ref: str):
    return await produto_controller.list_by_ref(ref)
