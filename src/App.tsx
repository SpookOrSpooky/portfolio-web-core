import { useEffect, useMemo, useRef, useState, type AnchorHTMLAttributes, type FormEvent, type KeyboardEvent } from 'react';
import {
  Activity,
  BadgeCheck,
  BrainCircuit,
  BriefcaseBusiness,
  Calendar,
  ChevronRight,
  CircleDot,
  CloudCog,
  Code2,
  DatabaseZap,
  FileText,
  FolderKanban,
  Github,
  Globe2,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Maximize2,
  Minimize2,
  Network,
  PanelLeft,
  RadioTower,
  Search,
  ShieldCheck,
  Sparkles,
  Workflow,
  X,
} from 'lucide-react';
import heroWorkbench from './assets/ai-workbench-hero.png';
import {
  buildProjectRefs,
  completeTerminalInput,
  executeTerminalCommand,
  type TerminalDockId,
  type TerminalProjectTab,
} from './terminal';
import { createIncidentState, formatIncidentTime, getIncidentPortfolioLinks, incidentIntro, runIncidentCommand, type IncidentState } from './incidentGame';

type Project = {
  title: string;
  file: string;
  type: string;
  status: string;
  origin: string;
  originDetail: string;
  icon: typeof Network;
  summary: string;
  stack: string[];
  metrics: string[];
  flow: string[];
  architecture: string[];
  proof: string[];
  capabilities: string[];
  mediaNote: string;
  video?: {
    kind: 'vimeo' | 'mp4';
    title: string;
    sourceUrl: string;
  };
  publicApplications?: {
    title: string;
    url: string;
    description: string;
    contribution: string;
  }[];
};

type ProjectImage = {
  src: string;
  name: string;
};

const projectImageModules = import.meta.glob('./assets/projects/*/*.{png,jpg,jpeg,webp,gif}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const contact = {
  name: 'Daniel Campbell',
  role: 'Founder & CTO @ Synexis | ex. NVIDIA, Borealis AI',
  location: 'Toronto / Sao Paulo / San Francisco',
  email: 'dcamp049@uottawa.ca',
  calendly: 'https://calendly.com/dcampbel/30min',
  linkedin: 'https://www.linkedin.com/in/campbeld/',
  github: 'https://github.com/SpookOrSpooky',
  clearance: 'SECRET - Level II',
};

function EmailLink({ className, children, onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={className}
      href={`mailto:${contact.email}`}
      onClick={(event) => {
        void navigator.clipboard.writeText(contact.email);
        onClick?.(event);
      }}
      {...props}
    >
      {children}
    </a>
  );
}

const signalStats = [
  { value: '$16M', label: 'Reduced annualized AI infrastructure run-rate' },
  { value: '37', label: 'Led global AI staff and manager portfolio' },
  { value: '500M+', label: 'Optimized retrieval over legal-domain tokens' },
  { value: '1.3M', label: 'Scaled GenAI product request volume' },
  { value: '80%+', label: 'Cut critical cloud security non-compliance' },
];

