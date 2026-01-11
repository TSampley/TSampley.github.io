---
---
;

/**
 * Default no-op analytics implementation. Any custom events
 * should be passed to {@link analyticsObj} which will 
 * silently ignore all events if consent has not been given
 * by the user yet.
 */
class Analytics {
  event(action, params) {}
}
/** @type {Analytics} */
let analyticsObj = new Analytics();

function loadAnalytics() {
  const script = document.createElement('script')
  script.async = true
  script.src = 'https://www.googletagmanager.com/gtag/js?id={{ site.google_analytics }}'
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '{{ site.google_analytics }}', {
    anonymize_ip: true
  });

  analyticsObj = {
    event: function(action, params) {
      gtag('event', action, params);
    }
  }
}

const cookieBannerShowClass = 'show'
const cookieConsentAccepted = 'accepted'
const cookieConsentDeclined = 'declined'
const cookieConsentKey = 'cookieConsent'
const cookieConsentDateKey = 'cookieConsentDate'
class ConsentController {

  constructor(cookieBannerId='cookie-banner') {
    this.cookieBanner = document.getElementById(cookieBannerId)
    this.displayStatus = document.getElementById('consent-status')
  }

  updateStatus(message) {
    this.displayStatus.textContent = message
  }

  showBanner() {
    this.cookieBanner.classList.add(cookieBannerShowClass);
  }

  hideBanner() {
    this.cookieBanner.classList.remove(cookieBannerShowClass);
  }

  checkConsent() {
    const consent = localStorage.getItem(cookieConsentKey);
    const consentDate = localStorage.getItem(cookieConsentDateKey);
    
    // Check if consent exists and is less than 365 days old
    if (consent && consentDate) {
      const daysSince = (Date.now() - parseInt(consentDate)) / (1000 * 60 * 60 * 24);
      if (daysSince < 365) {
        if (consent === cookieConsentAccepted) {
          loadAnalytics();
          updateStatus('Analytics enabled (consent given)');
        } else {
          updateStatus('Analytics disabled (consent declined)');
        }
      }
    } else {
      // No valid consent, show banner
      this.showBanner()
      updateStatus('Awaiting consent...');
    }
  }

  acceptCookies() {
    localStorage.setItem(cookieConsentKey, cookieConsentAccepted)
    localStorage.setItem(cookieConsentDateKey, Date.now().toString())
    this.hideBanner()
  }

  declineCookies() {
    localStorage.setItem(cookieConsentKey, cookieConsentDeclined)
    localStorage.setItem(cookieConsentDateKey, Date.now().toString())
    this.hideBanner()
  }

  resetConsent() {
    localStorage.removeItem(cookieConsentKey)
    localStorage.removeItem(cookieConsentDateKey)
    // reload page to reset any elements or scripts that depend on consent
    location.reload()
  }
}