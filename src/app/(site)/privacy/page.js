import Link from 'next/link';
import { companyData } from '@/lib/data';

export const metadata = {
  title: 'Privacy Policy | Bluehydra',
  description: 'How Bluehydra collects, uses, stores, and protects personal information submitted through bluehydralabs.com.',
};

const LAST_UPDATED = '24 July 2026';

function Section({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-2xl font-bold text-black tracking-tight mb-5">{title}</h2>
      <div className="space-y-4 text-[15px] text-gray-600 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function DataTable({ rows }) {
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-xl mt-6">
      <table className="w-full text-left text-sm min-w-[600px]">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-5 py-3 font-semibold text-black text-xs uppercase tracking-widest">Where it comes from</th>
            <th className="px-5 py-3 font-semibold text-black text-xs uppercase tracking-widest">What we collect</th>
            <th className="px-5 py-3 font-semibold text-black text-xs uppercase tracking-widest">Why</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rows.map((r) => (
            <tr key={r.source} className="align-top">
              <td className="px-5 py-4 font-medium text-black whitespace-nowrap">{r.source}</td>
              <td className="px-5 py-4 text-gray-600">{r.data}</td>
              <td className="px-5 py-4 text-gray-600">{r.why}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const collectionRows = [
  {
    source: 'Contact form',
    data: 'Name, email address, company name, phone number, project type, budget range, timeline, and the message you write.',
    why: 'To respond to your enquiry and prepare a proposal.',
  },
  {
    source: 'Consultation booking',
    data: 'Name, email address, your chosen date and time, and any note you add to the booking.',
    why: 'To create the calendar event and send you the invitation.',
  },
  {
    source: 'Referral programme',
    data: 'Name, email address, WhatsApp number, and the referral link generated for you.',
    why: 'To issue your referral link, track referrals, and pay out rewards.',
  },
  {
    source: "Founders' Five application",
    data: 'Name, email address, WhatsApp number, business name and description, existing website, social media platform and link, and your written answers.',
    why: 'To assess your application and contact you with the outcome.',
  },
  {
    source: 'Website analytics and advertising',
    data: 'Page views, referring URL, approximate location, device and browser type, and interactions such as submitting the contact form.',
    why: 'To measure how our adverts perform and improve the site.',
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="pt-16 bg-white">

      {/* Hero */}
      <section className="px-6 lg:px-8 py-20 border-b border-gray-200">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#7c3aed] mb-6">
            Legal
          </p>
          <h1 className="text-4xl lg:text-5xl font-bold text-black tracking-tight leading-tight mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            This policy explains what personal information Bluehydra collects through bluehydralabs.com, why we collect it, who we share it with, and the control you have over it.
          </p>
          <p className="text-sm text-gray-400 mt-8">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      {/* Apps notice */}
      <section className="px-6 lg:px-8 py-8 border-b border-gray-200 bg-gray-50">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-[15px] text-gray-600">
            Looking for the privacy policy for our <strong className="text-black font-semibold">Learn Pandas</strong> Android app? It is covered separately.
          </p>
          <Link
            href="/privacy/learn-pandas"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#7c3aed] hover:text-[#6d28d9] transition-colors duration-200 flex-shrink-0"
          >
            Learn Pandas privacy policy
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Body */}
      <section className="px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto space-y-14">

          <Section id="who-we-are" title="1. Who we are">
            <p>
              Bluehydra (also trading as Bluehydra Labs) is a software development agency operating from Nigeria. We are the data controller for the information described in this policy.
            </p>
            <p>
              You can reach us at{' '}
              <a href={`mailto:${companyData.contact.email}`} className="text-[#7c3aed] font-medium hover:underline">
                {companyData.contact.email}
              </a>{' '}
              or{' '}
              <a href={`tel:${companyData.contact.phone}`} className="text-[#7c3aed] font-medium hover:underline">
                {companyData.contact.phone}
              </a>.
            </p>
          </Section>

          <Section id="what-we-collect" title="2. What we collect">
            <p>
              We only collect information you give us directly, plus limited technical data gathered automatically when you browse the site. We do not buy personal data from third parties.
            </p>
            <DataTable rows={collectionRows} />
            <p className="pt-2">
              We do not collect payment card details on this website. Where a project involves payment, it is handled directly between you and us or through a separate payment provider.
            </p>
          </Section>

          <Section id="how-we-use-it" title="3. How we use your information">
            <p>We use the information above to:</p>
            <ul className="space-y-3 pl-1">
              {[
                'Reply to your enquiry, prepare quotes, and schedule consultations.',
                'Deliver and support the projects our clients engage us for.',
                'Administer the referral programme, including verifying referrals and paying rewards.',
                "Review Founders' Five applications and notify applicants of the outcome.",
                'Send you emails that relate to something you started — your referral link, your booking confirmation, or an application update.',
                'Measure the performance of our adverts and understand which pages people find useful.',
                'Meet our legal, accounting, and record-keeping obligations.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-[#7c3aed] mt-0.5 flex-shrink-0">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>
              We do not sell your personal information, and we do not rent or trade our enquiry list to anyone.
            </p>
          </Section>

          <Section id="legal-basis" title="4. Our legal basis">
            <p>
              Where the Nigeria Data Protection Act 2023 or the UK/EU GDPR applies, we rely on the following grounds:
            </p>
            <ul className="space-y-3 pl-1">
              {[
                ['Consent', 'when you submit a form, book a consultation, or accept advertising cookies.'],
                ['Contract', 'when we process information in order to deliver work you have engaged us for.'],
                ['Legitimate interests', 'to secure our systems, keep basic business records, and understand how our site is used.'],
                ['Legal obligation', 'where tax or other law requires us to retain records.'],
              ].map(([label, text]) => (
                <li key={label} className="flex items-start gap-3">
                  <span className="text-[#7c3aed] mt-0.5 flex-shrink-0">→</span>
                  <span><strong className="text-black font-semibold">{label}</strong> — {text}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section id="third-parties" title="5. Services we share data with">
            <p>
              We use a small number of trusted providers to run this site. They process your data on our instructions only.
            </p>
            <ul className="space-y-3 pl-1">
              {[
                ['Supabase', 'database hosting for referral sign-ups and applications.'],
                ['Google (Gmail and Google Calendar)', 'receiving and sending enquiry emails, and creating consultation events and invitations.'],
                ['Resend', 'delivering calendar invitations for booked consultations.'],
                ['Meta (Facebook) Pixel', 'measuring advert performance and website conversions.'],
                ['Our hosting provider', 'serving the website and holding short-lived server logs.'],
              ].map(([label, text]) => (
                <li key={label} className="flex items-start gap-3">
                  <span className="text-[#7c3aed] mt-0.5 flex-shrink-0">→</span>
                  <span><strong className="text-black font-semibold">{label}</strong> — {text}</span>
                </li>
              ))}
            </ul>
            <p>
              We may also disclose information where the law requires it, or where it is necessary to establish or defend a legal claim.
            </p>
          </Section>

          <Section id="cookies" title="6. Cookies and tracking">
            <p>
              We use the Meta Pixel on this website. It sets cookies in your browser and reports page views and specific actions — such as opening the contact page or submitting the contact form — back to Meta. Meta may use this to show you our adverts and to build audiences of people with similar interests.
            </p>
            <p>
              You can limit this by using your browser&apos;s cookie controls, by enabling a tracking-protection or ad-blocking extension, or by adjusting your ad preferences in your Facebook or Instagram account settings.
            </p>
          </Section>

          <Section id="international" title="7. Where your data is stored">
            <p>
              Our providers operate data centres outside Nigeria, including in the European Union and the United States. This means your information may be transferred and stored outside your country of residence. We choose providers that offer recognised safeguards, such as standard contractual clauses, for those transfers.
            </p>
          </Section>

          <Section id="retention" title="8. How long we keep it">
            <p>
              We keep enquiry emails and consultation records for as long as the relationship is active, and for up to three years afterwards so we can pick up a past conversation and meet our record-keeping obligations. Referral records are kept while the programme runs and for two years after your last referral, so payouts can be verified. Application records are kept for two years after the outcome is communicated.
            </p>
            <p>
              You can ask us to delete your information sooner. See section 9.
            </p>
          </Section>

          <Section id="your-rights" title="9. Your rights">
            <p>You can ask us to:</p>
            <ul className="space-y-3 pl-1">
              {[
                'Tell you what personal information we hold about you and give you a copy.',
                'Correct anything that is wrong or out of date.',
                'Delete your information, where we are not required to keep it.',
                'Stop using your information for a particular purpose, including marketing.',
                'Withdraw consent you previously gave, at any time.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-[#7c3aed] mt-0.5 flex-shrink-0">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>
              Email{' '}
              <a href={`mailto:${companyData.contact.email}`} className="text-[#7c3aed] font-medium hover:underline">
                {companyData.contact.email}
              </a>{' '}
              with the subject line &quot;Privacy request&quot;. We respond within 30 days. If you are in Nigeria and are unhappy with our response, you may complain to the Nigeria Data Protection Commission.
            </p>
          </Section>

          <Section id="security" title="10. Security">
            <p>
              The site is served over HTTPS, credentials for our email, database, and calendar services are held as server-side environment variables and never exposed to the browser, and access to our database and inbox is limited to the people who need it. No system is perfectly secure, but if a breach affects your personal information we will notify you and the relevant authority as required by law.
            </p>
          </Section>

          <Section id="children" title="11. Children">
            <p>
              This website is intended for business audiences and is not directed at children under 16. We do not knowingly collect information from children. If you believe a child has submitted information to us, contact us and we will delete it.
            </p>
          </Section>

          <Section id="changes" title="12. Changes to this policy">
            <p>
              We update this policy when our practices change. The date at the top always reflects the current version. If a change materially affects how we use your information, we will make that clear on this page.
            </p>
          </Section>

          <Section id="contact" title="13. Contact us">
            <p>
              Questions about this policy, or about how we handle your data:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-2 text-[15px] not-prose">
              <p className="text-black font-semibold">{companyData.name}</p>
              <p>
                <a href={`mailto:${companyData.contact.email}`} className="text-[#7c3aed] font-medium hover:underline">
                  {companyData.contact.email}
                </a>
              </p>
              <p>
                <a href={`tel:${companyData.contact.phone}`} className="text-[#7c3aed] font-medium hover:underline">
                  {companyData.contact.phone}
                </a>
              </p>
            </div>
          </Section>

        </div>
      </section>

      {/* Footer nav */}
      <section className="px-6 lg:px-8 py-12 border-t border-gray-200 bg-gray-50">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">Need something else?</p>
          <div className="flex flex-wrap gap-6">
            <Link href="/privacy/learn-pandas" className="text-sm font-semibold text-black hover:text-[#7c3aed] transition-colors duration-200">
              Learn Pandas policy
            </Link>
            <Link href="/contact" className="text-sm font-semibold text-black hover:text-[#7c3aed] transition-colors duration-200">
              Contact us
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
