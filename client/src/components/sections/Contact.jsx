import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { SectionTitle } from "../ui/SectionTitle";
import { Section } from "../ui/Section";
import { Field } from "../ui/Field";
import { Button } from "../ui/Button";
import { useSiteData } from "../../context/SiteDataContext";
import { fadeUp, inView } from "../../utils/motion";

const API_URL = import.meta.env.VITE_API_URL || "";

const INITIAL_FORM = { name: "", phone: "", email: "", course: "", message: "" };

/** Success / failure panel shown in place of the form. */
function FormResult({ tone, title, description, actionLabel, onAction }) {
  const isSuccess = tone === "success";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      role={isSuccess ? "status" : "alert"}
      className="flex flex-col items-center justify-center gap-4 py-16 text-center"
    >
      <span
        className={`flex h-14 w-14 items-center justify-center rounded-full ${
          isSuccess
            ? "bg-success-50 text-success-600 dark:bg-success-500/12"
            : "bg-danger-50 text-danger-600 dark:bg-danger-500/12"
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        ) : (
          <AlertCircle className="h-7 w-7" aria-hidden="true" />
        )}
      </span>
      <h3 className="text-h3 text-fg">{title}</h3>
      <p className="max-w-sm text-body-sm text-fg-muted">{description}</p>
      <Button variant="secondary" size="sm" onClick={onAction} className="mt-1">
        {actionLabel}
      </Button>
    </motion.div>
  );
}

export function Contact() {
  const { t, i18n } = useTranslation();
  const { siteData } = useSiteData();
  const contactInfo = siteData.contact || {};
  const isKa = i18n.language.startsWith("ka");
  const address = (isKa && contactInfo.ka?.address) || contactInfo.address;
  const hours = (isKa && contactInfo.ka?.hours) || contactInfo.hours;

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  const courseOptions = t("contact.courseOptions", { returnObjects: true });

  const validate = () => {
    const f = t("contact.form", { returnObjects: true });
    const errs = {};
    if (!form.name.trim()) errs.name = f.nameRequired;
    if (!form.phone.trim()) errs.phone = f.phoneRequired;
    else if (!/^[\d\s+\-()]{7,}$/.test(form.phone)) errs.phone = f.phoneInvalid;
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = f.emailInvalid;
    if (!form.course) errs.course = f.courseRequired;
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // Move focus to the first problem so keyboard users aren't stranded.
      const first = Object.keys(errs)[0];
      document.querySelector(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("submitting");
    try {
      // Firestore is only needed at submit time, so it is fetched on demand.
      const [{ collection, addDoc, serverTimestamp }, { db }] = await Promise.all([
        import("firebase/firestore"),
        import("../../firebase"),
      ]);

      // Save to Firestore — this is the source of truth, always works
      await addDoc(collection(db, "contacts"), {
        name: form.name,
        phone: form.phone,
        email: form.email || "",
        course: form.course,
        message: form.message || "",
        submittedAt: serverTimestamp(),
      });

      // Fire email notification in the background — doesn't affect the user
      fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_name: form.name,
          from_phone: form.phone,
          from_email: form.email,
          course: form.course,
          message: form.message || "No message",
        }),
      }).catch(() => {});

      setStatus("success");
      setForm(INITIAL_FORM);
    } catch {
      setStatus("error");
    }
  };

  const contactMeta = [
    {
      Icon: Phone,
      label: t("contact.labels.phone"),
      value: contactInfo.phone,
      href: contactInfo.phone ? `tel:${contactInfo.phone.replace(/\s/g, "")}` : null,
    },
    {
      Icon: Mail,
      label: t("contact.labels.email"),
      value: contactInfo.email,
      href: contactInfo.email ? `mailto:${contactInfo.email}` : null,
    },
    { Icon: MapPin, label: t("contact.labels.address"), value: address, href: null },
    { Icon: Clock, label: t("contact.labels.hours"), value: hours, href: null },
  ].filter((entry) => entry.value);

  return (
    <Section id="contact" tone="subtle" aria-label={t("contact.eyebrow")}>
      <SectionTitle
        eyebrow={t("contact.eyebrow")}
        title={t("contact.title")}
        highlight={t("contact.titleHighlight")}
        description={t("contact.description")}
        align="center"
        className="mb-12 lg:mb-14"
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Details */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          className="flex flex-col gap-5 lg:col-span-5"
        >
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {contactMeta.map(({ Icon, label, value, href }) => (
              <li
                key={label}
                className="flex items-start gap-3.5 rounded-card border border-line bg-surface p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-primary-50 text-primary-700 dark:bg-white/8 dark:text-accent-300">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-caption font-semibold uppercase tracking-[0.1em] text-fg-subtle">
                    {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      className="mt-0.5 block break-words text-body-sm font-medium text-fg transition-colors hover:text-accent-700 dark:hover:text-accent-300"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="mt-0.5 break-words text-body-sm font-medium text-fg">{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="overflow-hidden rounded-card border border-line">
            <iframe
              title="Kutaisi English Academy location"
              src="https://maps.google.com/maps?q=Javakhishvili+street+24+Kutaisi+Georgia&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-56 w-full"
            />
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          className="lg:col-span-7"
        >
          <div className="rounded-card border border-line bg-surface p-6 shadow-sm sm:p-8">
            {status === "error" ? (
              <FormResult
                tone="error"
                title={t("contact.form.errorTitle")}
                description={t("contact.form.errorDesc")}
                actionLabel={t("contact.form.errorRetry")}
                onAction={() => setStatus("idle")}
              />
            ) : status === "success" ? (
              <FormResult
                tone="success"
                title={t("contact.form.successTitle")}
                description={t("contact.form.successDesc")}
                actionLabel={t("contact.form.successLink")}
                onAction={() => setStatus("idle")}
              />
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field
                    label={t("contact.form.name")}
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder={t("contact.form.namePlaceholder")}
                    value={form.name}
                    onChange={handleChange}
                    error={errors.name}
                    required
                  />
                  <Field
                    label={t("contact.form.phone")}
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder={t("contact.form.phonePlaceholder")}
                    value={form.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    required
                  />
                </div>

                <Field
                  label={t("contact.form.email")}
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={t("contact.form.emailPlaceholder")}
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                />

                <Field
                  as="select"
                  label={t("contact.form.course")}
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  error={errors.course}
                  required
                >
                  <option value="">{t("contact.form.courseDefault")}</option>
                  {Array.isArray(courseOptions) &&
                    courseOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                </Field>

                <Field
                  as="textarea"
                  label={t("contact.form.message")}
                  optionalLabel={t("contact.form.messageOptional")}
                  name="message"
                  rows={4}
                  placeholder={t("contact.form.messagePlaceholder")}
                  value={form.message}
                  onChange={handleChange}
                />

                <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
                  <Button
                    type="submit"
                    size="lg"
                    loading={status === "submitting"}
                    className="w-full sm:w-auto"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    {status === "submitting" ? t("contact.form.sending") : t("contact.form.sendBtn")}
                  </Button>
                  <p className="text-caption text-fg-subtle">{t("contact.form.privacy")}</p>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
