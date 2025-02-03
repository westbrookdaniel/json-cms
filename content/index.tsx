"use client";

import obj from "./data.json";
import { Editable } from "./content";
import { get } from "./util";
import { useIsEditable } from "./toggle";

type Flatten<T> = T extends object
  ? T extends Array<infer U>
    ? Flatten<U>
    : {
        [K in keyof T as T[K] extends object
          ? `${K & string}.${keyof Flatten<T[K]> & string}`
          : K]: T[K] extends object ? Flatten<T[K]>[keyof Flatten<T[K]>] : T[K];
      }
  : T;

export function Content<T extends keyof Flatten<typeof obj>>({
  path,
}: {
  path: T;
}) {
  const isEditable = useIsEditable();
  let value = get(obj, path);

  if (isEditable) {
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem(`edit_${path}`);
      if (storedValue !== null) {
        value = JSON.parse(storedValue) as Flatten<typeof obj>[T];
      }
    }

    return <Editable path={path} value={value} />;
  }

  return (
    <span data-content-key={path}>
      <span>{value}</span>
    </span>
  );
}
