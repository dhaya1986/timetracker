const express = require("express");
require("./db/mongoose");
const path = require("path");
const userRouter = require("./routers/userRouter");
const adminRouter = require("./routers/adminRouters");
var json2xls = require('json2xls');

const app = express();
app.use(express.json());
app.use(json2xls.middleware);
app.use(userRouter);
app.use(adminRouter);

app.use(express.static(path.join(__dirname, '../public')));
app.use(function (req, res, next) {
    req.setTimeout(0);
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});



module.exports = app