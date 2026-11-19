import { useEffect, useState } from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { INITIAL_REGISTRY_ITEMS } from './data/baptismData';
import {
  subscribeBlessings,
  subscribeRegistry,
  submitRsvpToStore,
} from './services/baptismService';
import { isFirebaseConfigured } from './lib/firebase';
import type {
  BlessingNote,
  GuestRecord,
  PageView,
  RegistryItem,
  RsvpSubmission,
} from './types/baptism';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/invitation/HeroSection';
import { ScheduleSection } from './components/invitation/ScheduleSection';
import { FaqSection } from './components/invitation/FaqSection';
import { BlessingsWall } from './components/invitation/BlessingsWall';
import { GuestLookup } from './components/rsvp/GuestLookup';
import { RsvpForm } from './components/rsvp/RsvpForm';
import { ConfirmationPass } from './components/pass/ConfirmationPass';
import { AdminPage } from './components/admin/AdminPage';
import { StationeryCard } from './components/ui/StationeryCard';
import { ModalDialog } from './components/ui/ModalDialog';

const PAGE_TITLES: Record<PageView, string> = {
  invitation: 'Enzo’s Christening Day | Lorenzo Paul Holy Baptism',
  rsvp: 'RSVP & Gift Registry | Lorenzo Paul Holy Baptism',
  pass: 'Confirmation | Lorenzo Paul Holy Baptism',
  admin: 'Host Admin | Lorenzo Paul Holy Baptism',
};

const PASTEL_SWATCHES = [
  { name: 'Whispering Baby Blue', hex: '#C9E0F2', note: 'Sky & Cloud Tones' },
  { name: 'Warm Cotton Parchment', hex: '#FDFBF7', note: 'Ivory & Cream' },
  { name: 'Gilded Champagne', hex: '#C5A059', note: 'Soft Gold Accents' },
  { name: 'Gentle Slate Navy', hex: '#2B445B', note: 'Evening & Suiting' },
];

const SHOW_HEIRLOOM_NOTES = false;

function getInitialView(): PageView {
  if (typeof window !== 'undefined' && window.location.hash === '#admin') {
    return 'admin';
  }
  return 'invitation';
}

