from beanie import Document, Indexed
from typing import Optional, Literal


class Produto(Document):
    name: Indexed(str)
    image_url: Optional[str] = ""
    description: Optional[str] = ""
    content: str
    tags: list[str] = []
    price: float
    author: str
    type: Literal["fisico", "ebook", "kit"]
