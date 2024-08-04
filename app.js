//express 모듈
const express = require("express");
const cors = require("cors");
const app = express();

//dot env 모듈
const dotenv = require("dotenv");
dotenv.config();

app.use(
  cors({
    origin: "http://localhost:3001", // The frontend URL
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.listen(process.env.PORT);

const userRouter = require("./routes/users");
const likeRouter = require("./routes/likes");
const cartRouter = require("./routes/carts");
const orderRouter = require("./routes/orders");
const bookRouter = require("./routes/books");
const categoryRouter = require("./routes/category");

app.use("/users", userRouter);
app.use("/likes", likeRouter);
app.use("/carts", cartRouter);
app.use("/category", categoryRouter);
app.use("/orders", orderRouter);
app.use("/books", bookRouter);
