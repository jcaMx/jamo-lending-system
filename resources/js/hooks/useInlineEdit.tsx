import { useState } from "react";

export default function useInlineEdit(
  initialData: Record<string, any>,
  onChange: (field: string, value: any) => void
) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editedValue, setEditedValue] = useState<any>("");

  const startEditing = (field: string, value: any) => {
    setEditingField(field);
    setEditedValue(value);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditedValue("");
  };

  const saveField = () => {
    if (editingField) {
      onChange(editingField, editedValue);
      cancelEditing();
    }
  };

  return { editingField, editedValue, setEditedValue, startEditing, cancelEditing, saveField };
}
