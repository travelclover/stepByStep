import indexCSS from './style/index.less'; // 样式文件
import Game from './Game.js';
import util from './util.js';
import socket from './socket.js';

window.onload = function () {
  let readyBtn = util.$('#readyBtn');
  let game = new Game('checkerboardWrap');

  readyBtn.addEventListener('click', function () {
    game.ready();
  }, false);

  // 收到消息
  socket.on('message', (msg) => {
    console.log(msg)
  });
  // 房间信息
  socket.on('room info', (data) => {
    console.log(data)
  });
}