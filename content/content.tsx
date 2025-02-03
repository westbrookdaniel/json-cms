"use client";

import obj from "./data.json";
import { get } from "./util";
import { useId, useRef, useState } from "react";
import { create } from "zustand";

type EditableStore = {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
};

// swap this to be a global state using sync external store thats built into react
const useEditableStore = create<EditableStore>((set) => ({
  activeId: null,
  setActiveId: (id: string | null) => set({ activeId: id }),
}));

export function Editable({ path, value }: { path: string; value: string }) {
  const id = useId();
  const [moused, setMoused] = useState(false);
  const { activeId, setActiveId } = useEditableStore();
  const ref = useRef<HTMLSpanElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [startEditingContent, setStartEditingContent] = useState("");

  const visible = activeId === id || (moused && !activeId);

  const handleMouseEnter = () => {
    if (isEditing) return;
    setMoused(true);
    if (!activeId) setActiveId(id);
  };

  const handleMouseLeave = () => {
    if (isEditing) return;
    setMoused(false);
    if (activeId === id) setActiveId(null);
  };

  return (
    <div
      data-content-key={path}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={
        visible
          ? {
              display: "block",
              position: "relative",
              outlineWidth: "2px",
              outlineStyle: "solid",
              outlineOffset: "9px",
              borderRadius: "4px",
            }
          : {
              display: "block",
              position: "relative",
            }
      }
    >
      {visible ? (
        <div
          style={{
            position: "absolute",
            right: 0,
            display: "flex",
            top: "-62px",
            letterSpacing: 0,
            gap: "8px",
            padding: "16px",
          }}
        >
          <Button
            onClick={() => {
              if (isEditing) {
                if (!ref.current) throw new Error("Ref not found");
                saveElementChanges(ref.current, path);
                setIsEditing(false);
              } else {
                setStartEditingContent(ref.current?.textContent ?? "");
                setIsEditing(true);
              }
            }}
          >
            {isEditing ? "Save" : "Edit"}
          </Button>
          <Button
            onClick={() => {
              if (isEditing) {
                setIsEditing(false);
                if (ref.current) ref.current.textContent = startEditingContent;
              } else {
                if (!ref.current) throw new Error("Ref not found");
                revertElementChanges(ref.current, path);
              }
            }}
          >
            {isEditing ? "Cancel" : "Revert"}
          </Button>
        </div>
      ) : null}
      <span
        ref={ref}
        suppressContentEditableWarning
        contentEditable={isEditing ? "plaintext-only" : undefined}
        style={{ outline: "none" }}
      >
        {value}
      </span>
    </div>
  );
}

function revertElementChanges(element: HTMLElement, key: string) {
  const value = get(obj, key);
  element.textContent = value; // this will remove the buttons
  localStorage.removeItem(`edit_${key}`);
}

function saveElementChanges(element: HTMLElement, key: string) {
  localStorage.setItem(`edit_${key}`, JSON.stringify(element.textContent));
}

function Button({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      style={{
        backgroundColor: "white",
        color: "black",
        borderRadius: "8px 8px 0 0",
        border: "none",
        padding: "8px 18px",
        fontSize: "14px",
        cursor: "pointer",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
