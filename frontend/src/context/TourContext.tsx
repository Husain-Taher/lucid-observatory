"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export interface TourChapter {
  id: string;
  number: string;
  title: string;
  featureName: string;
  route: string;
  tag: string;
  explanation: string;
  howToUse: string[];
  takeaway: string;
}

export const TOUR_CHAPTERS: TourChapter[] = [
  {
    id: "atmosphere",
    number: "01",
    title: "The Observatory Atmosphere",
    featureName: "Environmental Sentiment & Multi-Signal Radar",
    route: "/room",
    tag: "MACRO REGIME & PSYCHOLOGY",
    explanation:
      "Most trading platforms bombard you with flashing red and green numbers designed to induce FOMO. LUCID reverses this paradigm: before looking at a single price, we assess the overall atmospheric pressure of the market using four empirical pillars from FRED® and market history: Treasury yield spreads, credit stress, volatility, and historical sentiment percentiles.",
    howToUse: [
      "Inspect the Composite Atmosphere Score (0-100) to understand whether the market is Fearful, Calm, or Overheated.",
      "Explore the 4 Environmental Signal Nodes to see exact percentage contributions and historical percentiles.",
      "Read the Grounded Editorial Narrative explaining what market forces are actually driving today's environment.",
    ],
    takeaway: "Never execute a trade without first diagnosing the environmental weather of the macroeconomic system.",
  },
  {
    id: "concepts",
    number: "02",
    title: "Concept Studios",
    featureName: "Interactive Mental Models & Simulators",
    route: "/see",
    tag: "COGNITIVE GROUNDING",
    explanation:
      "Financial literacy is not about memorizing ticker symbols; it is about building durable mental models. The Concept Studios provide tactile visual laboratories where you can interactively explore purchasing power decay across fiat versus gold, understand fractional reserve banking, and experiment with counterfactual outcomes.",
    howToUse: [
      "Select any concept module (such as Purchasing Power, Yield Curves, or Liquidity Spirals).",
      "Interact with the timeline sliders and inflation controls to watch cash purchasing power erode versus hard assets.",
      "Complete modules to build your institutional foundation and unlock advanced decision frameworks.",
    ],
    takeaway: "Price is what you pay; value and monetary dynamics are what you must understand.",
  },
  {
    id: "market",
    number: "03",
    title: "The Living Market Floor",
    featureName: "Dual-Band Ticker & The Daily Prophet",
    route: "/market",
    tag: "HIGH-VELOCITY OBSERVATORY",
    explanation:
      "Welcome to the Market Floor. Here you transition into a fast-paced cyber-terminal. Track real-time prices for Gold (GLD), Silver (SLV), Platinum (PPLT), Major Indices, and Equities. Below the charts sits our flagship Daily Prophet broadsheet: an AI-powered newspaper that strips away viral headlines to uncover the objective underlying facts.",
    howToUse: [
      "Watch the dual-band ticker tape running live at the top of the terminal.",
      "Switch between 1D, 5D, 1Mo, 6Mo, 1Y, and 5Y charting envelopes with 20-period Moving Average overlays.",
      "Search any stock or commodity in the Daily Prophet archive to see real news articles deconstructed into Substance Scores, Hype Scores, and 'What It Actually Means.'",
    ],
    takeaway: "Separate the objective economic event from the sensational narrative designed to provoke your emotions.",
  },
  {
    id: "integrity",
    number: "04",
    title: "Investment Integrity Engine",
    featureName: "The Capital Trail & Pluralistic Screening",
    route: "/integrity",
    tag: "CAPITAL TRANSPARENCY",
    explanation:
      "Modern corporations are complex webs of subsidiaries, non-core ventures, and interest-bearing debt. The Investment Integrity Engine lets you screen companies under five international standards (AAOIFI, DJIM, FTSE, MSCI, Custom Ethical). It features the Capital Trail: an interactive graph that follows your investment dollar through parent entities, operating segments, and hidden subsidiaries.",
    howToUse: [
      "Select from 5 Pluralistic Screening Methodologies to see how different Shariah and ethical boards evaluate leverage and revenue.",
      "Step through the 6-stage Capital Trail to trace your dollar through corporate subsidiaries and balance sheet debt.",
      "Review the 4-Quarter Continuous Monitoring timeline to track balance sheet drift across SEC 10-Q and 10-K filings.",
      "Use the Independent Purification Calculator to calculate exact dividend cleansing obligations for public charity.",
    ],
    takeaway: "Compliance is not a static stamp; understand where your capital travels before allocating.",
  },
  {
    id: "practice",
    number: "05",
    title: "Practice Arena & Claim Deconstructor",
    featureName: "Hypothesis Verification & Paper Execution",
    route: "/practice",
    tag: "DECISION LAB & PAPER TRADING",
    explanation:
      "Before risking real capital, test your judgment in the Practice Arena. Paste any viral social media claim or analyst headline into the Claim Deconstructor. Our NLP engine breaks it into Subject, Certainty, and Hype metrics. Then form a falsifiable thesis with an explicit pre-mortem commitment before placing a simulated paper order.",
    howToUse: [
      "Paste any investment claim or thesis into the Claim Deconstructor to evaluate its empirical grounding.",
      "Set your falsification criteria: 'I will be proven wrong if X happens within Y days.'",
      "Execute simulated paper trades backed by structured theses rather than impulsive reactions.",
    ],
    takeaway: "Disciplined investing requires writing down how you could be wrong before you click buy.",
  },
  {
    id: "trace",
    number: "06",
    title: "Behavioral Mirror",
    featureName: "Cognitive Bias Detection & Calibration",
    route: "/trace",
    tag: "SELF-MASTERY & JOURNAL",
    explanation:
      "The greatest risk in investing is not the market; it is the investor's own psychology. The Behavioral Mirror logs every decision you make, scans your trading behavior for cognitive biases (such as Loss Aversion, Outcome Bias, and Overconfidence), and tracks the counterfactual trajectory of what would have happened had you taken the opposite action.",
    howToUse: [
      "Inspect your Cognitive Bias Radar to identify recurring emotional blindspots.",
      "Review the Counterfactual Trajectory to see how disciplined patience compares against impulse trades.",
      "Track your Calibration Score over time to align your confidence with actual statistical probabilities.",
    ],
    takeaway: "Master yourself, and you master your relationship with financial markets.",
  },
];

