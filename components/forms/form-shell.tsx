"use client";

import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CircleCheckIcon,
  LoaderCircleIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { submitForm } from "@/app/actions/submit-form";
import { Link } from "@/lib/i18n/navigation";
import {
  emptyValues,
  forms,
  OPTIONS,
  PHOTO_MAX_BYTES,
  schemas,
  type FieldDef,
  type FormKind,
} from "@/lib/forms/definitions";
import {
  HONEYPOT,
  TURNSTILE_FIELD,
  type SubmitError,
} from "@/lib/forms/process";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Placeholder } from "@/components/site/placeholder";
import { compressImage } from "./compress-image";
import { Turnstile } from "./turnstile";

type Values = Record<string, string | boolean>;

const control =
  "min-h-12 w-full rounded-lg border border-muted-foreground/60 bg-background px-3 text-lg aria-invalid:border-danger-strong aria-invalid:ring-1 aria-invalid:ring-danger-strong";

export type FormShellProps = {
  kind: FormKind;
  /** Puroks for the report form, from content/areas.yaml. */
  areas?: string[];
  /** Cloudflare Turnstile site key; the widget is skipped when not configured. */
  turnstileSiteKey?: string;
  /** Shown as the fallback when sending fails. */
  phone?: string | null;
  phoneTel?: string | null;
};

/**
 * One form component for every form on the site. Fields and validation come
 * from lib/forms/definitions.ts; the same schema runs again on the server.
 */
