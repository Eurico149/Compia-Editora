from beanie import Document, Indexed
from typing import Optional, Literal


class Produto(Document):
    produto_uuid: Indexed(str, unique=True)
    name: Indexed(str, unique=True)
    image_url: Optional[str] = ""
    description: Optional[str] = ""
    content: str
    tags: Indexed(list[str]) = []
    price: float
    author: str
    type: Literal["fisico", "ebook", "kit"]
    estoque: Optional[int] = None
