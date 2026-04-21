import React, { useState, useEffect, useRef, createContext, useContext, useCallback } from "react";

const PHOTO_SRC = "/dennis.jpeg";
const EFFECTV_MOBILE = "/effectv-mobile.png";
const EFFECTV_DESKTOP1 = "/effectv-desktop-1.png";
const EFFECTV_DESKTOP2 = "/effectv-desktop-2.png";
const AIM_PLOTLY = "/aim-plotly.png";
const AIM_TREND = "aim-trend.png";
const UX_COE_DEFINE = "/ux-coe-define.png";
const UX_COE_SKILLS = "/ux-coe-skills.png";

// ============================================================
// THEME SYSTEM
// ============================================================
const LIGHT = {
  bg: "#EDF2F6",
  surface: "#FFFFFF",
  surfaceMuted: "#E2E9EF",
  text: "#141418",
  textHeading: "#0B1464",
  textMuted: "#4A5E6D",
  accent: "#2E6383",
  accentSecondary: "#E87040",
  accentGradient: "linear-gradient(135deg, #2E6383, #1B4D6B)",
  accentWarm: "#E87040",
  accentWarmText: "#A04E25",
  accentWarmGradient: "linear-gradient(135deg, #E87040, #E04B30)",
  teal: "#2E6383",
  border: "#0B146410",
  navBg: "rgba(237,242,246,0.96)",
  // Resume section (always dark-styled)
  resumeBg: "#0B1464",
  resumeText: "#FFFFFF",
  resumeTextMuted: "#FFFFFFB0",
  resumeTextDim: "#FFFFFF80",
  resumeAccent: "#4A93B3",
  resumeBorder: "#FFFFFF0C",
  resumeGlow1: "#2E63830C",
  resumeGlow2: "#E870400C",
  resumeGlow3: "#2E638308",
  isDark: false,
};

const DARK = {
  bg: "#141418",
  surface: "#1C1C22",
  surfaceMuted: "#23232B",
  text: "#E8E4DF",
  textHeading: "#FFFFFF",
  textMuted: "#9BA4AB",
  accent: "#4A93B3",
  accentSecondary: "#E87040",
  accentGradient: "linear-gradient(135deg, #357A9B, #265E7A)",
  accentWarm: "#E87040",
  accentWarmText: "#E87040",
  accentWarmGradient: "linear-gradient(135deg, #E87040, #E04B30)",
  teal: "#4A93B3",
  border: "#FFFFFF0C",
  navBg: "rgba(20,20,24,0.96)",
  // Resume section (slightly different shade to differentiate)
  resumeBg: "#0D0F2A",
  resumeText: "#FFFFFF",
  resumeTextMuted: "#FFFFFFB0",
  resumeTextDim: "#FFFFFF80",
  resumeAccent: "#4A93B3",
  resumeBorder: "#FFFFFF0C",
  resumeGlow1: "#4A93B30C",
  resumeGlow2: "#0B146406",
  resumeGlow3: "#E8704008",
  isDark: true,
};

const ThemeContext = createContext({ T: LIGHT, mode: "light", toggle: () => {} });

function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "light" || stored === "dark") return stored;
    } catch {}
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  const toggle = useCallback(() => {
    setMode(prev => {
      const next = prev === "light" ? "dark" : "light";
      try { localStorage.setItem("theme", next); } catch {}
      return next;
    });
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
    document.documentElement.style.colorScheme = mode;
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) meta.setAttribute("content", mode);
  }, [mode]);

  const T = mode === "dark" ? DARK : LIGHT;

  return (
    <ThemeContext.Provider value={{ T, mode, toggle }}>{children}</ThemeContext.Provider>
  );
}

function useTheme() {
  return useContext(ThemeContext);
}

