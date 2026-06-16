export type IncidentStatus = 'briefing' | 'active' | 'won' | 'lost';
export type IncidentId =
  | 'parser-schema-drift'
  | 'temporal-graph-projection-skew'
  | 'agent-route-policy-regression'
  | 'embedding-freshness-starvation';

export type RootCause =
  | IncidentId
  | 'index-publish-skew'
  | 'feature-freshness-lag'
  | 'policy-filter-regression'
  | 'ranker-config-regression';

export type MitigationId =
  | 'rollback-parser-template'
  | 'rollback-graph-projection'
  | 'pin-kg-manifest'
  | 'rollback-route-policy'
  | 'reserve-embedding-gpu-pool'
  | 'rebuild-recent-embeddings'
  | 'rollback-index-alias'
  | 'flush-affected-cache'
  | 'rollback-ranker-config'
  | 'restart-service'
  | 'scale-workers';

export type EvidenceCategory = 'impact' | 'localization' | 'causality' | 'refutation' | 'validation' | 'guide';

export type EvidenceCard = {
  id: string;
  title: string;
  category: EvidenceCategory;
  supports: RootCause[];
  refutes?: RootCause[];
  weight: 1 | 2 | 3;
};

export type PortfolioGuideLink = {
  projectFile: string;
  tab: 'overview' | 'architecture' | 'evidence';
  title: string;
  concept: string;
};

type ScenarioOutput = {
  evidence?: EvidenceCard;
  before: string[];
  after?: string[];
};

export type IncidentScenario = {
  id: IncidentId;
  title: string;
  target: string;
  symptom: string;
  productContext: string;
  alertLine: string;
  objective: string;
  recentChanges: string[];
  correctRoot: RootCause;
  correctMitigations: MitigationId[];
  primaryReplay: string;
  difficulty: 2 | 3 | 4;
  hints: {
    subtle: string;
    strong: string;
  };
  guideLinks: PortfolioGuideLink[];
  outputs: Record<string, ScenarioOutput>;
};

export type IncidentState = {
  status: IncidentStatus;
  scenario: IncidentScenario;
  timeRemaining: number;
  health: number;
  confidence: number;
  blastRadius: 'low' | 'medium' | 'high';
  evidence: EvidenceCard[];
  rootCause?: RootCause | string;
  mitigations: MitigationId[];
  validated: boolean;
  steps: number;
  hintsUsed: number;
  stakeholderUpdated: boolean;
  score?: number;
  rank?: string;
  achievements: string[];
};

export type IncidentCommandResult = {
  state: IncidentState;
  output: string[];
};

