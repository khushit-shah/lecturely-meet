const Room = require("./room");
const User = require("./user");

class Controller {

    constructor(io) {
        this.io = io;
        this.rooms = [];
    }

    startListening() {
        this.io.on("connection", (socket) => {
            console.log("A user connected ", socket.id);
            socket.on("init", (data) => {
                console.log(data, " user called init");
                if (this.rooms[data["roomId"]] !== undefined) {
                    this.rooms[data["roomId"]].addUser(new User(data["userName"], data["userImageLink"], socket));
                } else {
                    this.rooms[data["roomId"]] = new Room(this.io, data["roomId"]);
                    this.rooms[data["roomId"]].addUser(new User(data["userName"], data["userImageLink"], socket));
                }
                socket.join(data["roomId"]);
            });

            // non admin user clicks circle.
            socket.on("circleRes", (data) => {
                this.rooms[data["roomId"]].circleRes(data);
            });

            // non admin user answers question asked by admin.
            socket.on("ansRes", (data) => {
                this.rooms[data["roomId"]].questionRes(data);
            });

            // user pvt message another user.
            socket.on("pvtMessage", (data) => {
                this.rooms[data["roomId"]].pvtMessage(data);
            });

        });

    }
}

module.exports = Controller;