// ============================================================
// DATA: Case studies
// ============================================================
const CASE_STUDIES = [
  {
    id: "taco-bell-designops",
    tag: "DESIGN OPERATIONS",
    title: "Scaling Design Ops at Taco Bell",
    excerpt: "Built Taco Bell's first design operating model from scratch: design systems, research ops, intake models, and a $4.5M budget. Turned design into a strategic partner across app, web, and in-store.",
    tags: ["DesignOps", "Design Systems", "Research Ops"],
    stats: [
      { value: "$4.5M", label: "Budget Managed" },
      { value: "60+", label: "Components Shipped" },
      { value: "~1 Sprint", label: "Handoff Time Saved" },
    ],
    color: "#E04B30", colorBg: "#FFF0ED", colorBgDark: "#E04B3018",
    content: {
      intro: "When I joined Taco Bell as its first Design Operations Lead, the UX organization was growing quickly but lacked the operating foundation needed to scale effectively. There was no shared intake model, limited planning infrastructure, and no consistent way for design to partner with product and engineering at the level the business required.",
      intro2: "My role has focused on designing and operationalizing Taco Bell's first multidisciplinary design operating model, bringing UX Research, Content Strategy, and Design Systems together as core, scalable capabilities. The goal has been to enable design to function as a reliable, strategic partner across app, web, and in-store experiences.",
      sections: [
        {
          heading: "Establishing the DesignOps Foundation",
          text: "I stood up Taco Bell's first formal DesignOps practice, defining how work enters the organization, how priorities are set, and how designers collaborate with cross-functional partners. This included establishing shared rituals, documentation, and operating standards that replaced ad-hoc coordination with a repeatable, scalable model. As a result, the UX team now operates with greater clarity, predictability, and alignment as it continues to grow."
        },
        {
          heading: "Launching Taco Bell's First Design System",
          text: "In partnership with product, engineering, and visual design, I helped establish Taco Bell's first internal design system to support both native and responsive experiences across app and web. Beyond components, the system introduced governance, contribution workflows, and shared standards that improved consistency and confidence across teams.",
          results: [
            "Reduced design-to-engineering handoff time by approximately one sprint",
            "Decreased engineering rework by roughly 30%",
            "Enabled more than 60 components now powering a 0-to-1 mobile app redesign, with future web and kiosk expansion planned"
          ]
        },
        {
          heading: "Creating Intake, Planning, and Visibility Infrastructure",
          text: "To reduce friction and improve predictability, I designed and implemented a centralized intake and planning model using Jira and Confluence. This system connects cross-functional requests directly to team capacity, enabling clearer prioritization, improved forecasting, and fewer reactive interruptions. Importantly, this model links design delivery to executive-level OKRs, improving visibility and strengthening leadership confidence in design as a planning and delivery partner."
        },
        {
          heading: "Scaling Tooling, Budget, and Resources",
          text: "I own and manage a $4.5M annual operating budget for the UX organization, overseeing tooling, vendors, and contractor resourcing. This includes leading the rollout and governance of enterprise platforms such as Figma Enterprise and Dovetail to support scalable collaboration, research, and design system governance. Investment decisions are guided by long-term scalability, operational efficiency, and alignment with product strategy."
        },
        {
          heading: "Bringing UX Research In-House",
          text: "I hired and onboarded Taco Bell's first dedicated UX research team, establishing foundational research operations practices, tooling, and team rituals. This shift reduced reliance on ad-hoc or external research models and enabled faster, more consistent access to user insights. Research is now embedded into product planning and delivery, supporting experimentation, personalization, and data-informed design decisions across teams."
        },
        {
          heading: "Supporting Team Health and Remote Growth",
          text: "As the team scaled in a distributed environment, I introduced practices to support sustainable, remote-first collaboration. This included regular retrospectives, reductions in unnecessary meetings, and the formation of a culture committee focused on connection, inclusion, and team health."
        },
        {
          heading: "Ongoing Evolution",
          text: "Design operations at Taco Bell continues to mature. Current focus areas include expanding design system governance and adoption across teams, aligning UX goals and success metrics more tightly with product leadership, and developing support models for cross-brand collaboration within the broader Yum! Brands ecosystem."
        }
      ]
    }
  },
  {
    id: "comcast-ux-coe",
    tag: "UX LEADERSHIP",
    title: "Creating a UX Center of Excellence",
    excerpt: "Turned UX from ad-hoc support into a strategic, operationalized partner across Comcast's enterprise platforms. Coached a junior team, defined service tiers, and introduced the org's first usability metrics.",
    tags: ["UX Leadership", "Org Change", "Enterprise UX"],
    stats: [
      { value: "33%", label: "Reduced UX Drag" },
      { value: "SUS", label: "First Usability Metric" },
      { value: "Figma", label: "Org-Wide Migration" },
    ],
    color: "#2E6383", colorBg: "#E8F5F1", colorBgDark: "#2E638318",
    content: {
      intro: "Following the rebrand of Comcast's internal learning organization from Comcast University to ULearn, the business invested heavily in modern platforms and tooling to support a new generation of employees. However, UX as a discipline was newly introduced to this space and lacked the structure, clarity, and credibility needed to operate effectively.",
      sections: [
        {
          heading: "Context",
          text: "In 2021, Comcast rebranded its internal employee learning organization to ULearn as part of a broader effort to modernize the employee experience. This transformation included adopting modern learning platforms such as Workday and Articulate, replacing legacy SAP-based systems. To support this shift, Comcast hired its first UX team into the ULearn division. However, the team was entirely junior, UX had no historical presence in the organization, stakeholders did not understand UX's role or value, and UX work was often misaligned with business metrics and planning cycles."
        },
        {
          heading: "Role & Scope",
          text: "As Senior Program Manager for Digital Experience, I led the creation of a UX Center of Excellence designed to scale UX capability, educate stakeholders, and increase organizational maturity.",
          results: [
            "Coaching and mentoring a team of junior designers",
            "Defining UX operating models, standards, and outputs",
            "Establishing shared rituals, workflows, and governance",
            "Translating UX value into business-aligned language",
            "Introducing measurement and feedback loops",
            "Leading the organization's transition from Adobe XD to Figma"
          ]
        },
        {
          heading: "Establishing Strategic Credibility for UX",
          text: "I began with a clear data point: less than 20% of employees completed the ULearn content they started, including required compliance training. I reframed the conversation around key insights: completion does not equal comprehension, poor usability and misaligned content reduced engagement, and UX research could uncover the drivers behind drop-off. This framing helped reposition UX from 'design support' to a strategic lever for improving learning effectiveness."
        },
        {
          heading: "Defining the UX Center of Excellence",
          text: "As UX credibility increased, I defined a clear framework to articulate what UX stood for, how it partnered with the business, and where it focused its efforts. These pillars became the foundation for engagement models, measurement practices, and ongoing capability development as UX maturity increased.",
          image: UX_COE_DEFINE,
          imageCaption: "We declared a laser focus on  four core focus areas as a CoE"
        },
        {
          heading: "Designing a Tiered UX Engagement Model",
          text: "To meet varying business needs without overwhelming a small team, I designed and implemented a tiered UX service model. Tier 1 covered embedded UX strategy for flagship initiatives. Tier 2 provided short-term consulting, reviews, and feedback. Tier 3 handled rapid information architecture or visual design support. This model clarified expectations, improved alignment with stakeholders, and allowed UX to focus effort where it delivered the greatest impact."
        },
        {
          heading: "Transitioning the Organization to Figma",
          text: "Recognizing the limitations and stagnation of Adobe XD, I led the transition to Figma as the team's primary design tool. While Comcast held enterprise Adobe licenses, Figma adoption required internal advocacy and coordination across Comcast and NBCUniversal teams. I partnered with stakeholders to secure licensing, onboard the team, and establish governance and workflows that supported collaboration and consistency."
        },
        {
          heading: "Scaling UX Capability Beyond the Design Team",
          text: "As UX maturity increased within the design team, I partnered with the Instructional Design organization to extend UX thinking beyond the core UX function. Rather than relying on ad-hoc training, I developed a phased enablement strategy to build shared understanding of UX methods, decision-making, and measurement over time.",
          image: UX_COE_DEFINE,
          imageCaption: "Phased UX enablement plan designed to build UX capability and shared decision-making across the Instructional Design team"
        },
        {
          heading: "Results & Impact",
          results: [
            "UX gained visibility and credibility as a strategic function",
            "Figma migration completed, improving collaboration and design velocity",
            "Tiered engagement model reduced UX drag by 33%",
            "SUS measurement introduced as the org's first usability benchmark",
            "Cross-functional UX enablement scaled beyond the core design team"
          ]
        }
      ]
    }
  },
  {
    id: "gsk-analytics",
    tag: "PRODUCT DESIGN",
    title: "Improving Decision-Making in Medical Analytics",
    excerpt: "Redesigned GSK's global analytics platform to dramatically improve usability, adoption, and decision-making for medical and compliance teams working with complex clinical data.",
    tags: ["Healthcare UX", "Data Viz", "Platform Redesign"],
    stats: [
      { value: "3x", label: "Faster Insights" },
      { value: "85%", label: "Adoption Rate" },
      { value: "SUS 34\u219281", label: "Usability Gain" },
    ],
    color: "#3D5FA0", colorBg: "#EBF0F8", colorBgDark: "#3D5FA018",
    content: {
      intro: "At GSK, I led the redesign of the AIM (Analytics and Insights for Medical) dashboard, a critical analytics platform used by Medical Insights Analysts to surface trends from large-scale field data. The goal was to transform a failing tool into a reliable, high-performance system that could support real analysis and decision-making.",
      intro2: "The work ultimately delivered dramatic gains in usability, performance, and adoption, but it also revealed how deeply organizational context affects the success of even the best-designed products.",
      sections: [
        {
          heading: "Context",
          text: "For more than a decade, GSK had collected extensive field data from physicians, nurses, and patients covering side effects, prescribing patterns, and competitive insights. Despite the richness of this data, there was no effective way to analyze or synthesize it. The AIM dashboard was created to address this gap. However, the initial implementation built on Power BI struggled almost immediately: the platform could not handle the scale or complexity of the data, load times routinely exceeded 30 minutes, and visualizations lacked the flexibility required for medical analysis. After six months in production, the dashboard was largely unused."
        },
        {
          heading: "Diagnosing the Problem",
          text: "Initial usability testing produced a SUS score of 34, confirming that the dashboard was failing its users. Iterative improvements within Power BI raised the score only to 51, at which point progress stalled. The data made the conclusion unavoidable: the platform itself was the constraint. Power BI could not support the performance demands of GSK's datasets, the types of medical visualizations analysts needed, or the flexibility required for exploratory analysis."
        },
        {
          heading: "Rebuilding the Platform",
          text: "Working with the Product Owner, I spent 8 to 9 months advocating for a full rebuild using a custom technology stack centered on Plotly. This approach offered dramatically improved performance, design flexibility, and control over complex visualizations. At the same time, analyst morale was deteriorating. To rebuild trust and maintain engagement during the transition, we introduced a weekly 'You Said, We Listened' email series highlighting incremental improvements driven by user feedback, along with live demos during every focus group to show progress and reinforce accountability."
        },
        {
          heading: "Solution",
          text: "The redesigned AIM dashboard delivered near-instant load times (reduced from 30+ minutes to seconds), navigation and workflows grounded in real analyst behavior, flexible medically relevant visualizations tailored to insight discovery, and a visual language aligned with the GSK design system. For many analysts, this was the first time the platform enabled meaningful exploration of years of previously underutilized data.",
          images: [AIM_PLOTLY, AIM_TREND],
          imageCaption: "Redesigned AIM dashboard with Plotly-based visualizations"
        },
        {
          heading: "Results & Impact",
          results: [
            "SUS score improved from 34 to 81, well above industry benchmarks",
            "Analyst engagement increased by triple digits",
            "New insights generated from long-dormant datasets",
            "Analyst trust rebuilt through consistent, transparent feedback loops",
            "Awarded the GSK Gold Award (May 2021), the company's highest internal recognition"
          ],
          callout: "Thank you for your relentless advocacy for a better analyst experience. Your leadership aligns with GSK's mission and empowers our company to keep driving its products forward."
        },
        {
          heading: "Reflection",
          text: "This project reinforced a lesson that has shaped the rest of my career: product outcomes are inseparable from organizational context. Despite strong results and formal recognition, the effort required to achieve success was unsustainable. Design was expected to deliver impact without the structural support, processes, or shared understanding needed to do so effectively. That experience became a catalyst for my transition into Design Operations."
        }
      ]
    }
  },
  {
    id: "effectv-ad-platform",
    tag: "UX ENGINEERING",
    title: "Building a Self-Service TV Ad Buying Tool",
    excerpt: "Designed and built Comcast's first self-service digital ad buying platform, making complex media workflows accessible to small and mid-sized businesses.",
    tags: ["UX Design", "Front-End Engineering", "UX Writing"],
    stats: [
      { value: "SUS 41\u219272", label: "Usability Gain" },
      { value: "40%+", label: "Fewer Clicks" },
      { value: "~50%", label: "Faster Tasks" },
    ],
    color: "#7E54A9", colorBg: "#F2ECF8", colorBgDark: "#7E54A918",
    content: {
      intro: "At Comcast Advertising, I worked on the launch of the first self-service linear TV ad buying platform in the U.S., designed specifically for small and 'super-small' businesses. These were local shops and restaurants that had historically viewed TV advertising as inaccessible, expensive, and opaque.",
      sections: [
        {
          heading: "Context & Opportunity",
          text: "Comcast Advertising traditionally relied on account executives to manage high-touch TV advertising campaigns. While effective for large clients, this model did not scale to small businesses with limited budgets, time, or marketing expertise. The opportunity was twofold: enable small businesses to plan and purchase TV ads independently, and reduce manual operational effort by automating campaign setup and execution. Success required more than a new interface; it required rethinking how TV advertising was explained, structured, and experienced."
        },
        {
          heading: "Role & Scope",
          text: "I played a hybrid role across design, content, and front-end engineering, working as part of a cross-functional product team.",
          results: [
            "Designing end-to-end user flows and interaction models",
            "Leading usability testing and iterative refinement",
            "Developing clear, confidence-building product language",
            "Building responsive front-end components for a mobile-first experience",
            "Translating validated design decisions directly into production code"
          ]
        },
        {
          heading: "Designing for Mobile-First, Self-Service Use",
          text: "The platform was built as a Progressive Web App (PWA) to support business owners managing campaigns on the go. Core capabilities included simplified onboarding and campaign setup, a guided ad planner with demographic targeting, campaign performance dashboards, and a browser-based commercial creation tool.",
          results: [
            "Clicks per task reduced by more than 40%",
            "Task completion time cut roughly in half",
            "Mobile usability improved steadily through analytics-driven iteration"
          ],
          image: EFFECTV_MOBILE,
          imageCaption: "Ad Planner mobile experience",
        },
        {
          heading: "Language as a Core UX Lever",
          text: "Early usability testing revealed that layout and navigation were not the primary barriers; language was. Industry terminology such as 'spots,' 'linear opportunities,' and 'inventory' created confusion and hesitation. Users understood their businesses, not the advertising industry. Through interviews, focus groups, and iterative testing, we replaced jargon with plain everyday language, added contextual explanations for unfamiliar concepts, and shifted tone from transactional to supportive and conversational.",
          results: [
            "Initial SUS score of 41 improved through successive iterations",
            "Scores progressively increased to 51, 57, 61, and finally 72",
            "User feedback shifted from confusion to clarity and confidence"
          ],
          images: [EFFECTV_DESKTOP1, EFFECTV_DESKTOP2],
          imageCaption: "Desktop ad management interfaces",
        },
        {
          heading: "Reflection",
          text: "This project reinforced a lesson that has shaped much of my career: clarity is a product feature. Designing effective self-service experiences isn't just about interfaces, it's about translating complexity into language and structures users can understand and trust. As a former small business owner myself, this work was especially meaningful. The most rewarding moment came when early participants returned later in the pilot and finally got it, when TV advertising stopped feeling intimidating and started feeling possible."
        }
      ]
    }
  },
];


