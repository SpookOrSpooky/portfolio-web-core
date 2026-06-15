import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  BadgeCheck,
  BookOpenText,
  Boxes,
  BrainCircuit,
  BriefcaseBusiness,
  ChevronRight,
  CircleDot,
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
  Newspaper,
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
  icon: typeof Network;
  summary: string;
  stack: string[];
  metrics: string[];
  architecture: string[];
  proof: string[];
};

const contact = {
  name: 'Daniel Campbell',
  role: 'Founder & CTO @ Synexis | ex. NVIDIA, Borealis AI',
  location: 'Toronto / Sao Paulo / San Francisco',
  email: 'dcampbel@radrower.com',
  linkedin: 'https://www.linkedin.com/in/campbeld/',
  clearance: 'Secret Clearance - Level II',
};

const signalStats = [
  { value: '$16M', label: 'Annualized AI infra run-rate reduction' },
  { value: '37', label: 'AI staff portfolio directed' },
  { value: '500M+', label: 'Legal corpus tokens optimized' },
  { value: '1.3M', label: 'GenAI customer requests scaled' },
  { value: '80%+', label: 'Critical cloud non-compliance reduction' },
];

const projects: Project[] = [
  {
    title: 'Investment Intelligence Graph',
    file: 'investment-graph.project',
    type: 'GraphRAG',
    status: 'Production',
    icon: Network,
    summary:
      'Source-scoped financial dataroom memory with bitemporal facts, immutable manifests, entity resolution, metric ledgers, and provenance-linked citations.',
    stack: ['Postgres', 'Prisma', 'Neo4j', 'Milvus/Zilliz', 'Temporal KG', 'FastAPI'],
    metrics: ['Source manifests', 'Bitemporal facts', 'Metric facts', 'Entity merges'],
    architecture: [
      'Source registry compiles visibility, grants, ignored sources, revocation state, and private dataroom access.',
      'Fact ledger separates claims, metric facts, decision events, contradictions, supersession, and as-of-date replay.',
      'Graph projection supports multi-hop investor/startup reasoning while preserving document-level provenance.',
    ],
    proof: ['Deterministic finance runtime', 'Citation-verifiable Q&A', 'Conflict and supersession logic'],
  },
  {
    title: 'Recommendation & Matching Engine',
    file: 'matching-engine.project',
    type: 'Recommenders',
    status: 'Production',
    icon: RadioTower,
    summary:
      'Hybrid investor/startup matching with candidate generation, sentence-transformer embeddings, reciprocal scoring, online deltas, and contextual bandit ranking.',
    stack: ['Sentence Transformers', 'ANN', 'Redis', 'Bandits', 'W&D / Two Tower patterns'],
    metrics: ['Preference vectors', 'Hot/warm deck serving', 'Impression telemetry', 'Reciprocal scoring'],
    architecture: [
      'Profile compactors normalize investment thesis, firmographics, subtype constraints, geography, and behavioral signals.',
      'ANN recall generates candidate pools before reciprocal scoring, hard filters, and preference-aware reranking.',
      'Bandit feedback loops update ranker behavior from served impressions, explicit actions, and online user deltas.',
    ],
    proof: ['Type/subtype/industry constraints', 'Behavioral feedback loops', 'Attendee discovery and investor matching'],
  },
  {
    title: 'Agentic Financial RAG Platform',
    file: 'agentic-rag.project',
    type: 'Agents',
    status: 'Production',
    icon: Workflow,
    summary:
      'Conversational workflows for document Q&A, memo generation, criteria answering, multimodal retrieval, status streaming, and source attribution.',
    stack: ['FastAPI', 'Redpanda/Kafka', 'Redis', 'LangGraph patterns', 'Vector search'],
    metrics: ['Parallel retrieval', 'Citation verification', 'Tool routing', 'Status streaming'],
    architecture: [
      'Supervisor graph routes finance math, retrieval, graph lookups, image retrieval, and memo generation as separate tools.',
      'Parallel retrieval spans text chunks, images, graph neighborhoods, structured facts, and source-manifest filtering.',
      'Evaluation harnesses test leakage, as-of-date reasoning, prompt/model versions, numeric routing, and replayability.',
    ],
    proof: ['Multimodal dataroom Q&A', 'Source-scoped retrieval', 'Deterministic financial executors'],
  },
  {
    title: 'Enterprise AI Platform & MLOps',
    file: 'enterprise-mlops.project',
    type: 'MLOps',
    status: 'Enterprise',
    icon: DatabaseZap,
    summary:
      'Financial-services ML platform strategy spanning GPU compute, experiment tracking, evaluation, governance, monitoring, vendor management, and secure operations.',
    stack: ['AWS', 'Kubernetes', 'Terraform', 'Airflow', 'W&B', 'Fiddler', 'NVIDIA DGX/SuperPOD'],
    metrics: ['$16M run-rate reduction', '$350M program context', '$4.6B app-driven revenue context'],
    architecture: [
      'Hybrid-cloud GPU platform covered centralized compute, experiment tracking, model evaluation, data governance, and monitoring.',
      'Infrastructure strategy included DGX, Mellanox, A100/H100/B100 SuperPOD enablement and vendor/SLA negotiation.',
      'Enterprise controls addressed audit inquiries, resiliency gaps, policy failures, and secure production operations.',
    ],
    proof: ['37 staff portfolio', '80%+ critical non-compliance reduction', 'Production AI across RBC domains'],
  },
  {
    title: 'Legal Corpus Agentic Retrieval',
    file: 'legal-corpus.project',
    type: 'Applied AI',
    status: 'Research-to-prod',
    icon: Search,
    summary:
      'Graph-enhanced retrieval and conversational orchestration over a 500M+ token legal corpus for immigration and legal workflows.',
    stack: ['LLMs', 'Graph retrieval', 'GNNs', 'Hybrid text/voice', 'Evaluation harnesses'],
    metrics: ['500M+ tokens', '<3% hallucination rate', 'Conversational memory', 'Behavioral recognition'],
    architecture: [
      'Hybrid greenfield and open-source systems combined RAG, NLP, GNN experimentation, and production deployment.',
      'Agentic task orchestration split candidate analysis, corpus search, memory, and product workflows.',
      'Voice/text interfaces explored lower-friction interaction for complex immigration workflows.',
    ],
    proof: ['Low-hallucination candidate analysis', 'Applied-research team leadership', 'Production SaaS delivery'],
  },
  {
    title: 'Real-time Voice Conversion Platform',
    file: 'voice-conversion.project',
    type: 'Multimodal',
    status: 'Exited',
    icon: Sparkles,
    summary:
      'Deep-tech GenAI company building vocal-synthesis and voice-conversion products using neural style-transfer architectures and automated validation.',
    stack: ['VAEs', 'Neural style transfer', 'AWS', 'NVIDIA SuperPod', 'N-MOS / S-MOS validation'],
    metrics: ['$52M valuation benchmark', '427% CAGR activity growth', '~198.5% cost improvement', '1.3M requests'],
    architecture: [
      'On-demand model serving and GPU partitioning improved throughput-per-dollar for training and inference workloads.',
      'Validation automation covered vocal isolation, conversion naturalness, similarity scoring, and bias correction.',
      'Product operated across entertainment streaming and production markets before an all-stock M&A exit.',
    ],
    proof: ['Commercial voice-conversion SaaS', 'Automated output validation', 'Novel GPU cost optimization'],
  },
  {
    title: 'GeoSat AIOps Inference Systems',
    file: 'geosat-aiops.project',
    type: 'Secure AI',
    status: 'Classified context',
    icon: ShieldCheck,
    summary:
      'SECRET-classified real-time GeoSat ingestion, ETL, and inference architecture for allied naval intelligence alert systems.',
    stack: ['AIOps', 'ETL', 'Streaming inference', 'Secure systems', 'Real-time alerting'],
    metrics: ['SECRET context', 'Real-time ingestion', 'Naval intelligence', 'NATO Top 10 innovator'],
    architecture: [
      'Designed ingestion and inference paths for high-trust geospatial data where latency, classification, and reliability mattered.',
      'Balanced operational constraints, security posture, and data engineering requirements for alerting workflows.',
      'Built in a context requiring auditability and disciplined access boundaries.',
    ],
    proof: ['Larus Technologies', 'Secure data workflows', 'Mission-critical inference'],
  },
  {
    title: 'Noisy Web Parsing RL Pipeline',
    file: 'rl-web-parser.project',
    type: 'RL / Data',
    status: 'Production',
    icon: BrainCircuit,
    summary:
      'Deep-Q and sequence-model parsing system for noisy non-Markovian web environments feeding an education SaaS database stream.',
    stack: ['TensorFlow', 'Pandas', 'Deep-Q networks', 'LSTM cells', 'AWS clusters'],
    metrics: ['~$145K/year saved', 'Automated ingress', 'Bayesian refinement', 'Noisy web parsing'],
    architecture: [
      'Reinforcement-learning crawler strategy improved extraction reliability across hard-to-map education data sources.',
      'LSTM cells addressed vanishing-gradient behavior in sequential parsing contexts.',
      'Automated data ingress reduced manual operational work and improved internal database freshness.',
    ],
    proof: ['Kwaddle AI product leadership', 'Manual task elimination', 'Cloud-trained parsing models'],
  },
];

