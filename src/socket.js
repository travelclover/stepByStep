
import io from 'socket.io-client';

const socket = io('https://111.231.215.103:3001/stepByStep', {
  reconnection: true, // 是否自动重连
});
socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', data);
});

export default socket;