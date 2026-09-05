/**
 * PORTFOLIO DATA - SINGLE SOURCE OF TRUTH
 * Verified personal, project, academic, and technical data for Aaron Ebenezer Samuel.
 */

export const personalData = {
  name: "Aaron Ebenezer Samuel",
  shortName: "Aaron Samuel",
  role: "Software Engineer & Creative Technologist",
  status: "Available for High-Impact Roles & Research",
  location: "Chennai, Tamil Nadu, India",
  coordinates: "13.0827° N, 80.2707° E",
  institution: "SRM Institute of Science and Technology, Ramapuram",
  degree: "B.Tech in Computer Science and Engineering",
  timeline: "August 2023 — May 2027 (Expected)",
  cgpa: "8.08",
  bio: [
    "Computer Science & Engineering student passionate about engineering at the intersection of intelligent systems, modern web architecture, and intentional human experience.",
    "Driven by technical curiosity across Python, Java, modern TypeScript ecosystems, machine learning models, and relational data architecture."
  ],
  contacts: {
    email: "aaronsamuel0205@gmail.com",
    phone: "+91 9791056098",
    phoneRaw: "9791056098",
    whatsappUrl: "https://wa.me/919791056098",
    github: "https://github.com/Aaron-Samuel05",
    linkedin: "https://www.linkedin.com/in/aaronsamuel05",
    instagram: "https://www.instagram.com/aaron_samuel05/"
  }
};

export const projects = [
  {
    id: "01",
    code: "PRJ-FIT",
    title: "FITCHECK / FLEXIFY",
    tagline: "Intelligent Athletic Workout Engine & Architecture",
    category: "Full-Stack Web System",
    year: "2025 — 2026",
    status: "Active Production Code",
    summary:
      "A high-performance workout management application combining intelligent workout logging, progress visualization, and responsive tracking architectures with dark obsidian ergonomics.",
    description:
      "Engineered with a focus on high-throughput database interactions and minimal interaction latency. Built around an end-to-end type-safe pipeline using Prisma ORM over PostgreSQL, providing structured exercise tracking, real-time metrics, interactive volume calculators, and modern dark-mode ergonomics.",
    metrics: [
      { label: "Architecture", value: "Full-Stack Type-Safe" },
      { label: "Database Layer", value: "PostgreSQL + Prisma" },
      { label: "Target Latency", value: "< 50ms Operations" }
    ],
    technologies: [
      "React.js",
      "TypeScript",
      "Tailwind CSS",
      "Vite",
      "Next.js",
      "Node.js",
      "Express.js",
      "Prisma ORM",
      "PostgreSQL",
      "Prisma Studio"
    ],
    githubUrl: "https://github.com/Aaron-Samuel05",
    liveUrl: null,
    featured: true,
    accent: "#ff8533"
  },
  {
    id: "02",
    code: "PRJ-RES",
    title: "RES TECHNOLOGIES",
    tagline: "Industrial Enterprise Platform & Digital Architecture",
    category: "Corporate & Industrial Systems",
    year: "2025",
    status: "Deployed Platform",
    summary:
      "A high-precision corporate technology platform designed for industrial enterprise systems, automated enquiry workflows, and technical equipment specifications.",
    description:
      "Built with strict engineering standards to provide an authoritative industrial digital presence. Features serverless communication pipelines for real-time customer enquiry ingestion, responsive specification breakdowns for complex equipment, and fluid, physics-based viewport transitions.",
    metrics: [
      { label: "Performance", value: "100 Lighthouse" },
      { label: "Pipeline", value: "Serverless Endpoints" },
      { label: "Rendering", value: "Framer Motion Engine" }
    ],
    technologies: [
      "React",
      "TypeScript",
      "Vite",
      "Framer Motion",
      "Serverless APIs",
      "Tailwind CSS"
    ],
    githubUrl: "https://github.com/Aaron-Samuel05",
    liveUrl: null,
    featured: true,
    accent: "#00e5a3"
  },
  {
    id: "03",
    code: "PRJ-PNG",
    title: "PING PONG DUAL-ENGINE",
    tagline: "Cross-Language Physics & Real-Time Simulation",
    category: "Simulation & Game Physics",
    year: "2024 — 2025",
    status: "Complete Implementation",
    summary:
      "An interactive real-time simulation engine developed natively across both Java (JavaFX) and Python (PyGame) to examine dual-runtime execution and physics responsiveness.",
    description:
      "Engineered to benchmark and compare desktop interaction paradigms across JVM and CPython runtimes. Features custom collision vector mathematics, frame-independent paddle acceleration, score arbitration, and real-time audio-visual feedback loops.",
    metrics: [
      { label: "Runtimes", value: "JVM + CPython" },
      { label: "Refresh Target", value: "Fixed 60 FPS Delta" },
      { label: "Mechanics", value: "Elastic Vector Math" }
    ],
    technologies: [
      "Java",
      "Python",
      "PyGame",
      "JavaFX",
      "OOP Architecture",
      "Physics Math"
    ],
    githubUrl: "https://github.com/Aaron-Samuel05",
    liveUrl: null,
    featured: true,
    accent: "#4d96ff"
  }
];

