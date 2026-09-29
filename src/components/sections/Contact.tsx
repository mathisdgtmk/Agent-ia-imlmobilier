"use client";

import Link from "next/link";
import { CircleCheck, Info, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { contact } from "@/content/home";
import {
  TEAM_SIZES,
  contactSchema,
  type ContactField,
  type ContactResponse,
} from "@/lib/contact/schema";
import { Reveal } from "@/components/ui/Reveal";
import { Container, SectionHeading } from "@/components/ui/Section";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Values = {
  name: string;
  agency: string;
  email: string;
  phone: string;
  city: string;
  teamSize: string;
  message: string;
  consent: boolean;
};

const EMPTY: Values = {
  name: "",
  agency: "",
  email: "",
  phone: "",
  city: "",
  teamSize: "",
  message: "",
  consent: false,
};

type Errors = Partial<Record<ContactField, string>>;
type Status = "idle" | "submitting" | "sent" | "demo" | "error";

const FIELD_ORDER: ContactField[] = ["name", "agency", "email", "phone", "city", "teamSize", "message", "consent"];

function validate(values: Values): Errors {
  const result = contactSchema.safeParse(values);
  if (result.success) return {};
  const errors: Errors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as ContactField;
    if (!errors[field]) errors[field] = issue.message;
  }
  return errors;
}

function Label({ field, children, optional }: { field: ContactField; children: string; optional?: boolean }) {
  return (
    <label htmlFor={`contact-${field}`} className="text-[13.5px] font-medium text-ivory/90">
      {children}
      {optional ? <span className="font-normal text-mist"> (facultatif)</span> : null}
    </label>
  );
}

function ErrorText({ field, message }: { field: ContactField; message?: string }) {
  return message ? (
    <p id={`contact-${field}-error`} className="mt-1.5 text-[13px] text-[#eba497]">
      {message}
    </p>
  ) : null;
}

