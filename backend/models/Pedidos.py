from beanie import Document, Indexed
from typing import Literal
from .Endereco import Endereco
from .Produto import Produto


class Pedido(Document):
    user_uuid: Indexed(str)
    produto: list[Produto]
    frete: float
    total: float
    status: Literal["pendente", "processando", "enviado", "entregue", "cancelado"] = "pendente"
    endereco: Endereco