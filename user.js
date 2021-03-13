class User {
    constructor(userName, userImageLink, socket) {
        this.userName = userName;
        this.userImageLink = userImageLink;
        this.score = 0;
        this.socket = socket;
        this.admin = false;
    }

    addScore(resTime) {
        if (resTime >= 5) return;
        this.score += (5 - resTime) * 20;
    }

    addQuestionScore() {
        // answering question is important.
        this.score += 100;
    }

    toJson() {
        return {
            userName: this.userName,
            userImageLink: this.userImageLink,
            score: this.score,
            socket: this.socket.id,
            admin: this.admin
        };
    }
}

module.exports = User;