const EXPERIENCE = [
  {
    role: "Design Operations Lead",
    company: "Taco Bell",
    years: "Dec 2023 \u2014 Present",
    desc: "Designed and operationalized Taco Bell's first multidisciplinary design operating model, establishing UX Research, Content Strategy, and Design Systems as core, scalable capabilities.",
    bullets: [
      "Scaled and enabled a team of 12 designers by defining org structure, growth frameworks, feedback cadences, and delivery rituals aligned to long-term ecommerce strategy.",
      "Partnered with Product, Engineering, Data, Marketing, and CX leadership to embed design into roadmap planning, prioritization, and KPI definition.",
      "Implemented Taco Bell's first enterprise design system, improving design-to-engineering delivery by one sprint, reducing engineering rework ~30%, and enabling 60+ components.",
      "Established intake, prioritization, and governance mechanisms linking design delivery to executive OKRs and improving visibility, throughput, and decision-making.",
      "Owned and managed a $4.5M annual budget, scaling enterprise tooling and research infrastructure (Figma Enterprise, Dovetail, UserTesting, PlaybookUX).",
      "Led design enablement for a large-scale mobile app redesign, integrating research, experimentation, and AI personalization.",
    ]
  },
  {
    role: "Sr. Program Manager, Digital Experience",
    company: "Comcast",
    years: "Aug 2021 \u2014 Dec 2023",
    desc: "Built and led a UX Center of Excellence, designing operating models and governance that shifted UX from ad-hoc support to a strategic partner across enterprise learning platforms.",
    bullets: [
      "Designed a tiered UX intake and engagement model for enterprise product teams, reducing sprint friction by 33% while improving prioritization and cross-team alignment.",
      "Partnered with product and engineering leadership to embed UX strategy into digital transformation initiatives, influencing roadmaps, sequencing, and resourcing decisions.",
      "Introduced experience measurement (SUS), enabling data-informed design decisions and strengthening the business case for UX investment.",
      "Managed and coached a distributed team of designers, aligning delivery practices and expectations across multiple product teams.",
    ]
  },
  {
    role: "Senior Product Designer",
    company: "GSK",
    years: "May 2020 \u2014 Aug 2021",
    desc: "Led UX strategy and design for global analytics platforms supporting medical and compliance functions.",
    bullets: [
      "Delivered a redesign that improved usability from a SUS of 34 to 81, significantly accelerating analyst time-to-insight and increasing adoption.",
      "Modernized legacy Power BI dashboards with Plotly-based solutions, improving scalability and load times.",
      "Established a recurring research and usability practice to maintain continuous alignment with user needs.",
      "Awarded GSK's 2021 Gold Award for design impact.",
    ]
  },
  {
    role: "UI/UX Engineer",
    company: "Comcast Effectv",
    years: "Jul 2017 \u2014 May 2020",
    desc: "Designed and developed Comcast's first self-service digital advertising platform, contributing to increased ad sales and widespread adoption.",
    bullets: [
      "Led responsive redesigns of internal monitoring tools, improving accessibility and analyst workflow efficiency.",
      "Introduced NPS measurement during pilot. Improved satisfaction by 20+ points and guided iterative improvements.",
      "Served as Certified ScrumMaster, driving Agile best practices across teams.",
    ]
  },
  {
    role: "UX Strategist",
    company: "TopClick",
    years: "Feb 2010 \u2014 Jul 2017",
    desc: "Founded and led a UX consultancy, owning strategy, delivery, and business operations across multiple client engagements.",
    bullets: [
      "Designed and delivered digital products end-to-end, developing deep fluency in tradeoffs between user needs, business goals, technical constraints, and timelines.",
      "Introduced experience measurement frameworks (SUS, NPS) to quantify impact and guide investment decisions.",
    ]
  },
];

const EDUCATION = [
  { school: "Drexel University", degree: "M.B.A.", field: "Innovation Management" },
  { school: "Temple University", degree: "B.B.A.", field: "Business Administration" },
];

const SKILLS = [
  "Agile & Scrum", "People Leadership", "AI & Emerging Tech",
  "Product Design", "UX Strategy", "UX Metrics (SUS, NPS)",
  "Stakeholder Alignment", "Design Systems", "Design Leadership",
  "Digital Operations", "Jira, Confluence, Asana", "Figma",
];

// ============================================================
// HOOKS
// ============================================================
function useInView(t = 0.15) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.unobserve(el); } }, { threshold: t });
    obs.observe(el);
    return () => obs.disconnect();
  }, [t]);
  return [ref, v];
}

function useIsMobile(bp = 768) {
  const [m, setM] = useState(false);
  useEffect(() => { const c = () => setM(window.innerWidth <= bp); c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c); }, [bp]);
  return m;
}

// URL-aware router context
const RouterContext = React.createContext({ route: "/", navigate: () => {} });

