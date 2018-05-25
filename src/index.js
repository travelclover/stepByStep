import indexCSS from './style/index.less'; // 样式文件
import Game from './Game.js';
import util from './util.js';
import socket from './socket.js';

window.onload = function () {
  let readyBtn = util.$('#readyBtn');
  let giveUpBtn = util.$('#giveUpBtn');
  let sendMsgBtn = util.$('#sendMsgBtn'); // 发送消息按钮
  let sendMsgInput = util.$('#sendMsgInput'); // 消息输入框
  let msgList = util.$('#msgList'); // 消息列表
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
  // 聊天框回车事件
  sendMsgInput.addEventListener('keydown', function (e) {
    if (e.keyCode === 13) {
      sendMsgFn();
    }
  })
  // 发送聊天信息点击事件
  sendMsgBtn.addEventListener('click', sendMsgFn, false)
  // 点击发送信息
  function sendMsgFn() {
    let data = {}
    let msg = sendMsgInput.value.trim();
    if (msg == '') {
      return;
    }
    data = { msg: msg };
    socket.emit('message', data);
  }

  // 发送信息成功
  socket.on('sendMsgSuccess', () => {
    sendMsgInput.value = '';
  })
  // 收到消息
  socket.on('message', (data) => {
    let cls = '';
    let nickname = '';
    let li = document.createElement('li');
    // 默认滚动列表滚动到底部20px以内就需要自动滚动到底部
    let needScroll = msgList.scrollHeight - msgList.scrollTop - msgList.clientHeight < 20; // 是否需要滚动底部
    if (!data.socketId) { // 没有socketId默认为系统消息
      util.addClass(li, 'system');
      nickname = '系统';
    } else {
      if (data.socketId == socket.id) {
        util.addClass(li, 'self');
        nickname = '我';
      } else {
        util.addClass(li, 'other');
        nickname = '对方';
      }
    }
    li.innerHTML = `<p><span class="nickname">${nickname}</span>: <span class="msg">${data.msg}</span></p>`;
    msgList.appendChild(li);
    // 判断是否需要滚动消息列表到底部
    if (needScroll) {
      msgList.scrollTop = msgList.scrollHeight - msgList.clientHeight;
    }
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