export function App() {
  const [currentView, setCurrentView] = useState<PageView>(getInitialView);
  const [verifiedGuest, setVerifiedGuest] = useState<GuestRecord | null>(null);
  const [registryItems, setRegistryItems] = useState<RegistryItem[]>(INITIAL_REGISTRY_ITEMS);
  const [blessings, setBlessings] = useState<BlessingNote[]>([]);
  const [submission, setSubmission] = useState<RsvpSubmission | null>(null);
  const [hasConfirmedPass, setHasConfirmedPass] = useState(false);

  const [dressCodeOpen, setDressCodeOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  useEffect(() => {
    document.title = PAGE_TITLES[currentView];
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const unsubRegistry = subscribeRegistry(setRegistryItems);
    const unsubBlessings = subscribeBlessings(setBlessings);
    return () => {
      unsubRegistry();
      unsubBlessings();
    };
  }, []);

  const navigateTo = (view: PageView) => {
    if (view !== 'admin' && window.location.hash === '#admin') {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    if (view === 'admin') {
      window.location.hash = 'admin';
    }
    setCurrentView(view);
  };

  const handleSubmitRsvp = async (nextSubmission: RsvpSubmission) => {
    const previousGiftId = submission?.reservedGiftId ?? null;
    await submitRsvpToStore(nextSubmission, previousGiftId);

    setSubmission(nextSubmission);
    setHasConfirmedPass(true);

    // Local fallback updates when Firebase is not configured
    if (!isFirebaseConfigured) {
      setRegistryItems((prev) =>
        prev.map((item) => {
          if (item.id === previousGiftId && item.id !== nextSubmission.reservedGiftId) {
            return item.allowMultiple
              ? {
                  ...item,
                  reservedByGuestIds: (item.reservedByGuestIds ?? []).filter(
                    (id) => id !== nextSubmission.guestId
                  ),
                }
              : { ...item, reservedByGuestId: null };
          }
          if (item.id === nextSubmission.reservedGiftId) {
            return item.allowMultiple
              ? {
                  ...item,
                  reservedByGuestIds: Array.from(
                    new Set([...(item.reservedByGuestIds ?? []), nextSubmission.guestId])
                  ),
                }
              : { ...item, reservedByGuestId: nextSubmission.guestId };
          }
          return item;
        })
      );

      if (nextSubmission.blessingMessage) {
        const words = nextSubmission.guestName.split(/\s+/).filter(Boolean);
        const initials =
          words.length >= 2
            ? `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
            : nextSubmission.guestName.slice(0, 2).toUpperCase();

        setBlessings((prev) => [
          {
            id: nextSubmission.guestId,
            author: nextSubmission.guestName,
            initials,
            role:
              nextSubmission.attendance === 'in-person'
                ? 'Confirmed Guest'
                : 'Celebrating in Spirit',
            message: nextSubmission.blessingMessage,
          },
          ...prev.filter((b) => b.id !== nextSubmission.guestId),
        ]);
      }
    }

    setConfirmModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        currentView={currentView}
        onNavigate={navigateTo}
        hasConfirmedPass={hasConfirmedPass}
      />

      <main id="main-content" className="flex-1 px-4 sm:px-6 py-6">
        {currentView === 'invitation' && (
          <>
            <HeroSection
              onGoToRsvp={() => navigateTo('rsvp')}
              onOpenDressCode={() => setDressCodeOpen(true)}
            />
            <ScheduleSection />
            <FaqSection />
            {SHOW_HEIRLOOM_NOTES && (
              <BlessingsWall
                blessings={blessings}
                onLeaveBlessing={() => navigateTo('rsvp')}
              />
            )}
          </>
        )}

        {currentView === 'rsvp' && (
          <div className="mx-auto max-w-4xl py-4">
            <StationeryCard>
              <div className="text-center mb-10">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-soft px-4 py-1.5 font-label text-xs font-semibold uppercase tracking-[0.14em] text-primary-container mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
                  Jan 12, 2027 • 11:00 AM
                </span>
                <h1 className="font-display text-4xl sm:text-5xl font-normal text-primary">
                  Lorenzo Paul’s Christening
                </h1>
                <p className="mt-3 max-w-xl mx-auto font-body text-lg text-ink-muted">
                  Kindly confirm your attendance and preferences so we may lovingly prepare for your seat at the celebration table.
                </p>
              </div>

              <GuestLookup
                verifiedGuest={verifiedGuest}
                onVerify={(guest) => {
                  setVerifiedGuest(guest);
                  setSubmission(null);
                }}
                onFoundExistingRsvp={(guest, existingRsvp) => {
                  setVerifiedGuest(guest);
                  setSubmission(existingRsvp);
                  setHasConfirmedPass(true);
                  navigateTo('pass');
                }}
                onClearGuest={() => {
                  setVerifiedGuest(null);
                  setSubmission(null);
                }}
              />

              {verifiedGuest && (
                <RsvpForm
                  verifiedGuest={verifiedGuest}
                  registryItems={registryItems}
                  initialSubmission={submission}
                  onSubmitRsvp={handleSubmitRsvp}
                />
              )}
            </StationeryCard>
          </div>
        )}

        {currentView === 'pass' && submission && (
          <ConfirmationPass
            submission={submission}
            registryItems={registryItems}
            onEditRsvp={() => navigateTo('rsvp')}
          />
        )}

        {currentView === 'admin' && (
          <AdminPage
            registryItems={registryItems}
            blessings={blessings}
            onBackToSite={() => navigateTo('invitation')}
          />
        )}
      </main>

      <Footer onOpenAdmin={() => navigateTo('admin')} />

      {/* Dress Code Modal */}
      <ModalDialog
        open={dressCodeOpen}
        onClose={() => setDressCodeOpen(false)}
        title="Dress Code: Celestial Pastels"
      >
        <p className="font-body text-lg text-ink-muted leading-relaxed">
          We kindly ask guests to dress in reverent church attire featuring soft, serene tones—tender baby blues, warm creams, champagne gold, or light pastels.
        </p>

        <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 list-none p-0 m-0">
          {PASTEL_SWATCHES.map((swatch) => (
            <li
              key={swatch.hex}
              className="flex items-center gap-3 rounded-xl border border-gold/30 bg-surface p-3"
            >
              <span
                className="h-9 w-9 rounded-full border border-gold/40 shrink-0"
                style={{ backgroundColor: swatch.hex }}
                aria-hidden="true"
              />
              <div>
                <p className="font-label text-xs font-semibold text-primary-container">
                  {swatch.name}
                </p>
                <p className="font-label text-[11px] text-ink-muted">{swatch.note}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => setDressCodeOpen(false)}
            className="min-h-11 rounded-full bg-primary-container px-6 py-2 font-label text-xs font-semibold uppercase tracking-wider text-white hover:bg-primary cursor-pointer"
          >
            Got It
          </button>
        </div>
      </ModalDialog>

      {/* RSVP Confirmation Modal */}
      {submission && (
        <ModalDialog
          open={confirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          title="You Are Confirmed!"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-gold shrink-0 mt-0.5" aria-hidden="true" />
            <p className="font-body text-lg text-ink-muted leading-relaxed">
              Thank you, <strong className="text-primary-container">{submission.guestName}</strong>! Your RSVP and blessing for Baby Enzo have been lovingly recorded.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setConfirmModalOpen(false);
                navigateTo('invitation');
              }}
              className="min-h-11 rounded-full border border-gold bg-white px-5 py-2 font-label text-xs font-semibold uppercase tracking-wider text-primary-container hover:bg-sky-soft/70 cursor-pointer"
            >
              Close & View Invitation
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirmModalOpen(false);
                navigateTo('pass');
              }}
              className="min-h-11 rounded-full bg-gold px-6 py-2 font-label text-xs font-semibold uppercase tracking-wider text-primary hover:bg-gold-bright/90 cursor-pointer"
            >
              View Confirmation
            </button>
          </div>
        </ModalDialog>
      )}
    </div>
  );
}

export default App;
