import indexCSS from './style/index.less'; // 样式文件
import SpaceBlock from './SpaceBlock.js';
import HorizontalBlock from './HorizontalBlock.js';
import VerticalBlock from './VerticalBlock.js';
import SquareBlock from './SquareBlock.js';

// 生成棋盘
const row = 19;
const col = 19;
let blocks = [];
for (let i = 0; i < row; i++) {
  let line = [];
  for (let j = 0; j < col; j++) {
    if (i % 2 == 0) { // 偶数行
      if (j % 2 == 0) { // 偶数列
        // 生成木板与木板之间的空隙块
        line.push(new SpaceBlock(i, j));
      } else { // 奇数列
        // 生成水平木块
        line.push(new HorizontalBlock(i, j));
      }
    } else { // 奇数行
      if (j % 2 == 0) { // 偶数列
        // 生成垂直木板
        line.push(new HorizontalBlock(i, j));
      } else { // 奇数列
        // 生成正方形棋格
        line.push(new SquareBlock(i, j));
      }
    }
  }
  blocks.push(line);
}

let checkerboard = document.createElement('div');
