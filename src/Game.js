
import SpaceBlock from './SpaceBlock.js';
import HorizontalBlock from './HorizontalBlock.js';
import VerticalBlock from './VerticalBlock.js';
import SquareBlock from './SquareBlock.js';
import Chess from './Chess.js';
import socket from './socket.js';
import util from './util.js';

const plankOnclick = Symbol('plankOnclick'); // 木板点击函数的函数名，为了私有方法效果
const chessOnclick = Symbol('chessOnclick'); // 棋子点击函数的函数名，为了私有方法效果
const squareBlockOnclick = Symbol('squareBlockOnclick'); // 棋格点击函数的函数名，为了私有方法效果
const createCheckerboard = Symbol('createCheckerboard'); // 生成棋盘
const createChess = Symbol('createChess'); // 生成棋子
const gameInfo = Symbol('gameInfo'); // 当前游戏系统信息
const putDownChessAble = Symbol('putDownChessAble'); // 判断能否放棋子
const resetSquareBlockPutDownAble = Symbol('resetSquareBlockPutDownAble'); // 重置squareBlock的putDownAble属性为false
const stopedChessArrive = Symbol('stopedChessArrive'); // 判断是否阻挡棋子到达对面

class Game {
  constructor(id) {
    this.init(id);
    this[gameInfo] = { // 当前游戏系统信息
      step: 0, // 步数
      startTime: null, // 游戏开始时长
      stepTime: null, // 步时
      actionPlayer: null, // 玩家
    };
  }
  // 初始化
  init(id) {
    this.canvas = document.getElementById(id); // 棋盘wrap
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    this.SPACE_WIDTH = this.canvas.clientHeight / 46; // 间隙宽度
    this.SQUARE_WIDTH = 4 * this.SPACE_WIDTH; // 棋格宽度
    this[createCheckerboard](); // 生成棋盘

    // 添加事件
    this.canvas.addEventListener("mousemove", (event) => {
      this.x = this.getX(event);
      this.y = this.getY(event);
    })
    this.canvas.addEventListener("mousedown", (event) => {
      // 判断是否是当前玩家
      if (socket.id != this[gameInfo]['actionPlayer']) {
        return;
      }
      let x = this.getX(event);
      let y = this.getY(event);
      let targets = this.draw({x: x, y: y});
      if (targets.length > 0) {
        let block = targets[targets.length - 1];
        switch (block['type']) {
          case 'PLANK': // 木板
            this[plankOnclick](block);
            break;
          case 'CHESS': // 棋子
            this[chessOnclick](block);
            break;
          case 'SQUAREBLOCK': // 棋格
            this[squareBlockOnclick](block);
            break;
          default:
            break;
        }
      }
    })
  }
  /**
   * 判断是否能放板子
   * @param  {number}   x     板子的x坐标
   * @param  {number}   y     板子的y坐标
   * @param  {boolean}  tag   标记(用以判断板子的相对位置，上和左为true)
   * @return {boolean}        是否能放板子(true | false)
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

  /**
   * 判断2个棋子是否被阻挡
   * @param  {array}   planks     将要新增的木板
   * @return {boolean}            是否阻挡(true是 | false否)
   */
  [stopedChessArrive](planks) {
    let self = this;
    let blocks1 = JSON.parse(JSON.stringify(this.blocks));
    let blocks2 = JSON.parse(JSON.stringify(this.blocks));
    // 把对应的将要放木板位置为木板状态设置为0
    for (let i = 0; i < planks.length; i++) {
      let index = planks[i]['y'] * 19 + planks[i]['x'];
      blocks1[index]['status'] = 0;
      blocks2[index]['status'] = 0;
    }
    let chess1 = this.chess.find(item => item.id == this[gameInfo].actionPlayer); // 自己的棋子
    let chess2 = this.chess.find(item => item.id != this[gameInfo].actionPlayer); // 对方的棋子
    let startBlock1 = this.getBlockByPoint(chess1.x, chess1.y, blocks1); // 自己棋子起始位置所在方块
    let startBlock2 = this.getBlockByPoint(chess2.x, chess2.y, blocks2); // 对方棋子起始位置所在方块
    let stop1 = !findPath1(startBlock1);
    let stop2 = !findPath2(startBlock2);
    return Boolean(stop1 || stop2);
    function findPath1(block) {
      block.flag = true; // 标记
      if (block.y == 1) {
        return true;
      } else {
        // 判断右边
        let rightPlank = self.getBlockByPoint(block.x + 1, block.y, blocks1);
        let rightSquare = self.getBlockByPoint(block.x + 2, block.y, blocks1);
        if (block.x < 17 && rightPlank.status != 0 && rightSquare && !rightSquare.flag) { // 能往右
          if (findPath1(rightSquare)) {
            return true;
          }
        } else { // 不能往右
          // 判断上
          let upPlank = self.getBlockByPoint(block.x, block.y - 1, blocks1);
          let upSquare = self.getBlockByPoint(block.x, block.y - 2, blocks1);
          if (block.y > 1 && upPlank.status != 0 && upSquare && !upSquare.flag) { // 能往上
            if (findPath1(upSquare)) {
              return true;
            }
          } else { // 不能往上
            // 判断左
            let leftPlank = self.getBlockByPoint(block.x - 1, block.y, blocks1);
            let leftSquare = self.getBlockByPoint(block.x - 2, block.y, blocks1);
            if (block.x > 1 && leftPlank.status != 0 && leftSquare && !leftSquare.flag) { // 能往左
              if (findPath1(leftSquare)) {
                return true;
              }
            } else { // 不能往左
              // 判断下
              let downPlank = self.getBlockByPoint(block.x, block.y + 1, blocks1);
              let downSquare = self.getBlockByPoint(block.x, block.y + 2, blocks1);
              if (block.y < 17 && downPlank.status != 0 && downSquare && !downSquare.flag) { // 能忘下
                if (findPath1(downSquare)) {
                  return true;
                }
              } else { // 不能往下
                return false;
              }
            }
          }
        }
      }
    }
    function findPath2(block) {
      block.flag = true; // 标记
      if (block.y == 17) {
        return true;
      } else {
        // 判断右边
        let rightPlank = self.getBlockByPoint(block.x + 1, block.y, blocks2);
        let rightSquare = self.getBlockByPoint(block.x + 2, block.y, blocks2);
        if (block.x < 17 && rightPlank.status != 0 && rightSquare && !rightSquare.flag) { // 能往右
          if (findPath2(rightSquare)) {
            return true;
          }
        } else { // 不能往右
          // 判断下
          let downPlank = self.getBlockByPoint(block.x, block.y + 1, blocks2);
          let downSquare = self.getBlockByPoint(block.x, block.y + 2, blocks2);
          if (block.y < 17 && downPlank.status != 0 && downSquare && !downSquare.flag) { // 能往下
            if (findPath2(downSquare)) {
              return true;
            }
          } else { // 不能往下
            // 判断左
            let leftPlank = self.getBlockByPoint(block.x - 1, block.y, blocks2);
            let leftSquare = self.getBlockByPoint(block.x - 2, block.y, blocks2);
            if (block.x > 1 && leftPlank.status != 0 && leftSquare && !leftSquare.flag) { // 能往左
              if (findPath2(leftSquare)) {
                return true;
              }
            } else { // 不能往左
              // 判断上
              let upPlank = self.getBlockByPoint(block.x, block.y - 1, blocks2);
              let upSquare = self.getBlockByPoint(block.x, block.y - 2, blocks2);
              if (block.y > 1 && upPlank.status != 0 && upSquare && !upSquare.flag) { // 能往上
                if (findPath2(upSquare)) {
                  return true;
                }
              } else { // 不能往上
                return false;
              }
            }
          }
        }
      }
    }
  }
  // 通过x,y坐标获取block
  getBlockByPoint(x, y, blocks) {
    if (x < 0 || y < 0 || x > 18 || y > 18) {
      return;
    }
    let index = 19 * y + x;
    blocks = blocks || this.blocks;
    return blocks[index];
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
  [createCheckerboard]() {
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
  }
  // 生成棋子
  [createChess](players) {
    let player1 = null;
    let player2 = null;
    if (players[0] == socket.id) {
      player2 = players[0];
      player1 = players[1];
    } else {
      player2 = players[1];
      player1 = players[0];
    }
    let p1 = new Chess(9, 1, '#FF0000', player1, this.SPACE_WIDTH, this.SQUARE_WIDTH);
    let p2 = new Chess(9, 17, '#0000FF', player2, this.SPACE_WIDTH, this.SQUARE_WIDTH);
    this.chess = [p1, p2];
  }
  // 游戏开始
  begin(players) {
    this[createChess](players); // 生成棋子
    this.timer = setInterval(() => {
      this.blocks.forEach((block) => {
        if (block.hoverPlank) {
          block.hoverPlank(this.x, this.y);
        }
      });
      this.draw();
      // 更新面板时间
      this.updatePanleTime();
    }, 1000 / 60);
    // 更新面板行动方
    this.updatePanleActionPlayer();
    let panle = util.$('.panle');
    util.removeClass(panle, 'hidden');
  }
  // 游戏准备
  ready() {
    let data = {
      socketId: socket.id, // 链接id
    }
    socket.emit('ready', data);
  }
  /**
   * 画
   * @param  {object}   p     坐标对象 {x: 10, y: 11}
   * @return {array}          返回点击的对象
   */
  draw(p) {
    let targets = []; //
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let blocks = this.blocks;
    for (let i = 0, len = blocks.length; i < len; i++) {
      let block = blocks[i];
      this.ctx.beginPath();
      this.ctx.rect(block.left, block.top, block.width, block.height);
      this.ctx.fillStyle = block.color;
      this.ctx.fill();
      if (p && this.ctx.isPointInPath(p.x, p.y)) {
        targets.push(block);
      }
      this.ctx.closePath();
    }
    // 绘制棋子
    for (let i = 0, len = this.chess.length; i < len; i++) {
      let chess = this.chess[i];
      this.ctx.beginPath();
      this.ctx.arc(chess.pointX, chess.pointY, chess.radius, 0, Math.PI * 2, false);
      this.ctx.fillStyle = chess.color;
      this.ctx.fill();
      if (p && this.ctx.isPointInPath(p.x, p.y)) {
        targets.push(chess);
      }
      this.ctx.closePath();
      // 绘制剩余木板数
      this.ctx.beginPath();
      this.ctx.fillStyle = chess.textColor;
      this.ctx.font = chess.radius + 'px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(chess.plankCount, chess.pointX, chess.pointY, 2 * chess.radius);
      this.ctx.closePath();
    }
    return targets;
  }
  // 木板点击
  [plankOnclick](block) {
    let self = this;
    let chess = this.chess.find(item => item.id == socket.id); // 棋子
    let planks = [block]; // 将要放的木板，用以检测棋子路线是否被阻挡
    // 木板数量不够
    if (chess.plankCount == 0) {
      return;
    }
    let prevBlock; // 前一个木板
    let nextBlock; // 后一个木板
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
        planks[1] = prevBlock;
        // 判断是否阻挡棋子的路线
        if (this[stopedChessArrive](planks)) {
          prevBlock.changeStatus(5);
        } else {
          prevBlock.changeStatus(4);
          prevBlock.putDownAble = true;
        }
      }
      // 判断下面是否可放置木板
      if (nextBlock && this.putDownAble(block.x, block.y + 2, false)) {
        planks[1] = nextBlock;
        // 判断是否阻挡棋子的路线
        if (this[stopedChessArrive](planks)) {
          nextBlock.changeStatus(5);
        } else {
          nextBlock.changeStatus(4);
          nextBlock.putDownAble = true;
        }
      }
    } else { // 横
      prevBlock = block.x === 1 ? null : this.getBlockByPoint(block.x - 2, block.y);
      nextBlock = block.x === 17 ? null : this.getBlockByPoint(block.x + 2, block.y);
      // 判断左边是否可放置木板
      if (prevBlock && this.putDownAble(block.x - 2, block.y, true)) {
        planks[1] = prevBlock;
        // 判断是否阻挡棋子的路线
        if (this[stopedChessArrive](planks)) {
          prevBlock.changeStatus(5);
        } else {
          prevBlock.changeStatus(4);
          prevBlock.putDownAble = true;
        }
      }
      // 判断右边是否可放置木板
      if (nextBlock && this.putDownAble(block.x + 2, block.y, false)) {
        planks[1] = nextBlock;
        // 判断是否阻挡棋子的路线
        if (this[stopedChessArrive](planks)) {
          nextBlock.changeStatus(5);
        } else {
          nextBlock.changeStatus(4);
          nextBlock.putDownAble = true;
        }
      }
    }
    block.changeStatus(3); // 改变成点击状态
    // 重置squareBlock的putDownAble属性为false
    this[resetSquareBlockPutDownAble]();

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
        chess.updatePlankCount(chess.plankCount - 1); // 更新剩余木板数量
        let plankIndex = []; // 放置木板位置的索引数组
        self.blocks.forEach((item, i) => {
          if (item.type == 'PLANK' && item.status == 0) {
            plankIndex.push(i);
          }
        });
        chess.changeActionPlayer(plankIndex); // 切换当前玩家
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
  // 棋子点击
  [chessOnclick](block) {
    // 判断点的棋子是不是自己的
    if (block.id != this[gameInfo]['actionPlayer']) {
      return;
    }
    // 获取四个方向相邻的格子
    let fourBlock = new Array(4);
    fourBlock[0] = this.getBlockByPoint(block.x, block.y - 2); // 上
    fourBlock[1] = this.getBlockByPoint(block.x, block.y + 2); // 下
    fourBlock[2] = this.getBlockByPoint(block.x - 2, block.y); // 左
    fourBlock[3] = this.getBlockByPoint(block.x + 2, block.y); // 右
    // 找出敌方棋子
    let chess = this.chess.find(item => item.id != this[gameInfo]['actionPlayer']);
    // 判断是否有被棋子占用的格子
    fourBlock = fourBlock.map(item => {
      if (item && item.x == chess.x && item.y == chess.y) {
        if (chess.x - block.x > 0) { // 在自己的棋子右边
          return this.getBlockByPoint(block.x + 4, block.y);
        } else if (chess.x - block.x < 0) { // 在自己的棋子的左边
          return this.getBlockByPoint(block.x - 4, block.y);
        } else if (chess.y - block.y > 0) { // 在自己的棋子的下边
          return this.getBlockByPoint(block.x, block.y + 4);
        } else if (chess.y - block.y < 0) { // 在自己的棋子的上边
          return this.getBlockByPoint(block.x, block.y - 4);
        }
      }
      return item;
    });
    fourBlock.forEach(item => {
      if (item && this[putDownChessAble](item, block)) {
        item.putDownAble = true;
      }
    });
  }
  /**
   * 判断能否放棋子
   * @param  {object}   targetBlock   目标格子
   * @param  {object}   centerBlock   中心格子（棋子所在格子）
   * @return {Boolean}                返回true（能）和false（不能）
   */
  [putDownChessAble](targetBlock, centerBlock) {
    if (Math.abs(targetBlock.x - centerBlock.x) == 2 || Math.abs(targetBlock.y - centerBlock.y) == 2) {
      let x = (targetBlock.x + centerBlock.x) / 2;
      let y = (targetBlock.y + centerBlock.y) / 2;
      let plank = this.getBlockByPoint(x, y);
      if (plank.status == 0) {
        return false;
      }
    } else { // 中间需要判断两块板子
      let x1;
      let x2;
      let y1;
      let y2;
      if (targetBlock.x == centerBlock.x) {
        x1 = centerBlock.x;
        x2 = centerBlock.x;
        if (targetBlock.y < centerBlock.y) { // 目标格子在上
          y1 = centerBlock.y - 1;
          y2 = centerBlock.y - 3;
        } else { // 目标格子在下
          y1 = centerBlock.y + 1;
          y2 = centerBlock.y + 3;
        }
      } else {
        y1 = centerBlock.y;
        y2 = centerBlock.y;
        if (targetBlock.x < centerBlock.x) { // 目标格子在左
          x1 = centerBlock.x - 1;
          x2 = centerBlock.x - 3;
        } else { // 目标格子在右
          x1 = centerBlock.x + 1;
          x2 = centerBlock.x + 3;
        }
      }
      let plank1 = this.getBlockByPoint(x1, y1);
      let plank2 = this.getBlockByPoint(x2, y2);
      if (plank1.status == 0 || plank2.status == 0) {
        return false;
      }
    }
    return true;
  }
  // 棋格点击
  [squareBlockOnclick](block) {
    if (block.putDownAble) {
      let chess = this.chess.find(item => item.id == this[gameInfo]['actionPlayer']);
      chess.updatePosition(block.x, block.y); // 更新位置
      chess.changeActionPlayer(); // 更换行动方
    }
    // 重置squareBlock的putDownAble属性为false
    this[resetSquareBlockPutDownAble]();
  }
  // 重置squareBlock的putDownAble属性为false
  [resetSquareBlockPutDownAble]() {
    this.blocks.forEach(item => {
      if (item.type == 'SQUAREBLOCK') {
        item.putDownAble = false;
      }
    });
  }
  // 更新游戏信息
  updateGameInfo(info) {
    if (info.step != undefined) this[gameInfo].step = info.step; // 步数
    if (info.startTime != undefined) this[gameInfo].startTime = info.startTime; // 游戏开始时间
    if (info.stepTime != undefined) this[gameInfo].stepTime = info.stepTime; // 步时
    if (info.actionPlayer != undefined) this[gameInfo].actionPlayer = info.actionPlayer; // 当前行动玩家
  }
  // 更新面板时间
  updatePanleTime() {
    let time = util.$('.time');
    let timeStr = new Date().getTime() - this[gameInfo].stepTime;
    time.innerText = Math.floor(timeStr / 1000); // 更新时间
  }
  // 更新面板行动方
  updatePanleActionPlayer() {
    let panle = util.$('.panle');
    if (socket.id == this[gameInfo].actionPlayer) {
      util.addClass(panle, 'self');
      util.removeClass(panle, 'other');
    } else {
      util.addClass(panle, 'other');
      util.removeClass(panle, 'self');
    }
  }
  // 切换行动玩家
  changeActionPlayer(data) {
    // 更新刚行动完的玩家棋子信息
    let chess = this.chess.find(item => item.id == data.socketId);
    if (data.socketId != socket.id) {
      chess.updatePosition(data.x, data.y);
      chess.updatePlankCount(data.plankCount);
    }
    // 更新即将行动的玩家棋子信息
    let actionChess = this.chess.find(item => item.id != data.socketId);
    // 更新木板信息
    if (data.socketId != socket.id) {
      data.plankIndex.forEach(item => {
        this.blocks[item].changeStatus(0);
      });
    }
    // 更新游戏系统信息
    let game = {
      step: this[gameInfo].step + 1,
      stepTime: new Date().getTime(),
      actionPlayer: actionChess.id, // 更换成即将行动的玩家socket.id
    }
    this.updateGameInfo(game);
    this.updatePanleActionPlayer();
  }
}

export default Game;