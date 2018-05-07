import Block from './block.js';

// 小空白块（木板与木板之间的空隙）类
class spaceBlock extends Block {
  constructor(x, y) {
    super(x, y);
    this.color = '#fff';
  }
}

export default spaceBlock;
