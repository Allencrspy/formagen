"use client";

import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowDown, ArrowUp, GripVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { useStore } from "zustand";
import { FieldTypeIcon } from "@/components/FieldTypeIcon";
import type { Field } from "@/lib/schema/types";
import { FIELD_TYPE_LABEL, type BuilderStore } from "./store";
import styles from "./builder.module.css";

const nameOf = (f: Field) => f.label.trim() || "Untitled field";

/**
 * The form's fields in order. Click a row to edit it; reorder by dragging the handle
 * or with the move buttons (both keyboard accessible, moves are announced).
 */
export function FieldList({ store }: { store: BuilderStore }) {
  const fields = useStore(store, (s) => s.schema.fields);
  const selectedId = useStore(store, (s) => s.selectedId);
  const issues = useStore(store, (s) => s.issues);
  const [announcement, setAnnouncement] = useState("");
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function move(field: Field, toIndex: number) {
    store.getState().moveField(field.id, toIndex);
    setAnnouncement(`Moved ${nameOf(field)} to position ${toIndex + 1} of ${fields.length}`);
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const field = fields.find((f) => f.id === active.id);
    const to = fields.findIndex((f) => f.id === over.id);
    if (field && to >= 0) move(field, to);
  }

  if (fields.length === 0) {
    return <p className={styles.empty}>No fields yet. Add one below.</p>;
  }

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          <ol aria-label="Fields" className={styles.fieldList}>
            {fields.map((field, index) => (
              <FieldRow
                key={field.id}
                field={field}
                index={index}
                count={fields.length}
                selected={field.id === selectedId}
                issues={issues.filter((i) => i.fieldId === field.id).map((i) => i.message)}
                onSelect={() => store.getState().select(field.id)}
                onMove={(to) => move(field, to)}
                onRemove={() => {
                  store.getState().removeField(field.id);
                  setAnnouncement(`Removed ${nameOf(field)}`);
                }}
              />
            ))}
          </ol>
        </SortableContext>
      </DndContext>
      <p role="status" aria-live="polite" className="visually-hidden">
        {announcement}
      </p>
    </>
  );
}

function FieldRow({
  field,
  index,
  count,
  selected,
  issues,
  onSelect,
  onMove,
  onRemove,
}: {
  field: Field;
  index: number;
  count: number;
  selected: boolean;
  issues: string[];
  onSelect: () => void;
  onMove: (to: number) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
  });
  const name = nameOf(field);
  const className = [styles.fieldRow, selected && styles.fieldRowSelected, isDragging && styles.fieldRowDragging, issues.length > 0 && styles.fieldRowIssue]
    .filter(Boolean)
    .join(" ");

  return (
    <li ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className={className}>
      <button
        ref={setActivatorNodeRef}
        type="button"
        className={styles.handle}
        aria-label={`Drag to reorder ${name}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} strokeWidth={1.75} aria-hidden="true" />
      </button>
      <button type="button" className={styles.fieldMain} aria-label={`Edit ${name}`} aria-pressed={selected} onClick={onSelect}>
        <span className={styles.fieldIcon}>
          <FieldTypeIcon type={field.type} />
        </span>
        <span className={styles.fieldText}>
          <span className={styles.fieldLabel}>{name}</span>
          <span className={styles.fieldMeta}>
            {FIELD_TYPE_LABEL[field.type]}
            {field.required ? " · Required" : ""}
            {field.showIf ? " · Conditional" : ""}
          </span>
        </span>
      </button>
      <span className={styles.rowActions}>
        <button type="button" className={styles.iconButton} aria-label={`Move ${name} up`} disabled={index === 0} onClick={() => onMove(index - 1)}>
          <ArrowUp size={16} strokeWidth={1.75} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={styles.iconButton}
          aria-label={`Move ${name} down`}
          disabled={index === count - 1}
          onClick={() => onMove(index + 1)}
        >
          <ArrowDown size={16} strokeWidth={1.75} aria-hidden="true" />
        </button>
        <button type="button" className={styles.iconButton} aria-label={`Remove ${name}`} onClick={onRemove}>
          <Trash2 size={16} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </span>
      {issues.length > 0 ? (
        <ul className={styles.rowIssues}>
          {issues.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}
