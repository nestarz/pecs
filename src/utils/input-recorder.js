export class InputRecorder {
  constructor(DOMNode) {
    this.keydown = {};
    DOMNode.addEventListener("keyup", ({ code }) => {
      this.keydown[code] = false;
    });
    DOMNode.addEventListener("keydown", ({ code }) => {
      this.keydown[code] = true;
    });
  }
}
