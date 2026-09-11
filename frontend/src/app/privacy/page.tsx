import React from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { ArrowLeft, Lock, EyeOff } from "lucide-react";

export const metadata = {
  title: "Privacy Policy · Lucid",
  description: "Privacy Policy and user legal protection disclosures for Lucid and FRED® API integration.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto pt-6 pb-28 px-4">
      <Breadcrumb
        section="PRIVACY"
        observation="User Rights & Privacy Policy"
        stepIndex="LEGAL"
        lessonNarrative="Respecting user privacy, minimal data retention, and zero commercial tracking."
      />

      <div className="mt-8 mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-lucid-stone hover:text-lucid-bone transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Observatory</span>
        </Link>
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-lucid-stone block">
          User Privacy
        </span>
        <h1 className="font-editorial text-4xl md:text-5xl text-lucid-bone font-normal mt-2">
          Privacy Policy
        </h1>
        <p className="text-sm font-mono text-lucid-stone/80 mt-2">
          Effective Date: September 2026 · Committed to User Privacy
        </p>
      </div>

      {/* CORE PRIVACY PILLARS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        <div className="p-5 rounded-xl bg-lucid-ash border border-lucid-border space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-lucid-bone">
            <Lock className="w-4 h-4 text-lucid-moss" />
            <span>Zero Data Brokerage</span>
          </div>
          <p className="text-xs text-lucid-stone leading-relaxed">
            We never sell, rent, monetize, or trade your personal information, decision logs, or behavioral reflection notes with any third party or advertiser.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-lucid-ash border border-lucid-border space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-lucid-bone">
            <EyeOff className="w-4 h-4 text-lucid-dust" />
            <span>No Cross-Site Ad Tracking</span>
          </div>
          <p className="text-xs text-lucid-stone leading-relaxed">
            Lucid does not load invasive ad-tech pixels, behavioral trackers, or surveillance cookies. Learning is a private, reflective experience.
          </p>
        </div>
      </div>

      <div className="space-y-10 text-sm text-lucid-stone leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-editorial text-2xl text-lucid-bone">
            1. Information We Collect
          </h2>
          <p>
            To deliver an interactive observatory without friction, Lucid collects only the minimal information required to maintain your learning state:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 font-mono text-xs text-lucid-stone/90">
            <li><strong>Account Identifiers:</strong> Email address and salted bcrypt password hash if you choose to create an account. Anonymous visitors can explore immediately without creating an account.</li>
            <li><strong>Simulated Decisions & Theses:</strong> Hypothetical actions (BUY, WAIT, PASS), paper trading records, and self-reflection notes logged within the Practice and Trace modules.</li>
            <li><strong>Application Telemetry:</strong> Anonymized error rates and request timestamps strictly used for system reliability and rate limiting.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-editorial text-2xl text-lucid-bone">
            2. Upstream Data Providers & FRED® API
          </h2>
          <p>
            Lucid retrieves public macroeconomic data directly from the Federal Reserve Bank of St. Louis FRED® API, the Chicago Board Options Exchange (CBOE), and public indices.
          </p>
          <div className="p-4 rounded-xl bg-lucid-ash/70 border border-lucid-border text-xs font-mono text-lucid-bone space-y-2">
            <p>
              <strong>Mandatory FRED® Disclosure:</strong> This product uses the FRED® API but is not endorsed or certified by the Federal Reserve Bank of St. Louis.
            </p>
            <p>
              Your personal identity is <em>never</em> transmitted to the Federal Reserve Bank of St. Louis or other upstream providers when fetching public series data.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-editorial text-2xl text-lucid-bone">
            3. How Your Information Is Used
          </h2>
          <p>
            We process your information exclusively to:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 font-mono text-xs text-lucid-stone/90">
            <li>Render your personal Behavioral Mirror timeline and pattern reflections;</li>
            <li>Maintain your paper trading balances and simulation history;</li>
            <li>Secure the platform against automated abuse, SSRF, or malicious inputs;</li>
            <li>Comply with all applicable legal, regulatory, export, and OFAC requirements.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-editorial text-2xl text-lucid-bone">
            4. User Rights & Data Deletion
          </h2>
          <p>
            You retain complete ownership over your decision records and profile. You may request the export or permanent deletion of your account and all associated simulation logs at any time by contacting our team or using the profile management surface.
          </p>
        </section>
      </div>
    </div>
  );
}
