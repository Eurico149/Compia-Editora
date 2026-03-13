from typing import Optional, Literal
from pydantic import BaseModel


class ProdutoDTO(BaseModel):
    produto_uuid: Optional[str] = ""
    name: str
    image_url: Optional[str] = ""
    description: Optional[str] = ""
    content: str
    tags: list[str] = []
    price: float
    author: str
    type: Literal["fisico", "ebook", "kit"]
