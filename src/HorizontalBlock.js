import Plank from './Plank.js';

// 水平块（横着的木板）类
class HorizontalBlock extends Plank {
  constructor(x, y, SPACE_WIDTH, SQUARE_WIDTH) {
    super(x, y, SPACE_WIDTH, SQUARE_WIDTH);
    this.width = SQUARE_WIDTH;
    this.height = SPACE_WIDTH;
  }
}

export default HorizontalBlock;