const projects: Project[] = [
  {
    title: 'Synexis Product Platform',
    file: 'synexis-product-platform.project',
    type: 'Application Engineering',
    status: 'Production',
    origin: 'Synexis',
    originDetail: 'Primary product monolith and onboarding platform: investor/startup workspaces, datarooms, chat, CRM, events, payments, onboarding, and operational APIs.',
    icon: Code2,
    summary:
      'Full-stack investment intelligence SaaS spanning a Next.js product monolith, dedicated NestJS onboarding API, Vite onboarding SPA, real-time chat, payments, auth, documents, and event workflows.',
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'MUI v7', 'Prisma', 'PostgreSQL 16', 'Redis 7', 'Socket.IO', 'Stripe', 'NextAuth'],
    metrics: ['140+ product pages', 'Pages Router API surface', 'Realtime chat', 'Payments + webhooks', 'Document conversion'],
    flow: ['Browser', 'Next.js app', 'API routes', 'PostgreSQL', 'Redis pub/sub', 'Socket.IO', 'Investor workspace'],
    architecture: [
      'Built application surfaces for startup and investor workspaces, datarooms, CRM, team workflows, event flows, payments, and diligence operations.',
      'Integrated server-side API routes with Prisma-managed PostgreSQL, Redis-backed realtime state, Socket.IO scaling, DigitalOcean Spaces, Stripe, Intercom, Telegram, and email workflows.',
      'Split onboarding into a NestJS API and Vite SPA to keep signup, OAuth callback, role-specific onboarding, partner/event flows, and enrichment jobs independently deployable.',
    ],
    proof: ['Application architecture across frontend, backend, documents, payments, auth, and realtime UX', 'Containerized production deployment', 'Shared schema and service integration across four repos'],
    capabilities: ['Hands-on full-stack implementation', 'Product architecture', 'API design', 'Realtime systems', 'Payment and integration engineering'],
    mediaNote: 'Add screenshots of investor workspace, dataroom, CRM board, onboarding, or chat here.',
  },
  {
    title: 'Investment Intelligence Graph',
    file: 'investment-graph.project',
    type: 'GraphRAG',
    status: 'Production architecture',
    origin: 'Synexis',
    originDetail: 'Built from Synexis dataroom, CRM, memo, criteria, profile, thesis, and relationship activity requirements.',
    icon: Network,
    summary:
      'Source-scoped financial dataroom memory with source registry, bitemporal fact ledger, graph projection, deterministic finance runtime, and provenance-linked answers.',
    stack: ['Postgres', 'Prisma', 'Neo4j', 'Milvus/Zilliz', 'FastAPI', 'Temporal facts', 'Source manifests'],
    metrics: ['Source manifests', 'Bitemporal facts', 'Metric facts', 'Entity merges', 'Conflict chains', 'Scope compiler'],
    flow: ['Sources', 'Scope compiler', 'Fact ledger', 'Neo4j projection', 'Scoped retrieval', 'Cited answer'],
    architecture: [
      'Designed a four-layer intelligence ledger: source registry, temporal fact ledger, graph projection, and deterministic finance runtime.',
      'Made Postgres authoritative while treating Neo4j and Milvus as rebuildable indexes carrying scope, source, origin, and provenance labels.',
      'Modeled profile forms, theses, documents, transcripts, Q&A, memos, decision events, and relationship activity as versioned source records and replayable fact/event streams.',
    ],
    proof: ['As-of-date reasoning', 'Source-manifest replay', 'Conflict/supersession handling', 'Multi-hop investor/startup reasoning'],
    capabilities: ['Knowledge graph design', 'GraphRAG architecture', 'Data modeling', 'Financial provenance', 'Secure retrieval'],
    mediaNote: 'Add graph projection diagrams, fact ledger tables, or dataroom evidence screenshots here.',
  },
  {
    title: 'Agentic RAG & ML Platform',
    file: 'agentic-rag-platform.project',
    type: 'AI Platform',
    status: 'Production',
    origin: 'Synexis / synexis-flows',
    originDetail: 'Python ML platform powering dataroom Q&A, AI agent chat, criteria answering, memo generation, matching, WhatsApp, and async workers.',
    icon: Workflow,
    summary:
      'Split FastAPI and worker platform for RAG, document search, agent supervision, attendee matching, durable ML jobs, WhatsApp flows, and observability.',
    stack: ['Python 3.11', 'FastAPI', 'Gunicorn', 'LangGraph', 'OpenAI', 'Langfuse', 'LangSmith', 'Milvus', 'Redpanda', 'Redis', 'ClickHouse'],
    metrics: ['RAG API', 'Interactive worker', 'Scheduler', 'Background worker', 'Attendee matching', 'WhatsApp API'],
    flow: ['App request', 'RAG API', 'Supervisor graph', 'Tool executor', 'Worker lane', 'Status stream', 'Cited response'],
    architecture: [
      'Separated public HTTP serving from Kafka consumers and durable execution through rag-api, interactive-worker, scheduler, and background-worker services.',
      'Used LangGraph-style supervision to route thesis, dataroom, investor workspace, platform help, matching, and deterministic tool execution paths.',
      'Implemented retrieval over Milvus collections, S3/Spaces documents, Postgres state, ClickHouse analytics, Redis job leases, and Redpanda job topics.',
    ],
    proof: ['Split Docker Swarm worker architecture', 'Citation rendering and source controls', 'Agent regression and Playwright coverage'],
    capabilities: ['Agent orchestration', 'RAG systems', 'Async worker design', 'LLM observability', 'Production ML APIs'],
    mediaNote: 'Add screenshots of agent chat, citation blocks, worker dashboards, or Langfuse traces here.',
  },
  {
    title: 'Investor & Attendee Matching Engine',
    file: 'matching-engine.project',
    type: 'Recommenders',
    status: 'Production',
    origin: 'Synexis',
    originDetail: 'Investor/startup matching and event attendee discovery across Synexis product and synexis-flows matching services.',
    icon: RadioTower,
    summary:
      'Hybrid matching system using profile compaction, sentence-transformer embeddings, ANN recall, reciprocal ranking, preference-aware filters, and served-impression telemetry.',
    stack: ['Sentence Transformers', 'ANN recall', 'Redis', 'FastAPI', 'PostgreSQL', 'Milvus', 'Contextual bandits', 'Behavioral feedback'],
    metrics: ['Preference vectors', 'Profile compactors', 'Facet ranking', 'Hot/warm serving', 'Impression telemetry'],
    flow: ['Profiles', 'Embeddings', 'ANN recall', 'Hard filters', 'Reciprocal score', 'Bandit ranker', 'Served deck'],
    architecture: [
      'Normalized investment thesis, firmographics, industry/subtype constraints, geography, check-size preferences, and behavioral signals into compact matching profiles.',
      'Generated candidate pools with embedding recall before reciprocal scoring, hard filters, online preference deltas, and contextual bandit reranking.',
      'Built attendee matching as a standalone FastAPI surface while keeping user actions and downstream analytics connected to product telemetry.',
    ],
    proof: ['Investor/startup matching', 'Attendee discovery', 'Served-impression feedback loop', 'Preference-aware ranking'],
    capabilities: ['Recommendation systems', 'Ranking architecture', 'Embedding retrieval', 'Telemetry loops', 'Productized matching UX'],
    mediaNote: 'Add screenshots of match cards, attendee ranking, or thesis-to-match explanations here.',
  },
  {
    title: 'Cloud & DevOps Operating Model',
    file: 'cloud-devops-platform.project',
    type: 'Cloud Engineering',
    status: 'Production',
    origin: 'Synexis',
    originDetail: 'Cross-repo deployment topology for app host, ML/support host, shared services, observability, secrets, CI/CD, and firewall-scoped service networking.',
    icon: CloudCog,
    summary:
      'Private VPS cluster and support stack spanning app services, ML Swarm services, PostgreSQL, Redis, Redpanda, ClickHouse, Milvus, Grafana, Prometheus, Loki, OpenBao, and S3-compatible storage.',
    stack: ['Docker Compose', 'Docker Swarm', 'Drone CI', 'GitHub Actions', 'nginx', 'Grafana', 'Prometheus', 'Loki', 'OpenBao', 'UFW'],
    metrics: ['2-host topology', 'Shared support stack', 'Per-env Redpanda', 'Swarm ML deploys', 'Telegram deploy alerts'],
    flow: ['Git push', 'Drone/GitHub CI', 'Docker build', 'Compose/Swarm deploy', 'Metrics/logs', 'Telegram alert', 'Rollback path'],
    architecture: [
      'Managed split deployment responsibilities across the main app, onboarding backend, onboarding frontend, and ML/support infrastructure.',
      'Used Docker Compose for app repos and Docker Swarm for ML services, with shared networks for monitoring, analytics, app communication, and service isolation.',
      'Operated shared infrastructure for PostgreSQL, Redis, Redpanda, ClickHouse, Milvus, OpenBao, Grafana, Prometheus, Loki, cAdvisor, and node-exporter.',
    ],
    proof: ['Private host deployment topology', 'CI/CD and notification pipelines', 'Support stack observability', 'Secrets and network boundaries'],
    capabilities: ['Cloud engineering management', 'Infrastructure implementation', 'CI/CD', 'Observability', 'Secure service topology'],
    mediaNote: 'Add deployment topology screenshots, Grafana panels, CI logs, or support-stack diagrams here.',
  },
  {
    title: 'Enterprise AI Platform & MLOps',
    file: 'enterprise-mlops.project',
    type: 'MLOps',
    status: 'Enterprise',
    origin: 'Borealis AI / RBC',
    originDetail: 'Global AI strategy and engineering program leadership for RBC research-to-production AI systems and hybrid-cloud ML platforms.',
    icon: DatabaseZap,
    summary:
      'Enterprise AI platform strategy spanning hybrid cloud, GPU scheduling, feature-store architecture, orchestration, experiment management, notebooks, model monitoring, governance, vendor management, and secure production operations.',
    stack: ['Red Hat OpenShift 4.x', 'AWS', 'A100 MIG', 'Run:ai', 'Airflow', 'W&B', 'JupyterHub', 'Papermill', 'Ray Train/Tune', 'SageMaker', 'Tecton/Feast evaluation', 'Apigee'],
    metrics: ['$16M run-rate reduction', '$350M program context', '$4.6B revenue context', '37 staff portfolio', '80%+ compliance reduction'],
    flow: ['OCP/AWS compute', 'Run:ai scheduler', 'Feature store', 'Airflow DAGs', 'W&B tracking', 'Jupyter/Ray jobs', 'Monitored models'],
    architecture: [
      'Led hybrid-cloud AI platform capability across Red Hat OpenShift 4.x, AWS, A100 MIG GPU hardware, Run:ai compute scheduling, Airflow orchestration, notebooks-on-demand, experiment management, model monitoring, and enterprise risk controls.',
      'Shaped platform architecture that enabled public RBC Borealis applications such as NOMI Forecast, Lumina, and Aiden through compute, infrastructure, governance, and productionization patterns.',
      'Evaluated feature-store direction for enterprise definition, ingress, egress, training/serving consistency, version control, and real-time access workflows across Tecton and Feast-style options.',
      'Designed reusable ML workflow patterns around Airflow DAG templates, W&B experiment tracking, Jupyter/JupyterHub with Papermill, Ray Tune/Train, SageMaker hyperparameter tuning, and API gateway integration.',
      'Closed resiliency and cloud-policy gaps while managing senior developer staff, research translation, executive roadmaps, vendor/SLA negotiation, and audit readiness.',
    ],
    proof: ['Estimated $16M annualized infrastructure reduction', 'Global AI engineering portfolio', 'Critical security non-compliance reduction', 'Infrastructure architecture contributions to RBC AI application portfolio'],
    capabilities: ['MLOps leadership', 'Hybrid-cloud platform architecture', 'GPU scheduling and tenancy', 'Feature-store strategy', 'Experiment management', 'Enterprise governance', 'Executive technical roadmaps'],
    mediaNote: 'NOMI Forecast, Aiden, and ATOM architecture showcase',
    video: {
      kind: 'mp4',
      title: 'NOMI Forecast customer experience award video',
      sourceUrl: 'https://rbcborealis.com/wp-content/uploads/2022/04/NOMI-Forecast-CX-Award-v1.mp4',
    },
    publicApplications: [
      {
        title: 'NOMI Forecast',
        url: 'https://rbcborealis.com/applications/nomi-forecast/',
        description: 'AI-enabled digital money management that forecasts upcoming pre-authorized payments and helps clients plan cash flow.',
        contribution: 'Contributed to enterprise compute and platform architecture, and product design context for non-trading banking AI workflows. Did not own the quantitative forecasting mathematics.',
      },
      {
        title: 'Lumina',
        url: 'https://rbcborealis.com/applications/lumina-platform/',
        description: 'RBC internal enterprise data and AI platform for secure, governed, scalable AI development and insights.',
        contribution: 'Worked on precursor platform architecture before Lumina was publicly announced, including hybrid compute, governance, workflow, and platform-service direction.',
      },
      {
        title: 'Aiden',
        url: 'https://rbcborealis.com/applications/aiden/',
        description: 'AI-powered electronic trading platform applying reinforcement learning to execution quality and market adaptation.',
        contribution: 'Contributed to underlying enterprise AI compute/platform architecture, not the trading quantitative mathematics or execution algorithm design.',
      },
    ],
  },
  {
    title: 'Legal Corpus Agentic Retrieval',
    file: 'legal-corpus.project',
    type: 'Applied AI',
    status: 'Research-to-prod',
    origin: 'Braxted Group',
    originDetail: 'Agentic LLM, graph-enhanced retrieval, and conversational systems for legal and immigration workflows.',
    icon: Search,
    summary:
      'Graph-enhanced retrieval and conversational orchestration over a 500M+ token legal corpus for low-hallucination candidate analysis and task execution.',
    stack: ['LLMs', 'RAG', 'Graph retrieval', 'GNN experiments', 'Hybrid text/voice', 'Evaluation harnesses'],
    metrics: ['500M+ tokens', '<3% hallucination rate', 'Candidate analysis', 'Conversational memory', 'Behavioral recognition'],
    flow: ['Legal corpus', 'Chunk/index', 'Graph retrieval', 'Agent plan', 'Candidate analysis', 'Cited output'],
    architecture: [
      'Led applied researchers building hybrid greenfield and open-source conversational LLM systems with RAG, NLP, GNN experimentation, and production deployment.',
      'Optimized retrieval and orchestration over a large legal corpus while evaluating hallucination behavior and structured task reliability.',
      'Designed conversational memory and behavioral-recognition systems for self-learning user experience improvements.',
    ],
    proof: ['Low-hallucination legal analysis', 'Applied-research team leadership', 'Text and voice UX experimentation'],
    capabilities: ['Applied AI leadership', 'Retrieval evaluation', 'Legal-domain AI', 'Agent task design', 'Research-to-production execution'],
    mediaNote: 'Sanitized Application views and architecture examples',
  },
  {
    title: 'Real-time Voice Conversion Platform',
    file: 'voice-conversion.project',
    type: 'Multimodal AI',
    status: 'Exited',
    origin: 'Transposed AI',
    originDetail: 'Founder/CEO and Head of ML for a deep-tech GenAI voice-conversion and vocal-synthesis SaaS company.',
    icon: Sparkles,
    summary:
      'Commercial vocal-synthesis and voice-conversion platform using neural style transfer, automated validation, GPU partitioning, and on-demand model serving.',
    stack: ['VAEs', 'Neural style transfer', 'AWS', 'NVIDIA SuperPod', 'N-MOS', 'S-MOS', 'GPU partitioning'],
    metrics: ['$52M valuation benchmark', '427% CAGR activity growth', '1.3M customer requests', '~198.5% cost improvement'],
    flow: ['Voice input', 'Isolation', 'Style transfer', 'Validation', 'Serving', 'User output'],
    architecture: [
      'Led model serving, validation automation, bias correction, vocal isolation, naturalness/similarity scoring, and GPU cost optimization.',
      'Scaled commercial GenAI workloads across entertainment streaming and production markets before an all-stock M&A exit.',
      'Improved throughput-per-dollar through GPU splitting, on-demand serving, validation automation, and NVIDIA/AWS infrastructure choices.',
    ],
    proof: ['M&A exit', 'Large-scale customer request volume', 'Training/inference efficiency improvement'],
    capabilities: ['Multimodal AI productization', 'Model serving', 'GPU economics', 'Validation automation', 'Founder execution'],
    mediaNote: 'Add product UI, evaluation dashboard, or audio workflow screenshots here.',
  },
  {
    title: 'GeoSat AIOps Inference Systems',
    file: 'geosat-aiops.project',
    type: 'Secure AI',
    status: 'Classified context',
    origin: 'Larus Technologies',
    originDetail: 'Staff AIOps engineering work for SECRET-classified real-time GeoSat ingestion, ETL, and inference systems.',
    icon: ShieldCheck,
    summary:
      'Real-time secure ingestion and inference architecture for allied naval intelligence alert systems under classified operational constraints.',
    stack: ['AIOps', 'Streaming ETL', 'Secure inference', 'Realtime alerting', 'Classified data workflows'],
    metrics: ['SECRET context', 'Realtime ingestion', 'Naval intelligence', 'Mission-critical alerting'],
    flow: ['GeoSat feed', 'Ingestion', 'ETL', 'Inference', 'Alert routing', 'Operator review'],
    architecture: [
      'Designed ingestion and inference paths for high-trust geospatial data where latency, reliability, access boundaries, and security posture mattered.',
      'Balanced mission constraints, data engineering, and inference operationalization in a classified environment.',
      'Worked within a NATO Top 10 innovator context supporting allied naval intelligence workflows.',
    ],
    proof: ['Secure data workflows', 'Realtime classified inference', 'Mission-critical operational systems'],
    capabilities: ['Secure systems engineering', 'Streaming data', 'AIOps', 'Operational AI', 'Classified-context delivery'],
    mediaNote: 'Sanitized Larus Technologies GeoSat/AIOps visual artifacts and overview video.',
    video: {
      kind: 'vimeo',
      title: 'Larus Technologies GeoSat AIOps overview',
      sourceUrl: 'https://vimeo.com/1189451733/2cd93c801e?fl=pl&fe=vl',
    },
  },
  {
    title: 'Noisy Web Parsing RL Pipeline',
    file: 'rl-web-parser.project',
    type: 'RL / Data Engineering',
    status: 'Production',
    origin: 'Kwaddle',
    originDetail: 'AI product leadership for noisy web parsing, crawler automation, and database ingress in an education SaaS context.',
    icon: BrainCircuit,
    summary:
      'Deep-Q and sequence-model parsing system for noisy non-Markovian web environments feeding automated data streams.',
    stack: ['TensorFlow', 'Pandas', 'Deep-Q networks', 'LSTM cells', 'AWS clusters', 'Bayesian refinement'],
    metrics: ['~$145K/year saved', 'Automated data ingress', 'Crawler efficiency', 'Noisy web parsing'],
    flow: ['Noisy web', 'Crawler policy', 'RL parser', 'Sequence model', 'Validation', 'Database stream'],
    architecture: [
      'Used reinforcement-learning crawler strategies to improve extraction reliability across difficult education data sources.',
      'Applied LSTM cells and AWS-trained models to handle sequential parsing and vanishing-gradient behavior.',
      'Automated database ingress and reduced manual operational work for an edu-tech SaaS product.',
    ],
    proof: ['Manual task elimination', 'Cloud-trained parsing models', 'Production data-ingress savings'],
    capabilities: ['Data engineering', 'RL systems', 'Crawler automation', 'Applied ML implementation', 'Product leadership'],
    mediaNote: 'Add crawler flow, validation output, or data pipeline screenshots here.',
  },
];

