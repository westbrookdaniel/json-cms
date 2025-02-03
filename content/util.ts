/* eslint-disable @typescript-eslint/no-explicit-any */

export function get(obj: any, path: any) {
  const keys = Array.isArray(path) ? path : path.split(".");
  let result = obj;
  for (const key of keys) {
    const cleanKey = key.replace(/\[|\]/g, "");
    result = result[cleanKey];
  }
  return result;
}

export function set(obj: any, path: any, value: any) {
  const keys = Array.isArray(path) ? path : path.split(".");
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i].replace(/\[|\]/g, "");
    if (!(key in current)) {
      current[key] = /^\d+$/.test(keys[i + 1]) ? [] : {};
    }
    current = current[key];
  }
  const lastKey = keys[keys.length - 1].replace(/\[|\]/g, "");
  current[lastKey] = value;
  return obj;
}
