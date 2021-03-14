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
    let users = [];
    let admin = false;
    let roomId = url.split("https://meet.google.com/")[1].split("?")[0].replace("/", "");
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

        let sendPrivateMessageModal = `
            <div class="modal" id="privateMessage">
                <div class="modal-header">Enter your Message</div>
                    <hr>
                    <div id="old-messages">
                       
                   </div>
                <select id="msg-select">
                </select>
                <input id="msg-input" placeholder="Enter Message Here"/>
                <hr>
                <div class="modal-footer">
                    <button class="btn btn-primary" id="msg-ok">Send</button>
                    <button class="btn" id="msg-cancel">Cancel</button>
                </div>
                
            </div>
        `;


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
        modals.innerHTML += sendPrivateMessageModal;

        let pvtMessageButton = document.createElement("div");
        pvtMessageButton.className = "add-question-btn";
        pvtMessageButton.style.display = "inline-block";
        pvtMessageButton.innerHTML = `<svg focusable="false" width="24" height="24" viewBox="0 0 24 24" class="Hdh4hc cIGbvc NMm5M"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H4V4h16v12z"></path><path d="M6 12h12v2H6zm0-3h12v2H6zm0-3h12v2H6z"></path></svg>`;
        pvtMessageButton.onclick = () => {
            let selectOp = document.getElementById("msg-select");
            selectOp.innerHTML = "";
            users.forEach(user => {
                if (user.userName == userName) return;
                selectOp.innerHTML += "<option value='" + user.userName + "'>" + user.userName + "</option>";
            })
            showModal("privateMessage");
            document.getElementById("msg-cancel").onclick = (e) => {
                hideModal("privateMessage")
            };
            document.getElementById("msg-ok").onclick = (e) => {
                sendPvtMessage(document.getElementById("msg-select").value, document.getElementById("msg-input").value);
                hideModal("privateMessage");
            }
        }

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
        document.getElementsByClassName("f0WtFf")[0]?.appendChild(pvtMessageButton);
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
            users = [];
            let users_a = data["users"];
            users_a.forEach(user => {
                users.push(user);
                if (user.userName === userName) {
                    if (user.admin === true) {
                        createQuestionButton.style.display = "inline-block";
                        admin = true;
                    } else {
                        createQuestionButton.style.display = "none";
                        admin = false;
                    }
                }
            })
            let scores = document.querySelectorAll(".scores");
            scores.forEach((score) => {
                score.remove();
            });
            let allUser = document.querySelectorAll(".ZjFb7c");
            console.log(allUser);
            allUser.forEach((userDiv) => {
                let name = userDiv.innerHTML;
                name = name.trim();
                users.forEach(user => {
                    if (user.userName.trim() === name) {
                        let a = document.createElement("div");
                        a.className = "scores";
                        a.innerHTML = " " + Math.round(user.score);
                        userDiv.parentElement.appendChild(a);
                        return;
                    }
                })
            })
        })

        let messageStructure = `
            <div class="message">
                <div class="msg-title">$1</div>
                <div class="msg">$2</div>                
            </div>
        `;


        let oldMessageStructure = `
            <div class="o-message">
                <div class="o-msg-title">$1</div>
                <div class="o-msg">$2</div>                
            </div>
            <hr>
        `;
        socket.on("pvtMessage", (data) => {
            console.log("Message received!");
            console.log(data);
            messages.className = "";
            let old = document.getElementById("old-messages");
            old.innerHTML += oldMessageStructure.replace("$1", data["title"]).replace("$2", data["message"]);
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
            if (admin) return;
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
            let old = document.getElementById("old-messages");
            old.innerHTML += oldMessageStructure.replace("$1", "To: " + to).replace("$2", msg);
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