function RouterProvider({ children }) {
  const [route, setRoute] = useState(window.location.pathname);

  const navigate = (path) => {
    window.history.pushState(null, "", path);
    setRoute(path);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const onPop = () => setRoute(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return (
    <RouterContext.Provider value={{ route, navigate }}>{children}</RouterContext.Provider>
  );
}

function useRouter() {
  return React.useContext(RouterContext);
}

function NavLink({ to, children, style = {}, className = "", onClick: extraOnClick }) {
  const { navigate } = useRouter();
  return (
    <a href={to} className={className} style={style} onClick={(e) => { e.preventDefault(); navigate(to); if (extraOnClick) extraOnClick(); }}>{children}</a>
  );
}

// ============================================================
// UTILITY COMPONENTS
// ============================================================
function FadeIn({ children, delay = 0, className = "", style = {} }) {
  const [ref, vis] = useInView(0.1);
  return <div ref={ref} className={className} style={{ ...style, opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(32px)", transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s` }}>{children}</div>;
}

function SectionLabel({ children, light }) {
  const { T } = useTheme();
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: light ? T.resumeAccent : T.accentWarmText, marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 32, height: 2, background: `linear-gradient(90deg, ${T.accentWarm}, ${T.accent})`, borderRadius: 2 }} />
      {children}
    </div>
  );
}

const DownloadIcon = ({ size = 14, color = "currentColor" }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <path d="M7 1V9.5M7 9.5L10.5 6M7 9.5L3.5 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1.5 11.5H12.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ArrowLeft = ({ size = 16, color = "currentColor" }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
    <path d="M10 3L5 8L10 13" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SunIcon = ({ size = 18 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = ({ size = 18 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

// ============================================================
// NAV
// ============================================================
function Nav({ scrolled }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { T, mode, toggle } = useTheme();
  const menuBtnRef = useRef(null);
  const menuRef = useRef(null);
  const items = [
    { label: "Experience", to: "/work" },
    { label: "Resume", to: "/resume" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  // Close mobile menu on Escape, manage focus
  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuBtnRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    // Focus first menu item when opened
    const firstLink = menuRef.current?.querySelector("a");
    if (firstLink) firstLink.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: (scrolled || menuOpen) ? T.navBg : "transparent", backdropFilter: (scrolled || menuOpen) ? "blur(20px)" : "none", WebkitBackdropFilter: (scrolled || menuOpen) ? "blur(20px)" : "none", borderBottom: (scrolled || menuOpen) ? `1px solid ${T.border}` : "1px solid transparent", transition: "all 0.4s ease" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <NavLink to="/" style={{ fontFamily: "'Fraunces', serif", fontSize: 20, color: T.textHeading, letterSpacing: "-0.02em", fontWeight: 400, textDecoration: "none", position: "relative", zIndex: 110 }}>Dennis Berger</NavLink>
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 32 }}>
          {!isMobile && items.map(i => <NavLink key={i.label} to={i.to} className="nav-link" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: T.textMuted, textDecoration: "none", letterSpacing: "0.02em", fontWeight: 500, transition: "color 0.2s" }}>{i.label}</NavLink>)}
          <button onClick={toggle} aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`} style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: "50%", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.textMuted, transition: "all 0.2s", flexShrink: 0, position: "relative", zIndex: 110 }}>
            {mode === "light" ? <MoonIcon size={16} /> : <SunIcon size={16} />}
          </button>
          {isMobile && (
            <button ref={menuBtnRef} onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="mobile-menu" style={{ background: "none", border: "none", cursor: "pointer", padding: 8, position: "relative", zIndex: 110, display: "flex", flexDirection: "column", gap: menuOpen ? 0 : 5, alignItems: "center", justifyContent: "center", width: 44, height: 44 }} aria-label="Toggle navigation menu">
              <span style={{ display: "block", width: 22, height: 2, background: T.textHeading, borderRadius: 2, transition: "all 0.3s", transform: menuOpen ? "rotate(45deg)" : "rotate(0)", position: menuOpen ? "absolute" : "relative" }} />
              <span style={{ display: "block", width: 22, height: 2, background: T.textHeading, borderRadius: 2, transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }} />
              <span style={{ display: "block", width: 22, height: 2, background: T.textHeading, borderRadius: 2, transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg)" : "rotate(0)", position: menuOpen ? "absolute" : "relative" }} />
            </button>
          )}
        </div>
      </div>
      {isMobile && (
        <div id="mobile-menu" ref={menuRef} role="menu" aria-hidden={!menuOpen} style={{ maxHeight: menuOpen ? 280 : 0, opacity: menuOpen ? 1 : 0, overflow: "hidden", transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)", background: T.navBg, borderTop: menuOpen ? `1px solid ${T.border}` : "none" }}>
          <div style={{ padding: "16px 32px 28px", display: "flex", flexDirection: "column", gap: 8 }}>
            {items.map((item, i) => <NavLink key={item.label} to={item.to} onClick={() => setMenuOpen(false)} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: T.textHeading, textDecoration: "none", fontWeight: 500, padding: "14px 0", minHeight: 44, display: "flex", alignItems: "center", borderBottom: i < items.length - 1 ? `1px solid ${T.border}` : "none" }}>{item.label}</NavLink>)}
          </div>
        </div>
      )}
    </nav>
  );
}

// ============================================================
// FOOTER
// ============================================================
function Footer() {
  const { T } = useTheme();
  return (
    <footer style={{ background: T.resumeBg, padding: "32px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: `${T.resumeText}80` }}>&copy; 2026 Dennis Berger</span>
        <span style={{ fontFamily: "'Fraunces', serif", fontSize: 13, color: `${T.resumeText}99`, fontStyle: "italic" }}>Philadelphia, PA</span>
      </div>
    </footer>
  );
}


// ============================================================
// REUSABLE BLOCKS
// ============================================================
function CaseStudyCard({ study }) {
  const [h, setH] = useState(false);
  const { T } = useTheme();
  const tagBg = T.isDark ? study.colorBgDark : study.colorBg;
  return (
    <NavLink to={`/work/${study.id}`} style={{ textDecoration: "none" }} onClick={() => { setH(false); }}>
      <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ background: T.surface, borderRadius: 20, overflow: "hidden", border: `1px solid ${h ? study.color + "25" : T.border}`, transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)", transform: h ? "translateY(-6px)" : "translateY(0)", boxShadow: h ? `0 24px 64px ${study.color}12, 0 8px 24px rgba(0,0,0,0.05)` : "0 2px 12px rgba(0,0,0,0.03)", cursor: "pointer", height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ height: 3, background: `linear-gradient(90deg, ${study.color}, ${study.color}50)`, opacity: h ? 1 : 0.3, transition: "opacity 0.4s" }} />
        <div style={{ padding: "36px 36px 20px", flex: 1 }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: study.color, background: tagBg, padding: "5px 12px", borderRadius: 100, display: "inline-block", marginBottom: 18 }}>{study.tag}</span>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 25, color: T.textHeading, lineHeight: 1.2, letterSpacing: "-0.015em", margin: "0 0 14px", fontWeight: 400 }}>{study.title}</h3>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.65, color: T.textMuted, margin: "0 0 24px" }}>{study.excerpt}</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
            {study.tags.map((t, i) => <span key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: T.textMuted, background: T.surfaceMuted, padding: "6px 14px", borderRadius: 100, letterSpacing: "0.02em" }}>{t}</span>)}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderTop: `1px solid ${T.border}`, background: T.isDark ? T.surfaceMuted : `${T.bg}90` }}>
          {study.stats.map((stat, i) => (
            <div key={i} style={{ padding: "20px", textAlign: "center", borderRight: i < 2 ? `1px solid ${T.border}` : "none" }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 21, color: study.color, letterSpacing: "-0.02em", fontWeight: 500 }}>{stat.value}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10.5, fontWeight: 600, color: T.textMuted, letterSpacing: "0.05em", textTransform: "uppercase", marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </NavLink>
  );
}

function CaseStudyGrid({ studies }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 480px), 1fr))", gap: 28 }}>
      {studies.map((s, i) => <FadeIn key={s.id} delay={i * 0.08}><CaseStudyCard study={s} /></FadeIn>)}
    </div>
  );
}

function ExperienceRow({ exp, index }) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const { T } = useTheme();
  return (
    <FadeIn delay={index * 0.06}>
      <button onClick={() => setOpen(!open)} aria-expanded={open} style={{ display: "block", width: "100%", padding: isMobile ? "24px 0" : "32px 0", border: "none", borderTop: `1px solid ${T.resumeBorder}`, background: "transparent", cursor: "pointer", WebkitTapHighlightColor: "transparent", textAlign: "left" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: isMobile ? 8 : 16, flexWrap: "wrap" }}>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: isMobile ? 19 : 23, color: open ? T.resumeAccent : T.resumeText, letterSpacing: "-0.01em", margin: 0, fontWeight: 400, transition: "color 0.3s" }}>{exp.role}</h3>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: isMobile ? 14 : 15, fontWeight: 500, color: open ? `${T.resumeAccent}CC` : T.textMuted, transition: "color 0.3s" }}>@ {exp.company}</span>
            </div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: T.resumeTextDim, display: "block", marginTop: 6 }}>{exp.years}</span>
            <div style={{ maxHeight: open ? 600 : 0, opacity: open ? 1 : 0, overflow: "hidden", transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.65, color: T.resumeTextMuted, margin: "12px 0 0" }}>{exp.desc}</p>
              {exp.bullets && (
                <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                  {exp.bullets.map((b, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: T.resumeAccent, flexShrink: 0, marginTop: 8 }} />
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.6, color: `${T.resumeText}90` }}>{b}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${T.resumeText}12`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s", transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0, marginTop: 4 }}>
            <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke={open ? T.resumeAccent : `${T.resumeText}90`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </div>
      </button>
    </FadeIn>
  );
}

function ResumeTimeline() {
  const isMobile = useIsMobile();
  const { T } = useTheme();
  return (
    <section style={{ background: T.resumeBg, padding: "120px 32px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: "-10%", top: "-10%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${T.resumeGlow1}, ${T.resumeGlow2}, transparent 65%)`, filter: "blur(80px)" }} />
      <div style={{ position: "absolute", left: "-5%", bottom: "-5%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${T.resumeGlow3}, transparent 65%)`, filter: "blur(60px)" }} />
      <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <FadeIn>
          <SectionLabel light>Resume</SectionLabel>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 64, flexWrap: "wrap", gap: 16 }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(30px, 4vw, 46px)", color: T.resumeText, lineHeight: 1.12, letterSpacing: "-0.025em", margin: 0, fontWeight: 400 }}>
              15+ years of making<br />design{" "}
              <span style={{ background: T.accentWarmGradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontStyle: "italic" }}>work</span>
            </h2>
            {isMobile ? (
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.resumeAccent, margin: 0, opacity: 0.7 }}>Tap to expand</p>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.resumeAccent, margin: 0, opacity: 0.7 }}>Click to expand</p>
                <a href="https://rxr.nuovo.cx/dberger/principal-design-ops?ref=dennisberger.me" target="_blank" rel="noopener noreferrer" className="btn-download" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: T.resumeAccent, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 24px", minHeight: 44, borderRadius: 100, border: `1px solid ${T.resumeAccent}40`, transition: "all 0.2s" }}>
                  <DownloadIcon size={14} /> Download PDF<span className="sr-only"> (opens in new tab)</span>
                </a>
              </div>
            )}
          </div>
        </FadeIn>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {EXPERIENCE.map((exp, i) => <ExperienceRow key={i} exp={exp} index={i} />)}
        </div>
        {isMobile && (
          <FadeIn delay={0.3}>
            <div style={{ borderTop: `1px solid ${T.resumeBorder}`, paddingTop: 32, marginTop: 8, textAlign: "center" }}>
              <a href="https://rxr.nuovo.cx/dberger/principal-design-ops?ref=dennisberger.me" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: T.resumeAccent, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 24px", minHeight: 44, borderRadius: 100, border: `1px solid ${T.resumeAccent}40` }}>
                <DownloadIcon size={14} /> Download PDF<span className="sr-only"> (opens in new tab)</span>
              </a>
            </div>
          </FadeIn>
        )}

        {/* Education & Skills */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: 64, borderTop: `1px solid ${T.resumeBorder}`, paddingTop: 48 }} className="resume-bottom-grid">
          <FadeIn delay={0.1}>
            <div>
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: T.resumeAccent, marginBottom: 24 }}>Education</h3>
              {EDUCATION.map((ed, i) => (
                <div key={i} style={{ marginBottom: i < EDUCATION.length - 1 ? 20 : 0 }}>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, color: T.resumeText, fontWeight: 400 }}>{ed.degree}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: T.resumeTextMuted, marginTop: 4 }}>{ed.field}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.resumeTextDim, marginTop: 2 }}>{ed.school}</div>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div>
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: T.resumeAccent, marginBottom: 24 }}>Skills</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {SKILLS.map((s, i) => (
                  <span key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.resumeTextMuted, background: `${T.resumeText}10`, padding: "7px 14px", borderRadius: 100, border: `1px solid ${T.resumeText}18` }}>{s}</span>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  const { T } = useTheme();
  const bodyStyle = { fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.75, color: T.textMuted, margin: 0 };
  return (
    <section style={{ background: T.bg, padding: "120px 32px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <FadeIn>
          <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "start" }}>
            <div>
              <SectionLabel>About</SectionLabel>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(26px, 3.2vw, 38px)", color: T.textHeading, lineHeight: 1.18, letterSpacing: "-0.02em", margin: "0 0 28px", fontWeight: 400 }}>Serious about outcomes,<br />not precious about process</h2>
              <div style={{ width: "100%", maxWidth: 240, marginBottom: 28, borderRadius: 16, overflow: "hidden", boxShadow: `0 8px 32px ${T.accent}15, 0 2px 8px rgba(0,0,0,0.06)` }}>
                <img src={PHOTO_SRC} alt="Dennis Berger" style={{ width: "100%", display: "block" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <p style={{ ...bodyStyle, fontSize: 15.5 }}>I'm a Design Operations and UX strategy leader based in Philadelphia, focused on building the systems and environments that help design teams do their best work.</p>
                <p style={{ ...bodyStyle, fontSize: 15.5 }}>I started hands-on. I wrote my first line of HTML at 12 years old, founded my own UX consultancy at 22, then spent years of designing and shipping products at Fortune 50 companies. That foundation shaped how I think about operations: practical, user-centered, and grounded in the realities of delivery.</p>
                <p style={{ ...bodyStyle, fontSize: 15.5 }}>Good operations should feel supportive, not restrictive. Teams do their best work when they're trusted, well-supported and given room to experiment.</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ background: T.surfaceMuted, borderRadius: 20, padding: 36 }}>
                <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: T.accent, margin: "0 0 20px" }}>Core Focus Areas</h4>
                {["Design Systems & Governance", "Research Operations", "Intake & Capacity Planning", "Tooling & Platform Strategy", "Team Enablement & Culture", "Cross-Functional Alignment"].map((item, i) => (
                  <div key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, color: T.textHeading, padding: "12px 0", borderBottom: i < 5 ? `1px solid ${T.border}` : "none", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.accentWarmGradient, flexShrink: 0 }} />
                    {item}
                  </div>
                ))}
              </div>
              <div style={{ background: `linear-gradient(145deg, ${T.resumeBg}, ${T.isDark ? "#0A0C24" : "#070335"})`, borderRadius: 20, padding: 36, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", right: -30, top: -30, width: 120, height: 120, borderRadius: "50%", background: `radial-gradient(circle, ${T.accentSecondary}18, transparent 70%)`, filter: "blur(25px)" }} />
                <div style={{ position: "absolute", left: 0, bottom: 0, width: 80, height: 80, borderRadius: "50%", background: `radial-gradient(circle, ${T.accent}10, transparent 70%)`, filter: "blur(20px)" }} />
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 21, color: "#FFFFFF", lineHeight: 1.45, fontStyle: "italic", position: "relative" }}>
                  "Operations is where design turns into impact. I'm not designing screens. I'm designing systems, processes, and team confidence."
                </div>
                <div style={{ marginTop: 20, width: 40, height: 3, borderRadius: 2, background: T.accentWarmGradient }} />
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function ContactBand() {
  const { T } = useTheme();
  return (
    <section style={{ background: T.isDark ? T.surfaceMuted : T.surfaceMuted, padding: "80px 32px", borderTop: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <FadeIn>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, color: T.textHeading, letterSpacing: "-0.02em", margin: "0 0 12px", fontWeight: 400 }}>Get in touch</h3>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.65, color: T.textMuted, margin: "0 0 32px" }}>
            Have a question or want to connect? Reach out via the contact form or connect with me on LinkedIn.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <NavLink to="/contact" className="btn-contact" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "#FFFFFF", background: T.accentGradient, padding: "12px 28px", borderRadius: 100, textDecoration: "none", transition: "transform 0.2s, box-shadow 0.2s", boxShadow: `0 4px 20px ${T.accent}20` }}>Reach Out</NavLink>
            <a href="https://linkedin.com/in/dennisberger" target="_blank" rel="noopener noreferrer" className="btn-linkedin" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: T.textHeading, background: T.surface, padding: "12px 28px", borderRadius: 100, textDecoration: "none", border: `1px solid ${T.border}`, transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: 8 }}>
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn<span className="sr-only"> (opens in new tab)</span>
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}


