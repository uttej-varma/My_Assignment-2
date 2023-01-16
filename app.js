const express = require("express");

const conn = require("./connection/conn");

const loginRoutes = require("./routes/login");

const postRoutes = require("./routes/posts");
const secret = "RESTAPI";
const jwt = require('jsonwebtoken');

conn();
const app = express();

app.use("/api/v1/posts", (req, res, next) => {
    console.log("Hello");
    const token = req.headers.authorization;
    if(token){
        jwt.verify(token, secret, function(err, decoded) {
            if(err) {
               return res.status(403).json({
                status: "Failed",
                message: "Token is not valid"
                });
            }
            console.log("Hello I am here");
            req.user = decoded.data;
            next();
          });

    }else {
        res.status(403).json({
            status: "Failed",
            message: "User is not authenticated"
        })
    }
})


app.use("/api/v1", loginRoutes);
app.use("/api/v1", postRoutes);

app.get("*", (req, res) => {
    res.status(404).send("API IS NOT FOUND");
})


app.listen(5000, () => console.log("Our server is up and running at port 5000"));
