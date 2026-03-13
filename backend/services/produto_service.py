from beanie.operators import RegEx
from dtos import ProdutoDTO
from models import Produto, Pedido
from exceptions import CompiaException
import uuid
import io


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


def generate_ebook(content: str):
    texto_em_bytes = content.encode('utf-8')
    return io.BytesIO(texto_em_bytes)


async def get_user_ebook(user_uuid: str, produto_uuid: str):
    pedido = await Pedido.find_one({
        "user_uuid": user_uuid,
        "produtos.produto_uuid": produto_uuid
    })

    if not pedido:
        raise CompiaException("user has not purchased this product")

    produto = await Produto.find_one(Produto.produto_uuid == produto_uuid)

    if not produto:
        raise CompiaException("product not found")

    if produto.type != "ebook":
        raise CompiaException("product is not an ebook")

    return produto
