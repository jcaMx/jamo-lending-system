// resources/js/pages/borrowers/EditableField.tsx
import React, { useState } from "react";

type EditableFieldProps = {
  value: string | number;
  onSave: (newValue: string | number) => void;
  type?: "text" | "number" | "email" | "select";
  options?: string[];
};

export default function EditableField({
  value,
  onSave,
  type = "text",
  options = [],
}: EditableFieldProps) {
  const [editing, setEditing] = useState(false);
  const [newValue, setNewValue] = useState(value);

  const save = () => {
    onSave(newValue);
    setEditing(false);
  };

  return (
    <div>
      {editing ? (
        <>
          {type === "select" ? (
            <select
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            >
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
          )}
          <button onClick={save}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </>
      ) : (
        <span onClick={() => setEditing(true)}>{value}</span>
      )}
    </div>
  );
}
