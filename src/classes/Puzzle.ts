import Panel from './Panel';

const di = [-1, 0, 0, 1];
const dj = [0, -1, 1, 0];

export default class Puzzle {
  panels: Panel[][];

  split: number;

  constructor(split: number, shuffle: boolean) {
    // 初期化
    const array = [...Array<Panel[]>(split + 2)].map(() =>
      Array<Panel>(split + 2).fill(new Panel(-1, -1, false))
    );
    array.forEach((row, i) =>
      row.forEach((el, j) => {
        array[i][j] = new Panel(i, j, i === split && j === split);
      })
    );

    // シャッフル
    if (shuffle) {
      let i = split;
      let j = split;
      for (let l = 0; l < 10000; l += 1) {
        const k = Math.floor(Math.random() * 4);
        const [ni, nj] = [i + di[k], j + dj[k]];
        if (ni >= 1 && ni <= split && nj >= 1 && nj <= split) {
          const p = new Panel(
            array[i][j].i,
            array[i][j].j,
            array[i][j].isLowerRight
          );
          const np = new Panel(
            array[ni][nj].i,
            array[ni][nj].j,
            array[ni][nj].isLowerRight
          );
          array[ni][nj] = p;
          array[i][j] = np;
          [i, j] = [ni, nj];
        }
      }
    }
    this.panels = array;
    this.split = split;
  }

  getMovingDirection = (i: number, j: number): [number, number] => {
    for (let k = 0; k < 4; k += 1) {
      const [ni, nj] = [i + di[k], j + dj[k]];
      if (this.panels[ni][nj].isLowerRight) return [di[k], dj[k]];
    }
    return [0, 0];
  };

  move = (i: number, j: number, ei: number, ej: number): Puzzle => {
    const [ni, nj] = [i + ei, j + ej];
    const newPanels = this.panels.map((row) =>
      row.map((panel) => new Panel(panel.i, panel.j, panel.isLowerRight))
    );
    newPanels[i][j] = this.panels[ni][nj];
    newPanels[ni][nj] = this.panels[i][j];
    const newPuzzle = new Puzzle(this.split, false);
    newPuzzle.panels = newPanels;
    return newPuzzle;
  };

  solved = (): boolean => {
    let res = true;
    for (let i = 0; i < this.split + 2; i += 1)
      for (let j = 0; j < this.split + 2; j += 1)
        if (!this.panels[i][j].isRightPosition(i, j)) res = false;
    return res;
  };
}