export function Contact({ deliveryConfigured }: { deliveryConfigured: boolean }) {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const mountedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mountedAt.current = performance.now();
  }, []);

  useEffect(() => {
    if (status === "sent" || status === "demo") resultRef.current?.focus();
  }, [status]);

  function update<K extends keyof Values>(key: K, value: Values[K]) {
    const next = { ...values, [key]: value };
    setValues(next);
    if (touched[key]) setErrors((prev) => ({ ...prev, [key]: validate(next)[key] }));
  }

  function blur(key: ContactField) {
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors((prev) => ({ ...prev, [key]: validate(values)[key] }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    setTouched(Object.fromEntries(FIELD_ORDER.map((f) => [f, true])));
    const firstInvalid = FIELD_ORDER.find((f) => found[f]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    setServerMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...values,
          website: honeypot,
          elapsedMs: Math.round(performance.now() - mountedAt.current),
        }),
      });
      const data = (await res.json().catch(() => null)) as ContactResponse | null;
      if (!data) throw new Error();

      switch (data.status) {
        case "sent":
          setStatus("sent");
          setValues(EMPTY);
          break;
        case "demo":
          setStatus("demo");
          break;
        case "invalid":
          setErrors(data.errors);
          setStatus("idle");
          break;
        case "rate_limited":
          setStatus("error");
          setServerMessage("Plusieurs demandes ont déjà été envoyées depuis cette connexion. Réessayez dans une heure.");
          break;
        default:
          setStatus("error");
          setServerMessage(data.message);
      }
    } catch {
      setStatus("error");
      setServerMessage("Connexion impossible. Vérifiez votre accès à Internet, puis réessayez.");
    }
  }

  const fieldProps = (key: Exclude<ContactField, "consent">) => ({
    id: `contact-${key}`,
    name: key,
    value: values[key],
    onBlur: () => blur(key),
    "aria-invalid": Boolean(errors[key]) || undefined,
    "aria-describedby": errors[key] ? `contact-${key}-error` : undefined,
  });

  const inputClass = (key: ContactField) =>
    cn(
      "mt-2 block w-full rounded-xl border bg-ink/60 px-4 text-[15px] text-ivory placeholder:text-ivory/30 transition-colors focus:outline-none",
      errors[key] ? "border-[#e08a7a]/70 focus:border-[#e08a7a]" : "border-ivory/12 focus:border-champagne/70",
    );

  const done = status === "sent" || status === "demo";

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(1100px,90%)] -translate-x-1/2 bg-gradient-to-r from-transparent via-champagne/60 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-220px] h-[440px] w-[900px] -translate-x-1/2 rounded-full bg-champagne/[0.08] blur-[140px]"
      />

      <Container className="relative grid gap-14 lg:grid-cols-12 lg:gap-16">
        <Reveal className="min-w-0 lg:col-span-5">
          <SectionHeading id="contact-title" title={contact.title} intro={contact.text} />
          <ul className="mt-10 space-y-4 border-t border-ivory/[0.08] pt-8">
            {contact.reassurance.map((item) => (
              <li key={item} className="flex items-center gap-3 text-[15px] text-ivory/85">
                <span aria-hidden="true" className="h-px w-5 bg-champagne" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="min-w-0 lg:col-span-7" delay={80}>
          <div className="glass rounded-[28px] p-5 sm:p-9">
            {!deliveryConfigured && !done ? (
              <p className="mb-7 flex gap-3 rounded-xl border border-champagne/30 bg-champagne/[0.08] px-4 py-3 text-[13.5px] leading-relaxed text-champagne-light">
                <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                Mode démonstration : l’envoi du formulaire n’est pas encore configuré sur ce site. Vos
                saisies seront vérifiées, mais aucune demande ne sera transmise.
              </p>
            ) : null}

            {done ? (
              <div ref={resultRef} tabIndex={-1} className="py-8 text-center outline-none" role="status">
                {status === "sent" ? (
                  <CircleCheck className="mx-auto h-12 w-12 text-champagne" strokeWidth={1.3} aria-hidden="true" />
                ) : (
                  <Info className="mx-auto h-12 w-12 text-champagne" strokeWidth={1.3} aria-hidden="true" />
                )}
                <h3 className="mt-6 font-display text-[2rem] leading-tight text-ivory">
                  {status === "sent" ? "Demande envoyée" : "Formulaire valide, aucune demande transmise"}
                </h3>
                <p className="mx-auto mt-4 max-w-md text-[15.5px] leading-relaxed text-mist">
                  {status === "sent"
                    ? "Merci. Nous vous recontactons pour convenir d’un créneau de démonstration adapté à votre agence."
                    : "Ce site est en mode démonstration : l’envoi n’est pas encore configuré, votre demande n’a donc été transmise à personne."}
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className={buttonClasses("ghost", "sm", "mt-8")}
                >
                  {status === "sent" ? "Envoyer une autre demande" : "Revenir au formulaire"}
                </button>
              </div>
            ) : (
              <form ref={formRef} noValidate onSubmit={onSubmit} aria-describedby="contact-required">
                <p id="contact-required" className="visually-hidden">
                  Tous les champs sont obligatoires, sauf mention « facultatif ».
                </p>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label field="name">Nom et prénom</Label>
                    <input
                      {...fieldProps("name")}
                      type="text"
                      autoComplete="name"
                      onChange={(e) => update("name", e.target.value)}
                      className={cn(inputClass("name"), "h-12")}
                    />
                    <ErrorText field="name" message={errors.name} />
                  </div>
                  <div>
                    <Label field="agency">Nom de l’agence</Label>
                    <input
                      {...fieldProps("agency")}
                      type="text"
                      autoComplete="organization"
                      onChange={(e) => update("agency", e.target.value)}
                      className={cn(inputClass("agency"), "h-12")}
                    />
                    <ErrorText field="agency" message={errors.agency} />
                  </div>
                  <div>
                    <Label field="email">Adresse e-mail professionnelle</Label>
                    <input
                      {...fieldProps("email")}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      onChange={(e) => update("email", e.target.value)}
                      className={cn(inputClass("email"), "h-12")}
                    />
                    <ErrorText field="email" message={errors.email} />
                  </div>
                  <div>
                    <Label field="phone" optional>
                      Téléphone
                    </Label>
                    <input
                      {...fieldProps("phone")}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      onChange={(e) => update("phone", e.target.value)}
                      className={cn(inputClass("phone"), "h-12")}
                    />
                    <ErrorText field="phone" message={errors.phone} />
                  </div>
                  <div>
                    <Label field="city">Ville ou secteur d’activité</Label>
                    <input
                      {...fieldProps("city")}
                      type="text"
                      autoComplete="address-level2"
                      onChange={(e) => update("city", e.target.value)}
                      className={cn(inputClass("city"), "h-12")}
                    />
                    <ErrorText field="city" message={errors.city} />
                  </div>
                  <div>
                    <Label field="teamSize" optional>
                      Nombre de collaborateurs
                    </Label>
                    <select
                      {...fieldProps("teamSize")}
                      onChange={(e) => update("teamSize", e.target.value)}
                      className={cn(inputClass("teamSize"), "h-12 appearance-none bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10", !values.teamSize && "text-ivory/45")}
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23cfb27c' stroke-width='1.8'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                      }}
                    >
                      <option value="">Sélectionner</option>
                      {TEAM_SIZES.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                    <ErrorText field="teamSize" message={errors.teamSize} />
                  </div>
                  <div className="sm:col-span-2">
                    <Label field="message">Message</Label>
                    <textarea
                      {...fieldProps("message")}
                      rows={5}
                      maxLength={2000}
                      placeholder="Parlez-nous de votre agence et de ce que vous attendez d’un agent IA."
                      onChange={(e) => update("message", e.target.value)}
                      className={cn(inputClass("message"), "resize-y py-3 leading-relaxed")}
                    />
                    <ErrorText field="message" message={errors.message} />
                  </div>
                </div>

                {/* Champ piège anti-spam : invisible pour les visiteurs */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                  <label htmlFor="contact-website">Ne pas remplir ce champ</label>
                  <input
                    id="contact-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                <div className="mt-6">
                  <div className="flex gap-3">
                    <input
                      id="contact-consent"
                      name="consent"
                      type="checkbox"
                      checked={values.consent}
                      onChange={(e) => update("consent", e.target.checked)}
                      onBlur={() => blur("consent")}
                      aria-invalid={Boolean(errors.consent) || undefined}
                      aria-describedby={errors.consent ? "contact-consent-error" : undefined}
                      className="mt-1 h-[18px] w-[18px] shrink-0 cursor-pointer rounded accent-champagne"
                    />
                    <label htmlFor="contact-consent" className="text-[13.5px] leading-relaxed text-mist">
                      J’accepte que les informations saisies soient utilisées pour me recontacter au sujet de ma
                      demande de démonstration. Pour en savoir plus, consultez la{" "}
                      <Link
                        href="/politique-de-confidentialite"
                        className="text-ivory underline decoration-champagne/60 underline-offset-4 hover:decoration-champagne"
                      >
                        politique de confidentialité
                      </Link>
                      .
                    </label>
                  </div>
                  <ErrorText field="consent" message={errors.consent} />
                </div>

                {status === "error" && serverMessage ? (
                  <p role="alert" className="mt-6 rounded-xl border border-[#e08a7a]/40 bg-[#e08a7a]/10 px-4 py-3 text-[14px] text-[#f0b8ad]">
                    {serverMessage}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className={buttonClasses("gold", "md", "mt-8 h-auto min-h-14 w-full whitespace-normal py-3 text-center text-base sm:w-auto sm:px-8")}
                >
                  {status === "submitting" ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Envoi en cours…
                    </>
                  ) : (
                    contact.submitLabel
                  )}
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
