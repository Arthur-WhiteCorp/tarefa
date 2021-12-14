import axios from "axios";

export type Product = {
  name: string,
  quantity: number,
  slug: string
}

type ProductsAllResponse = {
  products: Product[]
}

type CreateProductModel = {
  name: string
  quantity: number
}

const api = axios.create({
  baseURL: "http://localhost:3333"
})

export const getAllProducts = async () => {
  const { data: { products } } = await api.get<ProductsAllResponse>("/products/all")

  return products
}

export const createProduct = async (data: CreateProductModel) => {
  const response = await api.post("/products/create", data)

  return response;
}