import express from "express"
import uniqid from "uniqid"
import createHttpError from "http-errors"
import fetch from 'node-fetch';

import { getMedias, writeMedias } from "../../lib/fs-tools.js"

const mediaRouter = express.Router()


mediaRouter.get("/", async (req, res, next) => {
   
    try {

      /* const medias = await getMedias() */
        const response = await fetch(
            `http://www.omdbapi.com/?apikey=3d9e8fbe&s=batman&t=batman `
          );

          if (response.ok) { 
            const fetchedMovies = await response.json();
            /* console.log(fetchedMovies.Search)
            medias.push(fetchedMovies.Search)
            await writeMedias(medias) */
            await writeMedias(fetchedMovies.Search)
           /*  const medias =fetchedMovies.Search */
            res.send(fetchedMovies.Search)
           
         
          } else {
         
           console.log("something wrong")
          }


     /*  console.log("Query params --> ", req.query)
      const medias = await getMedias()
     
  
      if (req.query && req.query.title) {
        const filteredMedias = Medias.filter(media => media.title === req.query.title)
        res.send(filteredMedias)
      } else {
          const 
        res.send(medias)
      } */
    } catch (error) {
      next(error)
    }
  })
  
  mediaRouter.get("/:id", async (req, res, next) => {
    try {
      const medias = await getMedias()
console.log(medias)
      const media = medias.find(media => media.imdbID === req.params.id)
      if (media) {
        res.send(media)
      } else {
        next(createHttpError(404, `Media with id ${req.params.id} not found!`)) 
      }
    } catch (error) {
      next(error) 
    }
  })
  
  mediaRouter.post("/", async (req, res, next) => {
    try {
      const medias = await getMedias()
      const newMedia = { ...req.body, id: uniqid(), createdAt: new Date(),updatedAt:Date() }
  
      medias.push(newMedia)
  
      await writeMedias(medias)
  
      res.status(201).send({ id: newMedia.imdbID })
    } catch (error) {
      next(error)
    }
  })
  
  mediaRouter.put("/:id", async (req, res, next) => {
    try {
      const medias = await getMedias()
  
      const remainingMedias = medias.filter(media => media.imdbID !== req.params.id)
  
      const modifiedMedia = { ...req.body, id: req.params.id,updatedAt:Date() }
  
      remainingMedias.push(modifiedMedia)
  
      await writeMedias(remainingMedias)
  
      res.send(modifiedMedia)
    } catch (error) {
      next(error)
    }
  })
  
  mediaRouter.delete("/:id", async (req, res, next) => {
    try {
      const medias =await getMedias()
  console.log(medias)
      const remainingMedias = medias.filter(media => media.imdbID !== req.params.id)
  
      await writeMedias(remainingMedias)
  
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  })
  
  export default mediaRouter
  