const experience = [
  ['Synexis', 'Chief Technology Officer & Head of AI', 'Feb 2025 - Present', 'Built and led the split product, onboarding, ML, support, and deployment architecture for an AI-native deal-flow intelligence platform.'],
  ['NVIDIA Deep Learning Institute', 'Contributing Author', 'Jun 2021 - Present', 'Enterprise AI developer enablement and scalable LLM/datacenter architecture materials across DGX, Mellanox, A100, H100, and B100 SuperPOD configurations.'],
  ['AiMining Technologies', 'Research Board Director', 'Mar 2024 - Present', 'Scientific board oversight for safe, reliable, and regulatory-conscious Generative AI system releases.'],
  ['ISED Canada', 'AI Policy Advisor', 'Aug 2023 - Mar 2025', 'Advisor on AIDA Bill C-27, Council of Europe AI discussions, copyright policy, and generative AI policy files.'],
  ['Braxted Group', 'Head of Artificial Intelligence & Data', 'Sep 2024 - Feb 2025', 'Led applied researchers building agentic LLM systems, graph-enhanced retrieval, memory, voice interfaces, and low-hallucination legal workflows.'],
  ['Transposed AI', 'CEO, Head of ML', 'Oct 2023 - May 2024', 'Founded and exited a GenAI voice-conversion SaaS company with large-scale usage growth and GPU efficiency improvements.'],
  ['ASCAP', 'Advisor, AI & Copyright Policy', 'May 2023 - Dec 2023', 'Contributed to the creation of ASCAP AI Principles framework.'],
  ['Borealis AI / RBC', 'Director, Global AI Strategy & Engineering PM', 'Aug 2021 - Oct 2023', 'Led AI product engineering strategy, MLOps, enterprise risk controls, production ML platform capability, and executive AI roadmaps.'],
  ['RBC', 'Technical Product Manager, AI SaaS & MLOps', 'Sep 2019 - Aug 2021', 'Led cloud infrastructure, DGX clusters, ML platform design, vendor management, resiliency, and security non-compliance remediation.'],
  ['Larus / Kwaddle / Tegus', 'AIOps engineer, AI product leader, AI/cloud consultant', '2015 - 2022', 'Secure GeoSat inference, RL web parsing, VC/Fortune 500 diligence, and cloud/AI product architecture.'],
];

const stackGroups = [
  ['Application Engineering', 'Next.js', 'React', 'TypeScript', 'MUI', 'NestJS', 'Vite', 'Prisma', 'Socket.IO', 'Stripe', 'React Query'],
  ['Cloud Engineering', 'Docker Compose', 'Docker Swarm', 'Kubernetes', 'AWS', 'Azure', 'OpenShift', 'nginx', 'UFW', 'Private VPS clusters'],
  ['Data & Messaging', 'PostgreSQL', 'Redis', 'Redpanda/Kafka', 'ClickHouse', 'Milvus/Zilliz', 'Neo4j', 'DigitalOcean Spaces'],
  ['AI / ML Systems', 'LLMs', 'RAG', 'GraphRAG', 'LangGraph', 'Sentence Transformers', 'VAEs', 'GNN readiness', 'Evaluation harnesses'],
  ['MLOps & Observability', 'Airflow', 'W&B', 'Fiddler', 'Langfuse', 'LangSmith', 'Prometheus', 'Grafana', 'Loki', 'cAdvisor'],
  ['Security & Governance', 'OpenBao', 'NextAuth', 'JWT', 'OAuth', 'SOC 2 controls', 'Tenant isolation', 'Audit logs', 'Secret clearance context'],
];

