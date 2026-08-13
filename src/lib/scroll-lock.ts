/* Ref-counted body scroll lock, shared by the cart and mobile-menu drawers so
   opening one while the other is open never unlocks the page prematurely. */

let lockCount = 0;

export function lockScroll() {
  lockCount += 1;
  document.body.style.overflow = "hidden";
}

export function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = "";
  }
}
