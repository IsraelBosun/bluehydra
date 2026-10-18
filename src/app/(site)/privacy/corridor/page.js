import Link from 'next/link';
import { companyData } from '@/lib/data';

const APP_DETAILS = {
  name: 'Corridor',
  bundleId: 'com.bluehydra.corridor',
};

export const metadata = {
  title: 'Corridor Privacy Policy | Bluehydra',
  description: 'Privacy policy for Corridor, the workplace carpool app by Bluehydra: what the app collects, who can see it, how long it is kept, and how to delete your account.',
};

const LAST_UPDATED = '18 October 2026';

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

function Mail() {
  return (
    <a href={`mailto:${companyData.contact.email}`} className="text-[#7c3aed] font-medium hover:underline">
      {companyData.contact.email}
    </a>
  );
}

const dataRows = [
  {
    type: 'Login',
    data: 'Your email address and password. The password is stored as a salted hash, never in plain text.',
    who: 'Only you.',
  },
  {
    type: 'Work email',
    data: 'Your work email address and its company domain, and a one-time code we email to it. You confirm it again every 60 days.',
    who: 'Only you. Nobody else in the app sees it.',
  },
  {
    type: 'Profile',
    data: 'The display name you choose, your initials, team, floor, whether you mostly drive or ride, and a description of your car if you drive.',
    who: 'Other verified members.',
  },
  {
    type: 'Drop off place',
    data: 'One place where you usually get off, with its map coordinates. Choosing a new one replaces it. There is no history.',
    who: 'The driver of a ride you take a seat on.',
  },
  {
    type: 'Rides you post',
    data: 'Where the ride starts and ends, the departure time and window, seats, car, your note, and the fuel contribution if you set one.',
    who: 'All members on the night. Afterwards, only the people on that ride.',
  },
  {
    type: 'Seats you take',
    data: 'Which ride you booked, when, and the time you said you were at the pickup point.',
    who: 'The driver and riders on that ride.',
  },
  {
    type: 'Trip chat',
    data: 'Messages you send in a ride’s chat.',
    who: 'The driver and riders on that ride.',
  },
  {
    type: 'Bank details',
    data: 'For drivers who ask for a fuel contribution: bank name, account number and account name.',
    who: 'Only riders on your paid ride, and only on the night of that ride.',
  },
  {
    type: 'Reports',
    data: 'The category and details you write when you report a problem on a ride, plus a record of that ride.',
    who: 'Bluehydra only. The person reported is never told who reported them.',
  },
  {
    type: 'Notifications',
    data: 'A push notification token for your phone.',
    who: 'Nobody. It is used to send you ride alerts.',
  },
];

