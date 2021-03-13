class Room {

    constructor(io, roomId) {
        this.io = io;
        this.roomId = roomId;
        this.users = [];
        this.admin = null;
        this.createCircle();
        this.sendAllInfo();
        this.cnt = 0;
    }

    // clients will need all the info to show to users,
    // 1 - all users (so they can message them if they want).
    // 2 - all users score (to show the scoreboard).
    // 3 - which which user are connected (admin).
    sendAllInfo() {
        setInterval(() => {
            let toSend = [];
            for (let key in this.users) {
                if (this.users.hasOwnProperty(key)) {
                    if (this.users[key].userName != this.admin) {
                        this.users[key].admin = false;
                    }
                    toSend.push(this.users[key].toJson());
                }
            }
            console.log(toSend);
            this.io.to(this.roomId).emit("info", {users: toSend});
        }, 3000);
    }

    addUser(user) {
        if (this.admin !== null && this.admin.name === user.name) {
            user.admin = true;
        }
        if (this.cnt === 0) {
            this.admin = user;
            user.admin = true;
        }
        console.log("Adding a new user to the room!", user);
        if (this.users[user.userName] !== undefined) {
            // used is already present, .. so no need to do anything.
            this.users[user.userName].socket = user.socket;
            this.users[user.userName].admin = user.admin;
        } else {
            this.users[user.userName] = user;
        }
        this.cnt++;
    }

    createCircle() {
        // generated random number between 1min to 2min to create new circle.
        setInterval(() => {
            if (Object.keys(this.users).length === 0) return;
            this.io.to(this.roomId).emit("circle", {
                x: 100 + Math.random() * 500,
                y: 100 + Math.random() * 500,
                t: 5
            });
            console.log("Sending Circle in Room", this.roomId);
        }, 60000 + Math.random() * 60000);
    }

    circleRes(data) {
        this.users[data["userName"]]?.addScore(Number(data["resTime"]));
    }

    questionRes(data) {
        this.users[data["userName"]]?.addQuestionScore();
        this.admin?.socket.emit("pvtMessage", {
            title: "Question Ans | " + data["userName"],
            message: data["answer"],
        })
    }

    // TODO: you can add mcq type question if time permits.
    createQuestion(data) {
        this.io.to(this.roomId).emit("question", {
            question: data.question
        });
    }

    pvtMessage(data) {
        this.users[data["to"]]?.socket.emit("pvtMessage", {
            title: "Message From | " + data["userName"],
            message: data["message"],
        });
    }
}

module.exports = Room;