export class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
  }

  reset() {
    this.x = 0;
    this.y = 0;
  }

  add(vec) {
    return new Vector2(this.x + vec.x, this.y + vec.y);
  }

  multiplyScalar(scalar) {
    return new Vector2(this.x * scalar, this.y * scalar);
  }
}