const scenarios: IncidentScenario[] = [
  {
    id: 'parser-schema-drift',
    title: 'SEV-2 Recommendation Constraint Leakage',
    target: 'recommendation-quality.prod',
    symptom: 'accepted recommendations down 27%',
    productContext:
      'A recommender is serving plausible results, but users say some results violate explicit requirements. Availability and latency are normal.',
    alertLine: 'quality alert: complaints tagged violates_requirements +4.1x, hard errors normal',
    objective:
      'Localize where explicit constraints disappear, form a supported hypothesis, apply a scoped mitigation, validate replay recovery, then close.',
    recentChanges: [
      'vector index publish completed 63m ago',
      'ranker exploration config changed for 20% traffic 41m ago',
      'document extraction template promoted 19m ago',
      'cache namespace warmup completed 12m ago',
    ],
    correctRoot: 'parser-schema-drift',
    correctMitigations: ['rollback-parser-template'],
    primaryReplay: 'constraints',
    difficulty: 2,
    hints: {
      subtle: 'The ranker can only rank what survives filtering. Find where explicit requirements first disappear.',
      strong: 'Compare parsed requirement fields with the constraint compiler input in a traced request.',
    },
    guideLinks: [
      {
        projectFile: 'matching-engine.project',
        tab: 'architecture',
        title: 'Investor & Attendee Matching Engine',
        concept: 'recall, constraints, ranking, and feedback loops',
      },
      {
        projectFile: 'agentic-rag-platform.project',
        tab: 'evidence',
        title: 'Agentic RAG & ML Platform',
        concept: 'document processing, trace verification, and quality evals',
      },
    ],
    outputs: {
      'inspect slo': {
        evidence: card('impact-constraints', 'Impact: explicit requirement complaints', 'impact', ['parser-schema-drift'], 2),
        before: [
          'slo',
          '├─ availability              99.98% normal',
          '├─ p95 latency               410ms normal',
          '├─ accepted recommendations  -27%',
          '├─ complaint tag             violates_requirements +4.1x',
          '└─ affected cohort           documents parsed after 14:10 UTC',
        ],
      },
      'inspect metrics': {
        evidence: card('filter-rejection-drop', 'Localization: filter rejection rate dropped', 'localization', ['parser-schema-drift', 'policy-filter-regression'], 2),
        before: [
          'quality metrics',
          '├─ semantic similarity median   unchanged',
          '├─ candidate depth              unchanged',
          '├─ filter rejection rate        34% -> 19%',
          '└─ post-serve negative feedback up 3.8x',
        ],
        after: [
          'quality metrics',
          '├─ semantic similarity median   unchanged',
          '├─ candidate depth              unchanged',
          '├─ filter rejection rate        31% recovering',
          '└─ post-serve negative feedback falling',
        ],
      },
      'inspect parser': {
        evidence: card('parser-contract-shape', 'Causality: parser output contract changed', 'causality', ['parser-schema-drift'], 3),
        before: [
          'parser probe',
          '├─ parse success                  99.1%',
          '├─ field null rate                normal',
          '├─ new field observed             negative_preferences[]',
          '└─ legacy field observed          excluded_categories[] down 76% for new parses',
        ],
        after: [
          'parser probe',
          '├─ active template                previous stable contract',
          '├─ excluded_categories[]          restored',
          '└─ negative preference mapping    compatible with compiler',
        ],
      },
      'trace request': {
        evidence: card('trace-compiler-missing-exclusions', 'Causality: compiler input missing exclusions', 'causality', ['parser-schema-drift'], 3),
        before: [
          'trace sample-a',
          '├─ profile says             "no healthcare, no pre-revenue"',
          '├─ parser output            negative_preferences=["healthcare","pre-revenue"]',
          '├─ compiler input           excluded_categories=[]',
          '├─ filter result            healthcare candidate allowed',
          '└─ ranker score             high semantic fit',
        ],
        after: [
          'trace sample-a',
          '├─ parser output            excluded_categories=["healthcare","pre-revenue"]',
          '├─ compiler input           excluded_categories=["healthcare","pre-revenue"]',
          '├─ filter result            healthcare candidate rejected',
          '└─ ranker                   receives valid candidate set',
        ],
      },
      'inspect deploys': {
        evidence: card('timeline-parser-decoy-set', 'Timeline: multiple plausible recent changes', 'refutation', ['parser-schema-drift'], 1),
        before: [
          'deploy timeline',
          '├─ vector index publish        completed 63m ago',
          '├─ ranker exploration config   completed 41m ago',
          '├─ document extraction template promoted 19m ago',
          '└─ cache namespace warmup      completed 12m ago',
        ],
        after: [
          'deploy timeline',
          '├─ document extraction template rolled back just now',
          '├─ ranker exploration config   unchanged',
          '└─ vector index alias          unchanged',
        ],
      },
    },
  },
  {
    id: 'temporal-graph-projection-skew',
    title: 'SEV-2 Source-Backed Answer Freshness Regression',
    target: 'graphrag-answering.prod',
    symptom: 'cited answers are out of date',
    productContext:
      'RAG answers still include real citations, but time-sensitive questions are answered with stale facts.',
    alertLine: 'quality alert: correction requests +3.6x, citation missing rate normal',
    objective:
      'Determine whether the issue is retrieval, graph projection, structured facts, or citation verification; then restore as-of-date correctness.',
    recentChanges: [
      'graph projection job completed 91m ago',
      'citation verifier prompt revised 64m ago',
      'vector index refresh completed 42m ago',
      'structured fact cache warmed 18m ago',
    ],
    correctRoot: 'temporal-graph-projection-skew',
    correctMitigations: ['rollback-graph-projection'],
    primaryReplay: 'temporal',
    difficulty: 3,
    hints: {
      subtle: 'A citation can exist and still be wrong for the requested time window.',
      strong: 'Inspect the graph projection and compare stale graph facts against the structured fact ledger.',
    },
    guideLinks: [
      {
        projectFile: 'investment-graph.project',
        tab: 'architecture',
        title: 'Investment Intelligence Graph',
        concept: 'source manifests, bitemporal facts, graph projection, and provenance',
      },
      {
        projectFile: 'agentic-rag-platform.project',
        tab: 'architecture',
        title: 'Agentic RAG & ML Platform',
        concept: 'retrieval routing, context packing, and citation verification',
      },
    ],
    outputs: {
      'inspect slo': {
        evidence: card('impact-temporal-citations', 'Impact: corrections despite valid citations', 'impact', ['temporal-graph-projection-skew'], 2),
        before: [
          'slo',
          '├─ answer acceptance       -22%',
          '├─ citation missing rate   normal',
          '├─ correction requests     +3.6x',
          '└─ affected questions      "current", "as of", "latest", "now"',
        ],
      },
      'inspect rag': {
        evidence: card('rag-route-graph-temporal-gap', 'Localization: graph route missing temporal filter', 'localization', ['temporal-graph-projection-skew'], 2),
        before: [
          'rag route',
          '├─ route selection          graph + vector hybrid',
          '├─ top graph facts          high confidence',
          '├─ source documents         real and accessible',
          '└─ graph expansion filter   temporal window not present in trace',
        ],
        after: [
          'rag route',
          '├─ route selection          graph + vector hybrid',
          '├─ temporal graph filter    applied',
          '└─ stale neighborhoods      excluded for current-answer route',
        ],
      },
      'inspect graph': {
        evidence: card('graph-projection-temporal-off', 'Causality: projection manifest lacks temporal window', 'causality', ['temporal-graph-projection-skew'], 3),
        before: [
          'knowledge graph projection',
          '├─ active projection        kg-proj-2026-06-16-b',
          '├─ edge count               +11%',
          '├─ superseded fact edges    present in active neighborhood',
          '└─ projection manifest      temporal_window=false',
        ],
        after: [
          'knowledge graph projection',
          '├─ active projection        kg-proj-2026-06-15-stable',
          '├─ projection manifest      temporal_window=true',
          '└─ superseded fact edges    excluded from current route',
        ],
      },
      'trace request': {
        evidence: card('trace-stale-graph-outranks-ledger', 'Causality: stale graph fact outranks current ledger fact', 'causality', ['temporal-graph-projection-skew'], 3),
        before: [
          'trace sample-g',
          '├─ question                  "current ARR as of this quarter"',
          '├─ structured fact ledger    ARR=42M valid_from=2026-04-01',
          '├─ graph neighborhood        ARR=31M valid_to=2026-03-31',
          '├─ context packer            stale graph fact before current ledger fact',
          '└─ citation verifier         PASS: document exists',
        ],
        after: [
          'trace sample-g',
          '├─ graph neighborhood        excludes valid_to=2026-03-31 for current query',
          '├─ structured fact ledger    ARR=42M selected',
          '└─ temporal consistency      PASS',
        ],
      },
      'inspect citations': {
        evidence: card('citation-exists-not-temporal', 'Refutation: citation existence is not enough', 'refutation', ['temporal-graph-projection-skew'], 2),
        before: [
          'citation verifier',
          '├─ cited document exists     yes',
          '├─ cited span supports text  yes',
          '└─ as-of-date validity       not checked by current verifier',
        ],
      },
      'inspect structured-facts': {
        evidence: card('ledger-current-fact-ok', 'Refutation: structured ledger has current value', 'refutation', ['temporal-graph-projection-skew'], 2),
        before: [
          'structured facts',
          '├─ current ARR ledger fact   present',
          '├─ bitemporal validity       valid for query date',
          '└─ cache age                 normal',
        ],
      },
    },
  },
  {
    id: 'agent-route-policy-regression',
    title: 'SEV-2 Deterministic Tool Routing Regression',
    target: 'agent-workflows.prod',
    symptom: 'fluent answers with inconsistent numbers',
    productContext:
      'Agent answers are readable, but questions requiring deterministic calculations produce inconsistent results.',
    alertLine: 'quality alert: numeric correction requests +4.2x, tool error rate normal, token cost up 19%',
    objective:
      'Find where deterministic work is bypassed, restore the correct route, and validate numeric replay.',
    recentChanges: [
      'supervisor route policy promoted 83m ago',
      'calculator tool timeout raised 57m ago',
      'shorter answer prompt revised 39m ago',
      'model provider fallback enabled 21m ago',
    ],
    correctRoot: 'agent-route-policy-regression',
    correctMitigations: ['rollback-route-policy'],
    primaryReplay: 'numeric',
    difficulty: 3,
    hints: {
      subtle: 'Do not ask whether the model can do arithmetic. Ask whether it was supposed to.',
      strong: 'Trace a numeric request and check whether the deterministic calculator tool was called.',
    },
    guideLinks: [
      {
        projectFile: 'agentic-rag-platform.project',
        tab: 'architecture',
        title: 'Agentic RAG & ML Platform',
        concept: 'supervisor routing, tool traces, and deterministic executors',
      },
      {
        projectFile: 'synexis-product-platform.project',
        tab: 'evidence',
        title: 'Synexis Product Platform',
        concept: 'production workflows that combine SaaS state, AI routes, and user-facing outputs',
      },
    ],
    outputs: {
      'inspect slo': {
        evidence: card('impact-numeric-corrections', 'Impact: numeric corrections increased', 'impact', ['agent-route-policy-regression'], 2),
        before: [
          'slo',
          '├─ numeric correction requests   +4.2x',
          '├─ tool error rate               normal',
          '├─ calculator latency            normal',
          '└─ token cost                    +19%',
        ],
      },
      'inspect agent': {
        evidence: card('tool-call-rate-down', 'Localization: deterministic tool-call rate dropped', 'localization', ['agent-route-policy-regression'], 3),
        before: [
          'agent supervisor',
          '├─ route policy                  route-v12',
          '├─ numeric task tool-call rate   74% -> 28%',
          '├─ fallback general reasoning    up 3.1x',
          '└─ loop count                    normal',
        ],
        after: [
          'agent supervisor',
          '├─ route policy                  route-v11-stable',
          '├─ numeric task tool-call rate   recovering',
          '└─ calculator path               restored for finance_metric intents',
        ],
      },
      'trace request': {
        evidence: card('trace-calculator-bypassed', 'Causality: calculator bypassed after facts retrieved', 'causality', ['agent-route-policy-regression'], 3),
        before: [
          'trace sample-h',
          '├─ question              "compute runway using cash and monthly burn"',
          '├─ intent classifier     finance_metric',
          '├─ supervisor route      general_reasoning',
          '├─ structured facts      retrieved',
          '├─ calculator tool       not called',
          '└─ LLM answer            arithmetic mismatch',
        ],
        after: [
          'trace sample-h',
          '├─ supervisor route      deterministic_calculator',
          '├─ structured facts      retrieved',
          '├─ calculator tool       called',
          '└─ numeric consistency   PASS',
        ],
      },
      'inspect prompt': {
        evidence: card('prompt-decoy-refuted', 'Refutation: prompt changed but route binding changed separately', 'refutation', ['agent-route-policy-regression'], 2),
        before: [
          'prompt registry',
          '├─ answer template       shorter-answer-v7',
          '├─ calculator instruction unchanged',
          '└─ route policy binding  route-v12',
        ],
      },
      'inspect deploys': {
        evidence: card('agent-timeline-decoys', 'Timeline: route, prompt, timeout, and provider changed', 'refutation', ['agent-route-policy-regression'], 1),
        before: [
          'deploy timeline',
          '├─ supervisor route policy promoted 83m ago',
          '├─ calculator timeout raised        57m ago',
          '├─ shorter answer prompt revised    39m ago',
          '└─ model provider fallback enabled  21m ago',
        ],
        after: [
          'deploy timeline',
          '├─ supervisor route policy rolled back just now',
          '├─ prompt template unchanged',
          '└─ calculator timeout unchanged',
        ],
      },
    },
  },
  {
    id: 'embedding-freshness-starvation',
    title: 'SEV-2 Embedding Freshness Regression',
    target: 'semantic-ingestion.prod',
    symptom: 'new documents weak in semantic answers',
    productContext:
      'New documents are searchable by title, but RAG and recommender semantic answers miss or underuse them.',
    alertLine: 'quality alert: recent-upload semantic acceptance -29%, title search normal, latency normal',
    objective:
      'Separate serving health from embedding freshness, stop starvation, backfill recent embeddings, and validate recent-upload recall.',
    recentChanges: [
      'GPU scheduler policy changed for shared training queues 96m ago',
      'embedding batch started 72m ago',
      'large training job requested high-priority A100 slices 51m ago',
      'vector alias publish completed 24m ago',
    ],
    correctRoot: 'embedding-freshness-starvation',
    correctMitigations: ['reserve-embedding-gpu-pool', 'rebuild-recent-embeddings'],
    primaryReplay: 'retrieval',
    difficulty: 4,
    hints: {
      subtle: 'Freshness failures can look like retrieval quality failures while services remain healthy.',
      strong: 'Compare lexical and vector coverage for recent uploads, then inspect GPU queue pressure.',
    },
    guideLinks: [
      {
        projectFile: 'enterprise-mlops.project',
        tab: 'architecture',
        title: 'Enterprise AI Platform & MLOps',
        concept: 'GPU scheduling, training queues, model/eval governance, and hybrid-cloud MLOps',
      },
      {
        projectFile: 'cloud-devops-platform.project',
        tab: 'architecture',
        title: 'Cloud & DevOps Operating Model',
        concept: 'service topology, observability, deployment controls, and platform reliability',
      },
      {
        projectFile: 'agentic-rag-platform.project',
        tab: 'architecture',
        title: 'Agentic RAG & ML Platform',
        concept: 'embedding pipelines, vector search, and RAG worker architecture',
      },
    ],
    outputs: {
      'inspect slo': {
        evidence: card('impact-recent-upload-retrieval', 'Impact: recent uploads affected', 'impact', ['embedding-freshness-starvation'], 2),
        before: [
          'slo',
          '├─ new-document semantic acceptance -29%',
          '├─ title search                    normal',
          '├─ overall latency                 normal',
          '└─ affected cohort                 uploads in last 90m',
        ],
      },
      'inspect index': {
        evidence: card('index-lexical-vector-skew', 'Localization: lexical current, vector partial', 'localization', ['embedding-freshness-starvation'], 3),
        before: [
          'index status',
          '├─ active alias             docs-2026-06-16-c',
          '├─ lexical document count   current',
          '├─ vector document count    82% expected for recent uploads',
          '└─ hybrid fallback          masking partial failure',
        ],
        after: [
          'index status',
          '├─ active alias             docs-2026-06-16-c',
          '├─ lexical document count   current',
          '├─ vector document count    expected count reached',
          '└─ hybrid retrieval         healthy',
        ],
      },
      'inspect gpu': {
        evidence: card('gpu-embedding-pool-starved', 'Causality: embedding workers starved by training priority', 'causality', ['embedding-freshness-starvation'], 3),
        before: [
          'gpu scheduler',
          '├─ embedding worker queue wait p95 38m',
          '├─ training queue preemptions      +6',
          '├─ A100 MIG slices to training     92%',
          '└─ embedding pool starvation       observed',
        ],
        after: [
          'gpu scheduler',
          '├─ reserved embedding pool         active',
          '├─ embedding worker queue wait p95 4m',
          '└─ training queue still running with bounded slices',
        ],
      },
      'inspect training': {
        evidence: card('training-preempts-embedding', 'Causality: training job delayed embeddings, not serving', 'causality', ['embedding-freshness-starvation'], 2),
        before: [
          'training and batch jobs',
          '├─ large training job       high priority, healthy',
          '├─ checkpoint progress      normal',
          '├─ embedding batch          delayed, not failed',
          '└─ metadata/lexical stages  complete',
        ],
      },
      'trace request': {
        evidence: card('trace-new-doc-vector-missing', 'Localization: new document missing from vector retrieval', 'localization', ['embedding-freshness-starvation'], 3),
        before: [
          'trace sample-i',
          '├─ query targets new document',
          '├─ lexical retrieval        finds source',
          '├─ vector retrieval         missing recent embedding',
          '├─ context packer           weak context',
          '└─ LLM answer               generic summary',
        ],
        after: [
          'trace sample-i',
          '├─ lexical retrieval        finds source',
          '├─ vector retrieval         finds recent embedding',
          '├─ context packer           source included',
          '└─ LLM answer               grounded summary',
        ],
      },
    },
  },
];

