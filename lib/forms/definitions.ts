import { z } from "zod";

/**
 * Form definitions shared by the browser (react-hook-form) and the server
 * action. Validation messages are message keys (`forms.errors.*`), translated
 * where they are shown.
 */

export const FORM_KINDS = [
  "report",
  "connection",
  "membership",
  "loan",
  "contact",
] as const;
export type FormKind = (typeof FORM_KINDS)[number];

/* ---------- Shared field rules ---------- */

const text = (max: number) => z.string().trim().max(max, "tooLong");
const required = (max: number) => text(max).min(1, "required");
const name = text(100).min(2, "required");
const choice = z.string().min(1, "required").max(60, "tooLong");
const consent = z.boolean().refine((v) => v === true, "consent");

/** PH mobile: 09XXXXXXXXX or +639XXXXXXXXX. Spaces, dashes and dots are ignored. */
export const PH_MOBILE = /^(09\d{9}|\+639\d{9})$/;
const mobile = z
  .string()
  .transform((s) => s.replace(/[\s\-.()]/g, ""))
  .pipe(z.string().min(1, "required").regex(PH_MOBILE, "mobile"));

const optionalEmail = z
  .string()
  .trim()
  .max(200, "tooLong")
  .refine((s) => s === "" || z.email().safeParse(s).success, "email");

const optionalAmount = z
  .string()
  .trim()
  .refine(
    (s) =>
      s === "" ||
      (/^[\d,]+(\.\d{1,2})?$/.test(s) && Number(s.replace(/,/g, "")) > 0),
    "amount",
  );

/* ---------- Option lists (labels live in messages: forms.options.<group>.<value>) ---------- */

export const OPTIONS = {
  issueType: [
    "no_water",
    "low_pressure",
    "line_leak",
    "meter_leak",
    "water_quality",
    "broken_meter",
    "other",
  ],
  propertyType: ["residential", "commercial", "other"],
  contactTime: ["any", "morning", "afternoon"],
  subject: [
    "billing",
    "interruption",
    "connection",
    "membership",
    "loans",
    "other",
  ],
} as const;

/* ---------- Schemas ---------- */

export const schemas = {
  report: z.object({
    issueType: choice,
    purok: choice,
    address: required(200),
    accountNumber: text(40),
    name,
    mobile,
    description: text(2000),
    consent,
  }),
  connection: z.object({
    name,
    mobile,
    email: optionalEmail,
    address: required(200),
    propertyType: choice,
    contactTime: choice,
    message: text(2000),
    consent,
  }),
  membership: z.object({
    name,
    mobile,
    email: optionalEmail,
    address: required(200),
    message: text(2000),
    consent,
  }),
  loan: z.object({
    name,
    memberId: text(40),
    mobile,
    loanType: text(100),
    amount: optionalAmount,
    message: text(2000),
    consent,
  }),
  contact: z.object({
    name,
    mobile,
    email: optionalEmail,
    subject: choice,
    message: required(2000),
    consent,
  }),
} satisfies Record<FormKind, z.ZodType>;

/* ---------- Field layout ---------- */

export type FieldType =
  "text" | "tel" | "email" | "amount" | "textarea" | "select" | "photo";

export type FieldDef = {
  name: string;
  type: FieldType;
  required?: boolean;
  /** Key into OPTIONS, or "areas" for the purok list from content/areas.yaml. */
  options?: keyof typeof OPTIONS | "areas";
  autoComplete?: string;
};

export type FormDef = {
  /** Reference number prefix, e.g. RPT-20261110-AB12. */
  prefix: string;
  /** Tag in the email subject, e.g. [IWMPC][Report]. */
  tag: string;
  /** Fields whose values summarise the submission in the email subject. */
  summary: string[];
  fields: FieldDef[];
};

const nameField: FieldDef = {
  name: "name",
  type: "text",
  required: true,
  autoComplete: "name",
};
const mobileField: FieldDef = {
  name: "mobile",
  type: "tel",
  required: true,
  autoComplete: "tel",
};
const emailField: FieldDef = {
  name: "email",
  type: "email",
  autoComplete: "email",
};

export const forms: Record<FormKind, FormDef> = {
  report: {
    prefix: "RPT",
    tag: "Report",
    summary: ["issueType", "purok"],
    fields: [
      {
        name: "issueType",
        type: "select",
        required: true,
        options: "issueType",
      },
      { name: "purok", type: "select", required: true, options: "areas" },
      {
        name: "address",
        type: "text",
        required: true,
        autoComplete: "street-address",
      },
      { name: "accountNumber", type: "text" },
      nameField,
      mobileField,
      { name: "description", type: "textarea" },
      { name: "photo", type: "photo" },
    ],
  },
  connection: {
    prefix: "CON",
    tag: "New Connection",
    summary: ["propertyType", "name"],
    fields: [
      nameField,
      mobileField,
      emailField,
      {
        name: "address",
        type: "text",
        required: true,
        autoComplete: "street-address",
      },
      {
        name: "propertyType",
        type: "select",
        required: true,
        options: "propertyType",
      },
      {
        name: "contactTime",
        type: "select",
        required: true,
        options: "contactTime",
      },
      { name: "message", type: "textarea" },
    ],
  },
  membership: {
    prefix: "MEM",
    tag: "Membership",
    summary: ["name"],
    fields: [
      nameField,
      mobileField,
      emailField,
      {
        name: "address",
        type: "text",
        required: true,
        autoComplete: "street-address",
      },
      { name: "message", type: "textarea" },
    ],
  },
  loan: {
    prefix: "LOAN",
    tag: "Loan Inquiry",
    summary: ["loanType", "name"],
    fields: [
      nameField,
      { name: "memberId", type: "text" },
      mobileField,
      { name: "loanType", type: "text" },
      { name: "amount", type: "amount" },
      { name: "message", type: "textarea" },
    ],
  },
  contact: {
    prefix: "MSG",
    tag: "Contact",
    summary: ["subject", "name"],
    fields: [
      nameField,
      mobileField,
      emailField,
      { name: "subject", type: "select", required: true, options: "subject" },
      { name: "message", type: "textarea", required: true },
    ],
  },
};

/** Empty starting values for a form (react-hook-form needs every field defined). */
export function emptyValues(kind: FormKind): Record<string, string | boolean> {
  const values: Record<string, string | boolean> = { consent: false };
  for (const field of forms[kind].fields) {
    if (field.type !== "photo") values[field.name] = "";
  }
  return values;
}

/* ---------- Photo rules (shared so the browser can reject early) ---------- */

export const PHOTO_MAX_BYTES = 3 * 1024 * 1024;
export const PHOTO_MAX_DIMENSION = 1600;
