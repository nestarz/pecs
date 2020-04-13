import {
  velocityComponent,
  shapeComponent,
  positionComponent,
  rendererComponent,
  inputComponent,
  factionComponent,
} from "../components/index.js";

export default (canvas) => [
  {
    component: positionComponent,
    value: {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
    },
  },
  {
    component: velocityComponent,
    value: {
      x: 1,
      y: 1,
    },
  },
  {
    component: shapeComponent,
    value: {
      color: "red",
      size: { x: 100, y: 60 },
    },
  },
  {
    component: rendererComponent,
    value: {
      context2d: canvas.getContext("2d"),
    },
  },
  {
    component: inputComponent,
    value: { recorder: new InputRecorder(canvas) },
  },
  {
    component: factionComponent,
    value: { enemy: true },
  },
];