const experience = [
  ['Synexis', 'Chief Technology Officer & Head of AI', 'Feb 2025 - Present', 'AI-native deal-flow intelligence platform spanning multi-agent LLMs, multimodal RAG, GraphRAG, recommender networks, tenant isolation, and financial workflows.'],
  ['NVIDIA Deep Learning Institute', 'Contributing Author', 'Jun 2021 - Present', 'Enterprise AI developer enablement and scalable LLM/datacenter architecture materials across DGX, Mellanox, A100, H100, and B100 SuperPOD configurations.'],
  ['AiMining Technologies', 'Research Board Director', 'Mar 2024 - Present', 'Scientific board oversight for safe, reliable, and regulatory-conscious Generative AI system releases.'],
  ['ISED Canada', 'AI Policy Advisor', 'Aug 2023 - Mar 2025', 'Advisor on AIDA Bill C-27, Council of Europe AI discussions, copyright policy, and generative AI policy files.'],
  ['Braxted Group', 'Head of Artificial Intelligence & Data', 'Sep 2024 - Feb 2025', 'Led applied researchers building agentic LLM systems, graph-enhanced retrieval, memory, voice interfaces, and low-hallucination legal workflows.'],
  ['Transposed AI', 'CEO, Head of ML', 'Oct 2023 - May 2024', 'Founded and exited a GenAI voice-conversion SaaS company with large-scale usage growth and GPU efficiency improvements.'],
  ['ASCAP', 'Advisor, AI & Copyright Policy', 'May 2023 - Dec 2023', 'Contributed to the creation of ASCAP AI Principles framework.'],
  ['Borealis AI / RBC', 'Director, Global AI Strategy & Engineering PM', 'Aug 2021 - Oct 2023', 'Led AI product engineering strategy, MLOps, enterprise risk controls, and production ML platform capabilities for financial services.'],
  ['RBC', 'Technical Product Manager, AI SaaS & MLOps', 'Sep 2019 - Aug 2021', 'Led cloud infrastructure, DGX clusters, ML platform design, vendor management, resiliency, and security non-compliance remediation.'],
  ['Larus / Kwaddle / Tegus', 'AIOps engineer, AI product leader, AI/cloud consultant', '2015 - 2022', 'Secure GeoSat inference, RL web parsing, VC/Fortune 500 diligence, and cloud/AI product architecture.'],
];

