import Block from './Block.js';
import socket from './socket.js';

// 棋子类
class Chess extends Block {
  constructor(x, y, color, player, SPACE_WIDTH, SQUARE_WIDTH) {
    super(x, y, SPACE_WIDTH, SQUARE_WIDTH);
    this.type = 'CHESS';
    this.id = player;
    this.color = color; // 背景颜色
    this.textColor = '#FFFFFF'; // 文字颜色
    this.radius = SQUARE_WIDTH / 2; // 半径
    this.pointX = this.left + SQUARE_WIDTH / 2; // 中心点x坐标
    this.pointY = this.top + SQUARE_WIDTH / 2; // 中心点y坐标
    this.plankCount = 10; // 木板数量10
  }
  // 更新位置
  updatePosition(x, y) {
    this.x = x;
    this.y = y;
    this.pointX = this.left + this.SQUARE_WIDTH / 2;
    this.pointY = this.top + this.SQUARE_WIDTH / 2;
  }
  // 更新剩余木板数量
  updatePlankCount(count) {
    this.plankCount = count;
  }
  // 更换行动方
  changeActionPlayer(plankIndex) {
    let data = {
      x: this.x,
      y: this.y,
      plankCount: this.plankCount, // 木板数量
      plankIndex: plankIndex, // 已经放置木板的索引位置
    }
    socket.emit('changeActionPlayer', data);
  }
}

export default Chess;