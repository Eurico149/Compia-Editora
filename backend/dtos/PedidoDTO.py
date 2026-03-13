from pydantic import BaseModel
from models import Endereco


class ItemPedidoDTO(BaseModel):
    produto_uuid: str
    quantidade: int


class PedidoDTO(BaseModel):
    produtos: list[ItemPedidoDTO]
    endereco: Endereco
