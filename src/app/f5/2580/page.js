import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const STATUS = {
  selected:     { label: 'Selected',     bg: 'bg-green-100',  text: 'text-green-700'  },
  not_selected: { label: 'Not selected', bg: 'bg-red-100',    text: 'text-red-600'    },
  ack_sent:     { label: 'Ack sent',     bg: 'bg-blue-100',   text: 'text-blue-700'   },
  pending:      { label: 'Pending',      bg: 'bg-amber-100',  text: 'text-amber-700'  },
};

function Badge({ type }) {
  const s = STATUS[type];
  return (
    <span className={`inline-block text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

function Field({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{value}</p>
    </div>
  );
}

export default async function ApplicationsPage() {
  const { data: applications, error } = await supabase
    .from('founders_five_applications')
    .select('*')
    .order('sn', { ascending: true });

  if (error) {
    return <div className="p-8 text-red-600">Failed to load: {error.message}</div>;
  }

  const total       = applications.length;
  const ackSent     = applications.filter(a => a.acknowledge_sent_at).length;
  const resultsSent = applications.filter(a => a.results_sent_at).length;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-[#09051e] px-5 py-6 sticky top-0 z-10">
        <p className="text-xs font-bold tracking-widest uppercase text-[#7c3aed] mb-1">Bluehydra</p>
        <h1 className="text-lg font-bold text-white">Founders' Five — Applications</h1>
        <div className="flex flex-wrap gap-3 mt-3">
          <span className="text-xs text-gray-400">{total} total</span>
          <span className="text-xs text-gray-400">·</span>
          <span className="text-xs text-gray-400">{ackSent} ack sent</span>
          <span className="text-xs text-gray-400">·</span>
          <span className="text-xs text-gray-400">{resultsSent} results sent</span>
        </div>
      </div>

      {/* Cards */}
      <div className="px-4 py-5 space-y-4 max-w-2xl mx-auto">
        {applications.map((a) => {
          const statusType = a.results_sent_at
            ? (a.results_sent_at && a.acknowledge_sent_at ? 'selected' : 'not_selected')
            : a.acknowledge_sent_at
            ? 'ack_sent'
            : 'pending';

          const resolvedStatus = (() => {
            if (a.results_sent_at) return 'selected';
            if (a.acknowledge_sent_at) return 'ack_sent';
            return 'pending';
          })();

          return (
            <div key={a.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

              {/* Card header */}
              <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">#{a.sn}</p>
                  <p className="font-bold text-black text-base leading-tight">{a.name}</p>
                  <p className="text-sm text-[#7c3aed] font-semibold mt-0.5">{a.business_name}</p>
                </div>
                <Badge type={resolvedStatus} />
              </div>

              {/* Card body */}
              <div className="px-5 py-4 space-y-4">
                <Field label="What they do" value={a.business_description} />
                <Field label="Who they serve" value={a.customers} />
                <Field label="Why they want a site" value={a.why_pick} />

                {(a.existing_website) && (
                  <Field label="Existing website" value={a.existing_website} />
                )}

                {/* Contact row */}
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1.5">Contact</p>
                  <div className="flex flex-wrap gap-2">
                    {a.whatsapp && (
                      <a href={`https://wa.me/${a.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-green-500 hover:bg-green-600 px-3 py-1.5 rounded-lg transition-colors">
                        WhatsApp
                      </a>
                    )}
                    {a.email && (
                      <a href={`mailto:${a.email}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#7c3aed] hover:bg-[#6d28d9] px-3 py-1.5 rounded-lg transition-colors">
                        {a.email}
                      </a>
                    )}
                  </div>
                </div>

                {/* Social */}
                {a.social_link && (
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">
                      {a.social_platform || 'Social'}
                    </p>
                    <p className="text-sm text-gray-700 break-all">{a.social_link}</p>
                  </div>
                )}

                {/* Submitted */}
                <p className="text-[11px] text-gray-400">
                  Submitted {new Date(a.submitted_at).toLocaleDateString('en-NG', {
                    day: 'numeric', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
