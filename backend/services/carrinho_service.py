from dtos import ItemPedidoDTO
from exceptions import CompiaException
from models import Carrinho


async def add(itemDTO: ItemPedidoDTO, user_uid: str):
    carrinho = await Carrinho.find_one(Carrinho.user_uuid == user_uid)

    if not carrinho:
        carrinho = Carrinho(user_uuid=user_uid, produtos=[])

    for item in carrinho.produtos:
        if item.produto_uuid == itemDTO.produto_uuid:
            item.quantidade += itemDTO.quantidade
            await carrinho.save()
            return carrinho

    carrinho.produtos.append(itemDTO)

    await carrinho.save()

    return carrinho


async def remove(produto_uuid: str, user_uid: str):
    carrinho = await Carrinho.find_one(Carrinho.user_uuid == user_uid)

    if not carrinho:
        carrinho = Carrinho(user_uuid=user_uid, produtos=[])
        await carrinho.save()
        return carrinho

    for item in carrinho.produtos:
        if item.produto_uuid == produto_uuid:
            carrinho.produtos.remove(item)
            await carrinho.save()
            return carrinho

    raise CompiaException(f"produto '{produto_uuid}' nof found in '{user_uid}' carrinho")


async def decrement(itemDTO: ItemPedidoDTO, user_uid: str):
    carrinho = await Carrinho.find_one(Carrinho.user_uuid == user_uid)

    if not carrinho:
        carrinho = Carrinho(user_uuid=user_uid, produtos=[])
        await carrinho.save()
        return carrinho

    for item in carrinho.produtos:
        if item.produto_uuid == itemDTO.produto_uuid:
            item.quantidade -= itemDTO.quantidade
            if item.quantidade <= 0:
                carrinho.produtos.remove(item)
            await carrinho.save()
            return carrinho

    raise CompiaException(f"produto '{itemDTO.produto_uuid}' nof found in '{user_uid}' carrinho")


async def get(user_uid: str):
    carrinho = await Carrinho.find_one(Carrinho.user_uuid == user_uid)

    if not carrinho:
        carrinho = Carrinho(user_uuid=user_uid, produtos=[])
        await carrinho.save()

    return carrinho
