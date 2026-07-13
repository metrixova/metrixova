import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const COOKIE_CONSENT_KEY = 'metrixova_cookie_consent';
const TAWK_SCRIPT_ID = 'metrixova-tawk-script';

function loadTawkScript() {
  if (typeof window === 'undefined' || document.getElementById(TAWK_SCRIPT_ID)) {
    return;
  }

  const script = document.createElement('script');
  script.id = TAWK_SCRIPT_ID;
  script.type = 'text/javascript';
  script.textContent = `
    var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
    (function(){
      var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
      s1.async=true;
      s1.src="https://embed.tawk.to/6a3e1dd7bf47421d4a0c9be1/1js1a94pd";
      s1.charset="UTF-8";
      s1.setAttribute("crossorigin","*");
      s0.parentNode.insertBefore(s1,s0);
    })();
  `;

  document.body.appendChild(script);
}

export function CookieBanner() {
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    setConsent(stored);
  }, []);

  useEffect(() => {
    if (consent === null) {
      return;
    }

    loadTawkScript();
  }, [consent]);

  const handleAccept = () => {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setConsent('accepted');
  };

  const handleDeny = () => {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, 'denied');
    setConsent('denied');
  };

  const handleClose = () => {
    // Dismiss without granting consent; persist dismissal so banner doesn't reappear immediately
    window.localStorage.setItem(COOKIE_CONSENT_KEY, 'dismissed');
    setConsent('dismissed');
  };

  // If the user has any stored decision (accepted, denied, dismissed), hide the banner
  if (consent !== null) {
    return null;
  }

  return (
    <div className="fixed left-4 right-4 bottom-16 md:bottom-12 lg:bottom-4 z-20">
      <div className="mx-auto max-w-3xl md:max-w-7xl pointer-events-auto bg-metrix-bg/95 border border-white/8 backdrop-blur-sm rounded-lg px-3 py-3 flex flex-col gap-3 text-sm sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleAccept}
            className="inline-flex items-center justify-center rounded-full bg-metrix-crimson-bright px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-metrix-crimson"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={handleDeny}
            className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:border-metrix-crimson-bright/40 hover:bg-white/10"
          >
            Deny
          </button>
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <p className="text-white font-semibold">We use cookies to improve your experience.</p>
          <p className="text-metrix-muted">
            By using this site, you can read our{' '}
            <a href="#/privacy" className="text-metrix-crimson-bright underline hover:text-white">
              Privacy Policy
            </a>
            .
          </p>
        </div>

        <button
          aria-label="Dismiss cookie banner"
          onClick={handleClose}
          className="text-metrix-muted hover:text-white rounded p-1 self-start sm:self-auto"
        >
          ×
        </button>
      </div>
    </div>
  );
}
