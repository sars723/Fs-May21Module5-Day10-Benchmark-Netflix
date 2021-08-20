import fs from "fs-extra"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const { readJSON, writeJSON } = fs


const mediasJSONPath = join(dirname(fileURLToPath(import.meta.url)), "../data/media.json")



export const getMedias = () => readJSON(mediasJSONPath)
export const writeMedias = content => writeJSON(mediasJSONPath, content)