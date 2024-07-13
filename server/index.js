const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { DBConnection } = require("./database/db.js");
const cookieParser = require("cookie-parser");
const authRoutes = require('./routes/auth');
const problemRoutes = require('./routes/problem')

dotenv.config();

DBConnection(); //Db connection

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/', authRoutes);
app.use('/',problemRoutes);


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});