const stackGroups = [
  ['AI / ML', 'LLMs', 'RAG', 'GraphRAG', 'GNN/R-GCN readiness', 'Transformers', 'VAEs', 'PEFT/LoRA', 'Evaluation'],
  ['Recommenders', 'Two-tower / W&D patterns', 'ANN recall', 'Reciprocal ranking', 'Contextual bandits', 'Behavioral feedback'],
  ['Data / Graph', 'Postgres', 'Prisma', 'Neo4j', 'Milvus/Zilliz', 'Redis', 'Redpanda/Kafka', 'DuckDB'],
  ['Agents', 'LangGraph-style state', 'FastAPI', 'Tool routing', 'Deterministic finance executors', 'Citation verification'],
  ['Infra / Security', 'AWS', 'Azure', 'Kubernetes', 'OpenShift', 'Docker', 'Terraform', 'SOC 2 controls', 'Tenant isolation'],
  ['MLOps', 'Airflow', 'W&B', 'Fiddler', 'Metaflow', 'Vertex AI', 'NVIDIA DGX/SuperPOD', 'Container scanning'],
];

const blogPosts = [
  ['GraphRAG', 'Designing source-scoped GraphRAG for financial datarooms', 'Immutable source manifests, temporal facts, conflict handling, and citation-verifiable retrieval.'],
  ['Recommenders', 'From ANN recall to reciprocal investor matching', 'Candidate generation, profile compaction, preference deltas, contextual bandits, and high-trust ranking.'],
  ['Evaluation', 'Evaluating agentic finance workflows without hand-waving', 'Leakage tests, as-of-date reasoning, numeric routing, source replay, and prompt/model versioning.'],
];