export function createIncidentState(scenarioId?: IncidentId | string): IncidentState {
  const scenario = scenarioId ? getScenario(normalizeLegacyScenarioId(scenarioId)) : randomScenario();

  return {
    status: 'briefing',
    scenario,
    timeRemaining: scenario.difficulty >= 4 ? 720 : 600,
    health: 88,
    confidence: 0,
    blastRadius: 'low',
    evidence: [],
    mitigations: [],
    validated: false,
    steps: 0,
    hintsUsed: 0,
    stakeholderUpdated: false,
    achievements: [],
  };
}

export function getIncidentPortfolioLinks(state: IncidentState) {
  return state.scenario.guideLinks;
}

export function incidentIntro(state = createIncidentState()) {
  const { scenario } = state;
  return [
    '╭────────────────────────────────────────────╮',
    '│ INCIDENT COMMANDER                         │',
    `│ SEV-2  ${fitTerminalText(scenario.target, 31)}│`,
    '├────────────────────────────────────────────┤',
    `│ ${fitTerminalText(scenario.symptom, 42)}│`,
    '│ hard errors: normal                        │',
    '│ user trust: degrading                      │',
    '╰────────────────────────────────────────────╯',
    '',
    'briefing: timer is paused until you run "start incident".',
    '',
    'scenario:',
    `  ${scenario.productContext}`,
    `  ${scenario.alertLine}.`,
    '',
    'objective:',
    `  ${scenario.objective}`,
    '',
    'known recent changes:',
    ...scenario.recentChanges.map((change, index) => `  ${index + 1}. ${change}`),
    '',
    'how to play:',
    '  gather impact, localization, causality, and validation evidence.',
    '  use "portfolio guide" if you want architectural reading from the portfolio.',
    '  use "hypothesis <cause>", "mitigate <action>", "validate", then "close incident".',
    '',
    'good first commands after start:',
    '  inspect slo | inspect metrics | inspect deploys | trace request | portfolio guide | help',
    '',
    'run "start incident" when ready.',
  ];
}

