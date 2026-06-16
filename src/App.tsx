import { useMemo, useState } from 'react';
import {
  Activity,
  BadgeCheck,
  BrainCircuit,
  BriefcaseBusiness,
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
  github: 'https://github.com/SpookOrSpooky',
  clearance: 'Secret Clearance - Level II',
};

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
    mediaNote: 'NOMI Forecast public video plus room for sanitized architecture snapshots, platform diagrams, or dashboard screenshots.',
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
    mediaNote: 'Add sanitized corpus evaluation, workflow, or conversational UX screenshots here.',
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

type DockId = (typeof dockItems)[number]['id'];
type ProjectTab = 'overview' | 'architecture' | 'evidence';

function App() {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<ProjectTab>('overview');
  const [activeDock, setActiveDock] = useState<DockId>('projects');
  const activeProject = projects[activeProjectIndex];

  return (
    <div className="site-shell">
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
              <a className="button button-secondary" href={`mailto:${contact.email}`}>
                <Mail size={18} />
                {contact.email}
              </a>
            </div>
          </div>

          <aside className="hero-profile" aria-label="Current profile">
            <img src={heroWorkbench} alt="Illustrated AI systems workbench" />
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
    </div>
  );
}

function Header() {
  return (
    <header className="topbar">
      <a className="brand" href="#home" aria-label="Daniel Campbell home">
        <span className="brand-mark">DC</span>
        <span>
          <strong>Daniel Campbell</strong>
          <small>AI systems portfolio</small>
        </span>
      </a>
      <nav aria-label="Primary navigation">
        <a href="#portfolio-os">Portfolio OS</a>
        <a href="#credentials">Credentials</a>
      </nav>
      <div className="topbar-actions">
        <a className="icon-button" href={`mailto:${contact.email}`} aria-label="Email Daniel Campbell">
          <Mail size={19} />
        </a>
        <a className="button button-secondary compact-button" href={contact.github} target="_blank" rel="noreferrer">
          <Github size={17} />
          GitHub
        </a>
      </div>
    </header>
  );
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
            <span>$ open {activeProject.file}</span>
            <span>loaded: {activeProject.status.toLowerCase()}</span>
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
        <a href={`mailto:${contact.email}`}>
          <Mail size={16} />
          {contact.email}
        </a>
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
