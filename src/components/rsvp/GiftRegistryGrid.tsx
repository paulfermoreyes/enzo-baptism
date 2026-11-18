import { Check, Gift, PiggyBank } from 'lucide-react';
import type { RegistryItem } from '../../types/baptism';

interface GiftRegistryGridProps {
  items: RegistryItem[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  pledgeAmount: string;
  onPledgeAmountChange: (amount: string) => void;
}

export function GiftRegistryGrid({
  items,
  selectedId,
  onSelect,
  pledgeAmount,
  onPledgeAmountChange,
}: GiftRegistryGridProps) {
  return (
    <section aria-labelledby="registry-heading" className="mb-10">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container font-label text-sm font-semibold text-white">
            3
          </span>
          <div>
            <h2 id="registry-heading" className="font-display text-2xl font-medium text-primary">
              Baby Enzo’s Gift Registry
            </h2>
            <p className="font-body text-base text-ink-muted">
              Select an heirloom keepsake or contribute to his educational fund.
            </p>
          </div>
        </div>
        <span className="rounded-full bg-sky-soft px-3.5 py-1 font-label text-xs font-semibold text-primary-container">
          Optional Selection
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const isSelected = selectedId === item.id;
          return (
            <div
              key={item.id}
              className={`flex flex-col justify-between rounded-xl border p-5 transition-all ${
                isSelected
                  ? 'border-gold bg-sky-soft/45 shadow-sm'
                  : 'border-gold/30 bg-surface hover:border-gold/70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="font-label text-[11px] font-semibold uppercase tracking-wider text-secondary">
                    {item.category}
                  </span>
                  <span className="rounded-full bg-parchment border border-gold/35 px-2.5 py-0.5 font-label text-xs font-semibold text-primary-container">
                    {item.priceLabel}
                  </span>
                </div>

                <h3 className="font-display text-lg font-medium text-primary-container flex items-center gap-2">
                  {item.isFund ? (
                    <PiggyBank className="w-4 h-4 text-gold shrink-0" aria-hidden="true" />
                  ) : (
                    <Gift className="w-4 h-4 text-gold shrink-0" aria-hidden="true" />
                  )}
                  {item.title}
                </h3>

                <p className="mt-2 font-body text-sm text-ink-muted leading-relaxed">
                  {item.description}
                </p>

                {item.isFund && isSelected && (
                  <div className="mt-3">
                    <label
                      htmlFor="pledge-amount"
                      className="block font-label text-xs font-semibold text-primary-container mb-1"
                    >
                      Pledge Amount (Optional)
                    </label>
                    <input
                      id="pledge-amount"
                      type="text"
                      inputMode="decimal"
                      value={pledgeAmount}
                      onChange={(e) => onPledgeAmountChange(e.target.value)}
                      placeholder="e.g. $100 or ₱5,000"
                      className="celestial-input w-full rounded-lg border border-gold-light bg-white px-3 py-1.5 text-sm text-ink"
                    />
                  </div>
                )}
              </div>

              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelect(isSelected ? null : item.id)}
                className={`mt-4 min-h-10 w-full inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 font-label text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-gold text-primary'
                    : 'border border-gold/60 bg-parchment text-primary-container hover:bg-sky-soft/70'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
                {isSelected
                  ? item.isFund
                    ? 'Pledge Selected'
                    : 'Reserved by You'
                  : item.isFund
                    ? 'Click to Pledge'
                    : 'Click to Reserve'}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