// ============================================================
// PAGE: Home
// ============================================================
function HomePage() {
  const [loaded, setLoaded] = useState(false);
  const { T } = useTheme();
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <>
      <section style={{ minHeight: "min(100vh, 900px)", display: "flex", alignItems: "center", background: T.bg, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: "-6%", top: "8%", width: 550, height: 550, borderRadius: "50%", background: `radial-gradient(circle at 40% 40%, ${T.teal}14, ${T.accent}08, transparent 70%)`, filter: "blur(80px)" }} />
        <div style={{ position: "absolute", left: "-4%", bottom: "5%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${T.accentWarm}10, transparent 70%)`, filter: "blur(60px)" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.018, backgroundImage: `radial-gradient(${T.textHeading} 1px, transparent 1px)`, backgroundSize: "32px 32px" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "140px 32px 100px", position: "relative", zIndex: 1, width: "100%" }}>
          <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(40px)", transition: "all 0.9s cubic-bezier(0.16,1,0.3,1)" }}>
            <SectionLabel>Design Operations Leader</SectionLabel>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(42px, 6.2vw, 78px)", lineHeight: 1.08, letterSpacing: "-0.03em", color: T.textHeading, maxWidth: 880, fontWeight: 400, margin: 0 }}>
              I build the systems that help design teams{" "}
              <span style={{ background: T.accentWarmGradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontStyle: "italic" }}>thrive</span>
            </h1>
          </div>
          <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(40px)", transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, lineHeight: 1.7, color: T.textMuted, maxWidth: 560, marginTop: 32, fontWeight: 400 }}>
              Operating models, design systems, research ops, and team enablement. 15+ years of experience across Taco Bell, Comcast, GSK, and my own UX consultancy, focused on making design a reliable, strategic function.
            </p>
          </div>
          <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(40px)", transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s", display: "flex", gap: 16, marginTop: 44, flexWrap: "wrap" }}>
            <a href="#work-section" className="btn-primary" onClick={(e) => { e.preventDefault(); document.getElementById("work-section")?.scrollIntoView({ behavior: "smooth" }); }} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: "#FFFFFF", background: T.accentGradient, padding: "15px 34px", borderRadius: 100, textDecoration: "none", transition: "transform 0.25s, box-shadow 0.25s", boxShadow: `0 6px 28px ${T.accent}30`, display: "inline-flex", alignItems: "center", gap: 10 }}>
              View Case Studies <span style={{ fontSize: 16 }}>&darr;</span>
            </a>
            <a href="https://rxr.nuovo.cx/dberger/principal-design-ops?ref=dennisberger.me" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: T.textHeading, background: "transparent", padding: "15px 34px", borderRadius: 100, textDecoration: "none", border: `1.5px solid ${T.isDark ? T.textMuted + "40" : T.textHeading + "18"}`, transition: "all 0.25s", display: "inline-flex", alignItems: "center", gap: 10 }}>
              <DownloadIcon size={15} color={T.textHeading} /> Download Resume<span className="sr-only"> (opens in new tab)</span>
            </a>
          </div>
          <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)", transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s", display: "flex", gap: 20, marginTop: 72, flexWrap: "wrap" }}>
            {[{ num: "15+", label: "Years in UX" }, { num: "4", label: "Enterprise Orgs" }, { num: "$4.5M", label: "Budget Managed" }].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, background: T.surface, borderRadius: 100, padding: "12px 24px 12px 16px", border: `1px solid ${T.border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.03)" }}>
                <span style={{ fontFamily: "'Fraunces', serif", fontSize: 24, color: T.accentWarmText, letterSpacing: "-0.02em", fontWeight: 500 }}>{s.num}</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: T.textMuted, letterSpacing: "0.05em", textTransform: "uppercase" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="work-section" style={{ background: T.bg, padding: "80px 32px 120px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 64, flexWrap: "wrap", gap: 20 }}>
              <div>
                <SectionLabel>Selected Work</SectionLabel>
                <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(30px, 4vw, 46px)", color: T.textHeading, lineHeight: 1.12, letterSpacing: "-0.025em", margin: 0, fontWeight: 400 }}>Building design's<br />operating backbone</h2>
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.65, color: T.textMuted, maxWidth: 380, margin: 0 }}>Each project reflects how I turn operational gaps into durable systems, whether I'm standing up a new function or scaling an established one.</p>
            </div>
          </FadeIn>
          <CaseStudyGrid studies={CASE_STUDIES} />
        </div>
      </section>

      <ResumeTimeline />
      <AboutSection />
      <ContactBand />
    </>
  );
}

// ============================================================
// PAGE: Case Study Detail
// ============================================================
function CaseStudyPage({ studyId }) {
  const { T } = useTheme();
  const bodyStyle = { fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.75, color: T.textMuted, margin: 0 };
  useEffect(() => { window.scrollTo(0, 0); }, [studyId]);
  const study = CASE_STUDIES.find(s => s.id === studyId);
  if (!study) return <div style={{ padding: "200px 32px", textAlign: "center", fontFamily: "'DM Sans', sans-serif", color: T.textMuted }}>Case study not found.</div>;
  const { content } = study;
  const tagBg = T.isDark ? study.colorBgDark : study.colorBg;

  // Find next case study for nav
  const idx = CASE_STUDIES.findIndex(s => s.id === studyId);
  const next = CASE_STUDIES[(idx + 1) % CASE_STUDIES.length];

  return (
    <>
      {/* Header area */}
      <section style={{ background: T.bg, padding: "120px 32px 0" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <FadeIn>
            <NavLink to="/work" className="back-link" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: T.textMuted, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 40, transition: "color 0.2s" }}>
              <ArrowLeft size={14} /> All work
            </NavLink>
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: study.color, background: tagBg, padding: "5px 12px", borderRadius: 100, display: "inline-block" }}>{study.tag}</span>
            </div>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(32px, 4.5vw, 50px)", color: T.textHeading, lineHeight: 1.12, letterSpacing: "-0.025em", margin: "0 0 24px", fontWeight: 400 }}>{study.title}</h1>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 40 }}>
              {study.tags.map((t, i) => <span key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: T.textMuted, background: T.surfaceMuted, padding: "6px 14px", borderRadius: 100, letterSpacing: "0.02em" }}>{t}</span>)}
            </div>
          </FadeIn>

          {/* Stats bar */}
          <FadeIn delay={0.1}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", background: T.surface, borderRadius: 16, border: `1px solid ${T.border}`, overflow: "hidden", marginBottom: 56 }}>
              {study.stats.map((stat, i) => (
                <div key={i} style={{ padding: 28, textAlign: "center", borderRight: i < 2 ? `1px solid ${T.border}` : "none" }}>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 28, color: study.color, fontWeight: 500 }}>{stat.value}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: T.textMuted, letterSpacing: "0.05em", textTransform: "uppercase", marginTop: 6 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Content */}
      <section style={{ background: T.bg, padding: "0 32px 80px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {/* Intro */}
          <FadeIn delay={0.15}>
            <p style={{ ...bodyStyle, fontSize: 18, lineHeight: 1.75, marginBottom: content.intro2 ? 20 : 48 }}>{content.intro}</p>
            {content.intro2 && <p style={{ ...bodyStyle, fontSize: 17, lineHeight: 1.75, marginBottom: 48 }}>{content.intro2}</p>}
          </FadeIn>

          {/* Sections */}
          {content.sections.map((sec, i) => (
            <FadeIn key={i} delay={0.05}>
              <div style={{ marginBottom: 48 }}>
                {sec.heading && (
                  <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, color: T.textHeading, letterSpacing: "-0.015em", margin: "0 0 16px", fontWeight: 400, lineHeight: 1.25 }}>{sec.heading}</h2>
                )}
                {sec.text && <p style={{ ...bodyStyle, marginBottom: sec.results || sec.callout ? 20 : 0 }}>{sec.text}</p>}
                {sec.results && (
                  <div style={{ background: T.surfaceMuted, borderRadius: 12, padding: "20px 24px", marginTop: sec.text ? 16 : 0 }}>
                    {sec.results.map((r, j) => (
                      <div key={j} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, color: T.textHeading, padding: "10px 0", borderBottom: j < sec.results.length - 1 ? `1px solid ${T.border}` : "none", display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: study.color, flexShrink: 0, marginTop: 7 }} />
                        {r}
                      </div>
                    ))}
                  </div>
                )}
                {/* Single image */}
                {sec.image && (
                  <figure style={{ margin: "24px 0 0", padding: 0 }}>
                    <img src={sec.image} alt={sec.imageCaption || ""} style={{ width: "100%", display: "block" }} />
                    {sec.imageCaption && (
                      <figcaption style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.textMuted, textAlign: "center", marginTop: 12 }}>{sec.imageCaption}</figcaption>
                    )}
                  </figure>
                )}
                {/* Image pair (side by side) */}
                {sec.images && (
                  <figure style={{ margin: "24px 0 0", padding: 0 }}>
                    <div className="image-pair" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      {sec.images.map((img, k) => (
                        <img key={k} src={img} alt="" style={{ width: "100%", display: "block" }} />
                      ))}
                    </div>
                    {sec.imageCaption && (
                      <figcaption style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.textMuted, textAlign: "center", marginTop: 12 }}>{sec.imageCaption}</figcaption>
                    )}
                  </figure>
                )}
                {sec.callout && (
                  <div style={{ background: `linear-gradient(145deg, ${T.resumeBg}, ${T.isDark ? "#0A0C24" : "#070335"})`, borderRadius: 16, padding: 32, marginTop: 24, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", right: -20, top: -20, width: 100, height: 100, borderRadius: "50%", background: `radial-gradient(circle, ${study.color}15, transparent 70%)`, filter: "blur(20px)" }} />
                    <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, color: "#FFFFFF", lineHeight: 1.55, fontStyle: "italic", position: "relative" }}>
                      "{sec.callout}"
                    </div>
                    <div style={{ marginTop: 16, width: 32, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${study.color}, ${T.accent})` }} />
                  </div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Next case study */}
      {next && (
        <section style={{ background: T.surfaceMuted, padding: "64px 32px", borderTop: `1px solid ${T.border}` }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <FadeIn>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textMuted, marginBottom: 16 }}>Next Case Study</p>
              <NavLink to={`/work/${next.id}`} style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}
                className="next-study-link"
              >
                <div>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: next.color }}>{next.tag}</span>
                  <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, color: T.textHeading, letterSpacing: "-0.015em", margin: "8px 0 0", fontWeight: 400 }}>{next.title}</h3>
                </div>
                <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M9 6L15 12L9 18" stroke={T.textHeading} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </NavLink>
            </FadeIn>
          </div>
        </section>
      )}
    </>
  );
}

