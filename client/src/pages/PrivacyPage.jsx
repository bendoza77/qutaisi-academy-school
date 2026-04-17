import { motion } from 'framer-motion'
import { PageLayout } from '../components/layout/PageLayout'

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: `We collect information you provide directly to us when you fill in our contact form, enrol in a course, or communicate with our team. This includes your full name, phone number, email address, and any messages or enquiries you submit.\n\nWe also collect basic technical data automatically when you visit our website, such as your IP address, browser type, and pages visited, in order to improve our service.`,
  },
  {
    title: '2. How We Use Your Information',
    body: `We use the information we collect to:\n• Respond to your enquiries and provide the services you request\n• Process course enrolments and manage your learning account\n• Send you relevant updates about your course or the academy\n• Improve our website and educational programmes\n• Comply with legal obligations\n\nWe do not use your personal data for automated decision-making or profiling.`,
  },
  {
    title: '3. Sharing Your Information',
    body: `Kutaisi English Academy does not sell, trade, or rent your personal information to third parties. We may share your data with trusted service providers who assist us in operating our website or conducting our business, provided they agree to keep your information confidential.\n\nWe may disclose your information if required by law or to protect the safety of our students and staff.`,
  },
  {
    title: '4. Data Retention',
    body: `We retain your personal information only for as long as necessary to fulfil the purposes described in this policy, or as required by Georgian law. Enquiry data is typically retained for up to 2 years. Active student records are retained for the duration of enrolment plus 3 years.`,
  },
  {
    title: '5. Your Rights',
    body: `Under applicable data protection laws, you have the right to:\n• Access the personal data we hold about you\n• Request correction of inaccurate data\n• Request deletion of your data\n• Object to certain uses of your data\n• Withdraw consent at any time\n\nTo exercise any of these rights, please contact us at info@kutaisi-english.ge.`,
  },
  {
    title: '6. Cookies',
    body: `Our website uses cookies to improve your browsing experience. Cookies are small text files stored on your device. We use only essential cookies required for basic website functionality. You can configure your browser to refuse cookies, but this may affect some features of our website.`,
  },
  {
    title: '7. Security',
    body: `We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: '8. Changes to This Policy',
    body: `We may update this Privacy Policy from time to time. When we do, we will revise the "Last Updated" date at the top of this page. We encourage you to review this policy periodically to stay informed about how we protect your information.`,
  },
  {
    title: '9. Contact Us',
    body: `If you have any questions about this Privacy Policy or our data practices, please contact us:\n\nKutaisi English Academy\n12 Rustaveli Avenue, Kutaisi, Georgia\ninfo@kutaisi-english.ge\n+995 599 123 456`,
  },
]

export function PrivacyPage() {
  return (
    <PageLayout pageTitle="Privacy Policy">
      {/* Header */}
      <section className="relative pt-32 pb-12 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-300/70 mb-4 block">Legal</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-blue-100/70 text-sm">Last Updated: April 2025</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-600 dark:text-slate-400 leading-relaxed mb-12 text-base border-l-4 border-primary-200 dark:border-primary-800 pl-5"
          >
            Kutaisi English Academy ("we", "us", or "our") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard the data you provide to us.
          </motion.p>

          <div className="flex flex-col gap-10">
            {SECTIONS.map((sec, i) => (
              <motion.div
                key={sec.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.5 }}
              >
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{sec.title}</h2>
                <div className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                  {sec.body}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
