const Room = require("./room");
const User = require("./user");

class Controller {

    constructor(io) {
        this.io = io;
        this.rooms = [];
    }

    startListening() {
        this.io.on("connection", (socket) => {
            console.log("A user connected");
            socket.on("init", (data) => {
                console.log(data, " user called init");
                if (this.rooms[data["roomId"]] !== undefined) {
                    this.rooms[data["roomId"]].addUser(new User(data["userName"], data["userImageLink"]));
                } else {
                    this.rooms[data["roomId"]] = new Room(this.io, data["roomId"]);
                    this.rooms[data["roomId"]].addUser(new User(data["userName"], data["userImageLink"]));
                }
                socket.join(data["roomId"]);
            });
        });
    }
}

module.exports = Controller;
