import express from "express";

import pizzaRouter from "./routes/films";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* Middleware to count the number of GET requests */
let requestCount = 0;
app.use((req, _res, next) => {
  if (req.method === "GET") {
    requestCount++;
    console.log(`GET counter : ${requestCount}`);
  }
  next();
});


app.use("/films", pizzaRouter);


export default app;