export function runIncidentCommand(rawInput: string, state: IncidentState): IncidentCommandResult {
  const input = normalizeCommand(rawInput);
  if (!input) return { state, output: [] };

  if (state.status === 'briefing') {
    return runBriefingCommand(input, state);
  }

  if (state.status !== 'active') {
    return {
      state,
      output: ['incident is closed. run reset to start a fresh randomized incident.'],
    };
  }

  if (input === 'help' || input === 'commands') return { state, output: helpLines(state) };
  if (input === 'status') return { state, output: statusLines(state) };
  if (input === 'objective' || input === 'objectives') return { state, output: objectiveLines(state) };
  if (input === 'evidence' || input === 'inventory') return { state, output: evidenceLines(state) };
  if (input === 'portfolio guide' || input === 'guide' || input === 'open guide') return portfolioGuideCommand(state);
  if (input === 'hint' || input === 'hint subtle') return hintCommand(state, 'subtle');
  if (input === 'hint strong' || input === 'ask gm') return hintCommand(state, 'strong');
  if (input === 'ack') return applyCommand(state, { output: ['incident acknowledged. clock discipline begins now.'], confidenceGain: 2 });
  if (input === 'update stakeholders') {
    return applyCommand(state, {
      output: ['stakeholder update sent: impact known, investigation in progress, no broad mitigation yet.'],
      confidenceGain: 3,
      stakeholderUpdated: true,
    });
  }

  const outputCommand = normalizeOutputCommand(input);
  if (state.scenario.outputs[outputCommand]) return inspectScenarioOutput(outputCommand, state);

  if (input === 'validate' || input === 'validate fix' || input === 'run replay' || input.startsWith('run replay ') || input.startsWith('run eval ')) {
    return validateIncident(input, state);
  }

  if (input.startsWith('hypothesis ') || input.startsWith('declare ')) {
    return setHypothesis(input.replace(/^hypothesis |^declare /, '') as RootCause, state);
  }

  if (input.startsWith('mitigate ')) {
    return applyMitigation(input.replace('mitigate ', '') as MitigationId, state);
  }

  const legacyMitigation = legacyMitigationCommand(input);
  if (legacyMitigation) return applyMitigation(legacyMitigation, state);

  if (input === 'restart service' || input === 'restart redis' || input === 'scale workers') {
    return applyMitigation(input === 'scale workers' ? 'scale-workers' : 'restart-service', state);
  }

  if (input === 'close' || input === 'close incident') return closeIncident(state);

  return {
    state,
    output: [`incident: command not found: ${input}. Try "help".`],
  };
}