const cloudCapabilities = [
  'Design and operate split monolith/service architectures with shared transactional, cache, analytics, vector, and secrets infrastructure.',
  'Lead cloud platform and MLOps programs from executive roadmap through hands-on Docker, Kubernetes, Terraform, CI/CD, monitoring, and rollback implementation.',
  'Build secure multi-tenant systems with scoped retrieval, document grants, revoked access, ignored sources, audit-oriented state, and SOC 2-ready controls.',
  'Translate research prototypes into production APIs, worker pools, observability, evaluation harnesses, and user-facing workflows.',
];

const dockItems = [
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'resume', label: 'Resume', icon: FileText },
  { id: 'stack', label: 'Stack', icon: Code2 },
  { id: 'cloud', label: 'Cloud', icon: CloudCog },
] as const;

type DockId = TerminalDockId;
type ProjectTab = TerminalProjectTab;
type TerminalLine = {
  id: number;
  text: string;
  tone?: 'command' | 'muted' | 'error';
};

const projectRefs = buildProjectRefs(projects);
const introBootSteps = [
  { label: 'loading portfolio-os', increment: 5 },
  { label: '> mounting projects, graphs, agents, infrastructure...', increment: 4 },
  { label: '> loading vision kernal', increment: 9 },
];
const introVisionLines = [
  '> "The next generation of AI products will not be demos"',
  '> "They will be memory, judgment, and infrastructure at scale..."',
];
const introPromptPrefix = 'daniel@portfolio:~$';
const introPromptCommand = `${introPromptPrefix} help`;
function App() {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<ProjectTab>('overview');
  const [activeDock, setActiveDock] = useState<DockId>('projects');
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [introPhase, setIntroPhase] = useState<'booting' | 'docking' | 'done'>('booting');
  const [introAccelerated, setIntroAccelerated] = useState(false);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [terminalCwd, setTerminalCwd] = useState('portfolio://');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [incidentCommanderOpen, setIncidentCommanderOpen] = useState(false);
  const terminalLineId = useRef(1);
  const activeProject = projects[activeProjectIndex];

  useEffect(() => {
    if (window.matchMedia('(max-width: 760px)').matches) {
      setTerminalOpen(false);
    }
  }, []);

  const scrollToTarget = (target: string) => {
    window.setTimeout(() => {
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  const runTerminalCommand = (rawInput: string) => {
    const input = rawInput.trim();
    if (!input) return;

    if (input.startsWith('__complete__ ')) {
      const completionText = input.replace('__complete__ ', '');
      setTerminalLines((lines) => [
        ...lines,
        {
          id: terminalLineId.current++,
          text: completionText,
          tone: 'muted',
        },
      ]);
      return;
    }

    const result = executeTerminalCommand(input, {
      projects: projectRefs,
      cwd: terminalCwd,
      activeProjectIndex,
    });
    const promptLine: TerminalLine = {
      id: terminalLineId.current++,
      text: `daniel@portfolio:${shortPromptPath(terminalCwd)}$ ${input}`,
      tone: 'command',
    };
    const outputLines = result.output.map<TerminalLine>((text) => ({
      id: terminalLineId.current++,
      text,
      tone: text.startsWith('command not found') ? 'error' : undefined,
    }));

    setCommandHistory((history) => [...history, input]);
    setTerminalOpen(true);
    setTerminalLines((lines) => (result.clear ? [] : [...lines, promptLine, ...outputLines]));
    if (result.nextCwd) {
      setTerminalCwd(result.nextCwd);
    }

    if (result.action?.type === 'openProject') {
      setActiveDock('projects');
      setActiveProjectIndex(result.action.projectIndex);
      setActiveTab('overview');
      setTerminalCwd(result.action.cwd);
      scrollToTarget('#portfolio-os');
    }

    if (result.action?.type === 'openDock') {
      setActiveDock(result.action.dockId);
      setTerminalCwd(result.action.cwd);
      scrollToTarget('#portfolio-os');
    }

    if (result.action?.type === 'openCredentials') {
      setTerminalCwd(result.action.cwd);
      scrollToTarget('#credentials');
    }

    if (result.action?.type === 'setTab') {
      const { cwd, tab } = result.action;
      setActiveDock('projects');
      const projectFromPath = projectRefs.find((project) => cwd.includes(`/projects/${project.file}/`));
      if (projectFromPath) {
        setActiveProjectIndex(projectFromPath.index);
      }
      setActiveTab(tab);
      setTerminalCwd(cwd);
      scrollToTarget('#portfolio-os');
    }

    if (result.action?.type === 'projectDelta') {
      const { delta } = result.action;
      setActiveDock('projects');
      setActiveProjectIndex((index) => (index + delta + projects.length) % projects.length);
      scrollToTarget('#portfolio-os');
    }

    if (result.openIncidentCommander) {
      setIncidentCommanderOpen(true);
    }

    if (result.replayIntro) {
      setIntroAccelerated(false);
      setIntroPhase('booting');
      window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 20);
    }
  };

  return (
    <div className={introPhase === 'done' ? 'site-shell intro-complete' : 'site-shell intro-pending'}>
      {introPhase !== 'done' && (
        <TerminalIntro
          accelerated={introAccelerated}
          phase={introPhase}
          onAccelerate={() => setIntroAccelerated(true)}
          onComplete={() => {
            setIntroAccelerated(false);
            const bootLines = toBootTerminalLines();
            terminalLineId.current = bootLines.length + 1;
            setTerminalLines(bootLines);
            setTerminalOpen(true);
            setIntroPhase('docking');
            window.setTimeout(() => {
              setIntroPhase('done');
            }, 1500);
          }}
        />
      )}
      <Header />
      <main>
        <section className="hero-os" id="home">
          <div className="hero-copy">
            <p className="eyebrow">
              <CircleDot size={14} />
              Applied AI systems / application engineering / cloud platforms
            </p>
            <h1>{contact.name}</h1>
            <p className="hero-lede">
              CTO and hands-on builder across production AI platforms, application architecture, recommender systems,
              GraphRAG, secure multi-tenant SaaS, MLOps, and cloud engineering programs.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#portfolio-os">
                <PanelLeft size={18} />
                Open portfolio OS
              </a>
              <a className="button button-secondary" href={contact.calendly} target="_blank" rel="noreferrer">
                <Calendar size={18} />
                Meet with me
              </a>
              <EmailLink className="button button-secondary">
                <Mail size={18} />
                {contact.email}
              </EmailLink>
            </div>
          </div>

          <aside className="hero-profile" aria-label="Current profile">
            <HeroTerminalCard activeProject={activeProject} />
            <div className="profile-chip">
              <span>Current role</span>
              <strong>{contact.role}</strong>
            </div>
            <div className="profile-chip">
              <span>Locations</span>
              <strong>{contact.location}</strong>
            </div>
            <div className="profile-chip">
              <span>Clearance</span>
              <strong>{contact.clearance}</strong>
            </div>
          </aside>
        </section>

        <section className="stats-strip" aria-label="Career signals">
          {signalStats.map((stat) => (
            <div className="stat-tile" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </section>

        <section className="desktop-stage" id="portfolio-os">
          <div className="desktop-dock" aria-label="Portfolio dock">
            {dockItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  className={activeDock === item.id ? 'dock-item active' : 'dock-item'}
                  key={item.id}
                  type="button"
                  onClick={() => setActiveDock(item.id)}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <BrowserFrame title={`portfolio://${activeDock}.workspace`} className="workspace-window">
            {activeDock === 'projects' && (
              <ProjectWorkspace
                activeProject={activeProject}
                activeProjectIndex={activeProjectIndex}
                activeTab={activeTab}
                onSelectProject={(index) => {
                  setActiveProjectIndex(index);
                  setActiveTab('overview');
                }}
                onSelectTab={setActiveTab}
              />
            )}
            {activeDock === 'resume' && <ResumeWorkspace />}
            {activeDock === 'stack' && <StackWorkspace />}
            {activeDock === 'cloud' && <CloudWorkspace />}
          </BrowserFrame>
        </section>

        <section className="credentials" id="credentials">
          <div>
            <p className="eyebrow">
              <BadgeCheck size={14} />
              Credentials / policy / public leadership
            </p>
            <h2>Enterprise AI builder with policy, product, and infrastructure depth.</h2>
          </div>
          <div className="credential-grid">
            <span>NVIDIA Certified Professional</span>
            <span>NVIDIA Certified Associate - AI in the Data Center</span>
            <span>NVIDIA CA: Generative AI and LLMs</span>
            <span>NVIDIA CA: Generative AI Multimodal</span>
            <span>NVIDIA CA: AI Infrastructure and Operations</span>
            <span>Certified Product Manager</span>
            <span>AI Policy Advisor to Canada's Minister of Innovation</span>
            <span>ASCAP AI and Copyright Policy Advisor</span>
            <span>2024 Most Pioneering Startup CEO</span>
          </div>
        </section>
      </main>
      <Footer />
      <CommandTerminal
        cwd={terminalCwd}
        history={commandHistory}
        lines={terminalLines}
        open={terminalOpen && introPhase !== 'booting'}
        handoff={introPhase === 'docking'}
        typeDefaultHelp={introPhase === 'done'}
        activeProjectIndex={activeProjectIndex}
        onRunCommand={runTerminalCommand}
        onSetOpen={setTerminalOpen}
      />
      {incidentCommanderOpen && (
        <IncidentCommanderModal
          onClose={() => setIncidentCommanderOpen(false)}
          onOpenProjectCommand={(command) => {
            setIncidentCommanderOpen(false);
            runTerminalCommand(command);
          }}
        />
      )}
    </div>
  );
}

function toBootTerminalLines(): TerminalLine[] {
  return introVisionLines.map((line, index) => ({
    id: index,
    text: line,
    tone: undefined,
  }));
}

function shortPromptPath(cwd: string) {
  if (cwd === 'portfolio://') return '~';
  return cwd.replace('portfolio://', '~/');
}

function projectPortfolioPath(file: string, tab: ProjectTab = 'overview') {
  return `portfolio://projects/${file}/${tab}.tab`;
}

function Header() {
  return (
    <header className="topbar">
      <a className="brand" href="#home" aria-label="Daniel Campbell home">
        <span className="brand-mark">DC</span>
        <span>
          <strong>Daniel Campbell</strong>
          <small>systems showcase</small>
        </span>
      </a>
      <nav aria-label="Primary navigation">
        <a href="#portfolio-os">Portfolio OS</a>
        <a href="#credentials">Credentials</a>
      </nav>
      <div className="topbar-actions">
        <EmailLink className="icon-button" aria-label="Email Daniel Campbell">
          <Mail size={19} />
        </EmailLink>
        <a className="button button-secondary compact-button" href={contact.linkedin} target="_blank" rel="noreferrer">
          <Linkedin size={17} />
          LinkedIn
        </a>
        <a className="button button-secondary compact-button" href={contact.github} target="_blank" rel="noreferrer">
          <Github size={17} />
          GitHub
        </a>
      </div>
    </header>
  );
}

function TerminalIntro({
  accelerated,
  phase,
  onAccelerate,
  onComplete,
}: {
  accelerated: boolean;
  phase: 'booting' | 'docking';
  onAccelerate: () => void;
  onComplete: () => void;
}) {
  const [bootStepIndex, setBootStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [introMode, setIntroMode] = useState<'typing-step' | 'progress' | 'typing-vision' | 'typing-prompt'>('typing-step');
  const [introLog, setIntroLog] = useState<string[]>([]);
  const [typingText, setTypingText] = useState(introBootSteps[0].label);
  const [typingIndex, setTypingIndex] = useState(0);
  const [visionIndex, setVisionIndex] = useState(0);
  const completedRef = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    overlayRef.current?.focus();
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reducedMotion) return undefined;

    setIntroLog([...introBootSteps.map((step) => step.label), ...introVisionLines]);
    setProgress(100);
    setIntroMode('typing-prompt');
    setTypingText(introPromptCommand);
    setTypingIndex(introPromptCommand.length);
    const timer = window.setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
    }, 500);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  useEffect(() => {
    const accelerate = () => onAccelerate();
    window.addEventListener('wheel', accelerate, { passive: true });
    window.addEventListener('touchmove', accelerate, { passive: true });
    window.addEventListener('keydown', accelerate);
    window.addEventListener('click', accelerate);

    return () => {
      window.removeEventListener('wheel', accelerate);
      window.removeEventListener('touchmove', accelerate);
      window.removeEventListener('keydown', accelerate);
      window.removeEventListener('click', accelerate);
    };
  }, [onAccelerate]);

  useEffect(() => {
    if (phase === 'docking' || completedRef.current) return undefined;

    if (accelerated) {
      setIntroLog([...introBootSteps.map((step) => step.label), ...introVisionLines]);
      setProgress(100);
      setIntroMode('typing-prompt');
      setTypingText(introPromptCommand);
      setTypingIndex(introPromptCommand.length);
      const timer = window.setTimeout(() => {
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete();
        }
      }, 360);
      return () => window.clearTimeout(timer);
    }

    if (introMode === 'typing-step' || introMode === 'typing-vision' || introMode === 'typing-prompt') {
      if (typingIndex < typingText.length) {
        const typeTimer = window.setTimeout(() => setTypingIndex((index) => index + 1), introMode === 'typing-prompt' ? 30 : 24);
        return () => window.clearTimeout(typeTimer);
      }

      if (introMode === 'typing-step') {
        const nextTimer = window.setTimeout(() => {
          setIntroLog((lines) => [...lines, typingText]);
          setIntroMode('progress');
          setProgress(0);
          setTypingIndex(0);
        }, 220);
        return () => window.clearTimeout(nextTimer);
      }

      if (introMode === 'typing-vision') {
        const nextTimer = window.setTimeout(() => {
          setIntroLog((lines) => [...lines, typingText]);
          const nextVisionIndex = visionIndex + 1;
          if (nextVisionIndex < introVisionLines.length) {
            setVisionIndex(nextVisionIndex);
            setTypingText(introVisionLines[nextVisionIndex]);
            setTypingIndex(0);
            return;
          }

          setIntroMode('typing-prompt');
          setTypingText(introPromptCommand);
          setTypingIndex(0);
        }, 260);
        return () => window.clearTimeout(nextTimer);
      }

      const completeTimer = window.setTimeout(() => {
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete();
        }
      }, 820);
      return () => window.clearTimeout(completeTimer);
    }

    const currentStep = introBootSteps[bootStepIndex];
    if (progress >= 100) {
      const nextTimer = window.setTimeout(() => {
        if (bootStepIndex >= introBootSteps.length - 1) {
          setIntroMode('typing-vision');
          setVisionIndex(0);
          setTypingText(introVisionLines[0]);
          setTypingIndex(0);
          return;
        }
        const nextStepIndex = bootStepIndex + 1;
        setBootStepIndex(nextStepIndex);
        setIntroMode('typing-step');
        setTypingText(introBootSteps[nextStepIndex].label);
        setTypingIndex(0);
        setProgress(0);
      }, 420);
      return () => window.clearTimeout(nextTimer);
    }

    const timer = window.setTimeout(() => {
      setProgress((value) => Math.min(100, value + currentStep.increment));
    }, 48);

    return () => window.clearTimeout(timer);
  }, [accelerated, bootStepIndex, introMode, onComplete, phase, progress, typingIndex, typingText, visionIndex]);

  const typedLine = typingText.slice(0, typingIndex);
  const typedPrompt = typedLine.slice(0, introPromptPrefix.length);
  const typedPromptInput = typedLine.length > introPromptPrefix.length ? typedLine.slice(introPromptPrefix.length + 1) : '';
  const promptStillTyping = introMode === 'typing-prompt' && typedLine.length <= introPromptPrefix.length;
  const progressLabel = formatIntroProgress(progress);
  const showProgress = introMode === 'progress';

  return (
    <div
      aria-label="Terminal intro"
      aria-modal="true"
      className={phase === 'docking' ? 'terminal-intro-overlay docking' : 'terminal-intro-overlay'}
      onClick={onAccelerate}
      onKeyDown={onAccelerate}
      ref={overlayRef}
      role="dialog"
      tabIndex={-1}
    >
      <div className="terminal-intro-window">
        <div className="command-terminal-header">
          <div>
            <strong>portfolio shell</strong>
            <span>portfolio://</span>
          </div>
          <button type="button" aria-hidden="true" tabIndex={-1}>
            Esc
          </button>
        </div>
        <div className="command-terminal-output terminal-intro-output" aria-live="polite">
          {introLog.map((line) => (
            <span className="terminal-output-line" key={line}>{line}</span>
          ))}
          {showProgress ? (
            <span className="terminal-output-line intro-progress-line">{progressLabel}<span className="terminal-cursor">█</span></span>
          ) : introMode === 'typing-prompt' ? null : (
            <span className="terminal-output-line">
              {typedLine}
              <span className="terminal-cursor">█</span>
            </span>
          )}
        </div>
        <div className={introMode === 'typing-prompt' || phase === 'docking' ? 'command-terminal-form intro-terminal-form visible' : 'command-terminal-form intro-terminal-form'} aria-hidden="true">
          {introMode === 'typing-prompt' || phase === 'docking' ? (
            <>
              <span>
                {typedPrompt}
                {promptStillTyping && <span className="terminal-cursor">█</span>}
              </span>
              <span className="terminal-input-wrap">
                <span className="terminal-input-mirror">
                  {typedPromptInput}
                  {!promptStillTyping && <span className="terminal-cursor">█</span>}
                </span>
              </span>
            </>
          ) : (
            <span>&nbsp;</span>
          )}
        </div>
      </div>
    </div>
  );
}

function formatIntroProgress(progress: number) {
  const slots = 20;
  const filled = Math.round((progress / 100) * slots);
  const bar = `${'|'.repeat(filled)}${' '.repeat(slots - filled)}`;
  const status = progress >= 100 ? ' - COMPLETE' : '';
  return `[${bar}] ${Math.round(progress)}%${status}`;
}

function HeroTerminalCard({ activeProject }: { activeProject: Project }) {
  return (
    <div className="hero-terminal-card" aria-label="Portfolio terminal status">
      <div className="terminal-window-bar">
        <span />
        <span />
        <span />
      </div>
      <div className="hero-terminal-screen">
        <span className="terminal-command">daniel@portfolio:~$ whoami</span>
        <strong>Applied AI systems leader</strong>
        <span>Graph-backed memory, recommenders, agents, MLOps, and cloud infrastructure.</span>
        <span className="terminal-command">
          daniel@portfolio:~$ open {shortPromptPath(projectPortfolioPath(activeProject.file))}
        </span>
        <span className="terminal-block-cursor" aria-hidden="true">█</span>
      </div>
    </div>
  );
}

function CommandTerminal({
  cwd,
  history,
  lines,
  open,
  handoff = false,
  typeDefaultHelp = false,
  activeProjectIndex,
  onRunCommand,
  onSetOpen,
}: {
  cwd: string;
  history: string[];
  lines: TerminalLine[];
  open: boolean;
  handoff?: boolean;
  typeDefaultHelp?: boolean;
  activeProjectIndex: number;
  onRunCommand: (input: string) => void;
  onSetOpen: (open: boolean) => void;
}) {
  const [input, setInput] = useState('');
  const [defaultCommandActive, setDefaultCommandActive] = useState(true);
  const [defaultCommandText, setDefaultCommandText] = useState('help');
  const [typedDefaultOnce, setTypedDefaultOnce] = useState(true);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight });
  }, [lines, open]);

  useEffect(() => {
    if (!open || !typeDefaultHelp || !defaultCommandActive || input || typedDefaultOnce) return undefined;
    if (defaultCommandText.length >= 'help'.length) {
      setTypedDefaultOnce(true);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setDefaultCommandText((text) => 'help'.slice(0, text.length + 1));
    }, 95);

    return () => window.clearTimeout(timer);
  }, [defaultCommandActive, defaultCommandText, input, open, typeDefaultHelp, typedDefaultOnce]);

  const submitCommand = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const command = input || (defaultCommandActive ? 'help' : '');
    onRunCommand(command);
    setInput('');
    setDefaultCommandText('');
    setDefaultCommandActive(false);
    setHistoryIndex(null);
  };

  const completeInput = () => {
    const completion = completeTerminalInput(input, {
      projects: projectRefs,
      cwd,
      activeProjectIndex,
    });
    if (completion.value) {
      setInput(completion.value);
      setDefaultCommandText('');
      setDefaultCommandActive(false);
    }
    if (completion.output?.length) {
      onRunCommand(`__complete__ ${completion.output.join('  ')}`);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onSetOpen(false);
      return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === 'l') {
      event.preventDefault();
      onRunCommand('clear');
      setInput('');
      setDefaultCommandText('');
      return;
    }

    if (
      defaultCommandActive &&
      !input &&
      event.key.length === 1 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.altKey
    ) {
      event.preventDefault();
      setDefaultCommandActive(false);
      setDefaultCommandText('');
      setInput(event.key);
      return;
    }

    if (event.key === 'Tab') {
      event.preventDefault();
      completeInput();
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!history.length) return;
      const nextIndex = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex]);
      setDefaultCommandText('');
      setDefaultCommandActive(false);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyIndex === null) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(null);
        setInput('');
        setDefaultCommandText('');
        setDefaultCommandActive(false);
        return;
      }
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex]);
      setDefaultCommandText('');
      setDefaultCommandActive(false);
    }
  };

  if (!open) {
    return (
      <button className="terminal-pill" type="button" onClick={() => onSetOpen(true)} aria-label="Open command terminal">
        <Code2 size={17} />
        <span>daniel@portfolio:~$</span>
      </button>
    );
  }

  return (
    <section className={handoff ? 'command-terminal handoff' : 'command-terminal'} aria-label="Command terminal">
      <div className="command-terminal-header">
        <div>
          <strong>portfolio shell</strong>
          <span>{cwd}</span>
        </div>
        <button type="button" onClick={() => onSetOpen(false)} aria-label="Collapse command terminal">
          Esc
        </button>
      </div>
      <div className="command-terminal-output" aria-live="polite" ref={outputRef}>
        {lines.map((line) => (
          <span className={line.tone ? `terminal-output-line ${line.tone}` : 'terminal-output-line'} key={line.id}>
            {line.text}
          </span>
        ))}
      </div>
      <form className="command-terminal-form" onSubmit={submitCommand}>
        <label className="sr-only" htmlFor="terminal-command-input">
          Terminal command
        </label>
        <span aria-hidden="true">daniel@portfolio:{shortPromptPath(cwd)}$</span>
        <span className="terminal-input-wrap">
          <span className={input || defaultCommandActive ? 'terminal-input-mirror' : 'terminal-input-mirror placeholder'} aria-hidden="true">
            {input || (defaultCommandActive ? defaultCommandText : '')}
            <span className="terminal-form-cursor">█</span>
          </span>
          <input
            autoComplete="off"
            id="terminal-command-input"
            onChange={(event) => {
              setDefaultCommandActive(false);
              setDefaultCommandText('');
              setInput(event.target.value);
            }}
            onKeyDown={handleKeyDown}
            value={input}
          />
        </span>
      </form>
    </section>
  );
}

