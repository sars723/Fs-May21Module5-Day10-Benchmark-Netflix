import express from "express" 
import cors from "cors"
import listEndpoints from "express-list-endpoints"
import { join } from "path"
import mediaRouter from "./services/media/index.js"
import filesRouter from "./services/files/index.js"

import { notFoundErrorHandler, forbiddenErrorHandler, badRequestErrorHandler, genericServerErrorHandler } from "./errorHandlers.js"
const server = express()

const port = process.env.PORT

const publicFolderPath = join(process.cwd(), "public")

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL]

const corsOpts = {
  origin: function (origin, next) {
    console.log("ORIGIN --> ", origin)
    if ( whitelist.indexOf(origin) !== -1) {
      next(null, true)
    } else {
      next(new Error(`Origin ${origin} not allowed!`))
    }
  },
}

server.use(express.static(publicFolderPath))
server.use(cors(corsOpts))
server.use(express.json()) 

server.use("/media", mediaRouter)
server.use("/files", filesRouter)

server.use(notFoundErrorHandler)
server.use(badRequestErrorHandler)
server.use(forbiddenErrorHandler)
server.use(genericServerErrorHandler)

console.table(listEndpoints(server))

server.listen(port, () => {
  console.log("Server listening on port " + port)
})