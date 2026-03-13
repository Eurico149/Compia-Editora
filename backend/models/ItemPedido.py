from pydantic import BaseModel


class ItemPedido(BaseModel):
    produto_uuid: str
    nome: str
    quantidade: int
    preco_unitario: float
