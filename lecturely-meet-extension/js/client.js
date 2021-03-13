// utility functions:
function addCircle(div, x_pos, y_pos) {
    // div.style.position = "absolute";
    div.style.left = x_pos + 'px';
    div.style.top = y_pos + 'px';
    // div.style.zIndex = "1";
    div.classList.add("circle-added");
}

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

        // create all the elements already!
        let circle = document.createElement("div");
        circle.className = "circle";
        document.body.appendChild(circle);


        socket.on("connect", () => {
            console.log("Client is connected to server! with id", socket.id);
            socket.emit("init", basicStructure);
        });

        socket.on("circle", (data) => {
            console.log("Client got a circle", data);
            let x = data["x"];
            let y = data["y"];
            let t = data["t"];
            let startTime = Date.now();
            addCircle(circle, x, y);
            circle.onclick = function () {
                circle.className = "circle";
                let endTime = Date.now();
                sendCircleResponse((endTime - startTime) / 1000);
            }
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
            console.log("sending circle response ", resTime);
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