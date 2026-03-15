const BASE_URL = "/api";

function getToken(): string | null {
  return localStorage.getItem("auth_token");
}

export function setToken(token: string) {
  localStorage.setItem("auth_token", token);
}

export function clearToken() {
  localStorage.removeItem("auth_token");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

async function request<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// ===== Public: Catalogo =====
export const catalogo = {
  getAll: () => request("/catalogo/"),
  getById: (uid: string) => request(`/catalogo/${uid}`),
  getByTag: (tag: string) => request(`/catalogo/tag/${tag}`),
  getByRef: (ref: string) => request(`/catalogo/ref/${ref}`),
};

// ===== Auth =====
export const auth = {
  me: () => request("/me"),
};

// ===== Cliente =====
export const cliente = {
  getCarrinho: () => request("/cliente/carrinho"),
  addToCarrinho: (produto_uuid: string, quantidade: number) =>
    request("/cliente/carrinho", {
      method: "POST",
      body: JSON.stringify({ produto_uuid, quantidade }),
    }),
  removeFromCarrinho: (produto_uuid: string) =>
    request(`/cliente/carrinho/${produto_uuid}`, { method: "DELETE" }),
  decrementCarrinho: (produto_uuid: string, quantidade: number) =>
    request("/cliente/carrinho/decrement", {
      method: "POST",
      body: JSON.stringify({ produto_uuid, quantidade }),
    }),
  getPedidos: () => request("/cliente/pedidos"),
  createPedido: (endereco: Endereco) =>
    request("/cliente/pedido", {
      method: "POST",
      body: JSON.stringify(endereco),
    }),
  getEbook: (produto_uuid: string) =>
    request(`/cliente/ebook/${produto_uuid}`),
};

// ===== Editor =====
export const editor = {
  createProduto: (produto: ProdutoDTO) =>
    request("/editor/product", {
      method: "POST",
      body: JSON.stringify(produto),
    }),
  updateProduto: (produto: ProdutoDTO) =>
    request("/editor/product", {
      method: "PUT",
      body: JSON.stringify(produto),
    }),
  deleteProduto: (uid: string) =>
    request(`/editor/product/${uid}`, { method: "DELETE" }),
};

// ===== Admin =====
export const admin = {
  getAllUsers: () => request("/admin/users"),
  getUserByEmail: (email: string) => request(`/admin/users/email/${email}`),
  getUser: (uid: string) => request(`/admin/users/${uid}`),
  deleteUser: (uid: string) =>
    request(`/admin/users/${uid}`, { method: "DELETE" }),
  changeUserRole: (uid: string, role: string) =>
    request(`/admin/users/${uid}/role/${role}`, { method: "PATCH" }),
  getAllPedidos: () => request("/admin/pedidos"),
  getPedido: (uid: string) => request(`/admin/pedidos/${uid}`),
};

// ===== Types =====
export interface Endereco {
  rua: string;
  numero: number;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  complemento?: string;
}

export interface ProdutoDTO {
  produto_uuid?: string;
  name: string;
  image_url?: string;
  description?: string;
  content: string;
  tags?: string[];
  price: number;
  author: string;
  type: "fisico" | "ebook" | "kit";
}

export interface ItemPedidoDTO {
  produto_uuid: string;
  quantidade: number;
}
