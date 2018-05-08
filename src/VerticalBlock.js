import Plank from './Plank.js';

// 垂直块（竖着的木板）类
class VerticalBlock extends Plank {
  constructor(x, y, SPACE_WIDTH, SQUARE_WIDTH) {
    super(x, y, SPACE_WIDTH, SQUARE_WIDTH);
    this.width = SPACE_WIDTH;
    this.height = SQUARE_WIDTH;
  }
}

export default VerticalBlock;