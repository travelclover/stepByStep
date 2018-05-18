import indexCSS from './style/index.less'; // 样式文件
import Game from './Game.js';
import util from './util.js';
import socket from './socket.js';

window.onload = function () {
  let readyBtn = util.$('#readyBtn');
  let giveUpBtn = util.$('#giveUpBtn');
  let game = new Game('checkerboardWrap');
  let tip = util.$('#tip');

  // 点击准备按钮
  readyBtn.addEventListener('click', function () {
    game.ready();
  }, false);
  // 点击认输按钮
  giveUpBtn.addEventListener('click', function () {
    game.giveUp();
  }, false)

  // 收到消息
  socket.on('message', (msg) => {
    console.log(msg)
  });
  // 收到已经准备的信息
  socket.on('ready', () => {
    util.addClass(readyBtn, 'hidden');
    util.removeClass(tip, 'hidden');
    tip.innerText = '等待其他玩家';
  })
  // 房间信息
  socket.on('room info', (data) => {
    console.log(data)
  });
  // 游戏开始
  socket.on('start-game', (room) => {
    util.addClass(tip, 'hidden');
    let gameInfo = {
      step: 0, // 步数
      startTime: new Date().getTime(), // 游戏开始时长
      stepTime: new Date().getTime(), // 步时
      actionPlayer: room.players[0], // 玩家
      gameover: false, // 游戏是否结束
    }
    game.updateGameInfo(gameInfo);
    game.begin(room.players);
  });
  // 切换行动玩家
  socket.on('changeActionPlayer', (data) => {
    game.changeActionPlayer(data);
  })
  // 游戏结束
  socket.on('gameover', (data) => {
    game.gameover(data);
  })
}