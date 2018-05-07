import Block from './Block.js';

// 垂直块（竖着的木板）类
class VerticalBlock extends Block {
  constructor(x, y) {
    super(x, y);
    this.color = '#ecbf7e';
  }
}

export default VerticalBlock;