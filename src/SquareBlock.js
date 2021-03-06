import Block from './Block.js';

// 正方形块（棋子落子的块）类
class SquareBlock extends Block {
  constructor(x, y, SPACE_WIDTH, SQUARE_WIDTH) {
    super(x, y, SPACE_WIDTH, SQUARE_WIDTH);
    this.type = 'SQUAREBLOCK';
    // this.color = '#ccc';
    this.hoverColor = '#ccc';
    this.width = SQUARE_WIDTH;
    this.height = SQUARE_WIDTH;
    this.putDownAble = false; // 能否放置棋子
  }
  get color() {
    if (this.putDownAble) {
      return '#00FF00';
    }
    return '#CCC';
  }
  set color(color) {
    this.color = color;
  }
}

export default SquareBlock;