interface TourContextType {
  isOpen: boolean;
  currentStep: number;
  showInitialPrompt: boolean;
  startTour: (stepIndex?: number) => void;
  closeTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  dismissInitialPrompt: () => void;
  tourChapters: TourChapter[];
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showInitialPrompt, setShowInitialPrompt] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user has already seen or dismissed the initial tour prompt
    if (typeof window !== "undefined") {
      const completed = localStorage.getItem("lucid_tour_completed");
      if (!completed) {
        // Wait 2.5 seconds after initial launch to gently show the welcome prompt
        const timer = setTimeout(() => {
          setShowInitialPrompt(true);
        }, 2500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const startTour = (stepIndex: number = 0) => {
    setShowInitialPrompt(false);
    const validIndex = Math.max(0, Math.min(stepIndex, TOUR_CHAPTERS.length - 1));
    setCurrentStep(validIndex);
    setIsOpen(true);
    const targetRoute = TOUR_CHAPTERS[validIndex].route;
    if (pathname !== targetRoute) {
      router.push(targetRoute);
    }
  };

  const closeTour = () => {
    setIsOpen(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("lucid_tour_completed", "true");
    }
  };

  const nextStep = () => {
    if (currentStep < TOUR_CHAPTERS.length - 1) {
      const nextIdx = currentStep + 1;
      setCurrentStep(nextIdx);
      const targetRoute = TOUR_CHAPTERS[nextIdx].route;
      if (pathname !== targetRoute) {
        router.push(targetRoute);
      }
    } else {
      closeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const prevIdx = currentStep - 1;
      setCurrentStep(prevIdx);
      const targetRoute = TOUR_CHAPTERS[prevIdx].route;
      if (pathname !== targetRoute) {
        router.push(targetRoute);
      }
    }
  };

  const goToStep = (index: number) => {
    const validIndex = Math.max(0, Math.min(index, TOUR_CHAPTERS.length - 1));
    setCurrentStep(validIndex);
    const targetRoute = TOUR_CHAPTERS[validIndex].route;
    if (pathname !== targetRoute) {
      router.push(targetRoute);
    }
  };

  const dismissInitialPrompt = () => {
    setShowInitialPrompt(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("lucid_tour_completed", "true");
    }
  };

  return (
    <TourContext.Provider
      value={{
        isOpen,
        currentStep,
        showInitialPrompt,
        startTour,
        closeTour,
        nextStep,
        prevStep,
        goToStep,
        dismissInitialPrompt,
        tourChapters: TOUR_CHAPTERS,
      }}
    >
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
};
