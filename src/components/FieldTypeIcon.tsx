import { AlignLeft, Calendar, CheckSquare, ChevronsUpDown, Hash, Mail, Type, type LucideIcon } from "lucide-react";
import type { FieldType } from "@/lib/schema/types";

const ICONS: Record<FieldType, LucideIcon> = {
  shortText: Type,
  longText: AlignLeft,
  email: Mail,
  number: Hash,
  select: ChevronsUpDown,
  checkbox: CheckSquare,
  date: Calendar,
};

/** One icon per field type, Lucide at 16px / stroke 1.75 (see DESIGN.md). Decorative. */
export function FieldTypeIcon({ type, size = 16 }: { type: FieldType; size?: number }) {
  const Icon = ICONS[type];
  return <Icon size={size} strokeWidth={1.75} aria-hidden="true" />;
}
