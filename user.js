class User {
    constructor(userName, userImageLink, socket) {
        this.userName = userName;
        this.userImageLink = userImageLink;
        this.score = 0;
        this.socket = socket;
        this.admin = false;
    }

    addScore(resTime) {
        if(resTime >= 5) return;
        this.score += (5 - resTime) * 20;
    }

}

module.exports = User;