// ============================================================
// PAGE: Resume (standalone)
// ============================================================
function ResumePage() {
  const { T } = useTheme();
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <>
      {/* Light header */}
      <section style={{ background: T.bg, padding: "140px 32px 64px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <FadeIn>
            <SectionLabel>Resume</SectionLabel>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(34px, 4.5vw, 52px)", color: T.textHeading, lineHeight: 1.1, letterSpacing: "-0.025em", margin: "0 0 16px", fontWeight: 400 }}>Work Experience</h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, lineHeight: 1.65, color: T.textMuted, maxWidth: 620, margin: "0 0 0" }}>
              Senior Design Operations leader with 15+ years scaling multidisciplinary design organizations across consumer, retail, and enterprise environments. Known for translating ambiguity into scalable systems that support high-impact product teams.
            </p>
          </FadeIn>
        </div>
      </section>
      <ResumeTimeline />
    </>
  );
}

// ============================================================
// PAGE: About (standalone)
// ============================================================
function AboutPage() {
  const { T } = useTheme();
  const bodyStyle = { fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.75, color: T.textMuted, margin: 0 };
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <>
      {/* Light header */}
      <section style={{ background: T.bg, padding: "140px 32px 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeIn>
            <SectionLabel>About</SectionLabel>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(34px, 4.5vw, 52px)", color: T.textHeading, lineHeight: 1.1, letterSpacing: "-0.025em", margin: "0 0 16px", fontWeight: 400 }}>
              Serious about outcomes,<br />not precious about process
            </h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, lineHeight: 1.65, color: T.textMuted, maxWidth: 560, margin: "0 0 56px" }}>
              Design Operations and UX strategy leader based in Philadelphia.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Main content */}
      <section style={{ background: T.bg, padding: "0 32px 80px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="about-page-grid" style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 64, alignItems: "start" }}>
            {/* Left column: photo + focus areas */}
            <FadeIn>
              <div style={{ position: "sticky", top: 100 }}>
                <div style={{ width: "100%", marginBottom: 32, borderRadius: 16, overflow: "hidden", boxShadow: `0 8px 32px ${T.accent}15, 0 2px 8px rgba(0,0,0,0.06)` }}>
                  <img src={PHOTO_SRC} alt="Dennis Berger" style={{ width: "100%", display: "block" }} />
                </div>
                <div style={{ background: T.surfaceMuted, borderRadius: 16, padding: 28 }}>
                  <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: T.accent, margin: "0 0 16px" }}>Core Focus</h4>
                  {["Design Systems & Governance", "Research Operations", "Intake & Capacity Planning", "Tooling & Platform Strategy", "Team Enablement & Culture", "Cross-Functional Alignment"].map((item, i) => (
                    <div key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, color: T.textHeading, padding: "10px 0", borderBottom: i < 5 ? `1px solid ${T.border}` : "none", display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.accentWarmGradient, flexShrink: 0 }} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Right column: narrative */}
            <FadeIn delay={0.1}>
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <p style={{ ...bodyStyle, fontSize: 18, lineHeight: 1.8 }}>
                  I'm a Design Operations and UX strategy leader based in Philadelphia, focused on building the systems and environments that help design teams do their best work.
                </p>
                <p style={bodyStyle}>
                  I started my career hands-on, writing my first line of HTML at 12 and spending years designing, building, and shipping digital products. That foundation shaped how I think about UX today: practical, user-centered, and grounded in the realities of delivery.
                </p>

                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, color: T.textHeading, letterSpacing: "-0.015em", margin: "16px 0 0", fontWeight: 400 }}>From practitioner to operator</h3>
                <p style={bodyStyle}>
                  In 2010, I founded a UX consultancy called TopClick, where I spent seven years leading end-to-end client work across strategy, design, development, and operations. Running my own business taught me how to deliver high-quality work consistently, balance competing constraints, and build trust with both clients and collaborators. It also gave me a deep appreciation for the operational side of design long before I had a name for it.
                </p>
                <p style={bodyStyle}>
                  I later brought that mindset into larger organizations, including Comcast and GSK, where I led UX initiatives in complex, highly regulated environments. Over time, my focus shifted from individual products to the systems behind them: operating models, research practices, tooling, and ways of working that enable teams to scale without burning out or losing clarity.
                </p>

                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, color: T.textHeading, letterSpacing: "-0.015em", margin: "16px 0 0", fontWeight: 400 }}>What I do now</h3>
                <p style={bodyStyle}>
                  Today, I lead Design Operations at Taco Bell, supporting a multidisciplinary UX team working across the mobile app, website, and in-store experiences. My work spans design systems, research operations, capacity planning, tooling and governance, and team enablement. At its core, it's about making design a reliable, strategic partner to the business and creating conditions where teams can focus on meaningful problems instead of fighting their tools or processes.
                </p>

                {/* Pull quote */}
                <div style={{ background: `linear-gradient(145deg, ${T.resumeBg}, ${T.isDark ? "#0A0C24" : "#070335"})`, borderRadius: 16, padding: 36, position: "relative", overflow: "hidden", margin: "16px 0" }}>
                  <div style={{ position: "absolute", right: -30, top: -30, width: 120, height: 120, borderRadius: "50%", background: `radial-gradient(circle, ${T.accentSecondary}18, transparent 70%)`, filter: "blur(25px)" }} />
                  <div style={{ position: "absolute", left: 0, bottom: 0, width: 80, height: 80, borderRadius: "50%", background: `radial-gradient(circle, ${T.accent}10, transparent 70%)`, filter: "blur(20px)" }} />
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, color: "#FFFFFF", lineHeight: 1.5, fontStyle: "italic", position: "relative" }}>
                    "Good operations should feel supportive, not restrictive. Teams do their best work when they're trusted, well-supported, and given room to experiment."
                  </div>
                  <div style={{ marginTop: 20, width: 40, height: 3, borderRadius: 2, background: T.accentWarmGradient }} />
                </div>

                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, color: T.textHeading, letterSpacing: "-0.015em", margin: "16px 0 0", fontWeight: 400 }}>How I work</h3>
                <p style={bodyStyle}>
                  Whether I'm shaping an operating model, rolling out a design system, or helping a team navigate change, I bring a mix of clarity, pragmatism, and humanity to the work. I believe structure and flexibility aren't opposites; they reinforce each other when you get the balance right. That shows up in how I lead and how I build.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
      <ContactBand />
    </>
  );
}

