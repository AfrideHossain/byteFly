let userInfo = JSON.parse(sessionStorage.getItem("user"));

if (!userInfo) {
    location.href = "./auth/";
}
const url = 'http://127.0.0.1:3000';

const back_btn = document.getElementsByClassName("backbtn")[0];
const chatBox = document.getElementsByClassName("chat-box")[0];
const otherPersonsBox = document.getElementsByClassName("otherPersonsBox")[0];

back_btn.addEventListener("click", () => {
    chatBox.style.display = "none";
    otherPersonsBox.style.display = "flex";
});

const userAvatar = document.getElementById("userAvatar");

const profileBox = document.getElementById("profileBox");
const closeProfileBox = document.getElementById("closeProfileBox");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userID = document.getElementById("userID");

userAvatar.addEventListener("click", () => {
    profileBox.style.display = 'flex';
})

closeProfileBox.addEventListener("click", () => {
    profileBox.style.display = "none";
})

userName.innerHTML = userInfo.username;
userEmail.innerHTML = userInfo.email;
userID.innerHTML = "User ID : " + userInfo.id;

//Scroll to latest message
chatBox.scrollTo(0, chatBox.scrollHeight);
// chatBox.scrollTop = chatBox.scrollHeight;