function runBriefingCommand(input: string, state: IncidentState): IncidentCommandResult {
  if (input === 'start' || input === 'start incident' || input === 'begin') {
    const activeState = { ...state, status: 'active' as const };
    return {
      state: activeState,
      output: [
        `incident timer started: ${formatIncidentTime(activeState.timeRemaining)}.`,
        'ops-note: find where the badness first enters the system.',
        'portfolio-note: "portfolio guide" opens relevant architecture references without revealing the answer.',
        ...statusLines(activeState),
      ],
    };
  }

  if (input === 'portfolio guide' || input === 'guide' || input === 'open guide') {
    return portfolioGuideCommand(state);
  }

  if (input === 'hint' || input === 'hint subtle' || input === 'hint strong' || input === 'ask gm') {
    return hintCommand(state, input === 'hint strong' || input === 'ask gm' ? 'strong' : 'subtle');
  }

  if (input === 'help' || input === 'commands' || input === 'status' || input === 'objective') {
    return {
      state,
      output: [
        'briefing mode:',
        '  timer is paused. read the scenario, then run "start incident".',
        '  use "portfolio guide" for related portfolio sections that explain the system concepts.',
        '',
        'core loop:',
        '  inspect -> evidence -> hypothesis -> mitigate -> validate -> close',
        '',
        ...objectiveLines(state),
      ],
    };
  }

  return {
    state,
    output: [`briefing paused. Run "start incident" before investigation commands. You typed: ${input}`],
  };
}

