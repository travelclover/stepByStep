
import SpaceBlock from './SpaceBlock.js';
import HorizontalBlock from './HorizontalBlock.js';
import VerticalBlock from './VerticalBlock.js';
import SquareBlock from './SquareBlock.js';

class Game {
  constructor() {
    this.init();
  }
  // 初始化
  init() {
    this.checkerboardWrap = document.getElementById('checkerboardWrap'); // 棋盘wrap
    this.checkerboard = document.createElement('div');
    this.createCheckerboard(); // 生成棋盘
  }
  // 生成棋盘
  createCheckerboard() {
    const row = 19;
    const col = 19;
    let blocks = [];
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++) {
        if (i % 2 == 0) { // 偶数行
          if (j % 2 == 0) { // 偶数列
            // 生成木板与木板之间的空隙块
            blocks.push(new SpaceBlock(i, j));
          } else { // 奇数列
            // 生成水平木块
            blocks.push(new HorizontalBlock(i, j));
          }
        } else { // 奇数行
          if (j % 2 == 0) { // 偶数列
            // 生成垂直木板
            blocks.push(new HorizontalBlock(i, j));
          } else { // 奇数列
            // 生成正方形棋格
            blocks.push(new SquareBlock(i, j));
          }
        }
      }
    }

    this.SPACE_WIDTH = this.checkerboardWrap.clientHeight / 46; // 间隙宽度
    this.SQUARE_WIDTH = 4 * this.SPACE_WIDTH; // 棋格宽度

    this.checkerboard.style.width = '100%';
    this.checkerboard.style.height = '100%';
    for (let i = 0; i < blocks.length; i++) {
      let div = this.createBlock(blocks[i]);
      this.checkerboard.appendChild(div);
    }
    this.checkerboardWrap.appendChild(this.checkerboard);
  }
  // 游戏开始
  begin() {

  }
  // 创建div块
  createBlock(block) {
    let div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.backgroundColor = block.color;
    div.style.top = Math.floor(block.y / 2) * (this.SPACE_WIDTH + this.SQUARE_WIDTH) + (block.y % 2) * this.SPACE_WIDTH + 'px';
    div.style.left = Math.floor(block.x / 2) * (this.SPACE_WIDTH + this.SQUARE_WIDTH) + (block.x % 2) * this.SPACE_WIDTH + 'px';
    if (block.y % 2 === 0) {
      div.style.height = this.SPACE_WIDTH + 'px';
      if (block.x % 2 === 0) {
        div.style.width = this.SPACE_WIDTH + 'px';
      } else {
        div.style.width = this.SQUARE_WIDTH + 'px';
      }
    } else {
      div.style.height = this.SQUARE_WIDTH + 'px';
      if (block.x % 2 === 0) {
        div.style.width = this.SPACE_WIDTH + 'px';
      } else {
        div.style.width = this.SQUARE_WIDTH + 'px';
      }
    }
    return div;
  }
}

export default Game;