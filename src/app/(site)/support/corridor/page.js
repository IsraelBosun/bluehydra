import Link from 'next/link';
import { companyData } from '@/lib/data';

export const metadata = {
  title: 'Corridor Support | Bluehydra',
  description: 'Help with Corridor, the workplace carpool app by Bluehydra: signing up with your work email, posting and booking rides, fuel contributions, reporting a problem, and deleting your account.',
};

function Mail({ subject }) {
  const href = subject
    ? `mailto:${companyData.contact.email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${companyData.contact.email}`;
  return (
    <a href={href} className="text-[#7c3aed] font-medium hover:underline">
      {companyData.contact.email}
    </a>
  );
}

function Path({ children }) {
  return <strong className="text-black font-semibold">{children}</strong>;
}

const groups = [
  {
    id: 'getting-started',
    title: 'Getting started',
    items: [
      {
        q: 'Why do I need a work email?',
        a: <p>Corridor is only for people who commute to work, so every member confirms where they work. Enter your company address (you@yourcompany.com) and type in the code we email you. Personal addresses like Gmail or Yahoo will not work. Your work email is never shown to anyone else.</p>,
      },
      {
        q: 'My verification code has not arrived.',
        a: <p>Check your spam or junk folder, and that the address is spelled correctly. You can ask for a new code after a minute. Some company mail systems hold outside email for a while, so if it still has not arrived, ask your IT team or email us.</p>,
      },
      {
        q: 'Why is the app asking me to confirm my work email again?',
        a: <p>Every member confirms their work email every 60 days. It keeps Corridor to people who still work where they said they do. If you change jobs, confirm your new work email instead.</p>,
      },
      {
        q: 'I forgot my password.',
        a: <p>On the sign in screen, tap <Path>Forgot your password?</Path>. We email you a code, then you choose a new password in the app.</p>,
      },
    ],
  },
  {
    id: 'rides',
    title: 'Rides',
    items: [
      {
        q: 'How do I offer a ride?',
        a: <p>Set yourself as a driver in <Path>Account</Path>, then post tonight&apos;s ride: where you start, where you are going, when you leave (with a give or take), how many seats, and your car so riders can spot it. You can post one ride a night and edit it until you leave.</p>,
      },
      {
        q: 'How do I get a seat?',
        a: <p>Set yourself as a rider in <Path>Account</Path>, choose where you get off, and pick a ride heading your way. You can hold one seat a night. Once you have a seat, the ride&apos;s chat opens so you can find each other.</p>,
      },
      {
        q: 'How do fuel contributions work?',
        a: <p>A driver can ask each rider for a fuel contribution, shown in naira on the ride before you book. You pay the driver directly by bank transfer. Corridor never handles the money. Drivers add their bank details under <Path>Account → Bank details</Path>, and they are shown only to riders on that night&apos;s paid ride. A problem with a payment can be reported from the ride.</p>,
      },
      {
        q: 'Why can I not put my phone number in the chat?',
        a: <p>Phone numbers are blocked in chats, ride notes, car descriptions and names, so they never spread beyond the people you choose to give them to. Use the trip chat to coordinate the pickup.</p>,
      },
      {
        q: 'Does Corridor track where I am?',
        a: <p>No. If you allow location, your position shows as a dot on your own map, and that is all. It is never stored, sent to us, or shown to anyone else. Corridor works without it. See the <Link href="/privacy/corridor" className="text-[#7c3aed] font-medium hover:underline">privacy policy</Link> for details.</p>,
      },
      {
        q: 'I am not getting ride alerts.',
        a: <p>Check that notifications are turned on for Corridor in your phone&apos;s settings. Alerts cover things like a seat being taken, your ride leaving, or a ride being cancelled.</p>,
      },
    ],
  },
  {
    id: 'safety',
    title: 'Safety',
    items: [
      {
        q: 'How do I report a problem on a ride?',
        a: (
          <>
            <p>Open the ride and tap <Path>Report a problem</Path>. Choose what happened (unsafe driving, harassment or threats, inappropriate messages, did not show up, a problem with the fuel contribution, or something else) and add details if you want.</p>
            <p>Reports come straight to the Corridor team along with a record of the ride. Nobody on the ride is told, and the person you report never learns who reported them. We can block a person, or a whole company, from Corridor.</p>
          </>
        ),
      },
      {
        q: 'What if I am in danger?',
        a: <p>A report is not an emergency service. If you are in danger, call <Path>112</Path> first, then report the ride when you are safe.</p>,
      },
    ],
  },
  {
    id: 'account',
    title: 'Your account',
    items: [
      {
        q: 'How do I delete my account?',
        a: (
          <>
            <p>Open <Path>Account → Delete my account</Path> and confirm. If you have a ride posted or a seat booked tonight, cancel it or give it up first. This deletes your profile, rides, seats, messages, bank details and work email.</p>
            <p>A private safety record of past rides and any reports are kept, as the <Link href="/privacy/corridor#retention" className="text-[#7c3aed] font-medium hover:underline">privacy policy</Link> explains. Your login is kept too, because it can also sign you in to other {companyData.name} apps. To remove the login as well, or if you can no longer open the app, email <Mail subject="Delete my Corridor account" /> from the address on your account.</p>
          </>
        ),
      },
      {
        q: 'Can I switch between driving and riding?',
        a: <p>Yes, in <Path>Account</Path>. You cannot switch while you have a ride posted or a seat booked tonight, so cancel or give it up first.</p>,
      },
    ],
  },
];

