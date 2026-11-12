import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Page, Paragraphs, Scripture, TopBar, toast } from '@/components/ui';
import { PRAYERS, PRAYER_CATEGORIES, prayerById } from '@/content/prayers';
import { useStore } from '@/lib/store';
import { useToday } from '@/lib/hooks';

export default function PrayerDetail() {
  const { id } = useParams();
  const p = prayerById(id ?? '');
  const today = useToday();
  const intention = useStore((s) => s.profile.customGoal);
  const upsertJournal = useStore((s) => s.upsertJournal);
  const related = useMemo(() => PRAYERS.filter((x) => x.category === p?.category && x.id !== p?.id).slice(0, 4), [p]);
  if (!p) return <Page><TopBar title="Prayer not found" /></Page>;
  const text = p.text.replace('[set your intention]', intention ? intention.charAt(0).toLowerCase() + intention.slice(1) : 'live this day faithfully with you');

  return (
    <Page>
      <TopBar title={PRAYER_CATEGORIES.find((c) => c.id === p.category)?.label} />
      <article className="card card-pad !p-7">
        {p.latinTitle && <p className="eyebrow text-center">{p.latinTitle}</p>}
        <h1 className="display mt-1 text-center text-[2.3rem] leading-tight">{p.title}</h1>
        {p.subtitle && <p className="mt-1 text-center text-sm text-ink-soft">{p.subtitle}</p>}
        <div className="mx-auto my-6 h-px w-16 bg-gold/50" />
        <Paragraphs text={text} className="serif text-[1.35rem] leading-[1.65] text-ink" />
      </article>
      {p.note && <p className="mt-4 px-2 text-sm text-ink-soft">{p.note}</p>}
      {p.ref && (
        <div className="card card-pad mt-4">
          <p className="eyebrow mb-3">Scripture</p>
          <Scripture refId={p.ref} size="sm" />
        </div>
      )}
      <button
        className="btn-primary mt-5 w-full"
        onClick={() => {
          upsertJournal({ type: 'reflection', title: `Prayed: ${p.title}`, body: `I prayed the ${p.title} today.`, date: today });
          toast('Amen. Noted in your journal.');
        }}
      >
        <Check size={17} /> Amen — I prayed this
      </button>
      {related.length > 0 && (
        <section className="mt-8">
          <p className="eyebrow mb-2 px-1">More prayers</p>
          <div className="grid grid-cols-2 gap-2">
            {related.map((r) => (
              <Link key={r.id} to={`/faith/prayers/${r.id}`} className="card !rounded-2xl p-4 text-sm font-medium">
                {r.title}
              </Link>
            ))}
          </div>
        </section>
      )}
    </Page>
  );
}
