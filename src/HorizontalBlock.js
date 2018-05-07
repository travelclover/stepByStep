import Block from './Block.js';

// 水平块（横着的木板）类
class HorizontalBlock extends Block {
  constructor(x, y) {
    super(x, y);
    this.color = '#ecbf7e';
  }
}

export default HorizontalBlock;