from beanie import Document, Indexed
from pydantic import Field
from dtos import ItemPedidoDTO


class Carrinho(Document):
    user_uuid: Indexed(str)
    produtos: list[ItemPedidoDTO] = Field(default_factory=list)
