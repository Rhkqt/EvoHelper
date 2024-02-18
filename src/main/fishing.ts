import { globalShortcut } from 'electron';
import { keyboard, Key, screen, Point} from '@nut-tree/nut-js';

let checkInterval: NodeJS.Timeout | undefined
let startInterval: NodeJS.Timeout | undefined
const click = async (button: Key) => {
  await keyboard.pressKey(button)
  await keyboard.releaseKey(button);
}
const closeEnough = (a: number, b: number) => {
  return Math.abs(a-b) < 10;
}

const fishingCheckInterval = (delay: number) => {
  return setInterval(() => {
    screen.colorAt(new Point(609, 835)).then((colorUp) => {
      if (closeEnough(colorUp.R, 255) && closeEnough(colorUp.G, 204) && closeEnough(colorUp.B, 0)) {
        click(Key.Up);
      }
    })
    screen.colorAt(new Point(609, 835)).then((colorDown) => {
      if (closeEnough(colorDown.R, 5) && closeEnough(colorDown.G, 250) && closeEnough(colorDown.B, 5)) {
        click(Key.Down);
      }
    })
  }, delay);
}
export function disarmFishing() {
  globalShortcut.unregister('CommandOrControl+9');
  globalShortcut.unregister('CommandOrControl+-');
  globalShortcut.unregister('CommandOrControl+=');
  try {
    clearInterval(checkInterval);
    clearInterval(startInterval);
    checkInterval = undefined;
    startInterval = undefined;
  } catch (e) {

  }
}
export function armFishing(rodHotkey: any) {
  disarmFishing();
  globalShortcut.register('CommandOrControl+9', () => {
    if(!checkInterval && !startInterval) {
      click(rodHotkey);
      startInterval = setInterval(() => {
        click(rodHotkey)
      }, 1000 * 5);
      checkInterval = fishingCheckInterval(1000 * 0.4);
    }
  });
  globalShortcut.register('CommandOrControl+0', () => {
    if(!checkInterval && !startInterval) {
      click(rodHotkey);
      startInterval = setInterval(() => {
        click(rodHotkey)
      }, 1000 * 5);
      checkInterval = fishingCheckInterval(1000 * 1.4);
    }
  });
  globalShortcut.register('CommandOrControl+-', () => {
   try {
      clearInterval(checkInterval);
      clearInterval(startInterval);
      checkInterval = undefined;
      startInterval = undefined;
    } catch (e) {

   }
  });
}

