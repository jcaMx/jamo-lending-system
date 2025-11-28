import { useState } from "react";

export default function useInlineEdit<T>(
  initialData: T,
  onChange: <K extends keyof T>(field: K, value: T[K]) => void
) {
  const [editingField, setEditingField] = useState<keyof T | null>(null);
  const [editedValue, setEditedValue] = useState<string>("");

  const startEditing = (field: keyof T, value: string) => {
    setEditingField(field);
    setEditedValue(value);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditedValue("");
  };

  const saveField = () => {
    if (editingField) {
      onChange(editingField, editedValue as T[keyof T]);
      cancelEditing();
    }
  };

  return {
    editingField,
    editedValue,
    setEditedValue,
    startEditing,
    cancelEditing,
    saveField,
  };
}
