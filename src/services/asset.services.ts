import { databases, account } from "../appwrite/config"
import { ID } from "appwrite"

/**
 * Data coming from the form
 */
export type CreateAssetInput = {
  password: unknown
  assetName: string
  assetType: string
  assetId: string
  purchaseDate: string
  description?: string
  employeeId: string
}

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID

/**
 * Receives form data + employeeId and saves it in Appwrite
 */
export async function createAsset(data: CreateAssetInput) {
  return databases.createDocument(
    DATABASE_ID,
    COLLECTION_ID,
    ID.unique(),
    {
      assetName: data.assetName,
      assetType: data.assetType,
      assetId: data.assetId,
      purchaseDate: data.purchaseDate,
      description: data.description ?? "",
      employeeId: data.employeeId,
      password: data.password, // required field for Appwrite
    }
  )
}
