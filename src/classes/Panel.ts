export default class Panel {
  i: number;

  j: number;

  isLowerRight: boolean;

  constructor(i: number, j: number, isLowerRight: boolean) {
    this.i = i;
    this.j = j;
    this.isLowerRight = isLowerRight;
  }

  calcKey = (i: number, j: number): number => i * 100 + j;

  key = (): number => this.calcKey(this.i, this.j);

  isRightPosition = (i: number, j: number): boolean =>
    this.calcKey(i, j) === this.key();
}
