import { useId, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  Gift,
  Loader2,
  Pencil,
  PiggyBank,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import {
  addRegistryItem,
  clearRegistryReservations,
  deleteRegistryItem,
  updateRegistryItem,
  type RegistryItemInput,
} from '../../services/baptismService';
import type { GuestRecord, RegistryItem, RsvpSubmission } from '../../types/baptism';
import { ModalDialog } from '../ui/ModalDialog';
import { StationeryCard } from '../ui/StationeryCard';

interface RegistryManagerProps {
  items: RegistryItem[];
  guests: GuestRecord[];
  rsvps: RsvpSubmission[];
  onStatus: (message: string) => void;
  onError: (message: string) => void;
}

const DEFAULT_CATEGORIES = [
  'Heirloom Keepsake',
  'Sacramental Classic',
  'Sensory & Play',
  'Daily Essentials',
  'Nursery & Care',
  'Future Dreams Fund',
];

const EMPTY_FORM: RegistryItemInput = {
  category: '',
  title: '',
  priceLabel: '',
  description: '',
  isFund: false,
  allowMultiple: false,
};

export function RegistryManager({
  items,
  guests,
  rsvps,
  onStatus,
  onError,
}: RegistryManagerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RegistryItem | null>(null);
  const [form, setForm] = useState<RegistryItemInput>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [busyItemId, setBusyItemId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RegistryItem | null>(null);

  // Field-level post-interaction invalid state
  const [titleInvalid, setTitleInvalid] = useState(false);
  const [categoryInvalid, setCategoryInvalid] = useState(false);
  const [priceInvalid, setPriceInvalid] = useState(false);
  const [descriptionInvalid, setDescriptionInvalid] = useState(false);
  const [liveMessage, setLiveMessage] = useState('');

  const titleRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const tableCaptionId = useId();
  const formHeadingId = useId();
  const categoryListId = useId();
  const titleId = useId();
  const titleErrorId = useId();
  const categoryId = useId();
  const categoryErrorId = useId();
  const priceId = useId();
  const priceErrorId = useId();
  const descriptionId = useId();
  const descriptionErrorId = useId();
  const allowMultipleId = useId();
  const isFundId = useId();

  const guestNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const g of guests) {
      map.set(g.id, g.displayName);
    }
    for (const r of rsvps) {
      if (!map.has(r.guestId)) {
        map.set(r.guestId, r.guestName);
      }
    }
    return map;
  }, [guests, rsvps]);

  const categorySuggestions = useMemo(() => {
    const set = new Set(DEFAULT_CATEGORIES);
    for (const item of items) {
      if (item.category.trim()) {
        set.add(item.category.trim());
      }
    }
    return Array.from(set);
  }, [items]);

  const resetValidation = () => {
    setTitleInvalid(false);
    setCategoryInvalid(false);
    setPriceInvalid(false);
    setDescriptionInvalid(false);
    setLiveMessage('');
  };

  const openAddModal = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    resetValidation();
    setModalOpen(true);
  };

  const openEditModal = (item: RegistryItem) => {
    setEditingItem(item);
    setForm({
      category: item.category,
      title: item.title,
      priceLabel: item.priceLabel,
      description: item.description,
      isFund: item.isFund,
      allowMultiple: item.allowMultiple,
    });
    resetValidation();
    setModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setModalOpen(false);
    setEditingItem(null);
  };

  const validateField = (
    value: string,
    setInvalid: (val: boolean) => void,
    errorText: string
  ) => {
    const invalid = !value.trim();
    setInvalid(invalid);
    if (invalid) {
      setLiveMessage(errorText);
    }
    return !invalid;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isTitleOk = validateField(form.title, setTitleInvalid, 'Title is required.');
    const isCategoryOk = validateField(form.category, setCategoryInvalid, 'Category is required.');
    const isPriceOk = validateField(
      form.priceLabel,
      setPriceInvalid,
      'Price or label is required.'
    );
    const isDescOk = validateField(
      form.description,
      setDescriptionInvalid,
      'Description is required.'
    );

    if (!isTitleOk) {
      titleRef.current?.focus();
      return;
    }
    if (!isCategoryOk) {
      categoryRef.current?.focus();
      return;
    }
    if (!isPriceOk) {
      priceRef.current?.focus();
      return;
    }
    if (!isDescOk) {
      descriptionRef.current?.focus();
      return;
    }

    setIsSaving(true);
    try {
      if (editingItem) {
        await updateRegistryItem(editingItem.id, form);
        onStatus(`Updated "${form.title.trim()}" in the gift registry.`);
      } else {
        await addRegistryItem(form);
        onStatus(`Added "${form.title.trim()}" to the gift registry.`);
      }
      setModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to save registry item.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearReservations = async (item: RegistryItem) => {
    setBusyItemId(item.id);
    try {
      await clearRegistryReservations(item.id);
      onStatus(`Cleared reservations for "${item.title}".`);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to clear reservations.');
    } finally {
      setBusyItemId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setBusyItemId(target.id);
    try {
      await deleteRegistryItem(target.id);
      onStatus(`Removed "${target.title}" from the gift registry.`);
      setDeleteTarget(null);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to remove registry item.');
    } finally {
      setBusyItemId(null);
    }
  };

  const getReservationSummary = (item: RegistryItem) => {
    if (item.allowMultiple) {
      const ids = item.reservedByGuestIds ?? [];
      if (ids.length === 0) {
        return { hasReservations: false, label: 'Open for pledges', names: [] as string[] };
      }
      const names = ids.map((id) => guestNameById.get(id) ?? id);
      return {
        hasReservations: true,
        label: `${ids.length} ${ids.length === 1 ? 'pledge' : 'pledges'}`,
        names,
      };
    }

    if (item.reservedByGuestId) {
      const name = guestNameById.get(item.reservedByGuestId) ?? item.reservedByGuestId;
      return { hasReservations: true, label: 'Reserved', names: [name] };
    }

    return { hasReservations: false, label: 'Available', names: [] as string[] };
  };

  const reservedItemCount = items.filter((item) =>
    item.allowMultiple
      ? (item.reservedByGuestIds?.length ?? 0) > 0
      : Boolean(item.reservedByGuestId)
  ).length;

  return (
    <StationeryCard>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="font-display text-2xl text-primary">Gift Registry</h2>
          <p className="font-label text-xs text-ink-muted mt-0.5">
            {items.length} {items.length === 1 ? 'item' : 'items'} • {reservedItemCount} reserved or
            pledged
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="min-h-11 inline-flex items-center justify-center gap-1.5 rounded-full bg-gold px-5 py-2 font-label text-xs font-semibold uppercase tracking-wider text-primary hover:bg-gold-bright/90 cursor-pointer"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Add Registry Item
        </button>
      </div>

      <div
        tabIndex={0}
        role="region"
        aria-labelledby={tableCaptionId}
        className="admin-table-wrapper"
      >
        <table className="admin-table w-full text-left">
          <caption id={tableCaptionId} className="visually-hidden">
            Gift registry items and reservation status
          </caption>
          <thead>
            <tr className="border-b border-gold/30 font-label text-xs uppercase tracking-wider text-secondary">
              <th scope="col" className="py-2.5 pr-4">
                Item
              </th>
              <th scope="col" className="py-2.5 pr-4">
                Category
              </th>
              <th scope="col" className="py-2.5 pr-4">
                Price / Label
              </th>
              <th scope="col" className="py-2.5 pr-4">
                Type
              </th>
              <th scope="col" className="py-2.5 pr-4">
                Status
              </th>
              <th scope="col" className="py-2.5 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/15 font-body text-base">
            {items.map((item) => {
              const reservation = getReservationSummary(item);
              const isBusy = busyItemId === item.id;

              return (
                <tr key={item.id}>
                  <th scope="row" className="py-3 pr-4 align-top font-normal">
                    <div className="flex items-start gap-2">
                      {item.isFund ? (
                        <PiggyBank
                          className="w-4 h-4 text-gold shrink-0 mt-1"
                          aria-hidden="true"
                        />
                      ) : (
                        <Gift className="w-4 h-4 text-gold shrink-0 mt-1" aria-hidden="true" />
                      )}
                      <div>
                        <p className="font-medium text-primary-container leading-snug">
                          {item.title}
                        </p>
                        <p className="text-sm text-ink-muted line-clamp-2 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </th>
                  <td data-label="Category" className="py-3 pr-4 align-top text-sm text-ink-muted">
                    {item.category}
                  </td>
                  <td
                    data-label="Price / Label"
                    className="py-3 pr-4 align-top font-label text-xs font-semibold text-primary-container whitespace-nowrap"
                  >
                    {item.priceLabel}
                  </td>
                  <td data-label="Type" className="py-3 pr-4 align-top">
                    <span className="inline-block rounded-full border border-gold/35 bg-parchment px-2.5 py-0.5 font-label text-[11px] font-semibold text-secondary whitespace-nowrap">
                      {item.isFund
                        ? 'Monetary Fund'
                        : item.allowMultiple
                          ? 'Multi-Pledge'
                          : 'Single Claim'}
                    </span>
                  </td>
                  <td data-label="Status" className="py-3 pr-4 align-top">
                    {reservation.hasReservations ? (
                      <div>
                        <span className="inline-block rounded-full bg-sky-soft px-2.5 py-0.5 font-label text-xs font-semibold text-primary-container">
                          {reservation.label}
                        </span>
                        <p className="mt-1 font-label text-xs text-ink-muted">
                          {reservation.names.join(', ')}
                        </p>
                      </div>
                    ) : (
                      <span className="font-label text-xs text-ink-muted">{reservation.label}</span>
                    )}
                  </td>
                  <td data-label="Actions" className="py-3 align-top text-right whitespace-nowrap">
                    <div className="inline-flex flex-wrap items-center justify-end gap-3">
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => openEditModal(item)}
                        className="inline-flex items-center gap-1 font-label text-xs font-semibold text-primary-container hover:underline disabled:opacity-50 cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                        Edit
                      </button>
                      {reservation.hasReservations && (
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => void handleClearReservations(item)}
                          className="inline-flex items-center gap-1 font-label text-xs font-semibold text-secondary hover:underline disabled:opacity-50 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                          Clear
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => setDeleteTarget(item)}
                        className="inline-flex items-center gap-1 font-label text-xs font-semibold text-error hover:underline disabled:opacity-50 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-ink-muted">
                  No registry items yet. Click “Add Registry Item” or “Seed Initial Data”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Registry Item Modal */}
      <ModalDialog
        open={modalOpen}
        onClose={closeModal}
        title={editingItem ? 'Edit Registry Item' : 'Add Registry Item'}
      >
        <form
          onSubmit={(e) => void handleSave(e)}
          noValidate
          aria-labelledby={formHeadingId}
          className="space-y-4"
        >
          <span id={formHeadingId} className="visually-hidden">
            {editingItem ? 'Edit Registry Item Form' : 'Add Registry Item Form'}
          </span>
          <div aria-live="polite" className="visually-hidden">
            {liveMessage}
          </div>

          <div>
            <label
              htmlFor={titleId}
              className="block font-label text-xs font-semibold uppercase tracking-wider text-primary-container mb-1"
            >
              Gift Title <span aria-hidden="true">*</span>
            </label>
            <input
              ref={titleRef}
              id={titleId}
              name="title"
              type="text"
              required
              maxLength={120}
              value={form.title}
              aria-invalid={titleInvalid ? 'true' : 'false'}
              aria-describedby={titleInvalid ? titleErrorId : undefined}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, title: e.target.value }));
                if (titleInvalid && e.target.value.trim()) {
                  setTitleInvalid(false);
                }
              }}
              onBlur={() => validateField(form.title, setTitleInvalid, 'Title is required.')}
              placeholder="e.g. Engraved Wooden Memory Box"
              className={`celestial-input w-full rounded-lg border border-gold-light bg-white px-3.5 py-2 text-ink ${
                titleInvalid ? 'user-invalid-fallback' : ''
              }`}
            />
            <div
              id={titleErrorId}
              className="field-error items-center gap-1.5 mt-1 font-label text-xs font-semibold text-error"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Please enter a gift title.</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor={categoryId}
                className="block font-label text-xs font-semibold uppercase tracking-wider text-primary-container mb-1"
              >
                Category <span aria-hidden="true">*</span>
              </label>
              <input
                ref={categoryRef}
                id={categoryId}
                name="category"
                type="text"
                list={categoryListId}
                required
                maxLength={60}
                value={form.category}
                aria-invalid={categoryInvalid ? 'true' : 'false'}
                aria-describedby={categoryInvalid ? categoryErrorId : undefined}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, category: e.target.value }));
                  if (categoryInvalid && e.target.value.trim()) {
                    setCategoryInvalid(false);
                  }
                }}
                onBlur={() =>
                  validateField(form.category, setCategoryInvalid, 'Category is required.')
                }
                placeholder="e.g. Heirloom Keepsake"
                className={`celestial-input w-full rounded-lg border border-gold-light bg-white px-3.5 py-2 text-ink ${
                  categoryInvalid ? 'user-invalid-fallback' : ''
                }`}
              />
              <datalist id={categoryListId}>
                {categorySuggestions.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
              <div
                id={categoryErrorId}
                className="field-error items-center gap-1.5 mt-1 font-label text-xs font-semibold text-error"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Please enter a category.</span>
              </div>
            </div>

            <div>
              <label
                htmlFor={priceId}
                className="block font-label text-xs font-semibold uppercase tracking-wider text-primary-container mb-1"
              >
                Price / Label <span aria-hidden="true">*</span>
              </label>
              <input
                ref={priceRef}
                id={priceId}
                name="priceLabel"
                type="text"
                required
                maxLength={40}
                value={form.priceLabel}
                aria-invalid={priceInvalid ? 'true' : 'false'}
                aria-describedby={priceInvalid ? priceErrorId : undefined}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, priceLabel: e.target.value }));
                  if (priceInvalid && e.target.value.trim()) {
                    setPriceInvalid(false);
                  }
                }}
                onBlur={() =>
                  validateField(form.priceLabel, setPriceInvalid, 'Price or label is required.')
                }
                placeholder="e.g. $75, Consumable, Any Amount"
                className={`celestial-input w-full rounded-lg border border-gold-light bg-white px-3.5 py-2 text-ink ${
                  priceInvalid ? 'user-invalid-fallback' : ''
                }`}
              />
              <div
                id={priceErrorId}
                className="field-error items-center gap-1.5 mt-1 font-label text-xs font-semibold text-error"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Please enter a price or label.</span>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor={descriptionId}
              className="block font-label text-xs font-semibold uppercase tracking-wider text-primary-container mb-1"
            >
              Description <span aria-hidden="true">*</span>
            </label>
            <textarea
              ref={descriptionRef}
              id={descriptionId}
              name="description"
              rows={3}
              required
              maxLength={400}
              value={form.description}
              aria-invalid={descriptionInvalid ? 'true' : 'false'}
              aria-describedby={descriptionInvalid ? descriptionErrorId : undefined}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, description: e.target.value }));
                if (descriptionInvalid && e.target.value.trim()) {
                  setDescriptionInvalid(false);
                }
              }}
              onBlur={() =>
                validateField(form.description, setDescriptionInvalid, 'Description is required.')
              }
              placeholder="Briefly describe the gift or how it will be used..."
              className={`celestial-input w-full rounded-lg border border-gold-light bg-white px-3.5 py-2 text-ink ${
                descriptionInvalid ? 'user-invalid-fallback' : ''
              }`}
            />
            <div
              id={descriptionErrorId}
              className="field-error items-center gap-1.5 mt-1 font-label text-xs font-semibold text-error"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Please enter a description.</span>
            </div>
          </div>

          <fieldset className="rounded-xl border border-gold/30 bg-surface p-3.5 space-y-2.5">
            <legend className="px-1 font-label text-xs font-semibold uppercase tracking-wider text-secondary">
              Reservation Options
            </legend>

            <div className="flex items-start gap-2.5">
              <input
                id={allowMultipleId}
                name="allowMultiple"
                type="checkbox"
                checked={form.allowMultiple || form.isFund}
                disabled={form.isFund}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, allowMultiple: e.target.checked }))
                }
                className="mt-1 h-4 w-4 accent-secondary cursor-pointer disabled:cursor-not-allowed"
              />
              <label htmlFor={allowMultipleId} className="font-body text-base text-primary-container cursor-pointer">
                Allow multiple guests to pledge
                <span className="block font-label text-xs text-ink-muted">
                  Best for consumables (diapers, wipes) or group gifts.
                </span>
              </label>
            </div>

            <div className="flex items-start gap-2.5">
              <input
                id={isFundId}
                name="isFund"
                type="checkbox"
                checked={form.isFund}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    isFund: e.target.checked,
                    allowMultiple: e.target.checked ? true : prev.allowMultiple,
                  }))
                }
                className="mt-1 h-4 w-4 accent-secondary cursor-pointer"
              />
              <label htmlFor={isFundId} className="font-body text-base text-primary-container cursor-pointer">
                Monetary fund
                <span className="block font-label text-xs text-ink-muted">
                  Shows an optional pledge amount input when selected by a guest.
                </span>
              </label>
            </div>
          </fieldset>

          <div className="pt-2 flex flex-wrap justify-end gap-2.5">
            <button
              type="button"
              onClick={closeModal}
              disabled={isSaving}
              className="min-h-11 rounded-full border border-gold/60 bg-white px-5 py-2 font-label text-xs font-semibold uppercase tracking-wider text-primary-container hover:bg-sky-soft/60 disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="min-h-11 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2 font-label text-xs font-semibold uppercase tracking-wider text-primary hover:bg-gold-bright/90 disabled:opacity-60 cursor-pointer"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
              {editingItem ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </ModalDialog>

      {/* Delete Confirmation Modal */}
      <ModalDialog
        open={Boolean(deleteTarget)}
        onClose={() => {
          if (!busyItemId) setDeleteTarget(null);
        }}
        title="Delete Registry Item?"
      >
        {deleteTarget && (
          <>
            <p className="font-body text-lg text-ink-muted leading-relaxed">
              Are you sure you want to remove{' '}
              <strong className="text-primary-container">{deleteTarget.title}</strong> from the gift
              registry?
            </p>
            {getReservationSummary(deleteTarget).hasReservations && (
              <div className="mt-3 rounded-xl border border-error/30 bg-[#fff6f6] p-3 font-label text-xs text-error">
                Note: This item currently has active reservations by{' '}
                <strong>{getReservationSummary(deleteTarget).names.join(', ')}</strong>.
              </div>
            )}
            <div className="mt-6 flex flex-wrap justify-end gap-2.5">
              <button
                type="button"
                disabled={Boolean(busyItemId)}
                onClick={() => setDeleteTarget(null)}
                className="min-h-11 rounded-full border border-gold/60 bg-white px-5 py-2 font-label text-xs font-semibold uppercase tracking-wider text-primary-container hover:bg-sky-soft/60 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={Boolean(busyItemId)}
                onClick={() => void handleConfirmDelete()}
                className="min-h-11 inline-flex items-center gap-1.5 rounded-full bg-error px-5 py-2 font-label text-xs font-semibold uppercase tracking-wider text-white hover:opacity-90 disabled:opacity-60 cursor-pointer"
              >
                {busyItemId === deleteTarget.id && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                )}
                Delete Item
              </button>
            </div>
          </>
        )}
      </ModalDialog>
    </StationeryCard>
  );
}
