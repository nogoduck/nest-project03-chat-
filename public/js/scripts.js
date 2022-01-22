const socket = io('/chattings');

const getElementById = (id) => document.getElementById(id) || null;

//DOM elements
const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

//global socket handler
socket.on('user_connected', (username) => {
  drawNewChat(`${username} connected!`);
});
socket.on('new_chat', (data) => {
  const { chat, username } = data;
  drawNewChat(`${username}: ${chat}`);
});

//draw functions
const drawHelloStranger = (username) =>
  (helloStrangerElement.innerText = `Welcome ${username}😊`);
const drawNewChat = (message) => {
  const wrapperChatBox = document.createElement('div');
  const chatBox = `<div>${message}<div>`;
  wrapperChatBox.innerHTML = chatBox;
  chattingBoxElement.append(wrapperChatBox);
};

//event callback functions
const formHandleSubmit = (event) => {
  //submit동작은 기본적으로 버블이 발생한다(새로고침)
  event.preventDefault();
  console.log('submit event >> ', event);
  const inputValue = event.target.elements[0].value;
  console.log('inputValue >> ', inputValue);
  if (inputValue !== '') {
    socket.emit('submit_chat', inputValue);
    drawNewChat(`ME: ${inputValue}`);
    event.target.elements[0].value = '';
  }
};

function helloUser() {
  const username = prompt('Input your name');
  console.log('username >> ', username);
  socket.emit('new_user', username, (data) => drawHelloStranger(data));
}

function init() {
  helloUser();
  formElement.addEventListener('submit', formHandleSubmit);
}

init();
