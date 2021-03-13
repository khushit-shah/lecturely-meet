const express = require("express");
const Controller = require("./controller");
const cors = require("cors");
const PORT = 3000;

const app = express();
app.use(cors());
app.use("/", express.static(__dirname + "/public/"));
const http = require('http').createServer(app);
const io = require("socket.io")(http, {
    cors: {
        origin: true,
        methods: ["GET", "POST"]
    }
});
const controller = new Controller(io);
controller.startListening();

http.listen(process.env.PORT || PORT, () => {
    console.log("Server started!");
})