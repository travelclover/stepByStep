
import io from 'socket.io-client';

// const socket = io('http://localhost:3001/stepByStep', {
const socket = io('https://www.notehut.cn:3001/stepByStep', {
  reconnection: true, // 是否自动重连
});
socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', data);
});

export default socket;