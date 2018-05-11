// 块类

class Block {
  constructor(x, y, SPACE_WIDTH, SQUARE_WIDTH) {
    this.x = x;
    this.y = y;
    this.SPACE_WIDTH = SPACE_WIDTH;
    this.SQUARE_WIDTH = SQUARE_WIDTH;
    this.left = Math.floor(x / 2) * (SPACE_WIDTH + SQUARE_WIDTH) + (x % 2) * SPACE_WIDTH; // x坐标
    this.top = Math.floor(y / 2) * (SPACE_WIDTH + SQUARE_WIDTH) + (y % 2) * SPACE_WIDTH; // y坐标
  }
  // 是否在矩形范围里
  isInRect(x, y) {
    if (x > this.left &&
      x < this.left + this.width &&
      y > this.top &&
      y < this.top + this.height) {
      return true;
    }
    return false;
  }
}

export default Block;