"use client";

import obj from "./data.json";
import { set } from "./util";

export function ToggleEditButton() {
  let isEditModeEnabled = false;
  if (typeof localStorage !== "undefined") {
    isEditModeEnabled = localStorage.getItem("edit_enabled") === "true";
  }
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <button onClick={() => toggleEditableContent()}>
        {isEditModeEnabled ? "Leave Edit Content" : "Edit Content"}
      </button>
      {isEditModeEnabled ? (
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
