from pydantic import BaseModel


class ItemPedidoDTO(BaseModel):
    produto_uuid: str
    quantidade: int