export function FormShell({
  kind,
  areas = [],
  turnstileSiteKey,
  phone,
  phoneTel,
}: FormShellProps) {
  const t = useTranslations("forms");
  const locale = useLocale();
  const uid = useId();
  const def = forms[kind];

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- one component, five schemas
    resolver: zodResolver(schemas[kind] as any),
    defaultValues: emptyValues(kind),
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState<
    "photoTooLarge" | "photoType" | null
  >(null);
  const [token, setToken] = useState<string | null>(null);
  const [failure, setFailure] = useState<SubmitError | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const errorText = (name: string) => {
    const message = errors[name]?.message;
    return typeof message === "string" && t.has(`errors.${message}`)
      ? t(`errors.${message}`)
      : undefined;
  };

  async function choosePhoto(file: File | undefined) {
    setPhotoError(null);
    if (!file) return setPhoto(null);
    if (!file.type.startsWith("image/")) {
      setPhoto(null);
      return setPhotoError("photoType");
    }
    const small = await compressImage(file);
    if (small.size > PHOTO_MAX_BYTES) {
      setPhoto(null);
      return setPhotoError("photoTooLarge");
    }
    setPhoto(small);
  }

  async function onSubmit(values: Values, event?: React.BaseSyntheticEvent) {
    setFailure(null);
    const data = new FormData();
    for (const [key, value] of Object.entries(values))
      data.set(key, String(value));
    data.set("locale", locale);
    const honeypot = (
      event?.target as HTMLFormElement | undefined
    )?.elements.namedItem(HONEYPOT);
    data.set(
      HONEYPOT,
      honeypot instanceof HTMLInputElement ? honeypot.value : "",
    );
    if (token) data.set(TURNSTILE_FIELD, token);
    if (photo) data.set("photo", photo);

    let result;
    try {
      result = await submitForm(kind, data);
    } catch {
      result = { ok: false as const, error: "send" as const };
    }

    if (result.ok) {
      setReference(result.reference);
      reset();
      setPhoto(null);
      return;
    }
    if (result.error === "validation" && result.fieldErrors) {
      for (const [name, message] of Object.entries(result.fieldErrors))
        setError(name, { message });
    }
    if (result.error === "photoTooLarge" || result.error === "photoType")
      setPhotoError(result.error);
    setFailure(result.error);
  }

  /* ---------- Success ---------- */
  if (reference) {
    return (
      <div
        role="status"
        className="rounded-2xl border-2 border-success/50 bg-success/10 p-6 text-center"
      >
        <CircleCheckIcon
          className="mx-auto size-14 text-success-strong"
          aria-hidden="true"
        />
        <h3 className="mt-3 text-2xl text-foreground">{t("success.title")}</h3>
        <p className="mx-auto mt-4 text-sm font-semibold text-muted-foreground">
          {t("success.reference")}
        </p>
        <p className="mx-auto font-mono text-3xl font-bold tracking-wide text-primary select-all">
          {reference}
        </p>
        <p className="mx-auto mt-2">{t("success.keep")}</p>
        <p className="mx-auto mt-4">
          {t("success.response")} <Placeholder />
        </p>
        {phone && (
          <p className="mx-auto mt-2">
            {t.rich("success.urgent", {
              phone: () => (
                <a
                  href={`tel:${phoneTel}`}
                  className="font-semibold text-primary underline underline-offset-4"
                >
                  {phone}
                </a>
              ),
            })}
          </p>
        )}
        <Button
          variant="secondary"
          className="mt-6"
          onClick={() => setReference(null)}
        >
          {t("success.again")}
        </Button>
      </div>
    );
  }

  /* ---------- Fields ---------- */
  function renderField(field: FieldDef) {
    const id = `${uid}-${field.name}`;
    const error =
      field.type === "photo"
        ? photoError
          ? t(`errors.${photoError}`)
          : undefined
        : errorText(field.name);
    const hint =
      field.type === "photo"
        ? t("photoHint")
        : t.has(`hints.${field.name}`)
          ? t(`hints.${field.name}`)
          : undefined;
    const describedBy =
      [hint && `${id}-hint`, error && `${id}-error`]
        .filter(Boolean)
        .join(" ") || undefined;
    const shared = {
      id,
      "aria-invalid": error ? true : undefined,
      "aria-describedby": describedBy,
      "aria-required": field.required || undefined,
    } as const;

    let input: React.ReactNode;
    if (field.type === "select") {
      const values: readonly string[] =
        field.options === "areas"
          ? [...areas, "other"]
          : OPTIONS[field.options!];
      input = (
        <select {...shared} {...register(field.name)} className={control}>
          <option value="">{t("select")}</option>
          {values.map((value) => (
            <option key={value} value={value}>
              {t.has(`options.${field.options}.${value}`)
                ? t(`options.${field.options}.${value}`)
                : value}
            </option>
          ))}
        </select>
      );
    } else if (field.type === "textarea") {
      input = (
        <textarea
          {...shared}
          {...register(field.name)}
          rows={4}
          className={cn(control, "py-2")}
        />
      );
    } else if (field.type === "photo") {
      input = (
        <input
          {...shared}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => choosePhoto(e.target.files?.[0])}
          className="block w-full text-base file:mr-3 file:min-h-12 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:font-semibold file:text-primary-foreground"
        />
      );
    } else {
      input = (
        <input
          {...shared}
          {...register(field.name)}
          type={field.type === "amount" ? "text" : field.type}
          inputMode={
            field.type === "tel"
              ? "tel"
              : field.type === "amount"
                ? "decimal"
                : undefined
          }
          autoComplete={field.autoComplete ?? "off"}
          className={control}
        />
      );
    }

    return (
      <div
        key={field.name}
        className={
          field.type === "textarea" || field.type === "photo"
            ? "sm:col-span-2"
            : undefined
        }
      >
        <label htmlFor={id} className="mb-1 block font-semibold">
          {t(`fields.${field.name}`)}{" "}
          <span className="text-sm font-normal text-muted-foreground">
            ({field.required ? t("requiredMark") : t("optional")})
          </span>
        </label>
        {input}
        {hint && (
          <p id={`${id}-hint`} className="mt-1 text-sm text-muted-foreground">
            {hint}
          </p>
        )}
        {error && (
          <p
            id={`${id}-error`}
            role="alert"
            className="mt-1 text-sm font-semibold text-danger-strong"
          >
            {error}
          </p>
        )}
      </div>
    );
  }

  const consentError = errorText("consent");
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-2xl border bg-card p-5 md:p-6"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {def.fields.map(renderField)}
      </div>

      {/* Honeypot: hidden from people and assistive technology, tempting to bots */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] size-px overflow-hidden"
      >
        <label>
          {t("honeypot")}
          <input type="text" name={HONEYPOT} tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mt-6">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            {...register("consent")}
            aria-invalid={consentError ? true : undefined}
            aria-describedby={consentError ? `${uid}-consent-error` : undefined}
            className="mt-1 size-6 shrink-0 accent-primary"
          />
          <span>
            {t.rich("consent", {
              privacy: (chunks) => (
                <Link
                  href="/privacy"
                  target="_blank"
                  className="font-semibold text-primary underline underline-offset-4"
                >
                  {chunks}
                </Link>
              ),
            })}
          </span>
        </label>
        {consentError && (
          <p
            id={`${uid}-consent-error`}
            role="alert"
            className="mt-1 text-sm font-semibold text-danger-strong"
          >
            {consentError}
          </p>
        )}
      </div>

      {turnstileSiteKey && (
        <div className="mt-5" aria-label={t("verification")}>
          <Turnstile
            siteKey={turnstileSiteKey}
            language={locale === "en" ? "en" : "tl"}
            onToken={setToken}
          />
        </div>
      )}

      {hasErrors && !failure && (
        <p role="alert" className="mt-5 font-semibold text-danger-strong">
          {t("errors.summary")}
        </p>
      )}

      {failure && (
        <div
          role="alert"
          className="mt-5 flex gap-3 rounded-xl border border-danger/40 bg-danger/10 p-4"
        >
          <TriangleAlertIcon
            className="mt-0.5 size-6 shrink-0 text-danger-strong"
            aria-hidden="true"
          />
          <div>
            <p className="font-bold text-danger-strong">{t("failure.title")}</p>
            <p>{t(`failure.${failure}`)}</p>
            {phone && (
              <p className="mt-1">
                {t.rich("failure.call", {
                  phone: () => (
                    <a
                      href={`tel:${phoneTel}`}
                      className="font-semibold text-primary underline underline-offset-4"
                    >
                      {phone}
                    </a>
                  ),
                })}
              </p>
            )}
          </div>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="mt-6 w-full sm:w-auto"
      >
        {isSubmitting && (
          <LoaderCircleIcon className="animate-spin" aria-hidden="true" />
        )}
        {isSubmitting ? t("sending") : t("submit")}
      </Button>
    </form>
  );
}
