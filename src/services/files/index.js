import express from "express"
import multer from "multer"
import {extname} from "path"
import { writeMedias,getMedias } from "../../lib/fs-tools.js"
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";



const cloudinaryStorage = new CloudinaryStorage({
 cloudinary,
  params: {
      folder: "files"
  }
})

const filesRouter = express.Router()
filesRouter.post("/:id/poster", multer({ storage: cloudinaryStorage }).single("mediaPic"), async (req, res, next) => {
    try {
      console.log(req.file)
      const extension = extname(req.file.originalname) // someimage.png --> 7d7d.png
      console.log(req.file.originalname)
      const fileName = `${req.params.id}${extension}`
      const url = `http://localhost:3003/${fileName}`
    /*   await saveBlogsPicture(fileName, req.file.buffer) */
      // FİND BLOG BY ID AND UPDATE COVER FIELD
      let  medias = await  getMedias()
      console.log(url)
      const media = medias.find(media=>media.imdbID===req.params.id);
      console.log(media)
      media.poster=url
      medias = medias.filter(media=>media.imdbID!==req.params.id)
      medias.push(media)
      await writeMedias(medias)
      res.send({media})
    } catch (error) {
        console.log(error)
      next(error)
    }
  })

  export default filesRouter