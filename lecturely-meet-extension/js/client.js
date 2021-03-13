window.onload = start;

function start() {
    console.log("client loaded!")
    // from url.
    // easily add zoom support!
    let url = document.URL;
    let roomId = url.split("https://meet.google.com/")[1].replace("/", "");
    if (roomId.length >= 14) {
        throw new Error("To big meeting code!");
    }

    // from selector
    let leaveButton = document.querySelector("div.s1GInc.zCbbgf");
    console.log("leave button");
    if (leaveButton === null) {
        setTimeout(start, 2000);
        return;
    }

    let hambar = document.querySelectorAll("span.NPEfkd.RveJvd.snByac")[1];
    hambar.dispatchEvent(new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true
    }));
    setTimeout(() => {
        let userName = document.querySelector("span.ZjFb7c").innerHTML;
        let userImageLink = document.getElementsByClassName("RWK2Je")[0].getElementsByTagName("img")[0].src;

        let basicStructure = {
            roomId: roomId,
            userName: userName,
            userImageLink: userImageLink,
        };
        console.log(basicStructure);

        const socket = io("http://localhost:3000/");
        
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
    }, 2000);
}