function loginThen() {
    document.querySelector(".login-page").classList.add("hidden");
    document.querySelector("main").classList.remove("hidden");
}

function loginCatch() {
    alert("Nome indisponível")
}

function login() {
    const nickname = { name: document.querySelector(".nickname-text-box").value }
    console.log(nickname);
    const serverResponse = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", nickname);
    serverResponse.then(loginThen);
    serverResponse.catch(loginCatch);
}

function onEnterPress() {
    enterKey = event.keyCode;
    if (enterKey === 13) {
        login();
    }
}