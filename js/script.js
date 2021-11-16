function onEnterPress(who) {
    enterKey = event.keyCode;
    if (who.classList.contains("nickname-text-box")) {

        if (enterKey === 13) {
            login();
        }
    } else {
        if (enterKey === 13) {
            sendMessage();
        }
    }
}
let user = { name: "" }

function login() {
    user = { name: document.querySelector(".nickname-text-box").value }
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", user);
    document.querySelector(".login-page").innerHTML = `<img class="login-logo" src="assets/logo.png"><img class="loading" src="assets/loading.gif">`;
    promise.catch(loginCatch);
    promise.then(loginThen);
}

function loginCatch() {
    alert("Nome indisponível");
    window.location.reload();
}

function loginThen() {
    document.querySelector(".login-page").classList.add("hidden");
    document.querySelector("main").classList.remove("hidden");
    messagesCaller();
    participantsCaller();
    setInterval(messagesCaller, 3000);
    setInterval(connectionCheck, 5000);
    setInterval(participantsCaller, 10000);
}

function connectionCheck() {
    const connectionData = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", user);
}

function messagesCaller() {
    const messagesData = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    messagesData.then(messagesCallerThen);
    messagesData.catch();
}

let lastMessage = document.querySelector('.chat').lastChild;

function messagesCallerThen(promise) {
    const messages = promise.data;
    document.querySelector(".chat").innerHTML = "";
    for (let i = 0; i < messages.length; i++) {
        if (messages[i].type === "status") {
            document.querySelector(".chat").innerHTML += `<li class="logged-in-out message" data-identifier="message">
            <span><time>(${messages[i].time})</time> <b>${messages[i].from}</b> ${messages[i].text}</span>
        </li>`
        }
        if (messages[i].type === "message") {
            document.querySelector(".chat").innerHTML += `<li class="message" data-identifier="message">
            <span><time>(${messages[i].time})</time> <b>${messages[i].from}</b> para <b>${messages[i].to}: </b>${messages[i].text}</span>
        </li>`
        }
        if (messages[i].type === "private_message" && (messages[i].to === user.name || messages[i].from === user.name)) {
            document.querySelector(".chat").innerHTML += `<li class="private message" data-identifier="message">
            <span><time>(${messages[i].time})</time> <b>${messages[i].from}</b> reservadamente para <b>${messages[i].to}: </b>${messages[i].text}</span>
        </li>`
        }
    }
    if (lastMessage.innerHTML !== document.querySelector(".chat").lastChild.innerHTML) {
        lastMessage = document.querySelector('.chat').lastChild;
        lastMessage.scrollIntoView();
    }
}

function sendMessage() {
    const message = { from: user.name, to: selectedParticipant, text: document.querySelector(".message-text-box").value, type: "message" }
    if (selectedVisibility === "Público") {
        message.type = "message";
    } else {
        message.type = "private_message"
    }
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", message);
    document.querySelector(".message-text-box").value = "";
    promise.then(messagesCaller);
    promise.catch(sendMessageCatch);
}

function sendMessageCatch() {
    alert("Conecte novamente.");
    window.location.reload();
}

function drawMenu() {
    const drawerMenu = document.querySelector(".drawer-menu");
    drawerMenu.classList.toggle("hidden");
    participantsCaller();
}

function participantsCaller() {
    const participantsData = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants")
    participantsData.then(participantsCallerThen);
    participantsData.catch(participantsCallerCatch);
}

function participantsCallerCatch() {
    alert("Erro com o servidor");
}

let selectedParticipant = "Todos";

function participantsCallerThen(promise) {
    const participants = promise.data;
    if (selectedParticipant !== "Todos") {
        document.querySelector(".contacts").innerHTML = `<li onclick="selection(this)" data-identifier="participant">
        <div><ion-icon name="people"></ion-icon> <span>Todos</span></div>
        <ion-icon class="checkMark" name="checkmark"></ion-icon>
        </li>`
    } else {
        document.querySelector(".contacts").innerHTML = `<li onclick="selection(this)" data-identifier="participant">
        <div><ion-icon name="people"></ion-icon> <span>Todos</span></div>
        <ion-icon class="checkMark selected" name="checkmark"></ion-icon>
        </li>`;
    }
    for (let i = 0; i < participants.length; i++) {
        if (participants[i].name !== user.name) {
            if (selectedParticipant !== participants[i].name) {
                document.querySelector(".contacts").innerHTML += `<li onclick="selection(this)" data-identifier="participant">
                <div><ion-icon name="people-circle"></ion-icon> <span>${participants[i].name}</span></div>
                <ion-icon class="checkMark" name="checkmark"></ion-icon>
                </li>`
            } else {
                document.querySelector(".contacts").innerHTML += `<li onclick="selection(this)" data-identifier="participant">
                <div><ion-icon name="people-circle"></ion-icon> <span>${participants[i].name}</span></div>
                <ion-icon class="checkMark selected" name="checkmark"></ion-icon>
                </li>`
            }
        }
    }
}

let selectedVisibility = "Público";

function selection(checkMarked) {
    const checkMark = checkMarked.querySelector(".checkMark");
    const container = checkMarked.parentNode;
    if (container.querySelector(".selected") !== null) {
        container.querySelector(".selected").classList.toggle("selected");
        if (container.classList.contains("contacts")) {
            selectedParticipant = checkMarked.querySelector("span").innerHTML;
        } else {
            selectedVisibility = checkMarked.querySelector("span").innerHTML;
        }
    }
    checkMark.classList.toggle("selected");
    if (container.classList.contains("contacts")) {
        selectedParticipant = checkMarked.querySelector("span").innerHTML;
    } else {
        selectedVisibility = checkMarked.querySelector("span").innerHTML;
    }
    document.querySelector("footer span").innerHTML = `Enviando para ${selectedParticipant} (${selectedVisibility})`
}