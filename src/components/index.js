import { InputRecorder } from "../utils/input-recorder.js";

export const positionComponent = {
  x: Number,
  y: Number,
};

export const velocityComponent = {
  x: Number,
  y: Number,
};

export const shapeComponent = {
  color: String,
  size: Object,
};

export const rendererComponent = {
  context2d: CanvasRenderingContext2D,
};

export const inputComponent = {
  recorder: InputRecorder,
};

export const factionComponent = {
  enemy: Boolean,
};
