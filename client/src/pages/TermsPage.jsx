import { motion } from 'framer-motion'
import { PageLayout } from '../components/layout/PageLayout'

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: `By accessing our website or enrolling in any course at Kutaisi English Academy, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.`,
  },
  {
    title: '2. Course Enrolment',
    body: `Enrolment in a course is confirmed upon receipt of full payment for the first month (or full course fee where applicable). All enrolments are subject to availability and placement assessment results. We reserve the right to decline enrolment at our discretion.\n\nStudents must meet the minimum English level requirements for their chosen course as determined by our free placement assessment.`,
  },
  {
    title: '3. Fees and Payment',
    body: `Course fees are due at the beginning of each month. Monthly fees must be paid no later than the 5th of each calendar month. Late payment may result in suspension of access to classes.\n\nAll fees are quoted in Georgian Lari (₾). Fees may be subject to annual review. Students will be notified of any fee changes at least 30 days in advance.`,
  },
  {
    title: '4. Cancellation and Refunds',
    body: `Students wishing to cancel their enrolment must provide written notice at least 14 days before the start of the next billing period. No refunds are issued for partially-completed months.\n\nIf the Academy cancels a course, enrolled students will receive a full refund of any fees paid for uncompleted sessions.\n\nIn exceptional circumstances (serious illness, family bereavement), refund requests may be considered on a case-by-case basis.`,
  },
  {
    title: '5. Attendance and Conduct',
    body: `Students are expected to attend all scheduled classes. If a student misses more than 30% of sessions in a month without prior notification, they may be asked to repeat the month at standard fee.\n\nAll students and staff are expected to treat each other with respect. Disruptive behaviour, harassment, or discrimination of any kind will result in immediate dismissal without refund.`,
  },
  {
    title: '6. Materials and Intellectual Property',
    body: `All course materials, including textbooks, handouts, recordings, and digital resources, are provided for the personal educational use of enrolled students only. Reproduction, distribution, or commercial use of any materials without prior written consent from Kutaisi English Academy is strictly prohibited.`,
  },
  {
    title: '7. Limitation of Liability',
    body: `Kutaisi English Academy provides educational services in good faith. We do not guarantee specific outcomes, exam scores, or employment results from completing our courses. Our liability is limited to the course fees paid in the relevant period.`,
  },
  {
    title: '8. Privacy',
    body: `Your use of our services is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices.`,
  },
  {
    title: '9. Governing Law',
    body: `These Terms of Service are governed by and construed in accordance with the laws of Georgia. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of Georgia.`,
  },
  {
    title: '10. Changes to Terms',
    body: `We reserve the right to modify these Terms of Service at any time. Changes will be communicated to enrolled students by email and published on our website. Continued use of our services after such changes constitutes acceptance of the revised terms.`,
  },
  {
    title: '11. Contact',
    body: `For questions about these Terms, please contact:\n\nKutaisi English Academy\n12 Rustaveli Avenue, Kutaisi, Georgia\ninfo@kutaisi-english.ge\n+995 599 123 456`,
  },
]

export function TermsPage() {
  return (
    <PageLayout pageTitle="Terms of Service">
      {/* Header */}
      <section className="relative pt-32 pb-12 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-300/70 mb-4 block">Legal</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Terms of Service</h1>
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
            These Terms of Service govern your use of Kutaisi English Academy's website and educational services. Please read them carefully before enrolling or using our services.
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