export default function CorridorSupportPage() {
  return (
    <main className="pt-16 bg-white">

      {/* Hero */}
      <section className="px-6 lg:px-8 py-20 border-b border-gray-200">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#7c3aed] mb-6">
            iOS and Android App · Support
          </p>
          <h1 className="text-4xl lg:text-5xl font-bold text-black tracking-tight leading-tight mb-6">
            Corridor<br />Support
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            Corridor helps colleagues share the ride home. Drivers post the trip they are already making, riders take a seat. Answers to common questions are below. If you are stuck, write to us and a person will reply.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a
              href={`mailto:${companyData.contact.email}?subject=${encodeURIComponent('Corridor support')}`}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#7c3aed] text-white text-sm font-semibold hover:bg-[#6d28d9] transition-colors duration-200"
            >
              Email support
            </a>
            <Link
              href="/privacy/corridor"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-gray-300 text-black text-sm font-semibold hover:border-[#7c3aed] hover:text-[#7c3aed] transition-colors duration-200"
            >
              Privacy policy
            </Link>
          </div>
        </div>
      </section>

      {/* Jump links */}
      <section className="px-6 lg:px-8 py-8 border-b border-gray-200 bg-gray-50">
        <div className="max-w-3xl mx-auto flex flex-wrap gap-x-6 gap-y-3">
          {groups.map((g) => (
            <a key={g.id} href={`#${g.id}`} className="text-sm font-semibold text-gray-600 hover:text-[#7c3aed] transition-colors duration-200">
              {g.title}
            </a>
          ))}
          <a href="#contact" className="text-sm font-semibold text-gray-600 hover:text-[#7c3aed] transition-colors duration-200">
            Contact
          </a>
        </div>
      </section>

      {/* Questions */}
      <section className="px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto space-y-14">
          {groups.map((g) => (
            <section key={g.id} id={g.id} className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-black tracking-tight mb-5">{g.title}</h2>
              <div className="border border-gray-200 rounded-xl divide-y divide-gray-200">
                {g.items.map((item) => (
                  <details key={item.q} className="group">
                    <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 py-4 text-[15px] font-semibold text-black hover:text-[#7c3aed] transition-colors duration-200 [&::-webkit-details-marker]:hidden">
                      <span>{item.q}</span>
                      <span className="text-[#7c3aed] text-lg leading-none flex-shrink-0 transition-transform duration-200 group-open:rotate-45">+</span>
                    </summary>
                    <div className="px-5 pb-5 space-y-3 text-[15px] text-gray-600 leading-relaxed">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}

          <section id="contact" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-black tracking-tight mb-5">Contact us</h2>
            <div className="bg-[#f3f0ff] border border-[#ddd6fe] rounded-xl p-6 space-y-3 text-[15px] text-gray-600 leading-relaxed">
              <p>
                Email <Mail subject="Corridor support" /> with the email you use for Corridor and, if it is about a ride, the four character ride code. A person reads every message.
              </p>
              <p>
                Or call{' '}
                <a href={`tel:${companyData.contact.phone}`} className="text-[#7c3aed] font-medium hover:underline">
                  {companyData.contact.phone}
                </a>.
              </p>
              <p className="text-sm text-gray-500">Corridor is made by {companyData.name}.</p>
            </div>
          </section>
        </div>
      </section>

    </main>
  );
}
