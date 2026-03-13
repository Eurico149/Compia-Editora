from exceptions import CompiaException
from models import Produto, ItemPedido, Pedido, Carrinho, Endereco
from beanie.operators import In
import uuid
import os
import httpx


async def get(uid: str):
    pedido = await Pedido.find_one(Pedido.pedido_uuid == uid)
    if not pedido:
        raise CompiaException("pedido not found")
    return pedido


async def get_all():
    return await Pedido.find_all().to_list()


async def get_all_by_user_uid(user_uid: str):
    return await Pedido.find(Pedido.user_uuid == user_uid).to_list()


async def create(carrinho: Carrinho, current_user: dict, pagamento: str, valor_frete: float, endereco: Endereco):
    uuids_enviados = [item.produto_uuid for item in carrinho.produtos]

    produtos_banco = await Produto.find(In(Produto.produto_uuid, uuids_enviados)).to_list()

    if len(produtos_banco) != len(set(uuids_enviados)):
        raise CompiaException("One or more products not found in the database")

    mapa_produtos = {p.produto_uuid: p for p in produtos_banco}

    itens_pedido = []
    valor_total_produtos = 0.0

    for item_dto in carrinho.produtos:
        produto_real = mapa_produtos[item_dto.produto_uuid]

        item = ItemPedido(
            produto_uuid=produto_real.produto_uuid,
            nome=produto_real.name,
            preco_unitario=produto_real.price,
            quantidade=item_dto.quantidade
        )
        itens_pedido.append(item)

        valor_total_produtos += (produto_real.price * item_dto.quantidade)

    pedido = Pedido(
        pedido_uuid=str(uuid.uuid4()),
        user_uuid=current_user.get('uid'),
        produtos=itens_pedido,
        endereco=endereco,
        frete=valor_frete,
        total=valor_total_produtos + valor_frete,
        pagamento=pagamento
    )

    await pedido.insert()
    await carrinho.delete()

    return pedido


async def calcular_frete(cep_origem: str, cep_destino: str, produtos: int):
    url = "https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate"

    headers = {
        "Accept": "application/json",
        "Authorization": f"Bearer {os.getenv("MELHOR_ENVIO_API_KEY")}",
        "Content-Type": "application/json",
        "User-Agent": "Aplicacao euricogabriel149@gmail.com"
    }

    payload = {
        "from": {
            "postal_code": cep_origem
        },
        "to": {
            "postal_code": cep_destino
        },
        "package": {
            "height": 4 * produtos,
            "width": 10 * produtos,
            "length": 15 * produtos,
            "weight": 0.3 * produtos
        }
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()

            return response.json()
        except httpx.HTTPStatusError as e:
            raise CompiaException(e.response.json())