import { Router } from "express";

import { Film, NewFilm } from "../types";

const router = Router();

const films: Film[] = [
  {
    id: 1,
    title: "Shang-Chi and the Legend of the Ten Rings",
    director: "Destin Daniel Cretton",
    duration: 132,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/7/74/Shang-Chi_and_the_Legend_of_the_Ten_Rings_poster.jpeg",
    description:
      "Shang-Chi, the master of unarmed weaponry-based Kung Fu, is forced to confront his past after being drawn into the Ten Rings organization.",
    budget: 150,
  },
  {
    id: 2,
    title: "The Matrix",
    director: "Lana Wachowski, Lilly Wachowski",
    duration: 136,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/c/c1/The_Matrix_Poster.jpg",
    description:
      "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    budget: 63,
  },
  {
    id: 3,
    title: "Summer Wars",
    director: "Mamoru Hosoda",
    duration: 114,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/7/7d/Summer_Wars_poster.jpg",
    description:
      "A young math genius solves a complex equation and inadvertently puts a virtual world's artificial intelligence in a position to destroy Earth.",
    budget: 18.7,
  },
  {
    id: 4,
    title: "The Meyerowitz Stories",
    director: "Noah Baumbach",
    duration: 112,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/a/af/The_Meyerowitz_Stories.png",
    description:
      "An estranged family gathers together in New York City for an event celebrating the artistic work of their father.",
  },
  {
    id: 5,
    title: "her",
    director: "Spike Jonze",
    duration: 126,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/4/44/Her2013Poster.jpg",
    description:
      "In a near future, a lonely writer develops an unlikely relationship with an operating system designed to meet his every need.",
    budget: 23,
  },
];

router.get("/", (req, res) => {
  // Si le paramètre de requête "minimum-duration" est absent,
  // on renvoie la liste complète des films.
  if (req.query["minimum-duration"] === undefined) {
    return res.send(films);
  }

  // On convertit le paramètre "minimum-duration" en nombre.
  const minDuration = Number(req.query["minimum-duration"]);

  // Si ce n’est pas un nombre ou si c’est ≤ 0, on répond 400 (Bad Request)
  if (isNaN(minDuration) || minDuration <= 0) {
    return res.sendStatus(400);
  }

  /*
C’est une fonction fléchée (arrow function).
Pour chaque élément (chaque film du tableau), la variable locale film représente l’objet courant.
L’expression vérifie si :
film.duration (durée du film, un nombre en minutes probablement)
est supérieure ou égale à minDuration (la valeur numérique extraite de req.query["minimum-duration"]).
Si oui → retourne true → le film est gardé dans filteredFilms.
Sinon → false → le film est exclu.
  */
  // On filtre les films dont la durée est >= à la durée minimale.

  const filteredFilms = films.filter((film) => film.duration >= minDuration);

  return res.send(filteredFilms);
});

router.get("/:id", (req, res) => {
  // On lit le paramètre dynamique ":id" dans l’URL et on le parse en entier.
  const id = parseInt(req.params.id);

  // Si l’id n’est pas un nombre => 400
  if (isNaN(id)) {
    return res.sendStatus(400);
  }
  //on recherche dans defaultFilm un film qui à le meme id que celui en param
  const film = films.find((film) => film.id === id);

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
  // si la ressource existe déjà, c'est-à-dire s'il y a déjà un film présent avec le title et le director
  const existingFilm = films.find(
    (film) =>
      film.title.toLowerCase() === newFilm.title.toLowerCase() &&
      film.director.toLowerCase() === newFilm.director.toLowerCase()
  );

  if (existingFilm) {
    return res.sendStatus(409);
  }

  // reduce pour incrémenter l'id de 1 à chaque fois
  const nextId =
    films.reduce((acc, film) => (film.id > acc ? film.id : acc), 0) + 1;

  // On construit l’objet Film complet avec l’id généré + les champs du corps.
  const addedFilm: Film = { id: nextId, ...newFilm };

  films.push(addedFilm);

  return res.json(addedFilm);
});

export default router;