const dockItems = [
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'resume', label: 'Resume', icon: FileText },
  { id: 'stack', label: 'Stack', icon: Code2 },
  { id: 'blog', label: 'Blog', icon: Newspaper },
] as const;

type DockId = (typeof dockItems)[number]['id'];
type ProjectTab = 'overview' | 'architecture' | 'evidence';

const substackUrl = import.meta.env.VITE_SUBSTACK_URL || '';

function App() {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<ProjectTab>('overview');
  const [activeDock, setActiveDock] = useState<DockId>('projects');
  const activeProject = projects[activeProjectIndex];

  const dockTitle = useMemo(() => {
    const active = dockItems.find((item) => item.id === activeDock);
    return active ? active.label.toLowerCase() : 'projects';
  }, [activeDock]);

  return (
    <div className="site-shell">
      <Header />
      <main>
        <section className="hero-os" id="home">
          <div className="hero-copy">
            <p className="eyebrow">
              <CircleDot size={14} />
              Applied AI systems / CTO / research-to-production
            </p>
            <h1>{contact.name}</h1>
            <p className="hero-lede">
              Founder and CTO building production AI systems for deal-flow intelligence, recommender networks,
              source-scoped GraphRAG, secure agentic workflows, enterprise MLOps, and AI policy-sensitive products.
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

          <PortfolioBrowser
            activeProject={activeProject}
            activeProjectIndex={activeProjectIndex}
            activeTab={activeTab}
            onSelectProject={(index) => {
              setActiveProjectIndex(index);
              setActiveTab('overview');
            }}
            onSelectTab={setActiveTab}
          />
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

          <BrowserFrame title={`portfolio://${dockTitle}.workspace`} className="workspace-window">
            {activeDock === 'projects' && (
              <ProjectWorkspace
                activeProject={activeProject}
                activeProjectIndex={activeProjectIndex}
                onSelectProject={setActiveProjectIndex}
              />
            )}
            {activeDock === 'resume' && <ResumeWorkspace />}
            {activeDock === 'stack' && <StackWorkspace />}
            {activeDock === 'blog' && <BlogWorkspace />}
          </BrowserFrame>
        </section>

        <section className="credentials" id="credentials">
          <div>
            <p className="eyebrow">
              <BadgeCheck size={14} />
              Credentials / policy / public leadership
            </p>
            <h2>Enterprise AI builder with policy and infrastructure depth.</h2>
          </div>
          <div className="credential-grid">
            <span>NVIDIA Certified Professional</span>
            <span>NVIDIA Certified Associate - AI in the Data Center</span>
            <span>NVIDIA CA: Generative AI and LLMs</span>
            <span>NVIDIA CA: Generative AI Multimodal</span>
            <span>NVIDIA CA: AI Infrastructure and Operations</span>
            <span>Certified Product Manager</span>
            <span>Bloomberg Market Concepts</span>
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
        <a href="#blog">Blog</a>
      </nav>
      <div className="topbar-actions">
        <a className="icon-button" href={`mailto:${contact.email}`} aria-label="Email Daniel Campbell">
          <Mail size={19} />
        </a>
        <a className="button button-secondary compact-button" href={contact.linkedin} target="_blank" rel="noreferrer">
          <Linkedin size={17} />
          LinkedIn
        </a>
      </div>
    </header>
  );
}

