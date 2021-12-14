import Dexie, { Table } from "dexie"
import { Cadastro } from "../@types/Cadastro"

export class IndexedDB extends Dexie {
  cadastro!: Table<Cadastro>

  constructor() {
    super("IndexedDB");
    this.version(1).stores({
      cadastro: '++id, name, value, ans',
    }
    );

  }
}

export const db = new IndexedDB()

export const searchByName = async (name: string) => {
  return await db.cadastro.where('name').equals(name).first()
}

export const modifyValue = async (name: string, value: number) => {
  await db.cadastro.where('name').equals(name).modify((cadastro) => {
    cadastro.value = value
    cadastro.ans = !cadastro.ans
    return cadastro;
  })
}

export const deleteCadastro = async (name: string) => {
  await db.cadastro.where('name').equals(name).delete()
}

export async function handleTransaction(name: string, value: number, ans: boolean) {

  if (!name.trim()) throw new Error("Name is Invalid")

  const fetchedData = await searchByName(name)
  if (!fetchedData) {
    await db.cadastro.add({ name, value, ans })
  } else if (fetchedData.value !== value) {
    await modifyValue(name, value)
  } else if (fetchedData.value === value) {
    await deleteCadastro(name)
  }
}

export const getAll = async () => {
  const cadastros = await db.cadastro.toArray()
  console.log(cadastros)
  return cadastros
}