function IncidentCommanderModal({
  onClose,
  onOpenProjectCommand,
}: {
  onClose: () => void;
  onOpenProjectCommand: (command: string) => void;
}) {
  const [incidentState, setIncidentState] = useState<IncidentState>(() => createIncidentState());
  const [logLines, setLogLines] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLogLines(incidentIntro(incidentState));
    // Run only once so the intro matches the randomized scenario selected for this modal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight });
  }, [logLines]);

  useEffect(() => {
    if (incidentState.status !== 'active') return undefined;

    const timer = window.setInterval(() => {
      setIncidentState((state) => {
        if (state.status !== 'active') return state;
        const nextTime = Math.max(0, state.timeRemaining - 1);
        if (nextTime > 0) return { ...state, timeRemaining: nextTime };

        setLogLines((lines) => [
          ...lines,
          '',
          'incident timer expired.',
          'incident failed: user trust degraded before a validated fix landed.',
        ]);
        return {
          ...state,
          timeRemaining: 0,
          status: 'lost',
          score: 0,
          rank: 'dashboard tourist',
        };
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [incidentState.status]);

  useEffect(() => {
    if (incidentState.status !== 'won' || !incidentState.achievements.length) return;
    const storageKey = 'incidentCommanderAchievements';
    const stored = window.localStorage.getItem(storageKey);
    const parsed = stored ? JSON.parse(stored) as Record<string, { count: number; firstUnlockedAt: string }> : {};
    const now = new Date().toISOString();
    for (const achievement of incidentState.achievements) {
      parsed[achievement] = {
        count: (parsed[achievement]?.count ?? 0) + 1,
        firstUnlockedAt: parsed[achievement]?.firstUnlockedAt ?? now,
      };
    }
    window.localStorage.setItem(storageKey, JSON.stringify(parsed));
  }, [incidentState.achievements, incidentState.status]);

  const runGameCommand = (command: string) => {
    const trimmed = command.trim();
    if (!trimmed) return;

    if (trimmed.toLowerCase() === 'reset') {
      const nextState = createIncidentState();
      setIncidentState(nextState);
      setLogLines(incidentIntro(nextState));
      setInput('');
      return;
    }

    const result = runIncidentCommand(trimmed, incidentState);
    setIncidentState(result.state);
    setLogLines((lines) => [...lines, '', `incident@portfolio:/sev2$ ${trimmed}`, ...result.output]);
    setInput('');
  };

  const portfolioLinks = getIncidentPortfolioLinks(incidentState);
  const commandGroups = [
    { label: 'Lifecycle', commands: [...(incidentState.status === 'briefing' ? ['start incident'] : []), 'status', 'objective', 'evidence', 'portfolio guide', 'hint'] },
    { label: 'Inspect', commands: ['inspect slo', 'inspect deploys', 'trace request', 'inspect parser', 'inspect rag', 'inspect graph', 'inspect agent', 'inspect gpu', 'inspect index', 'inspect prompt'] },
    { label: 'Hypothesize', commands: ['hypothesis parser-schema-drift', 'hypothesis temporal-graph-projection-skew', 'hypothesis agent-route-policy-regression', 'hypothesis embedding-freshness-starvation'] },
    { label: 'Mitigate', commands: ['mitigate rollback-parser-template', 'mitigate rollback-graph-projection', 'mitigate rollback-route-policy', 'mitigate reserve-embedding-gpu-pool', 'mitigate rebuild-recent-embeddings'] },
    { label: 'Replay', commands: ['run replay constraints', 'run replay temporal', 'run replay numeric', 'run replay retrieval', 'validate', 'close incident'] },
  ];

  return (
    <div className="incident-modal" role="dialog" aria-modal="true" aria-label="Incident Commander">
      <div className="incident-panel">
        <div className="incident-header">
          <div>
            <span>incident://{incidentState.scenario.target}</span>
            <h2>Incident Commander: {incidentState.scenario.title}</h2>
          </div>
          <button className="media-toggle" type="button" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="incident-status-grid" aria-label="Incident status">
          <span>time {formatIncidentTime(incidentState.timeRemaining)}</span>
          <span>health {incidentState.health}</span>
          <span>confidence {incidentState.confidence}</span>
          <span>{incidentState.status} / {incidentState.scenario.symptom}</span>
        </div>

        {incidentState.status === 'briefing' && (
          <div className="incident-briefing-actions">
            <strong>Read the briefing first.</strong>
            <p>The clock is paused. Start only when you are ready to diagnose and command the incident.</p>
            <button className="button button-primary" type="button" onClick={() => runGameCommand('start incident')}>
              start incident
            </button>
          </div>
        )}

        <div className="incident-playbook" aria-label="Incident playbook">
          <div className="incident-board">
            <strong>Evidence board</strong>
            <span className={incidentState.evidence.some((item) => item.category === 'impact') ? 'complete' : ''}>impact</span>
            <span className={incidentState.evidence.some((item) => item.category === 'localization') ? 'complete' : ''}>localization</span>
            <span className={incidentState.evidence.some((item) => item.category === 'causality') ? 'complete' : ''}>causality</span>
            <span className={incidentState.rootCause === incidentState.scenario.correctRoot ? 'complete' : ''}>hypothesis</span>
            <span className={incidentState.validated ? 'complete' : ''}>validation</span>
            <small>{incidentState.evidence.length ? incidentState.evidence.map((item) => item.title).join(' / ') : 'No evidence collected yet.'}</small>
          </div>
          <div className="incident-board">
            <strong>Portfolio field guide</strong>
            {portfolioLinks.map((link) => (
              <button
                key={`${link.projectFile}-${link.tab}-guide`}
                type="button"
                onClick={() => onOpenProjectCommand(`cd ${projectPortfolioPath(link.projectFile, link.tab)}`)}
              >
                {link.title}
              </button>
            ))}
          </div>
        </div>

        <div className="incident-terminal" aria-live="polite" ref={outputRef}>
          {logLines.map((line, index) => (
            <span className={incidentLineClass(line)} key={`${line}-${index}`}>{line || ' '}</span>
          ))}
        </div>

        <form
          className="incident-command-form"
          onSubmit={(event) => {
            event.preventDefault();
            runGameCommand(input);
          }}
        >
          <label className="sr-only" htmlFor="incident-command-input">Incident command</label>
          <span>incident@portfolio:/sev2$</span>
          <input
            autoComplete="off"
            id="incident-command-input"
            onChange={(event) => setInput(event.target.value)}
            placeholder="inspect metrics"
            value={input}
          />
          <button type="submit">Run</button>
        </form>

        <div className="incident-command-groups" aria-label="Common playbook actions">
          {commandGroups.map((group) => (
            <div className="incident-command-group" key={group.label}>
              <strong>{group.label}</strong>
              <div className="incident-command-chips">
                {group.commands.map((command) => (
                  <button key={command} type="button" onClick={() => runGameCommand(command)}>
                    {command}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {incidentState.status === 'won' && (
          <div className="incident-unlock">
            <strong>Incident closed</strong>
            <p>
              You diagnosed the AI system failure through evidence, applied a targeted mitigation, and validated the
              recovery path. Use the related portfolio systems as field notes for the architecture behind the incident.
            </p>
            <div className="incident-portfolio-links">
              {portfolioLinks.map((link) => (
                <button
                  className="button button-primary"
                  key={`${link.projectFile}-${link.tab}`}
                  type="button"
                  onClick={() => onOpenProjectCommand(`cd ${projectPortfolioPath(link.projectFile, link.tab)}`)}
                >
                  open {link.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {incidentState.status === 'lost' && (
          <div className="incident-unlock failed">
            <strong>Incident failed</strong>
            <p>Reset and try an evidence-first path: inspect impact, localize the fault, form a hypothesis, mitigate, validate, close.</p>
            <div className="incident-portfolio-links">
              {portfolioLinks.map((link) => (
                <button
                  className="button button-secondary"
                  key={`${link.projectFile}-${link.tab}`}
                  type="button"
                  onClick={() => onOpenProjectCommand(`cd ${projectPortfolioPath(link.projectFile, link.tab)}`)}
                >
                  study {link.title}
                </button>
              ))}
            </div>
            <button className="button button-secondary" type="button" onClick={() => runGameCommand('reset')}>
              reset incident
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function incidentLineClass(line: string) {
  if (line.includes('FAIL') || line.includes('rejected') || line.includes('failed') || line.includes('dropped')) return 'incident-line danger';
  if (line.includes('PASS') || line.includes('accepted') || line.includes('closed') || line.includes('achievement')) return 'incident-line success';
  if (line.includes('WARN') || line.includes('suspect') || line.includes('degraded')) return 'incident-line warning';
  if (line.startsWith('incident@portfolio')) return 'incident-line command';
  return 'incident-line';
}

function BrowserFrame({ title, className = '', children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={`browser-frame ${className}`}>
      <div className="browser-titlebar">
        <div className="traffic-group" aria-hidden="true">
          <span className="traffic red"><X size={10} /></span>
          <span className="traffic amber"><Minimize2 size={10} /></span>
          <span className="traffic green"><Maximize2 size={10} /></span>
        </div>
        <div className="address-bar">
          <Globe2 size={15} />
          <span>{title}</span>
        </div>
      </div>
      {children}
    </div>
  );
}

function ProjectWorkspace({
  activeProject,
  activeProjectIndex,
  activeTab,
  onSelectProject,
  onSelectTab,
}: {
  activeProject: Project;
  activeProjectIndex: number;
  activeTab: ProjectTab;
  onSelectProject: (index: number) => void;
  onSelectTab: (tab: ProjectTab) => void;
}) {
  const Icon = activeProject.icon;
  const images = useProjectImages(activeProject.file);

  return (
    <div className="project-workspace">
      <aside className="app-sidebar">
        <h3>Project files</h3>
        {projects.map((project, index) => {
          const ProjectIcon = project.icon;
          return (
            <button
              className={activeProjectIndex === index ? 'sidebar-card active' : 'sidebar-card'}
              key={project.file}
              type="button"
              onClick={() => onSelectProject(index)}
            >
              <ProjectIcon size={17} />
              <span>{project.file}</span>
              <strong>{project.title}</strong>
            </button>
          );
        })}
      </aside>

      <article className="project-main">
        <div className="terminal-panel">
          <div className="terminal-lines">
            <span>$ open {shortPromptPath(projectPortfolioPath(activeProject.file, activeTab))}</span>
            <span>focus: {activeProject.type.toLowerCase()}</span>
            <span>origin: {activeProject.origin}</span>
          </div>
        </div>

        <div className="document-tabs" role="tablist" aria-label="Project views">
          {(['overview', 'architecture', 'evidence'] as ProjectTab[]).map((tab) => (
            <button
              aria-selected={activeTab === tab}
              className={activeTab === tab ? 'tab active' : 'tab'}
              key={tab}
              type="button"
              onClick={() => onSelectTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="project-document-card">
          <div className="project-title-row">
            <span className="project-icon-large">
              <Icon size={26} />
            </span>
            <div>
              <span className="project-kicker">{activeProject.type} / {activeProject.status}</span>
              <h2>{activeProject.title}</h2>
            </div>
          </div>

          <div className="origin-callout">
            <strong>{activeProject.origin}</strong>
            <span>{activeProject.originDetail}</span>
          </div>

          {activeTab === 'overview' && (
            <>
              <p className="project-summary">{activeProject.summary}</p>
              {activeProject.publicApplications && <PublicApplications applications={activeProject.publicApplications} />}
              <div className="metric-grid">
                {activeProject.metrics.map((metric) => (
                  <span key={metric}>{metric}</span>
                ))}
              </div>
              <FlowMap steps={activeProject.flow} />
              <ProjectMedia key={activeProject.file} project={activeProject} images={images} />
            </>
          )}

          {activeTab === 'architecture' && (
            <div className="architecture-layout">
              <ul className="detail-list">
                {activeProject.architecture.map((item) => (
                  <li key={item}>
                    <CircleDot size={14} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div>
                <h3>Implementation capability</h3>
                <div className="tag-list">
                  {activeProject.capabilities.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="evidence-grid">
              <div>
                <h3>Proof points</h3>
                <ul className="detail-list compact">
                  {activeProject.proof.map((item) => (
                    <li key={item}>
                      <ChevronRight size={15} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Stack</h3>
                <div className="tag-list">
                  {activeProject.stack.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

function useProjectImages(projectFile: string) {
  return useMemo<ProjectImage[]>(() => {
    return Object.entries(projectImageModules)
      .filter(([path]) => path.includes(`/assets/projects/${projectFile}/`))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([path, src]) => ({
        src,
        name: decodeURIComponent(path.split('/').pop() || 'project artifact'),
      }));
  }, [projectFile]);
}

function FlowMap({ steps }: { steps: string[] }) {
  return (
    <div className="system-map" aria-label="System flow">
      {steps.map((step, index) => (
        <span className="flow-fragment" key={`${step}-${index}`}>
          <span>{step}</span>
          {index < steps.length - 1 && <ChevronRight size={16} />}
        </span>
      ))}
    </div>
  );
}

function ProjectMedia({ project, images }: { project: Project; images: ProjectImage[] }) {
  const [mode, setMode] = useState<'video' | 'slides'>(project.video ? 'video' : 'slides');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const hasImages = images.length > 0;
  const showVideo = Boolean(project.video) && mode === 'video';
  const canExpand = mode === 'slides' && hasImages;

  if (!project.video && !hasImages) {
    return null;
  }

  const nextImage = () => setActiveImageIndex((index) => (hasImages ? (index + 1) % images.length : 0));
  const previousImage = () => setActiveImageIndex((index) => (hasImages ? (index - 1 + images.length) % images.length : 0));

  return (
    <>
      <section className="project-media" aria-label={`${project.title} media`}>
        <div className="media-toolbar">
          <div>
            <strong>Project artifact view</strong>
            <span>{project.mediaNote}</span>
          </div>
          <div className="media-actions">
            {project.video && (
              <>
                <button className={mode === 'video' ? 'media-toggle active' : 'media-toggle'} type="button" onClick={() => setMode('video')}>
                  Video
                </button>
                <button className={mode === 'slides' ? 'media-toggle active' : 'media-toggle'} type="button" onClick={() => setMode('slides')}>
                  Slideshow
                </button>
              </>
            )}
            {canExpand && (
              <button className="media-toggle" type="button" onClick={() => setExpanded(true)}>
                Expand
              </button>
            )}
          </div>
        </div>

        {showVideo && project.video ? (
          <VideoFrame video={project.video} />
        ) : (
          <Slideshow
            fallbackNote={project.mediaNote}
            images={images}
            activeImageIndex={activeImageIndex}
            onNext={nextImage}
            onPrevious={previousImage}
            onSelect={setActiveImageIndex}
          />
        )}
      </section>

      {expanded && canExpand && (
        <div className="media-modal" role="dialog" aria-modal="true" aria-label={`${project.title} expanded media`}>
          <div className="media-modal-panel">
            <div className="media-modal-header">
              <div>
                <strong>{project.title}</strong>
                <span>{showVideo ? 'Video player' : 'Project slideshow'}</span>
              </div>
              <button className="media-toggle" type="button" onClick={() => setExpanded(false)}>
                Close
              </button>
            </div>
            {showVideo && project.video ? (
              <VideoFrame video={project.video} large />
            ) : (
              <Slideshow
                large
                fallbackNote={project.mediaNote}
                images={images}
                activeImageIndex={activeImageIndex}
                onNext={nextImage}
                onPrevious={previousImage}
                onSelect={setActiveImageIndex}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

function VideoFrame({ video, large = false }: { video: NonNullable<Project['video']>; large?: boolean }) {
  const src = video.kind === 'vimeo'
    ? video.sourceUrl.replace('https://vimeo.com/1189451733/2cd93c801e?fl=pl&fe=vl', 'https://player.vimeo.com/video/1189451733?h=2cd93c801e')
    : video.sourceUrl;

  return (
    <div className={large ? 'video-frame large' : 'video-frame'}>
      {video.kind === 'vimeo' ? (
        <iframe
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          src={src}
          title={video.title}
        />
      ) : (
        <video controls preload="metadata" src={src} title={video.title}>
          <track kind="captions" />
        </video>
      )}
    </div>
  );
}

function PublicApplications({
  applications,
}: {
  applications: NonNullable<Project['publicApplications']>;
}) {
  return (
    <section className="public-applications" aria-label="Public applications connected to this work">
      <div>
        <h3>Public RBC Borealis applications enabled</h3>
        <p>
          These examples are public product/application references. My contribution here was enterprise AI platform,
          compute, governance, and selected product architecture work as noted below.
        </p>
      </div>
      <div className="application-grid">
        {applications.map((application) => (
          <article className="application-card" key={application.title}>
            <a href={application.url} target="_blank" rel="noreferrer">
              {application.title}
              <ChevronRight size={15} />
            </a>
            <p>{application.description}</p>
            <strong>{application.contribution}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function Slideshow({
  images,
  activeImageIndex,
  fallbackNote,
  onNext,
  onPrevious,
  onSelect,
  large = false,
}: {
  images: ProjectImage[];
  activeImageIndex: number;
  fallbackNote: string;
  onNext: () => void;
  onPrevious: () => void;
  onSelect: (index: number) => void;
  large?: boolean;
}) {
  const activeImage = images[activeImageIndex];

  if (!activeImage) {
    return (
      <aside className="media-slot" aria-label="Project screenshot slot">
        <img src={heroWorkbench} alt="Portfolio visual placeholder" />
        <div>
          <strong>Screenshot / artifact slot</strong>
          <p>{fallbackNote}</p>
        </div>
      </aside>
    );
  }

  return (
    <div className={large ? 'slideshow large' : 'slideshow'}>
      <div className="slide-stage">
        <button className="slide-button previous" type="button" onClick={onPrevious} aria-label="Previous project image">
          <ChevronRight size={18} />
        </button>
        <img src={activeImage.src} alt={activeImage.name} />
        <button className="slide-button next" type="button" onClick={onNext} aria-label="Next project image">
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="slide-footer">
        <span>{activeImage.name}</span>
        <div className="slide-dots" aria-label="Select project image">
          {images.map((image, index) => (
            <button
              aria-label={`Show ${image.name}`}
              className={index === activeImageIndex ? 'slide-dot active' : 'slide-dot'}
              key={image.src}
              type="button"
              onClick={() => onSelect(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ResumeWorkspace() {
  return (
    <div className="resume-window">
      <aside className="profile-panel">
        <BriefcaseBusiness size={28} />
        <h2>{contact.role}</h2>
        <p>
          Executive ownership with hands-on systems range: application engineering, recommender systems, temporal
          knowledge graphs, source-scoped RAG, vector search, multimodal retrieval, GPU infrastructure, MLOps, and secure SaaS.
        </p>
        <div className="profile-lines">
          <span><MapPin size={16} /> {contact.location}</span>
          <span><ShieldCheck size={16} /> {contact.clearance}</span>
          <span><GraduationCap size={16} /> B.Eng. Computer Engineering; EMBA Candidate</span>
          <span><Github size={16} /> github.com/SpookOrSpooky</span>
        </div>
      </aside>
      <div className="timeline">
        {experience.map(([company, role, years, detail]) => (
          <article className="timeline-item" key={`${company}-${years}`}>
            <div className="timeline-dot" />
            <div>
              <span>{years}</span>
              <h3>{company}</h3>
              <strong>{role}</strong>
              <p>{detail}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function StackWorkspace() {
  return (
    <div className="stack-workspace">
      {stackGroups.map(([title, ...items]) => (
        <article className="stack-card" key={title}>
          <h3>{title}</h3>
          <div className="tag-list">
            {items.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

function CloudWorkspace() {
  return (
    <div className="cloud-workspace">
      <div className="cloud-summary">
        <CloudCog size={32} />
        <h2>Application and cloud engineering scope</h2>
        <p>
          I can lead and personally implement the layers between product UX, APIs, data stores, ML services, CI/CD,
          deployment topology, observability, security controls, and executive operating model.
        </p>
      </div>
      <div className="card-grid">
        {cloudCapabilities.map((item) => (
          <article className="mini-card" key={item}>
            <Activity size={18} />
            <p>{item}</p>
          </article>
        ))}
      </div>
      <FlowMap steps={['Product need', 'Architecture', 'Implementation', 'CI/CD', 'Observability', 'Risk controls', 'Operating cadence']} />
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div>
        <strong>{contact.name}</strong>
        <span>{contact.role}</span>
      </div>
      <div className="footer-links">
        <EmailLink>
          <Mail size={16} />
          {contact.email}
        </EmailLink>
        <a href={contact.github} target="_blank" rel="noreferrer">
          <Github size={16} />
          GitHub
        </a>
        <a href="#home">
          <Globe2 size={16} />
          Top
        </a>
      </div>
    </footer>
  );
}

export default App;