export const skillDomains = [
  {
    id: "languages",
    title: "Core Languages",
    code: "DOMAIN-01",
    icon: "terminal",
    description: "Multi-paradigm algorithmic thinking, object orientation, and systems programming.",
    skills: [
      { name: "Python", level: "Advanced", desc: "Data pipelines, automation, PyGame, algorithmic models" },
      { name: "Java", level: "Proficient", desc: "OOP design, JavaFX desktop runtimes, core structures" },
      { name: "JavaScript", level: "Advanced", desc: "ESNext, event-driven async programming, DOM engines" },
      { name: "TypeScript", level: "Proficient", desc: "Type safety, generics, enterprise web architecture" }
    ]
  },
  {
    id: "web",
    title: "Web Architecture",
    code: "DOMAIN-02",
    icon: "layers",
    description: "Component-driven client runtimes, reactive layouts, and scalable backend pipelines.",
    skills: [
      { name: "React.js", level: "Advanced", desc: "Hooks, reconciliation, custom state pipelines" },
      { name: "Next.js", level: "Proficient", desc: "SSR/SSG paradigms, route handlers, modern tooling" },
      { name: "Node.js", level: "Proficient", desc: "Asynchronous I/O, REST APIs, microservices" },
      { name: "Express.js", level: "Proficient", desc: "Middleware chains, route arbitration, authentication" },
      { name: "Vite", level: "Advanced", desc: "Rollup-backed lightning HMR and asset pipelines" },
      { name: "Tailwind CSS", level: "Advanced", desc: "Utility-first design tokens and responsive systems" },
      { name: "HTML5 & Semantic Web", level: "Mastery", desc: "WAI-ARIA accessibility, SEO schemas" },
      { name: "Modern CSS / Motion", level: "Advanced", desc: "CSS variables, grid/flex, keyframe physics" }
    ]
  },
  {
    id: "databases",
    title: "Databases & ORM",
    code: "DOMAIN-03",
    icon: "database",
    description: "Relational modeling, indexing strategies, type-safe data access, and migrations.",
    skills: [
      { name: "PostgreSQL", level: "Proficient", desc: "ACID transactions, relational constraints, indexing" },
      { name: "MySQL", level: "Proficient", desc: "Schema design, normalization, performant querying" },
      { name: "Prisma ORM", level: "Advanced", desc: "Declarative schemas, type-safe query generation" },
      { name: "pgAdmin & Studio", level: "Proficient", desc: "Database inspection, visual queries, data profiling" }
    ]
  },
  {
    id: "ai-cs",
    title: "AI, ML & Core CS",
    code: "DOMAIN-04",
    icon: "cpu",
    description: "Data structures, algorithmic complexity, neural models, and generative workflows.",
    skills: [
      { name: "Machine Learning", level: "Applied", desc: "Model training, supervised regression/classification" },
      { name: "Generative AI", level: "Applied", desc: "LLM integration, prompt engineering, agentic flows" },
      { name: "Data Structures & Algo", level: "Core Academic", desc: "Tree traversals, graph theory, dynamic programming" },
      { name: "Python Data Stack", level: "Applied", desc: "NumPy, Pandas, automated data wrangling" }
    ]
  },
  {
    id: "soft",
    title: "Professional Dynamics",
    code: "DOMAIN-05",
    icon: "compass",
    description: "Engineering leadership, cross-functional collaboration, and adaptive problem solving.",
    skills: [
      { name: "Problem Solving", level: "Core", desc: "Algorithmic deconstruction of ambiguous challenges" },
      { name: "Leadership Experience", level: "Demonstrated", desc: "Guiding team initiatives and coordinating deliverables" },
      { name: "Team Collaboration", level: "Demonstrated", desc: "Clear communication, Git review flows, empathy" },
      { name: "Adaptability", level: "Continuous", desc: "Rapid assimilation of emerging frameworks and tools" }
    ]
  }
];

export const areasOfCuriosity = [
  {
    num: "01",
    title: "App Development",
    tagline: "Native-Grade Digital Products",
    description: "Building interactive, resilient desktop and mobile experiences that respond instantly with physics-based feedback."
  },
  {
    num: "02",
    title: "Modern Web Technologies",
    tagline: "Kinetic UI & Experimental Canvas",
    description: "Pushing the boundaries of the browser canvas with Three.js, shaders, silky inertia scrolling, and editorial typography."
  },
  {
    num: "03",
    title: "Generative AI & Autonomous Workflows",
    tagline: "Intelligent Systems Integration",
    description: "Exploring frontier LLM patterns, automated agent synthesis, and conversational context pipelines to augment human ability."
  },
  {
    num: "04",
    title: "Automation & Developer Tooling",
    tagline: "High-Leverage Workflows",
    description: "Crafting bespoke scripts, CI pipelines, and developer environments that reduce friction and eradicate manual repetition."
  },
  {
    num: "05",
    title: "Data Insights & Analytics",
    tagline: "Signal from Structured Noise",
    description: "Transforming raw operational metrics and relational data streams into clear, decisive visual narratives."
  }
];
