import { Center, ListItem, UnorderedList, Button } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { createProduct, getAllProducts, Product } from "../services/api"



export default function Home() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    const data = await getAllProducts()
    setProducts(data)
  }

  async function criarProduto() {
    await createProduct({
      name: "Batata",
      quantity: 13
    })
    await fetchProducts()
  }

  return (
    <Center w="100vw" h="100vh">
      <UnorderedList>
        {
          products.map(product => (
            <ListItem key={product.slug}>
              {product.name} --- {product.quantity}
            </ListItem>)
          )
        }
        <Button onClick={criarProduto}>Criar produto</Button>
      </UnorderedList>
    </Center>
  )
}