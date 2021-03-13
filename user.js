class User {
    constructor(userName, userImageLink) {
        this.userName = userName;
        this.userImageLink = userImageLink;
        this.score = 0;
    }
    addScore(data) {
        if(data["type"] === "circleRes") {
            if(data["resTime"] >= 5) return;
            this.score += (5 - data["resTime"]) * 20;
        }
    }
}

module.exports = User;