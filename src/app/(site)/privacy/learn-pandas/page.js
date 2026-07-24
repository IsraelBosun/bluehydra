import Link from 'next/link';
import { companyData } from '@/lib/data';

/*
 * CONFIRM BEFORE PUBLISHING TO THE PLAY STORE — these must match the shipped app:
 *   - APP_DETAILS.signIn      : the sign-in methods the app actually offers
 *   - APP_DETAILS.backend     : the provider hosting accounts and progress data
 *   - APP_DETAILS.packageName : the Play Store package id
 * Google requires the policy to accurately match your Data Safety form.
 */
const APP_DETAILS = {
  name: 'Learn Pandas',
  platform: 'Android',
  packageName: 'com.bluehydra.learnpandas',
  signIn: 'email address and password, or Google Sign-In',
  backend: 'Supabase',
};

export const metadata = {
  title: 'Learn Pandas Privacy Policy | Bluehydra',
  description: 'Privacy policy for the Learn Pandas Android app by Bluehydra: what data the app collects, how it is used, and how to delete your account.',
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

function Bullets({ items }) {
  return (
    <ul className="space-y-3 pl-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="text-[#7c3aed] mt-0.5 flex-shrink-0">→</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

const dataRows = [
  {
    type: 'Account information',
    data: 'Your email address, the display name you choose, and an encrypted authentication credential.',
    why: 'To create your account, sign you in, and let you recover access.',
  },
  {
    type: 'Learning progress',
    data: 'Lessons you have opened or completed, quiz answers and scores, streaks, and bookmarks.',
    why: 'To save your place and sync your progress across your devices.',
  },
  {
    type: 'App preferences',
    data: 'Settings such as theme and notification choices.',
    why: 'To keep the app configured the way you left it.',
  },
  {
    type: 'Support messages',
    data: 'Anything you write to us if you email support or send feedback from inside the app.',
    why: 'To answer your question.',
  },
];

export default function LearnPandasPrivacyPage() {
  return (
    <main className="pt-16 bg-white">

      {/* Hero */}
      <section className="px-6 lg:px-8 py-20 border-b border-gray-200">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#7c3aed] mb-6">
            {APP_DETAILS.platform} App · Legal
          </p>
          <h1 className="text-4xl lg:text-5xl font-bold text-black tracking-tight leading-tight mb-6">
            {APP_DETAILS.name}<br />Privacy Policy
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            {APP_DETAILS.name} is an {APP_DETAILS.platform} app published by {companyData.name} that teaches the Python pandas library through structured lessons and quizzes. This policy explains exactly what the app collects and what it does not.
          </p>
          <p className="text-sm text-gray-400 mt-8">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      {/* At a glance */}
      <section className="px-6 lg:px-8 py-14 border-b border-gray-200 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-8">At a glance</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              ['No adverts', 'The app contains no advertising and no ad networks.'],
              ['No data selling', 'We never sell or share your data with data brokers.'],
              ['No third-party analytics', 'We do not embed advertising or analytics SDKs that track you.'],
              ['Delete any time', 'You can delete your account and all its data from inside the app.'],
            ].map(([title, text]) => (
              <div key={title} className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-black mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto space-y-14">

          <Section id="who-we-are" title="1. Who we are">
            <p>
              {APP_DETAILS.name} (package <code className="text-[13px] bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5 text-black">{APP_DETAILS.packageName}</code>) is developed and published by {companyData.name}, a software development agency operating from Nigeria. We are the data controller for information collected through the app.
            </p>
            <p>
              Contact us at{' '}
              <a href={`mailto:${companyData.contact.email}`} className="text-[#7c3aed] font-medium hover:underline">
                {companyData.contact.email}
              </a>.
            </p>
          </Section>

          <Section id="what-we-collect" title="2. What the app collects">
            <p>
              {APP_DETAILS.name} requires an account so your progress follows you between devices. Here is everything we store.
            </p>
            <div className="overflow-x-auto border border-gray-200 rounded-xl mt-6">
              <table className="w-full text-left text-sm min-w-[600px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-3 font-semibold text-black text-xs uppercase tracking-widest">Type</th>
                    <th className="px-5 py-3 font-semibold text-black text-xs uppercase tracking-widest">What we store</th>
                    <th className="px-5 py-3 font-semibold text-black text-xs uppercase tracking-widest">Why</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dataRows.map((r) => (
                    <tr key={r.type} className="align-top">
                      <td className="px-5 py-4 font-medium text-black whitespace-nowrap">{r.type}</td>
                      <td className="px-5 py-4 text-gray-600">{r.data}</td>
                      <td className="px-5 py-4 text-gray-600">{r.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="pt-2">
              You sign in with your {APP_DETAILS.signIn}. If you sign in with Google, we receive only your email address and basic profile name from Google. We never receive or store your Google password.
            </p>
          </Section>

          <Section id="what-we-dont-collect" title="3. What the app does not collect">
            <p>
              We want this to be unambiguous. {APP_DETAILS.name} does <strong className="text-black font-semibold">not</strong>:
            </p>
            <Bullets
              items={[
                'Collect your name beyond the display name you choose, your phone number, or your address.',
                'Request location, camera, microphone, contacts, photos, or file storage permissions.',
                'Read or upload anything else on your device.',
                'Contain advertising, ad SDKs, or third-party advertising identifiers.',
                'Sell, rent, or share your personal information with data brokers or advertisers.',
                'Execute code. The app teaches pandas through lessons and quizzes only — it does not run Python, so no code you write is transmitted anywhere.',
                'Process payments or store payment card details.',
              ]}
            />
            <p>
              The only permission the app needs is internet access, which is used to sign you in and sync your progress.
            </p>
          </Section>

          <Section id="how-we-use-it" title="4. How we use your information">
            <Bullets
              items={[
                'To create and secure your account and sign you in.',
                'To save your lesson progress and quiz results, and restore them when you reinstall or switch device.',
                'To keep your app settings consistent across devices.',
                'To send you service messages you would expect — a password reset, or a notice about a change to this policy.',
                'To understand, in aggregate, which lessons learners complete or abandon so we can improve the course content. This is done on our own data, not through a third-party tracking service.',
                'To respond when you contact support.',
              ]}
            />
            <p>
              We do not use your information to build advertising profiles, and we do not make automated decisions that have legal or similarly significant effects on you.
            </p>
          </Section>

          <Section id="legal-basis" title="5. Our legal basis">
            <p>
              Where the Nigeria Data Protection Act 2023 or the UK/EU GDPR applies, we process your data on the basis of the contract formed when you create an account and accept our terms, your consent where you have given it, and our legitimate interest in keeping the service secure and improving the course material.
            </p>
          </Section>

          <Section id="third-parties" title="6. Who we share it with">
            <p>
              Your data is stored on our behalf by {APP_DETAILS.backend}, which provides the authentication and database infrastructure behind the app. They process it under contract, on our instructions, and are not permitted to use it for their own purposes.
            </p>
            <p>
              If you choose Google Sign-In, Google handles the authentication step and will know that you signed in to {APP_DETAILS.name}. Google&apos;s handling of that is governed by their own privacy policy.
            </p>
            <p>
              Beyond that, we share your information only where the law compels us to, or where it is necessary to establish, exercise, or defend a legal claim. If {companyData.name} is ever acquired, account data may transfer to the acquirer under the same commitments in this policy, and we will tell you before that happens.
            </p>
          </Section>

          <Section id="storage" title="7. Where your data is stored and how it is protected">
            <p>
              Data is held on servers operated by our infrastructure provider, which may be located outside your country, including in the European Union or the United States. Transfers rely on the safeguards our provider offers, such as standard contractual clauses.
            </p>
            <p>
              All traffic between the app and our servers is encrypted in transit using TLS. Passwords are stored as salted hashes, never in plain text. Database access is restricted by row-level security rules so that your progress records are readable only by your own signed-in account.
            </p>
          </Section>

          <Section id="retention" title="8. How long we keep it">
            <p>
              We keep your account and progress data for as long as your account exists. If you delete your account, we remove your account record and associated progress data from our live systems within 30 days. Encrypted backups may retain a copy for up to a further 30 days before they are rotated out.
            </p>
            <p>
              An account that has been inactive for 24 months may be deleted, after we email you a warning to the address on the account.
            </p>
          </Section>

          <Section id="delete-account" title="9. Deleting your account and data">
            <p>
              You are in control of your data and can remove it at any time.
            </p>
            <div className="bg-[#f3f0ff] border border-[#ddd6fe] rounded-xl p-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-black mb-2">From inside the app</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Open <strong className="text-black font-semibold">Settings → Account → Delete account</strong>, then confirm. This deletes your account together with your progress, quiz results, and preferences.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-black mb-2">By email</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Write to{' '}
                  <a href={`mailto:${companyData.contact.email}`} className="text-[#7c3aed] font-medium hover:underline">
                    {companyData.contact.email}
                  </a>{' '}
                  from the address on your account, with the subject line &quot;Delete my {APP_DETAILS.name} account&quot;. We complete the request within 30 days and confirm when it is done.
                </p>
              </div>
            </div>
            <p>
              Deleting the app from your phone does not by itself delete your account, because your progress lives on our servers so it can be restored. Use one of the two routes above.
            </p>
          </Section>

          <Section id="your-rights" title="10. Your rights">
            <p>Depending on where you live, you can ask us to:</p>
            <Bullets
              items={[
                'Confirm what personal data we hold about you and provide a copy in a portable format.',
                'Correct information that is inaccurate or incomplete.',
                'Delete your account and personal data.',
                'Restrict or object to certain processing.',
                'Withdraw consent you previously gave, without affecting processing already carried out.',
              ]}
            />
            <p>
              Email{' '}
              <a href={`mailto:${companyData.contact.email}`} className="text-[#7c3aed] font-medium hover:underline">
                {companyData.contact.email}
              </a>{' '}
              and we will respond within 30 days. Users in Nigeria may complain to the Nigeria Data Protection Commission; users in the EU or UK may complain to their local supervisory authority.
            </p>
          </Section>

          <Section id="children" title="11. Children">
            <p>
              {APP_DETAILS.name} is designed for learners aged 13 and over and is not directed at children under 13. We do not knowingly create accounts for or collect personal information from children under 13. If you are a parent or guardian and believe your child has created an account, contact us at{' '}
              <a href={`mailto:${companyData.contact.email}`} className="text-[#7c3aed] font-medium hover:underline">
                {companyData.contact.email}
              </a>{' '}
              and we will delete the account and its data promptly.
            </p>
          </Section>

          <Section id="breach" title="12. Security incidents">
            <p>
              If a security incident affects your personal data, we will notify you and the relevant supervisory authority within the timeframes required by applicable law, and tell you what happened and what to do about it.
            </p>
          </Section>

          <Section id="changes" title="13. Changes to this policy">
            <p>
              We will update this page when the app&apos;s data practices change, and the date at the top will change with it. If a change is material — for example, if we begin collecting a new category of data — we will notify you in the app or by email before it takes effect.
            </p>
          </Section>

          <Section id="contact" title="14. Contact us">
            <p>Questions about this policy or about your data in {APP_DETAILS.name}:</p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-2 text-[15px]">
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
          <p className="text-sm text-gray-500">Looking for our website policy?</p>
          <div className="flex flex-wrap gap-6">
            <Link href="/privacy" className="text-sm font-semibold text-black hover:text-[#7c3aed] transition-colors duration-200">
              Website privacy policy
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
