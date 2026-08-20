import type { AnalysisResult } from "./types";

export const DEMO_TRUE: AnalysisResult = {
  inputType: "url",
  inputContent: "https://www.nasa.gov/mission/artemis-i/",
  title: "NASA's Artemis I Mission Successfully Completes Lunar Orbit",
  publisher: "NASA",
  author: "NASA Communications",
  pubDate: "2022-12-11",
  verdict: "TRUE",
  confidence: 91,
  summary:
    "The article accurately reports on NASA's Artemis I mission, which successfully sent the Orion spacecraft around the Moon and back. Multiple independent sources confirm the mission details.",
  claims: [
    {
      claim: "NASA's Orion spacecraft traveled around the Moon and returned to Earth.",
      verdict: "TRUE",
      confidence: 95,
      explanation:
        "Confirmed by NASA's official mission reports and multiple independent space journalism outlets. The Orion spacecraft successfully entered lunar orbit and returned.",
      evidence: [
        {
          source: "NASA",
          title: "Artemis I Mission Overview",
          url: "https://www.nasa.gov/mission/artemis-i/",
          date: "2022-12-11",
          snippet:
            "Orion successfully entered lunar orbit, passed behind the Moon, and performed a return trajectory burn.",
          type: "supporting",
        },
        {
          source: "Space.com",
          title: "NASA's Artemis I Orion spacecraft splashes down",
          url: "https://www.space.com/artemis-i-orion-splashes-down",
          date: "2022-12-11",
          snippet:
            "Orion splashed down in the Pacific Ocean after a 25.5-day mission around the Moon.",
          type: "supporting",
        },
      ],
    },
    {
      claim: "The mission lasted approximately 25 days.",
      verdict: "TRUE",
      confidence: 93,
      explanation:
        "Multiple sources confirm the mission duration was approximately 25.5 days, from launch on November 16 to splashdown on December 11, 2022.",
      evidence: [
        {
          source: "NASA",
          title: "Artemis I Mission Timeline",
          url: "https://www.nasa.gov/mission/artemis-i/timeline/",
          date: "2022-12-11",
          snippet:
            "Mission duration: 25 days, 10 hours, 52 minutes.",
          type: "supporting",
        },
      ],
    },
  ],
  limitations: undefined,
};

export const DEMO_FALSE: AnalysisResult = {
  inputType: "headline",
  inputContent: "5G Towers Proven to Cause Cancer in New Harvard Study",
  title: "5G Towers Proven to Cause Cancer",
  publisher: "Unknown",
  verdict: "FALSE",
  confidence: 87,
  summary:
    "This claim is false. There is no Harvard study establishing a causal link between 5G towers and cancer. The WHO and multiple peer-reviewed studies have found no evidence that 5G frequencies at public exposure levels cause cancer.",
  claims: [
    {
      claim: "A Harvard study has proven that 5G towers cause cancer.",
      verdict: "FALSE",
      confidence: 92,
      explanation:
        "No such study exists at Harvard. The WHO, FDA, and National Cancer Institute all state that current evidence does not support a causal link between 5G RF frequencies and cancer at typical exposure levels.",
      evidence: [
        {
          source: "World Health Organization",
          title: "Electromagnetic fields & public health: 5G",
          url: "https://www.who.int/news-room/questions-and-answers/item/radiation-5g-and-health",
          date: "2024-01-15",
          snippet:
            "To date, no adverse health effects have been established as being caused by mobile phone or 5G use.",
          type: "contradicting",
        },
        {
          source: "Harvard T.H. Chan School of Public Health",
          title: "5G and Health: What We Know",
          url: "https://www.hsph.harvard.edu/news/",
          snippet:
            "Harvard has not published any study claiming 5G causes cancer. Current scientific consensus does not support this claim.",
          type: "contradicting",
        },
        {
          source: "American Cancer Society",
          title: "Cell Phones and Cancer Risk",
          url: "https://www.cancer.org/cancer/risk-prevention/radiation-exposure/cell-phones.html",
          snippet:
            "At this time, there is no strong evidence that RF energy from cell phones causes any noticeable health effects.",
          type: "context",
        },
      ],
    },
  ],
  limitations:
    "While no evidence supports the cancer claim, research into long-term effects of radiofrequency electromagnetic fields continues.",
};

