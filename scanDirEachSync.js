import { readdirSync } from "fs";
import { join } from "path";

export default function scanDirEachSync(path, worker = () => {}, raw = false) {
  const WORKPIECES = [];
  const FILES = readdirSync(path, { withFileTypes: true });

  let changed = false;

  FILES.forEach((dirent, index) => {
    let pivot = {
      path: join(path, dirent.name),
      dirent,
    };

    if (raw) FILES[index] = pivot;

    const MAPPED = worker(pivot, index, FILES);

    switch (Object.prototype.toString.call(MAPPED)) {
      case "[object Object]":
        WORKPIECES.push(MAPPED);
        if (!Object.is(MAPPED, pivot) && !changed) changed = true;
        break;
      case "[object Boolean]":
        if (MAPPED) {
          WORKPIECES.push(pivot);
          break;
        }
        changed = true;
        break;
      default:
        WORKPIECES.push(pivot);
        break;
    }
  });

  return raw ? [WORKPIECES, changed ? FILES : false] : WORKPIECES;
}
