from models import Produto


async def get():
    return await Produto.find_all().to_list()


async def get_by_tag(tag: str):
    return await Produto.find({"tags": tag}).to_list()


async def get_by_ref(ref: str):
    return await Produto.find(Produto.name == ref).to_list()