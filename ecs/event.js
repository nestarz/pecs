export default () => {
  let callbackList = [];
  return {
    on: (callback) => callbackList.push(callback),
    emit: (...data) => callbackList.forEach((callback) => callback(...data)),
  };
};
