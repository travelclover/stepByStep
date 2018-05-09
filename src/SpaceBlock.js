import Block from './Block.js';

// 小空白块（木板与木板之间的空隙）类
class SpaceBlock extends Block {
  constructor(x, y, SPACE_WIDTH, SQUARE_WIDTH) {
    super(x, y, SPACE_WIDTH, SQUARE_WIDTH);
    this.type = 'SPACEBLOCK';
    this.color = '#fff';
    this.hoverColor = '#fff';
    this.width = SPACE_WIDTH;
    this.height = SPACE_WIDTH;
  }
}

export default SpaceBlock;