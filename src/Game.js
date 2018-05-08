
import SpaceBlock from './SpaceBlock.js';
import HorizontalBlock from './HorizontalBlock.js';
import VerticalBlock from './VerticalBlock.js';
import SquareBlock from './SquareBlock.js';

class Game {
  constructor(id) {
    this.init(id);
  }
  // 初始化
  init(id) {
    this.canvas = document.getElementById(id); // 棋盘wrap
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    this.SPACE_WIDTH = this.canvas.clientHeight / 46; // 间隙宽度
    this.SQUARE_WIDTH = 4 * this.SPACE_WIDTH; // 棋格宽度
    this.createCheckerboard(); // 生成棋盘
    // 添加事件
    this.canvas.addEventListener("mousemove", (event) => {
      this.x = this.getX(event);
      this.y = this.getY(event);
    })
    this.canvas.addEventListener("mousedown", (event) => {
      let self = this;
      let x = this.getX(event);
      let y = this.getY(event);
      let block = this.blocks.find((block) => {
        if (block.isInRect && block.isInRect(x, y)) {
          return true;
        }
      });
      let prevBlock; // 前一个木板
      let nextBlock; // 后一个木板
      if (block.width != block.height) { // 宽高不相等则是木板
        // 如果木板状态不为1和2，则return
        if (block.status != 1 && block.status != 2) {
          return;
        }
        // 判断是横还是竖木板
        if (block.x % 2 == 0) { // 竖
          prevBlock = block.y === 1 ? null : this.getBlockByPoint(block.x, block.y - 2);
          nextBlock = block.y === 17 ? null : this.getBlockByPoint(block.x, block.y + 2);
          // 判断上面是否可放置木板
          if (prevBlock && this.putDownAble(block.x, block.y - 2, true)) {
            prevBlock.changeStatus(4);
            prevBlock.putDownAble = true;
          }
          // 判断下面是否可放置木板
          if (nextBlock && this.putDownAble(block.x, block.y + 2, false)) {
            nextBlock.changeStatus(4);
            nextBlock.putDownAble = true;
          }
        } else { // 横
          prevBlock = block.x === 1 ? null : this.getBlockByPoint(block.x - 2, block.y);
          nextBlock = block.x === 17 ? null : this.getBlockByPoint(block.x + 2, block.y);
          // 判断左边是否可放置木板
          if (prevBlock && this.putDownAble(block.x - 2, block.y, true)) {
            prevBlock.changeStatus(4);
            prevBlock.putDownAble = true;
          }
          // 判断右边是否可放置木板
          if (nextBlock && this.putDownAble(block.x + 2, block.y, false)) {
            nextBlock.changeStatus(4);
            nextBlock.putDownAble = true;
          }
        }
        block.changeStatus(3); // 改变成点击状态

        // 添加mousemove事件
        document.addEventListener("mousemove", mousemove);
        // 添加mouseup事件
        document.addEventListener("mouseup", mouseup);

        function mouseup(event) {
          document.removeEventListener("mousemove", mousemove);
          document.removeEventListener("mouseup", mouseup);
          let x = self.getX(event);
          let y = self.getY(event);
          let upBlock = self.blocks.find((block) => {
            if (block.isInRect && block.isInRect(x, y)) {
              return true;
            }
          });
          // 判断鼠标抬起是否是鼠标按下时木块的相邻木块
          if (upBlock && (upBlock == prevBlock || upBlock == nextBlock) && upBlock.status == 3) {
            block.changeStatus(0);
            upBlock.changeStatus(0);
          } else { // 放置失败
            block.changeStatus(1);
            if (prevBlock && prevBlock.status != 0) {
              prevBlock.changeStatus(1);
            }
            if (nextBlock && nextBlock.status != 0) {
              nextBlock.changeStatus(1);
            }
          }
          // 清楚block的putDownAble标记
          if (prevBlock) {
            prevBlock.putDownAble = false;
          }
          if (nextBlock) {
            nextBlock.putDownAble = false;
          }
        }
        function mousemove(event) {
          let x = self.getX(event);
          let y = self.getY(event);
          let moveBlock = self.blocks.find((block) => {
            if (block.isInRect && block.isInRect(x, y)) {
              return true;
            }
          });
          //
          let leftTag = self.putDownAble(prevBlock.x, prevBlock.y, );
          // 判断moveBlock是否是合格的prevBlock、nextBlock
          if (moveBlock && (moveBlock == prevBlock || moveBlock == nextBlock) && moveBlock.putDownAble) {
            if (moveBlock == prevBlock && nextBlock) {
              nextBlock.changeStatus(1);
            } else if (moveBlock == nextBlock && prevBlock) {
              prevBlock.changeStatus(1);
            }
            moveBlock.changeStatus(3);
          }
        }

      }


    })
    // 开始游戏
    this.begin();
  }
  /**
   * 判断是否能放板子
   * @param  {number}   x   板子的x坐标
   * @param  {number}   y   板子的y坐标
   * @param  {boolean}  tag 标记
   * @return {boolean}      是否能放板子(true | false)
   */
  putDownAble(x, y, tag) {
    let leftBlock;
    let rightBlock;
    // 判断横竖
    if (x % 2 == 0) { // 竖
      // 判断板子相对位置
      if (tag) {
        leftBlock = this.getBlockByPoint(x - 1, y + 1);
        rightBlock = this.getBlockByPoint(x + 1, y + 1);
      } else {
        leftBlock = this.getBlockByPoint(x - 1, y - 1);
        rightBlock = this.getBlockByPoint(x + 1, y - 1);
      }
    } else { // 横
      if (tag) {
        leftBlock = this.getBlockByPoint(x + 1, y + 1);
        rightBlock = this.getBlockByPoint(x + 1, y - 1);
      } else {
        leftBlock = this.getBlockByPoint(x - 1, y + 1);
        rightBlock = this.getBlockByPoint(x - 1, y - 1);
      }
    }
    if (leftBlock && rightBlock) {
      if (leftBlock.status == 0 && rightBlock.status == 0) {
        return false;
      }
    } else if (leftBlock && !rightBlock) {
      if (leftBlock.status == 0) {
        return false;
      }
    } else if (!leftBlock && rightBlock) {
      if (rightBlock.status == 0) {
        return false
      }
    }
    return true;
  }
  // 通过x,y坐标获取block
  getBlockByPoint(x, y) {
    if (x < 0 || y < 0 || x > 18 || y > 18) {
      return;
    }
    let index = 19 * y + x;
    return this.blocks[index];
  }
  // 获取鼠标x坐标
  getX(event) {
    return event.clientX - this.canvas.getBoundingClientRect().left;
  }
  // 获取鼠标y坐标
  getY(event) {
    return event.clientY - this.canvas.getBoundingClientRect().top;
  }
  // 生成棋盘
  createCheckerboard() {
    const ROW = 19;
    const COL = 19;
    let blocks = [];
    for (let i = 0; i < ROW; i++) {
      for (let j = 0; j < COL; j++) {
        if (i % 2 == 0) { // 偶数行
          if (j % 2 == 0) { // 偶数列
            // 生成木板与木板之间的空隙块
            blocks.push(new SpaceBlock(j, i, this.SPACE_WIDTH, this.SQUARE_WIDTH));
          } else { // 奇数列
            // 生成水平木块
            blocks.push(new HorizontalBlock(j, i, this.SPACE_WIDTH, this.SQUARE_WIDTH));
          }
        } else { // 奇数行
          if (j % 2 == 0) { // 偶数列
            // 生成垂直木板
            blocks.push(new VerticalBlock(j, i, this.SPACE_WIDTH, this.SQUARE_WIDTH));
          } else { // 奇数列
            // 生成正方形棋格
            blocks.push(new SquareBlock(j, i, this.SPACE_WIDTH, this.SQUARE_WIDTH));
          }
        }
      }
    }
    this.blocks = blocks; // 方块集合
    this.draw();
  }
  // 游戏开始
  begin() {
    this.timer = setInterval(() => {
      this.blocks.forEach((block) => {
        if (block.hoverPlank) {
          block.hoverPlank(this.x, this.y);
        }
      });
      this.draw();
    }, 1000 / 60);
  }
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let blocks = this.blocks;
    for (let i = 0, len = blocks.length; i < len; i++) {
      let block = blocks[i];
      this.ctx.beginPath();
      this.ctx.rect(block.left, block.top, block.width, block.height);
      this.ctx.fillStyle = block.color;
      this.ctx.fill();
      this.ctx.closePath();
    }
  }
}

export default Game;