import { Baby, Gift, Shirt, Video } from 'lucide-react';
import { FAQ_ITEMS } from '../../data/baptismData';

const ICONS: Record<string, typeof Shirt> = {
  attire: Shirt,
  gifts: Gift,
  children: Baby,
  livestream: Video,
};

export function FaqSection() {
  return (
    <section aria-labelledby="faq-heading" className="mx-auto max-w-4xl py-8">
      <div className="text-center mb-8">
        <span className="font-label text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
          Celebration Information
        </span>
        <h2
          id="faq-heading"
          className="mt-2 font-display text-3xl sm:text-4xl font-medium text-primary"
        >
          Everything You Need to Know
        </h2>
        <p className="mt-2 font-body text-lg text-ink-muted">
          To ensure a peaceful, joyful morning for Baby Enzo and all our cherished guests.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {FAQ_ITEMS.map((item) => {
          const Icon = ICONS[item.id] ?? Shirt;
          return (
            <article
              key={item.id}
              className="rounded-2xl border border-gold/35 bg-parchment p-6 shadow-sm hover:border-gold/70 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-soft text-primary-container border border-gold/25">
                  <Icon className="w-5 h-5 text-primary-container" aria-hidden="true" />
                </span>
                <span className="rounded-full bg-sky-soft px-3 py-1 font-label text-xs font-semibold text-primary-container">
                  {item.badge}
                </span>
              </div>
              <h3 className="font-display text-xl font-medium text-primary-container">
                {item.title}
              </h3>
              <p className="mt-2 font-body text-base text-ink-muted leading-relaxed">
                {item.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
