
import io from 'socket.io-client';

const socket = io('http://118.126.110.61:3001/stepByStep', {
  reconnection: true, // 是否自动重连
});
socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', data);
});

export default socket;