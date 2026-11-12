import type { FormSchema } from "@/lib/schema/types";

/** Demonstration content for the landing page. Nothing here is real customer data. */

const v1: FormSchema = {
  schemaVersion: 1,
  title: "Early access",
  fields: [
    { id: "name", type: "shortText", label: "Your name", required: true, maxLength: 60 },
    { id: "email", type: "email", label: "Work email", required: true },
    {
      id: "team",
      type: "select",
      label: "Team size",
      required: true,
      options: [
        { value: "1-5", label: "1–5 people" },
        { value: "6-20", label: "6–20 people" },
        { value: "21+", label: "21 or more" },
      ],
    },
  ],
};

const v2: FormSchema = {
  ...v1,
  fields: [
    ...v1.fields,
    { id: "first", type: "longText", label: "What will you collect first?", required: false, maxLength: 280 },
  ],
};

export type DemoVersion = { key: "v1" | "v2"; schema: FormSchema; publishedOn: string };

export const DEMO_VERSIONS: DemoVersion[] = [
  { key: "v1", schema: v1, publishedOn: "2026-10-02" },
  { key: "v2", schema: v2, publishedOn: "2026-11-03" },
];

export type DemoResponse = {
  id: string;
  version: DemoVersion["key"];
  answers: Record<string, string | number | boolean>;
  submitted: string;
  sample?: boolean;
};

/** Pre-filed sample responses so the drawer isn't empty on first view. Marked as samples in the UI. */
export const SAMPLE_RESPONSES: DemoResponse[] = [
  { id: "s1", version: "v1", answers: { name: "Mira Okafor", email: "mira@example.com", team: "6-20" }, submitted: "2026-10-04", sample: true },
  { id: "s2", version: "v1", answers: { name: "Dev Raman", email: "dev@example.com", team: "1-5" }, submitted: "2026-10-11", sample: true },
  {
    id: "s3",
    version: "v2",
    answers: { name: "Lena Brandt", email: "lena@example.com", team: "21+", first: "Volunteer sign-ups for our spring fair." },
    submitted: "2026-11-05",
    sample: true,
  },
];
