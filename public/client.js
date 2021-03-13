const socket = io("http://localhost:3000");


// from url.
// easily add zoom support!
let url = window.url;
if (!url.startsWith("https://meet.google.com/")) {
    throw new Error("Not in a google meet");
}
let roomId = url.split("https://meet.google.com/")[1].replace("/", "");
if (roomId.length >= 14) {
    throw new Error("To big meeting code!");
}

// from selector
let sibling = document.querySelector(".QMC9Zd");
let userSpan = sibling.parentElement.getElementsByClassName("ZjFb7c")[0];
let userName = userSpan.innerHTML;
let userImageLink = userSpan.parentElement.parentElement.parentElement.getElementsByTagName("img")[0].src;

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