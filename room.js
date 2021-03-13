class Room {
    constructor(io, roomId) {
        this.io = io;
        this.roomId = roomId;
        this.users = [];
        this.setEventListeners();
        this.createCircle();
    }

    setEventListeners() {
        this.io.on("circleRes", (data) => {
            console.log(data, " user called circleRes");
            this.users[data.userImageLink].addScore(data);
        });
    }

    addUser(user) {
        console.log("Adding a new user to the room!", user);
        if (this.users[user.userImageLink] !== undefined) {
            // used is already present, .. so no need to do anything.
        } else {
            this.users[user.userImageLink] = user;
        }
    }

    createCircle() {
        // generated random number between 1min to 2min to create new circle.
        setInterval(() => {
            console.log(1, this.users, this.users.keys().length);
            if(this.users.keys().length === 0) return;
            console.log(2);
            this.io.to(this.roomId).emit("circle", {
                x: 10,
                y: 20,
                t: 5
            });
            console.log("sending circle res");
        }, 3000);
    }
}

module.exports = Room;