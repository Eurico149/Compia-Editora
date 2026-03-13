from beanie import Document, Indexed
from typing import Literal
from .Endereco import Endereco
from .Produto import Produto


class Pedido(Document):
    pedido_uuid: Indexed(str)
    user_uuid: Indexed(str)
    produtos: list[Produto]
    endereco: Endereco
    frete: float
    total: float
    status: Literal["pendente", "processando", "enviado", "entregue", "cancelado"] = "pendente"
