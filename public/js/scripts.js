const socket = io('/');

const getElementById = (id) => document.getElementById(id) || null;

//DOM element
const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

function helloUser() {
  const username = prompt('Input your name');
  console.log('username >> ', username);
  socket.emit('new_user', username, (data) =>
    console.log('return data >> ', data),
  );
  socket.on('hello_user', (data) => console.log(data));
}

function init() {
  helloUser();
}

init();