// ============================================================
// PAGE: Work (dedicated listing)
// ============================================================
function WorkPage() {
  const { T } = useTheme();
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <>
      <section style={{ background: T.bg, padding: "140px 32px 120px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <FadeIn>
            <SectionLabel>All Work</SectionLabel>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(34px, 4.5vw, 54px)", color: T.textHeading, lineHeight: 1.1, letterSpacing: "-0.025em", margin: "0 0 16px", fontWeight: 400 }}>Case Studies</h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, lineHeight: 1.65, color: T.textMuted, maxWidth: 520, margin: "0 0 64px" }}>
              A closer look at how I've built, scaled, and operationalized design across enterprise organizations.
            </p>
          </FadeIn>
          <CaseStudyGrid studies={CASE_STUDIES} />
        </div>
      </section>
      <ContactBand />
    </>
  );
}

// ============================================================
// PAGE: Contact
// ============================================================
function ContactPage() {
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { T } = useTheme();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("https://formspree.io/f/xyzepddp", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        setStatus("success");
        setName(""); setEmail(""); setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section style={{ background: T.bg, padding: "140px 32px 120px" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <FadeIn>
          <SectionLabel>Contact</SectionLabel>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(30px, 4vw, 44px)", color: T.textHeading, lineHeight: 1.12, letterSpacing: "-0.025em", margin: "0 0 16px", fontWeight: 400 }}>Send me a note</h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.65, color: T.textMuted, margin: "0 0 48px" }}>Have a question or just want to say hello? Fill out the form below and I'll get back to you.</p>

          {status === "success" ? (
            <div role="alert" style={{ background: T.isDark ? "#1A2E1A" : "#E8F5E9", borderRadius: 16, padding: "36px 32px", textAlign: "center" }}>
              <div aria-hidden="true" style={{ fontSize: 32, marginBottom: 12 }}>&#10003;</div>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, color: T.textHeading, margin: "0 0 8px", fontWeight: 400 }}>Message sent</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: T.textMuted, margin: "0 0 24px", lineHeight: 1.6 }}>Thanks for reaching out — I'll get back to you soon.</p>
              <button onClick={() => setStatus("idle")} className="btn-contact" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: T.accent, background: "transparent", padding: "10px 24px", borderRadius: 100, border: `1.5px solid ${T.accent}`, cursor: "pointer", transition: "all 0.2s" }}>Send another</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {[{ label: "Name", type: "text", id: "contact-name", value: name, onChange: setName },
                { label: "Email", type: "email", id: "contact-email", value: email, onChange: setEmail }].map(f => (
                <div key={f.label}>
                  <label htmlFor={f.id} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: T.textHeading, display: "block", marginBottom: 8, letterSpacing: "0.02em" }}>{f.label}</label>
                  <input id={f.id} type={f.type} value={f.value} onChange={(e) => f.onChange(e.target.value)} required style={{ width: "100%", padding: "14px 18px", borderRadius: 12, border: `1.5px solid ${T.border}`, background: T.surface, fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: T.textHeading, outline: "none", transition: "border-color 0.2s" }} />
                </div>
              ))}
              <div>
                <label htmlFor="contact-message" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: T.textHeading, display: "block", marginBottom: 8, letterSpacing: "0.02em" }}>Message</label>
                <textarea id="contact-message" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required style={{ width: "100%", padding: "14px 18px", borderRadius: 12, border: `1.5px solid ${T.border}`, background: T.surface, fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: T.textHeading, outline: "none", transition: "border-color 0.2s", resize: "vertical" }} />
              </div>
              {status === "error" && (
                <p role="alert" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: T.accentSecondary, margin: 0 }}>Something went wrong — please try again or reach out on LinkedIn.</p>
              )}
              <button onClick={handleSubmit} disabled={status === "sending"} aria-busy={status === "sending"} className="btn-contact" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: "#FFFFFF", background: status === "sending" ? T.textMuted : T.accentGradient, padding: "15px 34px", borderRadius: 100, border: "none", cursor: status === "sending" ? "default" : "pointer", transition: "transform 0.2s, box-shadow 0.2s", boxShadow: status === "sending" ? "none" : `0 4px 20px ${T.accent}20`, alignSelf: "flex-start", opacity: status === "sending" ? 0.7 : 1 }}>{status === "sending" ? "Sending\u2026" : "Send Message"}</button>
            </div>
          )}

          <div style={{ marginTop: 48, paddingTop: 32, borderTop: `1px solid ${T.border}` }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: T.textMuted }}>
              You can also find me on{" "}
              <a href="https://linkedin.com/in/dennisberger" target="_blank" rel="noopener noreferrer" style={{ color: T.accent, textDecoration: "underline", textUnderlineOffset: 3, fontWeight: 600 }}>LinkedIn <span className="sr-only">(opens in new tab)</span></a>.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ============================================================
