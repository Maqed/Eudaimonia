"use client";
import CookieConsent from "react-cookie-consent";
import Link from "next/link";
import { consent } from "nextjs-google-analytics";

function CookieConsentBanner() {
  const handleAccept = () => {
    consent({
      arg: "update",
      params: {
        ad_storage: "granted",
        analytics_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      },
    });
  };

  const handleDecline = () => {
    consent({
      arg: "update",
      params: {
        ad_storage: "denied",
        analytics_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      },
    });
  };

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      declineButtonText="Decline"
      cookieName="gdpr-analytics-advertising-consent"
      style={{
        background: "hsl(var(--card))",
        color: "hsl(var(--card-foreground))",
      }}
      buttonStyle={{
        background: "hsl(var(--primary)",
        color: "hsl(var(--primary-foreground))",
        fontSize: "14px",
        padding: "10px 20px",
        borderRadius: "var(--radius)",
      }}
      declineButtonStyle={{
        background: "hsl(var(--secondary))",
        color: "hsl(var(--secondary-foreground))",
        fontSize: "14px",
        padding: "10px 20px",
        borderRadius: "hsl(var(--radius))",
      }}
      onAccept={handleAccept}
      onDecline={handleDecline}
    >
      This website uses cookies to enhance the user experience. By using this
      website, you agree to our use of cookies.{" "}
      <Link
        href="/legal/privacy-policy"
        className="text-primary hover:underline"
      >
        Learn more
      </Link>
    </CookieConsent>
  );
}

export default CookieConsentBanner;
