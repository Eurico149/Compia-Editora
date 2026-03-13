from beanie import Document, Indexed
from typing import Literal
from pydantic import Field
from datetime import datetime, timezone
from .Endereco import Endereco
from .ItemPedido import ItemPedido


class Pedido(Document):
    pedido_uuid: Indexed(str, unique=True)
    user_uuid: Indexed(str)
    produtos: list[ItemPedido]
    endereco: Endereco
    frete: float
    total: float
    desconto: float = 0
    status: Literal["pendente", "processando", "enviado", "entregue", "cancelado"] = "pendente"
    criado_em: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
