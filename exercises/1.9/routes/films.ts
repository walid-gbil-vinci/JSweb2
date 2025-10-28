import { Router } from "express";


import { NewFilm } from "../types";
import {readAll, readOne, createOne, deleteOne, updateOne, updateOrCreateOne} from "../services/films";


const router = Router();




// Read all films, filtered by minimum-duration if the query param exists
router.get("/", (req, res) => {
  //Cette ligne vérifie (?) si un paramètre minimum-duration existe dans la requête(req.query) et si il existe il le converti en Number sinon undefined. 
   const minDuration = "minimum-duration" in req.query ? Number(req.query["minimum-duration"]): undefined;
   if (minDuration !== undefined && (isNaN(minDuration) || minDuration <= 0)) {
    return res.sendStatus(400);
  }
  const filteredFilms = readAll(minDuration);

  return res.send(filteredFilms);

});

router.get("/:id", (req, res) => {
  // On lit le paramètre dynamique ":id" dans l’URL et on le parse en entier.
  const id = Number(req.params.id);

  // Si l’id n’est pas un nombre => 400
  if (isNaN(id)) {
    return res.sendStatus(400);
  }

  const film = readOne(id);


  //si pas trv erreur
  if (film === undefined) {
    return res.sendStatus(404);
  }
  //sinon => film
  return res.send(film);
});

router.post("/", (req, res) => {
  //const film = { id: auto, title: "Inception", ... };
  const film: unknown = req.body;

  if (
    !film ||
    typeof film !== "object" ||
    !("title" in film) ||
    !("director" in film) ||
    !("duration" in film) ||
    typeof film.title !== "string" ||
    typeof film.director !== "string" ||
    typeof film.duration !== "number" ||
    !film.title.trim() ||
    !film.director.trim() ||
    film.duration <= 0 ||
    ("budget" in film &&
      (typeof film.budget !== "number" || film.budget <= 0)) ||
    ("description" in film &&
      (typeof film.description !== "string" || !film.description.trim())) ||
    ("imageUrl" in film &&
      (typeof film.imageUrl !== "string" || !film.imageUrl.trim()))
  ) {
    return res.sendStatus(400);
  }
  // avant film : unknown, mtn que sa a repondu aux if on sais qu'il est de type new film
  const newFilm = film as NewFilm;

  const addedFilm = createOne(newFilm);
  
  if(!addedFilm){ return res.sendStatus(409);}

   return res.json(addedFilm);
});



router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.sendStatus(400);
  }
 

  const deletedFilm = deleteOne(id);

  if (!deletedFilm) {
    return res.sendStatus(404);
  }

  return res.send(deletedFilm);
});

// Update on or multiple props of a film
router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.sendStatus(400);
  }
 
  const body: unknown = req.body;

  if (
    !body ||
    typeof body !== "object" ||
    Object.keys(body).length === 0 ||
    ("title" in body &&
      (typeof body.title !== "string" || !body.title.trim())) ||
    ("director" in body &&
      (typeof body.director !== "string" || !body.director.trim())) ||
    ("duration" in body &&
      (typeof body.duration !== "number" || body.duration <= 0)) ||
    ("budget" in body &&
      (typeof body.budget !== "number" || body.budget <= 0)) ||
    ("description" in body &&
      (typeof body.description !== "string" || !body.description.trim())) ||
    ("imageUrl" in body &&
      (typeof body.imageUrl !== "string" || !body.imageUrl.trim()))
  ) {
    return res.sendStatus(400);
  }

  const updatedFilm = updateOne(id, body);

    if (!updatedFilm) {
    return res.sendStatus(404);
  }

  return res.send(updatedFilm);
});

router.put("/:id", (req, res) => {
  const body: unknown = req.body;

  if (
    !body ||
    typeof body !== "object" ||
    !("title" in body) ||
    !("director" in body) ||
    !("duration" in body) ||
    typeof body.title !== "string" ||
    typeof body.director !== "string" ||
    typeof body.duration !== "number" ||
    !body.title.trim() ||
    !body.director.trim() ||
    body.duration <= 0 ||
    ("budget" in body &&
      (typeof body.budget !== "number" || body.budget <= 0)) ||
    ("description" in body &&
      (typeof body.description !== "string" || !body.description.trim())) ||
    ("imageUrl" in body &&
      (typeof body.imageUrl !== "string" || !body.imageUrl.trim()))
  ) {
    return res.sendStatus(400);
  }

  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.sendStatus(400);
  }
  const createdOrUpdatedFilm = updateOrCreateOne(id, body as NewFilm);

  if (!createdOrUpdatedFilm) {
    return res.sendStatus(409); // Film already exists
  }
  return res.send(createdOrUpdatedFilm);
});

export default router;
