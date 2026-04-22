import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { SectionTitle } from "../ui/SectionTitle";
import { useSiteData } from "../../context/SiteDataContext";
import { cn } from "../../utils/cn";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const API_URL = import.meta.env.VITE_API_URL || "";

const INITIAL_FORM = { name: "", phone: "", email: "", course: "", message: "" };

function InputField({ label, error, className, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
        {props.required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      <input
        className={cn(
          "w-full px-4 py-3 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white",
          "placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500",
          error
            ? "border-rose-400 dark:border-rose-500"
            : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600",
          className
        )}
        {...props}
      />
      {error && (
        <span className="flex items-center gap-1.5 text-xs text-rose-500">
          <AlertCircle className="w-3 h-3" />
          {error}
        </span>
      )}
    </div>
  );
}

function SelectField({ label, error, children, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
        {props.required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      <select
        className={cn(
          "w-full px-4 py-3 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white",
          "transition-all duration-200 cursor-pointer",
          "focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500",
          error
            ? "border-rose-400 dark:border-rose-500"
            : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
        )}
        {...props}
      >
        {children}
      </select>
      {error && (
        <span className="flex items-center gap-1.5 text-xs text-rose-500">
          <AlertCircle className="w-3 h-3" />
          {error}
        </span>
      )}
    </div>
  );
}

export function Contact() {
  const { t, i18n } = useTranslation();
  const { siteData } = useSiteData();
  const contactInfo = siteData.contact;
  const isKa = i18n.language.startsWith('ka');
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
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setStatus("submitting");
    try {
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
      Icon: Phone, label: t("contact.labels.phone"),
      value: contactInfo.phone, href: `tel:${contactInfo.phone.replace(/\s/g, "")}`,
      color: "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400",
    },
    {
      Icon: Mail, label: t("contact.labels.email"),
      value: contactInfo.email, href: `mailto:${contactInfo.email}`,
      color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
    },
    {
      Icon: MapPin, label: t("contact.labels.address"),
      value: address, href: null,
      color: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    },
    {
      Icon: Clock, label: t("contact.labels.hours"),
      value: hours, href: null,
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
    },
  ];

  return (
    <section
      id="contact"
      className="relative py-20 lg:py-32 bg-white dark:bg-slate-900 overflow-hidden"
      aria-label="Contact us"
    >
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-50 dark:bg-primary-950/20 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-14">
          <SectionTitle
            eyebrow={t("contact.eyebrow")}
            title={t("contact.title")}
            highlight={t("contact.titleHighlight")}
            description={t("contact.description")}
            align="center"
            className="mx-auto"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4 flex flex-col gap-8"
          >
            <div className="flex flex-col gap-4">
              {contactMeta.map(({ Icon, label, value, href, color }) => (
                  <div
                    key={label}
                    className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
                        {label}
                      </div>
                      {href ? (
                        <a href={href} className="text-sm font-medium text-slate-900 dark:text-white hover:text-primary-700 dark:hover:text-primary-400 transition-colors duration-150">
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{value}</p>
                      )}
                    </div>
                  </div>
              ))}
            </div>

            {/* Google Maps embed */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 h-52">
              <iframe
                title="Kutaisi English Academy location"
                src="https://maps.google.com/maps?q=Rustaveli+Avenue+Kutaisi+Georgia&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="lg:col-span-8"
          >
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 lg:p-8 shadow-sm">
              {status === "error" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center justify-center gap-4 py-16 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {t("contact.form.errorTitle")}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                    {t("contact.form.errorDesc")}
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-2 text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium cursor-pointer"
                  >
                    {t("contact.form.errorRetry")}
                  </button>
                </motion.div>
              ) : status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center justify-center gap-4 py-16 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {t("contact.form.successTitle")}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                    {t("contact.form.successDesc")}
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-2 text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium cursor-pointer"
                  >
                    {t("contact.form.successLink")}
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <InputField
                      label={t("contact.form.name")}
                      name="name"
                      type="text"
                      placeholder={t("contact.form.namePlaceholder")}
                      value={form.name}
                      onChange={handleChange}
                      error={errors.name}
                      required
                    />
                    <InputField
                      label={t("contact.form.phone")}
                      name="phone"
                      type="tel"
                      placeholder={t("contact.form.phonePlaceholder")}
                      value={form.phone}
                      onChange={handleChange}
                      error={errors.phone}
                      required
                    />
                  </div>

                  <InputField
                    label={t("contact.form.email")}
                    name="email"
                    type="email"
                    placeholder={t("contact.form.emailPlaceholder")}
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email}
                  />

                  <SelectField
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
                        <option key={c} value={c}>{c}</option>
                      ))}
                  </SelectField>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t("contact.form.message")}{" "}
                      <span className="text-slate-400 dark:text-slate-500 font-normal">
                        {t("contact.form.messageOptional")}
                      </span>
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      placeholder={t("contact.form.messagePlaceholder")}
                      value={form.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={status === "submitting"}
                    whileHover={{ scale: status !== "submitting" ? 1.01 : 1 }}
                    whileTap={{ scale: status !== "submitting" ? 0.99 : 1 }}
                    className="w-full sm:w-auto self-start inline-flex items-center gap-2 px-8 py-3.5 bg-primary-900 hover:bg-primary-800 disabled:bg-primary-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-primary-900/20 transition-all duration-200 cursor-pointer disabled:cursor-wait"
                  >
                    {status === "submitting" ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                        />
                        {t("contact.form.sending")}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {t("contact.form.sendBtn")}
                      </>
                    )}
                  </motion.button>

                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {t("contact.form.privacy")}
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
