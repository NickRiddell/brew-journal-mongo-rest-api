'use strict' ;

let express = require('express');
let app = express();
let routes = require("./routes");
let mongoose = require("mongoose");
let config = require('config');
let bodyParser = require("body-parser");
let morgan = require("morgan");
let options = {
               server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
               replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } }
             };


app.use(bodyParser.json());                                     
app.use(bodyParser.urlencoded({extended: true}));               
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'}));  


mongoose.connect(config.DBHost, options);

let db = mongoose.connection;

db.on("error", function(err) {
    console.error("connection error:", err);
});

//don't show the log when it is test
if(config.util.getEnv('NODE_ENV') !== 'test') {
    //use morgan to log at command line
    app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

db.once("open", function(){
    console.log("db connection successful");
});

app.use((req, res, next) => {
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

module.exports = app;



