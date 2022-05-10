const heading = document.getElementById("heading");
const login_box = document.getElementById("login");
const signup_box = document.getElementById("sign_up");
const signup_link = document.getElementById("signup_link");
const login_link = document.getElementById("login_link");

function show_alert(msg, color) {
    let alert_box = document.getElementById("alert_box");
    let alert_msg = document.getElementById("alert_msg");
    alert_msg.innerHTML = msg;
    alert_msg.style.backgroundColor = color;
    alert_box.style.display = "flex";
    alert_box.classList.add("t2b_anim");
    setTimeout(() => {
        alert_msg.innerHTML = "";
        alert_msg.style.backgroundColor = "";
        alert_box.style.display = "none";
        alert_box.classList.remove("t2b_anim");
    }, 3000);
}

signup_link.onclick = () => {
    heading.innerHTML = "Create new account";
    login_box.style.display = "none";
    signup_box.style.display = "flex";
}

login_link.onclick = () => {
    heading.innerHTML = "Log In";
    signup_box.style.display = "none";
    login_box.style.display = "flex";
}

const signup_btn = document.getElementById("signup_btn");

const url = 'http://127.0.0.1:3000';

//function for signup
signup_btn.onclick = async (e) => {
    e.preventDefault();
    let username = document.getElementById("username");
    let email = document.getElementById("email");
    let password = document.getElementById("password");

    let userString = JSON.stringify({ username: username.value, email: email.value, password: password.value });

    console.log(userString);

    let response = await fetch(`${url}/auth/createuser`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: userString
    });

    let jsonResp = await response.json();
    // console.log(jsonResp);
    if (jsonResp.success) {
        username.value = "";
        email.value = "";
        password.value = "";
        show_alert(jsonResp.message, 'green');
        login_link.click();
    } else {
        show_alert(jsonResp.message, 'red');
    }

}

//function for login
const login_btn = document.getElementById("login_btn");
login_btn.onclick = async (e) => {
    e.preventDefault();
    let username = document.getElementById("l_username");
    let password = document.getElementById("l_password");

    let credential_string = JSON.stringify({ username: username.value, password: password.value });

    // console.log(credential_string);

    let response = await fetch(`${url}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: credential_string
    });

    let jsonResp = await response.json()
    // console.log(jsonResp.success);

    if (jsonResp.success) {
        sessionStorage.setItem("user", JSON.stringify(jsonResp.user));
        sessionStorage.setItem("auth-token", JSON.stringify(jsonResp.authToken));
        username.value = "";
        password.value = "";
        show_alert(jsonResp.message, 'green');
        location.href = "../";
    } else {
        show_alert(jsonResp.message, 'red');
    }
}