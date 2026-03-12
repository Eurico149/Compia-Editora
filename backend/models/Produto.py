from beanie import Document, Indexed
from typing import Optional, Literal


class Produto(Document):
    name: Indexed(str)
    image_url: Optional[str] = ""
    description: Optional[str] = ""
    content: str
    tags: Indexed(list[str]) = []
    price: float
    author: str
    type: Literal["fisico", "ebook", "kit"]
