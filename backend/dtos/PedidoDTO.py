from pydantic import BaseModel
from models import Endereco
from .ItemPedidoDTO import ItemPedidoDTO


class PedidoDTO(BaseModel):
    produtos: list[ItemPedidoDTO]
    endereco: Endereco
