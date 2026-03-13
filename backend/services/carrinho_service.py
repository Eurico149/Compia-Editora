from dtos import ItemPedidoDTO
from models import Carrinho


async def add(itemDTO: ItemPedidoDTO, user_uid: str):
    carrinho =  Carrinho.find_one(Carrinho.user_uuid == user_uid)

    for item in carrinho.produtos:
        if item.produto_uuid == itemDTO.produto_uuid:
            item.quantidade += itemDTO.quantidade
            await carrinho.save()

            return carrinho

    carrinho.produtos.append(itemDTO)

    await carrinho.save()

    return carrinho



