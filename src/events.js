export function addKeyEvents({
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
