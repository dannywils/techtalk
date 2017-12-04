function addKeyEvents({
  leftKey,
  rightKey,
  upKey,
  downKey,
  shrinkKey,
  objectToUpdate
}) {
  window.addEventListener(
    'keydown',
    function(event) {
      switch (event.key) {
        case leftKey:
          objectToUpdate.left = true;
          break;
        case rightKey:
          objectToUpdate.right = true;
          break;
        case upKey:
          objectToUpdate.up = true;
          break;
        case downKey:
          objectToUpdate.down = true;
          break;
        case shrinkKey:
          objectToUpdate.shrink = true;

          this.setTimeout(() => {
            objectToUpdate.shrink = false;
          }, 1000);

          break;
      }
    },
    false
  );

  window.addEventListener(
    'keyup',
    function(event) {
      switch (event.key) {
        case leftKey:
          objectToUpdate.left = false;
          break;
        case rightKey:
          objectToUpdate.right = false;
          break;
        case upKey:
          objectToUpdate.up = false;
          break;
        case downKey:
          objectToUpdate.down = false;
          break;
      }
    },
    false
  );
}

let last = {};
let deferTimers = {};

function throttle(fn, threshhold = 250, context) {
  return () => {
    const now = +new Date();
    const args = arguments;
    if (last[fn] && now < last[fn] + threshhold) {
      // hold on to it
      clearTimeout(deferTimers[fn]);
      deferTimers[fn] = setTimeout(() => {
        last[fn] = now;
        fn.apply(context, args);
      }, threshhold + last[fn] - now);
    } else {
      last[fn] = now;
      fn.apply(context, args);
    }
  };
}
