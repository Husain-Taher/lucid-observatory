import React from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { ArrowLeft, ExternalLink, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Terms of Use · Lucid",
  description: "Terms of Use, FRED® API compliance, and legal disclosures for Lucid.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto pt-6 pb-28 px-4">
      <Breadcrumb
        section="TERMS"
        observation="Legal & FRED® API Compliance"
        stepIndex="LEGAL"
        lessonNarrative="Transparent boundaries, public data attributions, and user rights."
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
          Legal & Compliance
        </span>
        <h1 className="font-editorial text-4xl md:text-5xl text-lucid-bone font-normal mt-2">
          Terms of Use & API Notices
        </h1>
        <p className="text-sm font-mono text-lucid-stone/80 mt-2">
          Effective Date: September 2026
        </p>
      </div>

      {/* MANDATORY FRED® NOTICE BANNER */}
      <div className="p-6 md:p-8 rounded-2xl bg-lucid-ash border border-lucid-oxide/40 mb-12 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-lucid-oxide">
          <ShieldCheck className="w-4 h-4 text-lucid-oxide" />
          <span>Mandatory FRED® API Disclosure</span>
        </div>
        <p className="font-editorial text-2xl text-lucid-bone leading-snug">
          &ldquo;This product uses the FRED® API but is not endorsed or certified by the Federal Reserve Bank of St. Louis.&rdquo;
        </p>
        <p className="text-xs font-mono text-lucid-stone leading-relaxed">
          FRED® is a registered trademark of the Federal Reserve Bank of St. Louis.
        </p>
      </div>

      <div className="space-y-10 text-sm text-lucid-stone leading-relaxed">
        {/* SECTION 1 */}
        <section className="space-y-3">
          <h2 className="font-editorial text-2xl text-lucid-bone">
            1. Agreement to Terms & FRED® API Terms of Use
          </h2>
          <p>
            By accessing or using the Lucid observatory application (&ldquo;Lucid&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;), you agree to be bound by these Terms of Use and all applicable laws and regulations.
          </p>
          <div className="p-4 rounded-xl bg-lucid-ash/70 border border-lucid-border text-xs font-mono text-lucid-bone space-y-2">
            <p>
              <strong>Notice Regarding FRED® API:</strong> By using Lucid, you are explicitly agreeing to be bound by the Federal Reserve Bank of St. Louis FRED® API Terms of Use:
            </p>
            <a
              href="https://fred.stlouisfed.org/docs/api/terms_of_use.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-lucid-oxide hover:underline"
            >
              <span>https://fred.stlouisfed.org/docs/api/terms_of_use.html</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

        {/* SECTION 2 */}
        <section className="space-y-3">
          <h2 className="font-editorial text-2xl text-lucid-bone">
            2. Export Controls & OFAC Sanctions Compliance
          </h2>
          <p>
            You agree to comply with all export laws, restrictions, and regulations of the United States Department of Commerce, the United States Department of Treasury Office of Foreign Assets Control (&ldquo;OFAC&rdquo;), and any other United States or foreign agency or authority.
          </p>
          <p>
            You shall not export, or allow the export or re-export of the FRED® API, Lucid software, or any related data in violation of any such restrictions, laws, or regulations. By accessing or using Lucid and the FRED® API, you represent and warrant that:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 font-mono text-xs text-lucid-stone/90">
            <li>You are not located in, under the control of, or a national or resident of any country or territory subject to comprehensive United States embargo or sanctions (including Cuba, Iran, North Korea, Syria, and the Crimea, Donetsk, and Luhansk regions of Ukraine);</li>
            <li>You are not identified on any U.S. government list of prohibited, sanctioned, or restricted parties, including the OFAC Specially Designated Nationals (&ldquo;SDN&rdquo;) list;</li>
            <li>You will not use Lucid or the FRED® API for any purposes prohibited by U.S. law.</li>
          </ul>
        </section>

        {/* SECTION 3 */}
        <section className="space-y-3">
          <h2 className="font-editorial text-2xl text-lucid-bone">
            3. Permitted Use & Guidelines
          </h2>
          <p>
            You agree to use Lucid and the FRED® API data only for purposes that:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 font-mono text-xs text-lucid-stone/90">
            <li>Are permitted by these Terms of Use and the FRED® API Terms of Use;</li>
            <li>Are permitted by any applicable third-party contract, law, or regulation in relevant jurisdictions; and</li>
            <li>Comply with all applicable policies and guidelines made available by the Federal Reserve Bank of St. Louis.</li>
          </ul>
        </section>

        {/* SECTION 4 */}
        <section className="space-y-3">
          <h2 className="font-editorial text-2xl text-lucid-bone">
            4. Educational Non-Advisory Boundary
          </h2>
          <p>
            Lucid is an interactive financial observatory and cognitive self-observation platform built exclusively for educational, historical, and analytical literacy.
          </p>
          <p>
            <strong>No Investment Advice:</strong> Nothing published, synthesized, deconstructed, or simulated within Lucid constitutes personalized investment, tax, legal, or financial advice. Lucid is not a registered broker-dealer, investment adviser, or commodity trading advisor. All simulations (including paper trades, thesis logs, and counterfactual replays) are strictly hypothetical exercises designed to study behavioral biases without real capital risk.
          </p>
        </section>

        {/* SECTION 5 */}
        <section className="space-y-3">
          <h2 className="font-editorial text-2xl text-lucid-bone">
            5. User Privacy & Data Protection
          </h2>
          <p>
            Lucid protects the privacy and legal rights of its users. Please review our{" "}
            <Link href="/privacy" className="text-lucid-bone underline hover:text-lucid-oxide">
              Privacy Policy
            </Link>{" "}
            to understand how your information is handled. We do not sell personal data, do not display third-party advertisements, and do not share your paper trading or behavioral logs with external data brokers.
          </p>
        </section>
      </div>
    </div>
  );
}
