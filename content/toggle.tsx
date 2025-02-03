"use client";

import { useState, useEffect } from "react";
import obj from "./data.json";
import { set } from "./util";

export function useIsEditable() {
  const [isEditable, setIsEditable] = useState(false);

  // Needs to be done in a use effect to not cause hydration errors
  useEffect(() => {
    const isEditModeEnabled = localStorage?.getItem("edit_enabled") === "true";
    setIsEditable(isEditModeEnabled ?? false);
  }, []);

  return isEditable;
}

export function ToggleEditButton() {
  const isEditable = useIsEditable();

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <button onClick={() => toggleEditableContent()}>
        {isEditable ? "Leave Edit Content" : "Edit Content"}
      </button>
      {isEditable ? (
        <button onClick={() => exportLocalStorage()}>Export Changes</button>
      ) : null}
    </div>
  );
}

function toggleEditableContent() {
  let isEditModeEnabled = localStorage.getItem("edit_enabled") === "true";
  isEditModeEnabled = !isEditModeEnabled;
  localStorage.setItem("edit_enabled", isEditModeEnabled.toString());
  window.location.reload();
}

function exportLocalStorage() {
  const exportObj = structuredClone(obj);

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("edit_") && key !== "edit_enabled") {
      const value = localStorage.getItem(key);
      if (value) set(exportObj, key.substring("edit_".length), value);
    }
  }

  const blob = new Blob([JSON.stringify(exportObj, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "content-export.json";
  a.click();
  URL.revokeObjectURL(url);
}