function inspectScenarioOutput(command: string, state: IncidentState): IncidentCommandResult {
  const scenarioOutput = state.scenario.outputs[command];
  const fixed = hasAllCorrectMitigations(state);
  return applyCommand(state, {
    evidence: scenarioOutput.evidence,
    confidenceGain: scenarioOutput.evidence ? scenarioOutput.evidence.weight * 6 : 4,
    output: fixed && scenarioOutput.after ? scenarioOutput.after : scenarioOutput.before,
  });
}

function setHypothesis(cause: RootCause, state: IncidentState): IncidentCommandResult {
  const support = hypothesisSupport(cause, state.evidence);
  const correct = cause === state.scenario.correctRoot;

  if (correct && support >= 3) {
    return applyCommand(state, {
      rootCause: cause,
      confidenceGain: 14,
      output: [
        `hypothesis recorded: ${cause}`,
        'support: enough evidence points at this layer.',
        `next: apply a scoped mitigation, then run replay ${state.scenario.primaryReplay}.`,
      ],
    });
  }

  if (correct) {
    return applyCommand(state, {
      rootCause: cause,
      confidenceGain: 5,
      output: [
        `hypothesis recorded: ${cause}`,
        'support is still thin. gather impact, localization, and causality evidence before mitigation.',
      ],
    });
  }

  return applyCommand(state, {
    rootCause: cause,
    healthCost: 5,
    confidenceGain: -8,
    output: [
      `hypothesis recorded: ${cause}`,
      'support is weak or contradicted by current evidence.',
      'use "evidence" to review what you actually know.',
    ],
  });
}

function applyMitigation(mitigation: MitigationId, state: IncidentState): IncidentCommandResult {
  const correct = state.scenario.correctMitigations.includes(mitigation);
  const alreadyApplied = state.mitigations.includes(mitigation);
  if (alreadyApplied) {
    return {
      state,
      output: [`mitigation already applied: ${mitigation}`, ...statusSummary(state)],
    };
  }

  if (correct) {
    const nextMitigations = [...state.mitigations, mitigation];
    const allCorrect = state.scenario.correctMitigations.every((required) => nextMitigations.includes(required));
    return applyCommand(state, {
      mitigations: nextMitigations,
      confidenceGain: state.rootCause === state.scenario.correctRoot ? 16 : 7,
      output: [
        `mitigation applied: ${mitigation}`,
        `blast radius: ${mitigationBlastRadius(mitigation)}`,
        allCorrect
          ? 'world updated: affected inspections now show recovery. run validate.'
          : 'partial containment: one required mitigation remains before validation can pass.',
      ],
    });
  }

  return applyCommand(state, {
    mitigations: [...state.mitigations, mitigation],
    healthCost: mitigation === 'restart-service' || mitigation === 'scale-workers' ? 10 : 8,
    confidenceGain: -8,
    output: [
      `mitigation applied: ${mitigation}`,
      'live quality signal: unchanged.',
      mitigation === 'restart-service' || mitigation === 'scale-workers'
        ? 'lesson: hard errors and latency were normal; this looks like an AI quality-path failure.'
        : 'lesson: this action changed a nearby layer, but current evidence does not localize the fault there.',
    ],
  });
}

function validateIncident(input: string, state: IncidentState): IncidentCommandResult {
  const replay = input.replace(/^run replay |^run eval /, '').trim() || state.scenario.primaryReplay;
  const replayMatches = replay === state.scenario.primaryReplay || input === 'validate' || input === 'validate fix' || input === 'run replay';
  const pass = replayMatches && hasAllCorrectMitigations(state);
  const validationEvidence = card(`validation-${state.scenario.primaryReplay}`, `Validation: ${state.scenario.primaryReplay} replay`, 'validation', [state.scenario.correctRoot], 3);

  return applyCommand(state, {
    evidence: pass ? validationEvidence : undefined,
    validated: pass ? true : state.validated,
    confidenceGain: pass ? 20 : replayMatches ? 8 : 4,
    healthCost: pass ? 0 : 2,
    output: pass
      ? [
          `replay ${state.scenario.primaryReplay}`,
          '[||||||||||||||||||||] 100%',
          'validation: PASS',
          'live slice: recovering',
          'close is allowed if hypothesis and evidence gates are satisfied.',
        ]
      : [
          `replay ${replay}`,
          '[||||||||||||      ] 68%',
          replayMatches
            ? 'validation: FAIL. The relevant replay still fails because the correct mitigation is incomplete.'
            : 'validation: mixed. Useful context, but this is not the scenario-critical replay.',
        ],
  });
}

function closeIncident(state: IncidentState): IncidentCommandResult {
  const missing = closeBlockers(state);
  if (missing.length) {
    return applyCommand(state, {
      healthCost: 10,
      confidenceGain: -5,
      output: ['close rejected.', ...missing.map((item) => `missing: ${item}`), 'use "evidence" and "portfolio guide" if the causal chain is unclear.'],
    });
  }

  const achievements = calculateAchievements(state);
  const score = calculateScore(state, achievements);
  return {
    state: {
      ...state,
      status: 'won',
      score,
      rank: rankScore(score),
      achievements,
    },
    output: [
      'incident closed',
      `scenario: ${state.scenario.title}`,
      `root cause: ${state.scenario.correctRoot}`,
      `score: ${score}`,
      `rank: ${rankScore(score)}`,
      '',
      'portfolio closeout:',
      ...state.scenario.guideLinks.map((link) => `  ${link.title}: ${link.concept}`),
      '',
      'achievements:',
      ...achievements.map((achievement) => `  unlocked: ${achievement}`),
    ],
  };
}

