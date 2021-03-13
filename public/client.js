const socket = io("http://localhost:3000");


// from selector
let roomId = "1234";
let userName = Math.random().toString();
let userImageLink = Math.random().toString();

let basicStructure = {
    roomId: roomId,
    userName: userName,
    userImageLink: userImageLink,
};
socket.on("connect", () => {
    console.log("Client is connected to server! with id", socket.id);
    socket.emit("init", basicStructure);
});

socket.on("circle", (data) => {
    console.log("Client got a circle", data);

});

socket.on("info", (data) => {
    console.log("Information received!");
    console.log(data);
})


socket.on("pvtMessage", (data) => {
    console.log("Message received!");
    console.log(data);
})

socket.on("question", (data) => {
    console.log("Question received!");
    console.log(data);
})

function sendCircleResponse(resTime) {
    console.log("sending circle response");
    socket.emit("circleRes", {
        ...basicStructure,
        "resTime": resTime,
    });
}

function sendPvtMessage(to, msg) {
    console.log("sending private message");
    socket.emit("pvtMessage", {
        ...basicStructure,
        to: to,
        message: msg
    })
}

function createQuestion(question) {
    console.log("Sending question to the server");
    socket.emit("createQuestion", {
        ...basicStructure,
        question,
    })
}

function ansQuestion(ans) {
    console.log("sending answer to server");
    socket.emit("ansRes", {
        ...basicStructure,
        answer: ans,
    })
}