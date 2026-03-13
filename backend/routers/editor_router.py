from fastapi import APIRouter, Depends
from dependencies.security import verify_access
from dtos import ProdutoDTO
from controllers import produto_controller


editor_router = APIRouter(
    prefix="/editor",
    tags=["editor"],
    dependencies=[Depends(verify_access(['editor', 'admin']))]
)


@editor_router.post("/product")
async def create_produto(produto_dto: ProdutoDTO): return await produto_controller.create(produto_dto)

@editor_router.put("/product")
async def change_produto(produto_dto: ProdutoDTO): return await produto_controller.change(produto_dto)

@editor_router.delete("/product/{uid}")
async def delete_produto(uid: str): return await produto_controller.delete(uid)