function PortfolioBrowser({
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

  return (
    <BrowserFrame title={`portfolio://projects/${activeProject.file}`} className="hero-browser">
      <div className="browser-layout">
        <aside className="file-tree" aria-label="Project files">
          <div className="file-tree-heading">
            <Boxes size={16} />
            <span>Project files</span>
          </div>
          {projects.map((project, index) => {
            const ProjectIcon = project.icon;
            return (
              <button
                className={activeProjectIndex === index ? 'file-row active' : 'file-row'}
                key={project.file}
                type="button"
                onClick={() => onSelectProject(index)}
              >
                <ProjectIcon size={16} />
                <span>{project.file}</span>
              </button>
            );
          })}
        </aside>

        <article className="project-document">
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

          <div className="document-body">
            <div className="project-title-row">
              <span className="project-icon-large">
                <Icon size={26} />
              </span>
              <div>
                <span className="project-kicker">{activeProject.type} / {activeProject.status}</span>
                <h2>{activeProject.title}</h2>
              </div>
            </div>

            {activeTab === 'overview' && (
              <>
                <p className="project-summary">{activeProject.summary}</p>
                <div className="metric-grid">
                  {activeProject.metrics.map((metric) => (
                    <span key={metric}>{metric}</span>
                  ))}
                </div>
                <div className="system-map" aria-label="System map">
                  <span>sources</span>
                  <ChevronRight size={16} />
                  <span>retrieval</span>
                  <ChevronRight size={16} />
                  <span>graph</span>
                  <ChevronRight size={16} />
                  <span>ranking</span>
                  <ChevronRight size={16} />
                  <span>decision UI</span>
                </div>
              </>
            )}

            {activeTab === 'architecture' && (
              <ul className="detail-list">
                {activeProject.architecture.map((item) => (
                  <li key={item}>
                    <CircleDot size={14} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
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

        <aside className="inspector-panel" aria-label="Profile inspector">
          <img src={heroWorkbench} alt="Illustrated AI systems workbench" />
          <div className="inspector-card">
            <span>Current role</span>
            <strong>{contact.role}</strong>
          </div>
          <div className="inspector-card">
            <span>Location</span>
            <strong>{contact.location}</strong>
          </div>
          <div className="inspector-card">
            <span>Clearance</span>
            <strong>{contact.clearance}</strong>
          </div>
        </aside>
      </div>
    </BrowserFrame>
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
  onSelectProject,
}: {
  activeProject: Project;
  activeProjectIndex: number;
  onSelectProject: (index: number) => void;
}) {
  return (
    <div className="workspace-grid">
      <aside className="app-sidebar">
        <h3>Open project</h3>
        {projects.map((project, index) => (
          <button
            className={activeProjectIndex === index ? 'sidebar-card active' : 'sidebar-card'}
            key={project.file}
            type="button"
            onClick={() => onSelectProject(index)}
          >
            <span>{project.type}</span>
            <strong>{project.title}</strong>
          </button>
        ))}
      </aside>
      <div className="workspace-main">
        <div className="terminal-panel">
          <div className="terminal-lines">
            <span>$ open {activeProject.file}</span>
            <span>loaded: {activeProject.status.toLowerCase()}</span>
            <span>focus: {activeProject.type.toLowerCase()}</span>
          </div>
        </div>
        <h2>{activeProject.title}</h2>
        <p>{activeProject.summary}</p>
        <div className="card-grid">
          {activeProject.architecture.map((item) => (
            <article className="mini-card" key={item}>
              <Activity size={18} />
              <p>{item}</p>
            </article>
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
          Executive ownership with hands-on systems range: recommender systems, temporal knowledge graphs,
          source-scoped RAG, vector search, multimodal retrieval, deterministic finance, GPU infrastructure, and secure SaaS.
        </p>
        <div className="profile-lines">
          <span><MapPin size={16} /> {contact.location}</span>
          <span><ShieldCheck size={16} /> {contact.clearance}</span>
          <span><GraduationCap size={16} /> B.Eng. Computer Engineering; EMBA Candidate</span>
          <span><Linkedin size={16} /> linkedin.com/in/campbeld</span>
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

function BlogWorkspace() {
  return (
    <div className="blog-workspace" id="blog">
      <div className="blog-list">
        {blogPosts.map(([tag, title, summary]) => (
          <article className="blog-post" key={title}>
            <div className="post-meta">
              <span>Draft</span>
              <span>{tag}</span>
            </div>
            <h3>{title}</h3>
            <p>{summary}</p>
            <a href={`mailto:${contact.email}?subject=${encodeURIComponent(`Publish: ${title}`)}`}>
              Prepare post
              <ArrowUpRight size={16} />
            </a>
          </article>
        ))}
      </div>
      <div className="substack-panel">
        <div className="panel-header">
          <BookOpenText size={18} />
          <strong>Substack embed</strong>
        </div>
        {substackUrl ? (
          <iframe title="Substack publication" src={substackUrl} loading="lazy" />
        ) : (
          <div className="empty-embed">
            <BookOpenText size={34} />
            <h3>Substack ready</h3>
            <p>
              Set <code>VITE_SUBSTACK_URL=https://your-publication.substack.com/embed</code> to load the subscription
              frame here. Manual posts stay editable in <code>src/App.tsx</code>.
            </p>
          </div>
        )}
      </div>
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
        <a href={contact.linkedin} target="_blank" rel="noreferrer">
          <Linkedin size={16} />
          LinkedIn
        </a>
        <a href="https://github.com/" target="_blank" rel="noreferrer">
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
