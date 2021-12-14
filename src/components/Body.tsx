import {Button, Heading, useToast} from "@chakra-ui/react"
import { Flex, Input, Select, UnorderedList, ListItem } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { Cadastro } from "../@types/Cadastro"
import { db, getAll, searchByName, handleTransaction } from "../services/Db"

export function Body(){

  const toast = useToast()

  const [name,setName] = useState<string>("")
  const [value, setValue] = useState(null as number | null)
  const [ans, setAns] = useState(null as boolean | null)
  const [cadastros, setCadastros ] = useState<Cadastro[]>([])
  const [updated, setUpdated] = useState(false)

  const validateData = async () => {
    if(name.trim() === "" || value === null) {
      throw new Error("O nome ou valor ausente.");
    } else {
      const fetchedData = await searchByName(name);
      if(fetchedData === undefined && ans === null) {
        throw new Error("Faltando valor booleano para criação.");
      } else if(fetchedData && ans !== null) {
        throw new Error("Erro de alteração do valor booleano diretamente.");
      }
    }
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
        onChange = {(Event)=>setName(Event.target.value)}
      />
      <Input
        type="number"
        placeholder="Value"
        onChange={(Event) => {
          const stringValue = Event.target.value;
          if (stringValue !== "") {
            setValue(Number(stringValue)) 
          } else {
            setValue(null)
          }
        }}
      />
      <Select placeholder="Selecione a opção" onChange={(e) => {
          if (e.target.value === 'true'){
            setAns(true)
          }else if (e.target.value === 'false'){
            setAns(false)
          }else{
            setAns(null)
          }
        }
      }
      >
        <option value='true'>true</option>
        <option value='false'>false</option>
      </Select>

      <Button onClick={async () => { 
        try {
          await validateData();
          await handleTransaction(name, value, ans);
          setUpdated(!updated)
        } catch (error) {
          toast({
            title:'Houston, temos um problema!',
            description: error.toString(), 
            status:'error',
            isClosable: true,
            duration: 3000  
            })
        }  
      }}>Enviar</Button>

      <UnorderedList>
        {
          cadastros.map((objeto) => {
            return(
              <ListItem key={ objeto.name }>
                Name: {objeto.name} - Value: {objeto.value} - Ans: { objeto.ans ? "true" : "false"}
              </ListItem>
            )
          })
        }
      </UnorderedList>
    </Flex>
  )
}