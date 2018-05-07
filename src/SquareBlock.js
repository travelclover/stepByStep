import Block from './Block.js';

// 正方形块（棋子落子的块）类
class SquareBlock extends Block {
  constructor(x, y) {
    super(x, y);
    this.color = '#ccc';
  }
}

export default SquareBlock;