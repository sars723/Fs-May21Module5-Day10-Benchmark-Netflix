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
            `http://www.omdbapi.com/?apikey=3d9e8fbe&s=${req.query.s}&t=${req.query.t} `
          );
console.log("query",req.query.s)
          if (response.ok) { 
            const fetchedMovies = await response.json();
            await writeMedias(fetchedMovies.Search)
         
            res.send(fetchedMovies.Search)
         
          } else {
         
           console.log("something wrong")
          }
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

  
mediaRouter.put("/:id/reviews", async (req, res, next) => {
  try {
    const { text, userName } = req.body;
    const review = { id: uniqid(), text, userName, createdAt: new Date() };
   
    const medias = await getMedias()
    const mediaIndex = medias.findIndex(
      (media) => media.imdbID === req.params.id
    );
    if (!mediaIndex == -1) {
      res
        .status(404)
        .send({ message: `media with ${req.params.id} is not found!` });
    }
    const previousMedia = medias[mediaIndex];
    previousMedia.reviews = previousMedia.reviews || [];
    const changedReview = {
      ...previousMedia,
      ...req.body,
      reviews: [...previousMedia.reviews, review],
      updatedAt: new Date(),
      imdbID: req.params.id,
    };
    medias[mediaIndex] = changedReview;
    await writeMedias(medias)
  
    res.send(changedReview);
  } catch (error) {
    console.log(error);
    res.send(500).send({ message: error.message });
  }
});
  
  export default mediaRouter
  