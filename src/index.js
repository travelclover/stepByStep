import spaceBlock from './spaceBlock.js';

// 生成棋盘
const row = col = 19;
for (let i = 0; i < row; i++) {
  for (let j = 0; j < col; j++) {
    if (i % 2 == 0) { // 偶数行
      if (j % 2 == 0) { // 偶数列
        // 生成木板与木板之间的空隙块

      } else { // 奇数列

      }
    } else { // 奇数行
      if (j % 2 == 0) { // 偶数列

      } else { // 奇数列

      }
    }
  }
}