export default function CorridorPrivacyPage() {
  return (
    <main className="pt-16 bg-white">

      {/* Hero */}
      <section className="px-6 lg:px-8 py-20 border-b border-gray-200">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#7c3aed] mb-6">
            iOS and Android App · Legal
          </p>
          <h1 className="text-4xl lg:text-5xl font-bold text-black tracking-tight leading-tight mb-6">
            {APP_DETAILS.name}<br />Privacy Policy
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            {APP_DETAILS.name} is a carpool app, published by {companyData.name}, for people who share a commute home from work. Drivers post the ride they are already making and colleagues take a seat. This policy explains what the app collects, who can see it, and what it never collects.
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
              ['No live tracking', 'Your location is only used for the dot on your own map. It is never stored or sent to us.'],
              ['No phone numbers', 'The app never asks for one, and refuses them in chats, notes and names.'],
              ['No adverts or data selling', 'No ad networks, no tracking SDKs, and we never sell your data.'],
              ['Delete any time', 'Delete your account from inside the app, under Account.'],
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
              {APP_DETAILS.name} (app id <code className="text-[13px] bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5 text-black">{APP_DETAILS.bundleId}</code>) is developed and published by {companyData.name}, a software development agency operating from Nigeria. We are the data controller for information collected through the app.
            </p>
            <p>Contact us at <Mail />.</p>
          </Section>

          <Section id="what-we-collect" title="2. What the app collects, and who can see it">
            <p>
              {APP_DETAILS.name} is only open to people with a verified work email, so everyone you ride with is a fellow professional. Here is everything we store, and who inside the app can see each part.
            </p>
            <div className="overflow-x-auto border border-gray-200 rounded-xl mt-6">
              <table className="w-full text-left text-sm min-w-[640px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-3 font-semibold text-black text-xs uppercase tracking-widest">Type</th>
                    <th className="px-5 py-3 font-semibold text-black text-xs uppercase tracking-widest">What we store</th>
                    <th className="px-5 py-3 font-semibold text-black text-xs uppercase tracking-widest">Who can see it</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dataRows.map((r) => (
                    <tr key={r.type} className="align-top">
                      <td className="px-5 py-4 font-medium text-black whitespace-nowrap">{r.type}</td>
                      <td className="px-5 py-4 text-gray-600">{r.data}</td>
                      <td className="px-5 py-4 text-gray-600">{r.who}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="pt-2">
              Some small things are kept only on your phone and never sent to us: where you last started a ride (to fill in the next one), your app theme, and whether you have seen the introduction.
            </p>
          </Section>

          <Section id="what-we-dont-collect" title="3. What the app does not collect">
            <p>
              {APP_DETAILS.name} does <strong className="text-black font-semibold">not</strong>:
            </p>
            <Bullets
              items={[
                'Track your live location. The app asks for location only to show where you are on your own map. That position stays in memory on your phone while the map is open. It is never stored, never sent to our servers, and never shown to anyone else.',
                'Ask for your phone number. Phone numbers are also refused in the trip chat, ride notes, car descriptions and display names, so they cannot leak through the app.',
                'Use profile photos. Your initials are your only avatar.',
                'Access your contacts, photos, camera, microphone or files.',
                'Contain advertising, ad SDKs or third-party analytics that track you.',
                'Sell, rent or share your personal information with data brokers or advertisers.',
                'Process payments. A fuel contribution is paid by the rider straight to the driver. Corridor never touches the money.',
              ]}
            />
          </Section>

          <Section id="how-we-use-it" title="4. How we use your information">
            <Bullets
              items={[
                'To create your account, sign you in, and confirm through your work email that you work where you say you do.',
                'To show tonight’s rides, let drivers post rides and riders take seats, and let people on the same ride chat and find each other.',
                'To show a rider the driver’s bank details for a paid ride, so they can pay the fuel contribution directly.',
                'To send ride alerts, such as a seat being taken, a ride leaving, or a ride being cancelled.',
                'To investigate reports, keep a safety record of rides, and block people or company domains that break the rules.',
                'To answer you when you contact support.',
              ]}
            />
            <p>
              We do not use your information to build advertising profiles, and we do not make automated decisions that have legal or similarly significant effects on you.
            </p>
          </Section>

          <Section id="legal-basis" title="5. Our legal basis">
            <p>
              Where the Nigeria Data Protection Act 2023 or the UK/EU GDPR applies, we process your data to provide the service you signed up for (contract), on your consent where you give it (for example, location and notification permissions), and in our legitimate interest in keeping riders and drivers safe and the service secure.
            </p>
          </Section>

          <Section id="third-parties" title="6. Services the app relies on">
            <p>
              We use a small number of providers to run {APP_DETAILS.name}. Each receives only what it needs for its job.
            </p>
            <Bullets
              items={[
                <><strong className="text-black font-semibold">Supabase</strong> hosts the accounts and database, on our behalf and under contract.</>,
                <><strong className="text-black font-semibold">Mapbox</strong> draws the maps and helps with place search and routes. It receives the map area on screen and the text you type into search.</>,
                <><strong className="text-black font-semibold">Photon (Komoot)</strong>, an OpenStreetMap search, also helps with place search. It receives only the text you type and a fixed point in Lagos, nothing about you.</>,
                <><strong className="text-black font-semibold">Expo, Apple and Google</strong> deliver push notifications and app updates. They receive your phone&apos;s notification token and the alert text.</>,
                <><strong className="text-black font-semibold">Google (Gmail)</strong> sends the work email verification code, so it handles your work email address and that code.</>,
                <><strong className="text-black font-semibold">Google Maps</strong> opens only when a driver taps for directions. The ride&apos;s stops are passed to Google Maps at that moment.</>,
              ]}
            />
            <p>
              Beyond that, we share information only where the law requires it, or where it is needed to establish, exercise or defend a legal claim, including a safety incident on a ride. If {companyData.name} is ever acquired, data may transfer to the acquirer under the same commitments in this policy, and we will tell you before that happens.
            </p>
          </Section>

          <Section id="storage" title="7. Where your data is stored and how it is protected">
            <p>
              Data is held on servers operated by our providers, which may be outside Nigeria, including in the European Union or the United States. Transfers rely on the safeguards those providers offer, such as standard contractual clauses.
            </p>
            <p>
              All traffic between the app and our servers is encrypted with TLS. Database access is controlled by row-level security rules, so the app can only read what the table in section 2 allows. Bank details and old rides, for example, are refused to anyone not entitled to them. A small number of authorised {companyData.name} staff can access records to investigate reports and keep the service safe.
            </p>
          </Section>

          <Section id="retention" title="8. How long we keep it">
            <p>
              Your profile, rides, seats, chat messages and bank details are kept while your account exists, so the people on a ride keep a record of it. Your drop off place has no history: each change replaces the last one.
            </p>
            <p>
              For safety, we keep a private record of each ride (who drove, who rode, the car, and where it started and ended) and any reports, even after an account is deleted. These records are readable by nobody in the app, only by authorised {companyData.name} staff, and exist so that a problem on a ride can be looked into later.
            </p>
          </Section>

          <Section id="delete-account" title="9. Deleting your account and data">
            <div className="bg-[#f3f0ff] border border-[#ddd6fe] rounded-xl p-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-black mb-2">From inside the app</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Open <strong className="text-black font-semibold">Account → Delete my account</strong>, then confirm. If you have a ride posted or a seat booked tonight, cancel it or give it up first, so nobody is left waiting.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-black mb-2">By email</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Write to <Mail /> from the address on your account, with the subject line &quot;Delete my {APP_DETAILS.name} account&quot;. We complete the request within 30 days and confirm when it is done.
                </p>
              </div>
            </div>
            <p>
              Deleting removes at once your profile, your rides, your seats, your chat messages, your bank details, your verified work email and any pending code. The safety records and reports described in section 8 are kept, and so is any block on your account, so deleting and signing up again is not a way round a block.
            </p>
            <p>
              Your login (email and password) is not deleted by this, because the same login can sign you in to other {companyData.name} apps. To remove the login too, email us as above. Uninstalling the app does not delete your account.
            </p>
          </Section>

          <Section id="your-rights" title="10. Your rights">
            <p>Depending on where you live, you can ask us to:</p>
            <Bullets
              items={[
                'Confirm what personal data we hold about you and give you a copy in a portable format.',
                'Correct information that is inaccurate or incomplete.',
                'Delete your account and personal data, subject to the safety records in section 8.',
                'Restrict or object to certain processing.',
                'Withdraw consent you gave, without affecting processing already carried out.',
              ]}
            />
            <p>
              Email <Mail /> and we will respond within 30 days. Users in Nigeria may complain to the Nigeria Data Protection Commission; users in the EU or UK may complain to their local supervisory authority.
            </p>
          </Section>

          <Section id="children" title="11. Age">
            <p>
              {APP_DETAILS.name} is for working adults aged 18 and over with a work email. It is not directed at children, and we do not knowingly collect information from anyone under 18. If you believe a child has an account, contact us at <Mail /> and we will delete it.
            </p>
          </Section>

          <Section id="breach" title="12. Security incidents">
            <p>
              If a security incident affects your personal data, we will notify you and the relevant supervisory authority within the timeframes required by law, and tell you what happened and what to do about it.
            </p>
          </Section>

          <Section id="changes" title="13. Changes to this policy">
            <p>
              We will update this page when the app&apos;s data practices change, and the date at the top will change with it. If a change is material, for example if we begin collecting a new kind of data or use a new provider that receives ride or chat data, we will tell you in the app or by email before it takes effect.
            </p>
          </Section>

          <Section id="contact" title="14. Contact us">
            <p>Questions about this policy or about your data in {APP_DETAILS.name}:</p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-2 text-[15px]">
              <p className="text-black font-semibold">{companyData.name}</p>
              <p><Mail /></p>
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
          <p className="text-sm text-gray-500">Need help with the app?</p>
          <div className="flex flex-wrap gap-6">
            <Link href="/support/corridor" className="text-sm font-semibold text-black hover:text-[#7c3aed] transition-colors duration-200">
              Corridor support
            </Link>
            <Link href="/privacy" className="text-sm font-semibold text-black hover:text-[#7c3aed] transition-colors duration-200">
              Website privacy policy
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