// APP SHELL + ROUTER
// ============================================================
export default function Portfolio() {
  return (
    <ThemeProvider>
      <RouterProvider>
        <PortfolioShell />
      </RouterProvider>
    </ThemeProvider>
  );
}

function PortfolioShell() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <PortfolioInner scrolled={scrolled} />;
}

function PortfolioInner({ scrolled }) {
  const { route } = useRouter();
  const { T } = useTheme();

  let page;
  if (route === "/") page = <HomePage />;
  else if (route === "/work") page = <WorkPage />;
  else if (route === "/contact") page = <ContactPage />;
  else if (route === "/resume") page = <ResumePage />;
  else if (route === "/about") page = <AboutPage />;
  else if (route.startsWith("/work/")) page = <CaseStudyPage studyId={route.replace("/work/", "")} />;
  else page = <HomePage />;

  return (
    <div style={{ background: T.bg, minHeight: "100vh", transition: "background-color 0.3s ease, color 0.3s ease" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400;1,9..144,500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }
        input:focus, textarea:focus { border-color: ${T.accent} !important; }
        ::selection { background: ${T.accent}20; color: ${T.textHeading}; }
        .btn-primary:hover { transform: translateY(-2px) !important; box-shadow: 0 10px 36px ${T.accent}35 !important; }
        .btn-outline:hover { border-color: ${T.accent} !important; color: ${T.accent} !important; }
        .btn-outline:hover svg path { stroke: ${T.accent}; }
        .btn-download:hover { color: ${T.resumeAccent} !important; border-color: ${T.resumeAccent}40 !important; }
        .btn-contact:hover { transform: translateY(-1px); box-shadow: 0 6px 24px ${T.accent}30; }
        .btn-linkedin:hover { border-color: ${T.accent} !important; color: ${T.accent} !important; }
        .nav-link:hover { color: ${T.accent} !important; }
        .back-link:hover { color: ${T.accent} !important; }
        .next-study-link:hover h3 { color: ${T.accent}; }
        a:focus-visible, button:focus-visible { outline: 2px solid ${T.accent}; outline-offset: 2px; border-radius: 4px; }
        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }
        .skip-link { position: absolute; top: -100px; left: 16px; background: ${T.accent}; color: #FFFFFF; padding: 12px 24px; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; text-decoration: none; z-index: 200; transition: top 0.2s; }
        .skip-link:focus { top: 16px; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
        }
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .about-page-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .resume-bottom-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .image-pair { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Nav scrolled={scrolled} />
      <main id="main-content">
        {page}
      </main>
      <Footer />
    </div>
  );
}
