from beanie.operators import RegEx
from dtos import ProdutoDTO
from models import Produto
from exceptions import CompiaException
import uuid


async def get(uid: str):
    produto = await Produto.find_one(Produto.produto_uuid == uid)
    if not produto:
        raise CompiaException("product not found")
    return produto


async def list_all():
    return await Produto.find_all().to_list()


async def list_by_tag(tag: str):
    return await Produto.find({"tags": tag}).to_list()


async def list_by_ref(ref: str):
    return await Produto.find(RegEx(Produto.name, ref, "i")).to_list()


async def change(produto_dto: ProdutoDTO):
    dados_atualizados = produto_dto.model_dump(
        exclude={"produto_uuid"},
        exclude_unset=True
    )

    produto = await Produto.find_one(Produto.produto_uuid == produto_dto.produto_uuid)

    if not produto:
        raise CompiaException("product not found")

    await produto.update({"$set": dados_atualizados})

    return produto


async def create(produto_dto: ProdutoDTO):
    produto = await Produto.find_one(Produto.name == produto_dto.name)

    if produto:
        raise CompiaException("product with this name already exists")

    produto = Produto(**produto_dto.model_dump())
    produto.produto_uuid = str(uuid.uuid4())

    await produto.insert()

    return produto


async def delete(uid: str):
    produto = await Produto.find_one(Produto.produto_uuid == uid)

    if not produto:
        raise CompiaException("product not found")

    await produto.delete()