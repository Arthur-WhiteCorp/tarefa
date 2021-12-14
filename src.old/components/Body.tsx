import { Button, Heading, useToast } from "@chakra-ui/react"
import { Flex, Input, Select, UnorderedList, ListItem } from "@chakra-ui/react"
import { useState, useEffect, ChangeEvent } from "react"
import { Cadastro } from "../@types/Cadastro"
import { getAll, searchByName, handleTransaction } from "../services/Db"

export function Body() {

  const toast = useToast()

  const [name, setName] = useState<string>("")
  const [value, setValue] = useState(null as number | null)
  const [ans, setAns] = useState(null as boolean | null)
  const [cadastros, setCadastros] = useState<Cadastro[]>([])
  const [updated, setUpdated] = useState(false)

  const validateData = async () => {
    if (!name.trim() || !value) {
      throw new Error("O nome ou valor ausente.");
    } else {
      const fetchedData = await searchByName(name);
      if (!fetchedData && !ans) {
        throw new Error("Faltando valor booleano para criação.");
      } else if (fetchedData && ans) {
        throw new Error("Erro de alteração do valor booleano diretamente.");
      }
    }
  }

  const handleSubmit = async () => {
    try {
      await validateData();
      await handleTransaction(name, value, ans);
      setUpdated(!updated)
    } catch (error) {
      toast({
        title: 'Houston, temos um problema!',
        description: error.toString(),
        status: 'error',
        isClosable: true,
        duration: 3000
      })
    }
  }

  const handleNumberInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    value === ""
      ? setValue(null)
      : setValue(Number(value))
  }

  const handleSelectOption = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value: option } = event.target

    option === "true"
      ? setAns(true)
      : option === "false"
        ? setAns(false)
        : setAns(null);
  }

  useEffect(() => {
    async function getCadastros() {
      const cadastrosArray: Cadastro[] = await getAll()
      setCadastros(cadastrosArray)
    }
    getCadastros()
  }, [updated])

  return (
    <Flex w="100%" flexDirection='column' alignItems='center'>
      <Heading>Tarefa do chato Sr Edmilson ;)</Heading>
      <Input
        type='text'
        placeholder="Nome"
        onChange={(event) => setName(event.target.value)}
      />
      <Input
        type="number"
        placeholder="Value"
        onChange={handleNumberInput}
      />
      <Select placeholder="Selecione a opção" onChange={handleSelectOption}>
        <option value='true'>true</option>
        <option value='false'>false</option>
      </Select>

      <Button onClick={handleSubmit}>Enviar</Button>

      <UnorderedList>
        {
          cadastros.map((cadastro) => {
            return (
              <ListItem key={cadastro.name}>
                Name: {cadastro.name} - Value: {cadastro.value} - Ans: {cadastro.ans ? "true" : "false"}
              </ListItem>
            )
          })
        }
      </UnorderedList>
    </Flex>
  )
}