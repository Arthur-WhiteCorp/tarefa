import Dexie, {Table} from "dexie"
import { Cadastro } from "../@types/Cadastro"

export class IndexedDB extends Dexie{
  cadastro!: Table<Cadastro>
  
  constructor(){
    super("IndexedDB");
    this.version(1).stores({
      cadastro: '++id, name, value, ans',
    }
    );

  }
}

export const db = new IndexedDB()

export const searchByName = async (name:string) => {
  const object = await db.cadastro.where('name').equals(name).first()

  return object

  
}

export const modifyValue = async (name:string, value:number) =>{
  await db.cadastro.where('name').equals(name).modify((cadastro) => {
    cadastro.value = value
    cadastro.ans = !cadastro.ans
    return cadastro;
  })


}

export const deleteCadastro = async (name:string) =>{
  await db.cadastro.where('name').equals(name).delete()


}

export async function handleTransaction(name, value, ans){
  const fetchedData = await searchByName(name.trim())
  if (fetchedData === undefined){
    await db.cadastro.add({name, value, ans})
    
  }else if (fetchedData.value !== value){
    await  modifyValue(name, value)

  } else if(fetchedData.value === value){
    await deleteCadastro(name)
  }
}

export const getAll = async () =>{
  
  const objects = await db.cadastro.toArray()

  console.log(objects)

  return objects
}