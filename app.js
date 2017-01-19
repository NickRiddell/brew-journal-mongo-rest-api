'use strict' ;

let express = require('express');
let app = express();
let routes = require("./routes");

let jsonParser = require("body-parser").json;
let logger = require("morgan");

app.use(logger("dev"));
app.use(jsonParser());

let mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/brewjournal");

let db = mongoose.connection;

db.on("error", function(err) {
    console.error("connection error:", err);
});

db.once("open", function(){
    console.log("db connection successful");
});

app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if(req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE");
        return res.status(200).json({});
    }
    next();
});

app.use("/brews", routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//Error Handler

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});

let port = process.env.PORT || 3000;

app.listen(port, function(){
    console.log("Express server is listening on port", port);
});




