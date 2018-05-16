
import Block from './Block.js';

// 木板类
class Plank extends Block {
  constructor(x, y, SPACE_WIDTH, SQUARE_WIDTH) {
    super(x, y, SPACE_WIDTH, SQUARE_WIDTH);
    this.type = 'PLANK'; // 种类
    this.color = '#ECBF7E'; // 默认颜色
    this.status = 1; // 默认状态
    this.putDownAble = false; // 能否放置木板
  }
  hoverPlank(x, y) {
    if (this.status != 1 && this.status != 2) {
      return;
    }
    if (this.isInRect(x, y)) {
      this.changeStatus(2);
    } else {
      this.changeStatus(1);
    }
  }
  // 改变木板状态
  changeStatus(status) {
    if (this.status === 0) { // 木板状态为0时不可更改
      return;
    }
    this.status = status;
    switch (status) {
      case 1: // 默认状态
        this.color = '#ECBF7E';
        break;
      case 2: // hover状态
        this.color = '#C78F3E';
        break;
      case 3: // 点击状态
        this.color = '#00FF00';
        break;
      case 4: // 可选状态
        this.color = '#90FF90';
        break;
      case 5: // 会挡住棋子唯一路线的状态
        this.color = '#FF9090';
        break;
      case 0: // 占用状态
      default:
        this.color = '#000000';
        break;
    }
  }
}

export default Plank;