export const DEMO_MISLEADING: AnalysisResult = {
  inputType: "text",
  inputContent:
    "A new study shows that people who drink three cups of coffee a day live ten years longer than non-drinkers. Coffee companies are calling this proof that coffee is the secret to a long life. Doctors everywhere are now recommending coffee as a replacement for water.",
  title: "Study Claims Coffee Adds Ten Years to Life",
  publisher: "Health Daily News",
  verdict: "MISLEADING",
  confidence: 76,
  summary:
    "The article takes a real epidemiological observation about coffee consumption and longevity and dramatically exaggerates its findings. While some studies suggest moderate coffee consumption is associated with certain health benefits, the claims made here are significantly overstated.",
  claims: [
    {
      claim: "Drinking three cups of coffee a day adds ten years to your life.",
      verdict: "PARTIALLY_TRUE",
      confidence: 68,
      explanation:
        "Some studies show a statistical association between moderate coffee consumption and reduced mortality risk, but the effect is modest (a few percentage points reduction in risk, not years added) and correlation does not equal causation. The ten-year claim is a gross exaggeration.",
      evidence: [
        {
          source: "New England Journal of Medicine",
          title: "Coffee Consumption and Mortality",
          url: "https://www.nejm.org/doi/full/10.1056/NEJMoa1800934",
          date: "2022-07-11",
          snippet:
            "Coffee consumption was associated with a modest inverse association with mortality, not a ten-year increase in lifespan.",
          type: "contradicting",
        },
        {
          source: "Harvard T.H. Chan School of Public Health",
          title: "The Buzz on Coffee and Health",
          url: "https://www.hsph.harvard.edu/nutritionsource/food-features/coffee/",
          snippet:
            "Moderate coffee consumption (3-4 cups/day) has been linked to reduced risk of certain diseases, but is not a guarantee of extended lifespan.",
          type: "context",
        },
      ],
    },
    {
      claim: "Doctors are recommending coffee as a replacement for water.",
      verdict: "FALSE",
      confidence: 95,
      explanation:
        "No medical authority recommends replacing water with coffee. This is fabricated misinformation. Water remains essential for hydration, and excessive coffee consumption can cause dehydration.",
      evidence: [
        {
          source: "Mayo Clinic",
          title: "Water: How much should you drink every day?",
          url: "https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/water/art-20044256",
          snippet:
            "Water is essential for health. No medical guidelines recommend replacing water with coffee or other beverages.",
          type: "contradicting",
        },
      ],
    },
  ],
  limitations:
    "Coffee research is complex, and individual health outcomes depend on many factors including genetics, diet, and lifestyle.",
};

export const DEMO_UNVERIFIED: AnalysisResult = {
  inputType: "url",
  inputContent: "https://example-news.com/breaking-mystery-event",
  title: "Mysterious Celestial Object Detected Near Earth Orbit",
  publisher: "Breaking Space News",
  author: "Staff Reporter",
  pubDate: "2026-08-20",
  verdict: "UNVERIFIED",
  confidence: 32,
  summary:
    "This article reports on a claimed detection of an unidentified celestial object near Earth orbit. As of the time of analysis, no major space agencies or independent astronomers have confirmed this observation. The claim cannot be verified or debunked with currently available evidence.",
  claims: [
    {
      claim: "A mysterious celestial object has been detected approaching Earth's orbit.",
      verdict: "UNVERIFIED",
      confidence: 30,
      explanation:
        "No independent confirmation from NASA, ESA, or other major space agencies has been found. The report originates from a single source with no corroborating observations from established astronomical institutions.",
      evidence: [
        {
          source: "NASA",
          title: "Current Asteroid Tracking",
          url: "https://science.nasa.gov/asteroids-comets/planetary-defense/",
          snippet:
            "No recent announcements regarding unusual celestial objects approaching Earth orbit.",
          type: "context",
        },
      ],
    },
  ],
  limitations:
    "This report is very recent. Breaking news about astronomical events may not yet have independent verification. The lack of evidence does not necessarily mean the event did not occur — it may simply be too new for independent confirmation.",
};

export const DEMO_RESULTS: Record<string, AnalysisResult> = {
  true: DEMO_TRUE,
  false: DEMO_FALSE,
  misleading: DEMO_MISLEADING,
  unverified: DEMO_UNVERIFIED,
};