function portfolioGuideCommand(state: IncidentState): IncidentCommandResult {
  const guideEvidence = card(`guide-${state.scenario.id}`, 'Guide: portfolio field guide opened', 'guide', [], 1);
  return applyCommand(state, {
    evidence: guideEvidence,
    confidenceGain: 0,
    output: [
      'portfolio field guide:',
      ...state.scenario.guideLinks.flatMap((link) => [
        `  open ${link.projectFile} ${link.tab}`,
        `    ${link.title}: ${link.concept}`,
      ]),
      '',
      'guide note: these explain the system patterns. They do not identify the root cause by themselves.',
    ],
  });
}

function hintCommand(state: IncidentState, level: 'subtle' | 'strong'): IncidentCommandResult {
  const penalty = level === 'strong' ? 5 : 2;
  return {
    state: {
      ...state,
      hintsUsed: state.hintsUsed + (level === 'strong' ? 2 : 1),
      health: Math.max(0, state.health - penalty),
      steps: state.steps + 1,
    },
    output: [
      `${level} hint: ${state.scenario.hints[level]}`,
      level === 'strong' ? 'score note: strong hints block expert-style scoring.' : 'score note: subtle hints have a small score cost.',
      ...statusSummary({ ...state, health: Math.max(0, state.health - penalty), hintsUsed: state.hintsUsed + (level === 'strong' ? 2 : 1), steps: state.steps + 1 }),
    ],
  };
}

function applyCommand(
  state: IncidentState,
  change: {
    output: string[];
    evidence?: EvidenceCard;
    healthCost?: number;
    confidenceGain?: number;
    rootCause?: RootCause | string;
    mitigations?: MitigationId[];
    validated?: boolean;
    stakeholderUpdated?: boolean;
  },
): IncidentCommandResult {
  const evidence = change.evidence ? uniqueEvidence([...state.evidence, change.evidence]) : state.evidence;
  const nextState: IncidentState = {
    ...state,
    health: Math.max(0, state.health - (change.healthCost ?? 0)),
    confidence: clamp(state.confidence + (change.confidenceGain ?? 0), 0, 100),
    evidence,
    rootCause: change.rootCause ?? state.rootCause,
    mitigations: change.mitigations ?? state.mitigations,
    validated: change.validated ?? state.validated,
    stakeholderUpdated: change.stakeholderUpdated ?? state.stakeholderUpdated,
    steps: state.steps + 1,
  };

  if (nextState.health <= 0 || nextState.timeRemaining <= 0) {
    return {
      state: {
        ...nextState,
        status: 'lost',
        score: 0,
        rank: 'dashboard tourist',
      },
      output: [...change.output, 'incident failed: time or user trust exhausted.'],
    };
  }

  return {
    state: nextState,
    output: [...change.output, ...statusSummary(nextState)],
  };
}

function statusLines(state: IncidentState) {
  return [
    `${state.scenario.title} | ${state.scenario.symptom}`,
    `time: ${formatIncidentTime(state.timeRemaining)} | health: ${state.health} | confidence: ${state.confidence} | blast-radius: ${state.blastRadius}`,
    `hypothesis: ${state.rootCause ?? 'unset'} | mitigations: ${state.mitigations.length ? state.mitigations.join(', ') : 'none'} | validated: ${state.validated ? 'yes' : 'no'}`,
    ...checklistLines(state),
  ];
}

function objectiveLines(state: IncidentState) {
  return [
    `objective: ${state.scenario.objective}`,
    'evidence gates:',
    ...checklistLines(state),
    '',
    'portfolio guide:',
    ...state.scenario.guideLinks.map((link) => `  ${link.title}: ${link.concept}`),
  ];
}

function evidenceLines(state: IncidentState) {
  if (!state.evidence.length) return ['evidence board: empty'];
  return [
    'evidence board:',
    ...state.evidence.map((item) => `  [${item.category}] ${item.title}`),
    '',
    ...checklistLines(state),
  ];
}

function checklistLines(state: IncidentState) {
  return [
    `[${hasCategory(state, 'impact') ? 'x' : ' '}] impact evidence`,
    `[${hasCategory(state, 'localization') ? 'x' : ' '}] localization evidence`,
    `[${hasCategory(state, 'causality') ? 'x' : ' '}] causality evidence`,
    `[${state.rootCause === state.scenario.correctRoot ? 'x' : ' '}] supported hypothesis`,
    `[${hasAllCorrectMitigations(state) ? 'x' : ' '}] scoped mitigation`,
    `[${state.validated ? 'x' : ' '}] validation replay`,
  ];
}

function statusSummary(state: IncidentState) {
  return [`status: health ${state.health} | confidence ${state.confidence} | evidence ${state.evidence.length} | validated ${state.validated ? 'yes' : 'no'}`];
}

function helpLines(state: IncidentState) {
  return [
    'commands:',
    '  status | objective | evidence | portfolio guide',
    '  inspect slo | inspect metrics | inspect deploys | trace request',
    '  inspect parser | inspect index | inspect rag | inspect graph | inspect agent | inspect gpu | inspect training',
    '  inspect prompt | inspect citations | inspect structured-facts',
    '  run replay constraints | run replay temporal | run replay numeric | run replay retrieval | validate',
    '  hypothesis parser-schema-drift | temporal-graph-projection-skew | agent-route-policy-regression | embedding-freshness-starvation',
    '  mitigate rollback-parser-template | rollback-graph-projection | rollback-route-policy | reserve-embedding-gpu-pool | rebuild-recent-embeddings',
    '  ack | update stakeholders | close incident',
    '',
    `current objective: ${state.scenario.objective}`,
  ];
}

