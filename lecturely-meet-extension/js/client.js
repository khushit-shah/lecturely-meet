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

    function showModal(id) {
        let modal = document.getElementById(id);
        modal.style.display = "block";
    }

    function hideModal(id) {
        let modal = document.getElementById(id);
        modal.style.display = "none";
    }

    setTimeout(() => {
        let userName = document.querySelector("span.ZjFb7c").innerHTML;
        let userImageLink = document.getElementsByClassName("RWK2Je")[0].getElementsByTagName("img")[0].src;

        let basicStructure = {
            roomId: roomId,
            userName: userName,
            userImageLink: userImageLink,
        };
        console.log(basicStructure);

        const socket = io("https://lecturely-meet.herokuapp.com/");

        // create all the elements already!
        let circle = document.createElement("div");
        circle.className = "circle";
        document.body.appendChild(circle);


        let createQuestionModalHtml = `
            <div class="modal" id="createQuestion">
                <div class="modal-header">Enter your question</div>
                <hr>
                <input id="question-input" placeholder="Enter Question Here"></input>
                <hr>
                <div class="modal-footer">
                    <button class="btn btn-primary" id="question-ok">Create</button>
                    <button class="btn" id="question-cancel">Cancel</button>
                </div>
            </div>
        `;

        // let temp = document.createElement("div");
        // temp.id = "createQuestion";
        // temp.className = "modal";
        // let temp1 = document.createElement("input");
        // temp1.id = "question-input";
        // temp1.placeholder = "Enter Question here";
        // temp.appendChild(temp1);
        //
        // temp1 = document.createElement("button");
        // temp1.id = "question-cancel";
        // temp1.className = "btn";
        // temp1.innerHTML = "Cancel";
        // temp.appendChild(temp1);
        //
        // temp1 = document.createElement("button");
        // temp1.id = "question-ok";
        // temp1.innerHTML = "Create";
        // temp1.className = "btn btn-primary";
        // temp.appendChild(temp1);
        //
        // document.body.appendChild(temp);
        //
        // temp = document.createElement("div");
        // temp.id = "ansQuestion";
        // temp.className = "modal";
        // temp1 = document.createElement("div");
        // temp1.id = "question";
        // temp.appendChild(temp1);
        //
        // temp1 = document.createElement("input");
        // temp1.id = "ans-input";
        // temp1.placeholder = "Enter your answer here.";
        // temp.appendChild(temp1);
        //
        // temp1 = document.createElement("button");
        // temp1.id = "ans-cancel";
        // temp1.innerHTML = "Cancel";
        // temp1.className = "btn";
        // temp.appendChild(temp1);
        //
        // temp1 = document.createElement("button");
        // temp1.id = "ans-ok";
        // temp1.innerHTML = "Answer";
        // temp1.className = "btn btn-primary";
        // temp.appendChild(temp1);
        //
        // document.body.appendChild(temp);

        let ansQuestionModalHtml = `
            <div class="modal" id="ansQuestion">
                <div class="modal-header">
                    <div id="question"></div>
                </div>
                <hr>
                <input id="ans-input" placeholder="Enter Your answer here." />
                <div class="modal-footer">
                <button class="btn btn-primary" id="ans-ok">Answer</button>
                <button class="btn" id="ans-cancel">Cancel</button>
                </div>
            </div>
        `;

        let messages = document.createElement("div");
        messages.id = "pvtMessages";

        document.body.appendChild(messages);
        let modals = document.createElement("div");
        document.body.appendChild(modals);
        modals.innerHTML += createQuestionModalHtml;
        modals.innerHTML += ansQuestionModalHtml;


        let createQuestionButton = document.createElement("div");
        createQuestionButton.className = "add-question-btn";
        createQuestionButton.innerHTML = "+";
        createQuestionButton.onclick = () => {
            showModal("createQuestion");
            document.getElementById("question-cancel").onclick = (e) => {
                hideModal("createQuestion")
            };
            document.getElementById("question-ok").onclick = (e) => {
                createQuestion(document.getElementById("question-input").value);
                hideModal("createQuestion");
            }
        }

        document.getElementsByClassName("jzP6rf")[0]?.appendChild(createQuestionButton);
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
            let users = data["users"];
            users.forEach(user => {
                if (user.userName === userName) {
                    if (user.admin === true) {
                        createQuestionButton.style.display = "inline-block";
                    }
                }
            })
        })

        let messageStructure = `
            <div class="message">
                <div class="msg-title">$1</div>
                <div class="msg">$2</div>                
            </div>
        `;

        socket.on("pvtMessage", (data) => {
            console.log("Message received!");
            console.log(data);
            messages.className = "";
            // messages.style.opacity = 1;
            setTimeout(() => {
                messages.className = "animatefade";
            }, 3000);
            // alert(data["title"] + "Message: " + data["message"]);
            messages.innerHTML += messageStructure.replace("$1", data["title"]).replace("$2", data["message"]);
        })

        socket.on("question", (data) => {
            console.log("Question received!");
            console.log(data);
            document.getElementById("question").innerHTML = data["question"];
            showModal("ansQuestion");
            document.getElementById("ans-ok").onclick = () => {
                ansQuestion(document.getElementById("ans-input").value);
                hideModal("ansQuestion");
            }
            document.getElementById("ans-cancel").onclick = () => {
                hideModal("ansQuestion");
            }
            // we got question, we need to take ans of that question from the user.
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