function closeBlockers(state: IncidentState) {
  const blockers = [];
  if (!hasCategory(state, 'impact')) blockers.push('impact evidence');
  if (!hasCategory(state, 'localization')) blockers.push('localization evidence');
  if (!hasCategory(state, 'causality')) blockers.push('causality evidence');
  if (state.rootCause !== state.scenario.correctRoot) blockers.push('supported hypothesis');
  if (!hasAllCorrectMitigations(state)) blockers.push('correct scoped mitigation');
  if (!state.validated) blockers.push('passing validation replay');
  return blockers;
}

function calculateAchievements(state: IncidentState) {
  const achievements = ['Incident Closed', 'Validated, Not Vibes'];
  if (!state.mitigations.some((mitigation) => !state.scenario.correctMitigations.includes(mitigation))) achievements.push('Low Blast Radius');
  if (hasCategory(state, 'refutation')) achievements.push('Decoy Defused');
  if (state.evidence.filter((item) => item.category !== 'guide').length >= 5) achievements.push('Three-Layer Proof');
  if (state.stakeholderUpdated) achievements.push('Good Comms');
  if (state.scenario.id === 'parser-schema-drift') achievements.push('Contract Lawyer');
  if (state.scenario.id === 'temporal-graph-projection-skew') achievements.push('Temporal Mechanic');
  if (state.scenario.id === 'agent-route-policy-regression') achievements.push('Tool Router');
  if (state.scenario.id === 'embedding-freshness-starvation') achievements.push('GPU Diplomat');
  return achievements;
}

function calculateScore(state: IncidentState, achievements: string[]) {
  const wrongMitigations = state.mitigations.filter((mitigation) => !state.scenario.correctMitigations.includes(mitigation)).length;
  const evidenceBonus = state.evidence.reduce((sum, item) => sum + item.weight * 15, 0);
  const difficultyMultiplier = state.scenario.difficulty === 4 ? 1.3 : state.scenario.difficulty === 3 ? 1.15 : 1;
  const raw = 900 + state.timeRemaining * 1.2 + state.health * 3 + evidenceBonus + achievements.length * 35 - state.steps * 16 - wrongMitigations * 120 - state.hintsUsed * 70;
  return Math.max(100, Math.round(raw * difficultyMultiplier));
}

function rankScore(score: number) {
  if (score >= 1600) return 'principal incident lead';
  if (score >= 1350) return 'calm operator';
  if (score >= 1100) return 'quality-path debugger';
  if (score >= 850) return 'stack spelunker';
  return 'dashboard tourist';
}

function hypothesisSupport(cause: RootCause, evidence: EvidenceCard[]) {
  return evidence.reduce((score, item) => {
    const support = item.supports.includes(cause) ? item.weight : 0;
    const refute = item.refutes?.includes(cause) ? item.weight : 0;
    return score + support - refute;
  }, 0);
}

function hasCategory(state: IncidentState, category: EvidenceCategory) {
  return state.evidence.some((item) => item.category === category);
}

function hasAllCorrectMitigations(state: IncidentState) {
  return state.scenario.correctMitigations.every((mitigation) => state.mitigations.includes(mitigation));
}

function normalizeOutputCommand(input: string) {
  if (input === 'trace sample') return 'trace request';
  if (input === 'inspect embeddings') return 'inspect index';
  if (input === 'inspect lineage' || input === 'inspect registry' || input === 'inspect canary' || input === 'inspect drift') return 'inspect deploys';
  return input;
}

function legacyMitigationCommand(input: string): MitigationId | null {
  if (input === 'rollback parser') return 'rollback-parser-template';
  if (input === 'rollback embeddings' || input === 'rollback index') return 'rollback-index-alias';
  if (input === 'flush cache' || input === 'purge cache') return 'flush-affected-cache';
  return null;
}

function mitigationBlastRadius(mitigation: MitigationId) {
  if (mitigation === 'reserve-embedding-gpu-pool' || mitigation === 'rebuild-recent-embeddings') return 'medium but scoped to freshness recovery';
  if (mitigation === 'restart-service' || mitigation === 'scale-workers') return 'high';
  return 'low';
}

function normalizeLegacyScenarioId(scenarioId: string): IncidentId {
  if (scenarioId === 'parser-regression') return 'parser-schema-drift';
  if (scenarioId === 'embedding-drift') return 'embedding-freshness-starvation';
  return scenarioId as IncidentId;
}

function randomScenario() {
  return scenarios[Math.floor(Math.random() * scenarios.length)];
}

function getScenario(scenarioId: IncidentId) {
  return scenarios.find((scenario) => scenario.id === scenarioId) ?? scenarios[0];
}

function card(id: string, title: string, category: EvidenceCategory, supports: RootCause[], weight: 1 | 2 | 3, refutes?: RootCause[]): EvidenceCard {
  return { id, title, category, supports, refutes, weight };
}

function normalizeCommand(input: string) {
  return input.trim().toLowerCase().replace(/\s+/g, ' ');
}

function fitTerminalText(value: string, length: number) {
  return value.length > length ? value.slice(0, length - 1) + '…' : value.padEnd(length, ' ');
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function uniqueEvidence(values: EvidenceCard[]) {
  const seen = new Set<string>();
  return values.filter((value) => {
    if (seen.has(value.id)) return false;
    seen.add(value.id);
    return true;
  });
}

export function formatIncidentTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
