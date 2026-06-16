# Incident Commander Scenario Plan

## Goal

Incident Commander should feel like a compact production debugging game, not a scripted quiz. The player should diagnose quality failures in an AI/recommender/document intelligence system by building evidence across system layers, forming hypotheses, applying a targeted mitigation, validating recovery, and closing the incident.

The current implementation is too easy because it names the failure mode up front, gives direct hints in most outputs, and uses observations that are too static. This plan replaces that with a layered system model, ambiguous but coherent scenarios, and stateful evidence.

## External Gameplay References

The redesign borrows patterns from incident drills, CTFs, and text adventures without cloning any one format.

### Wheel of Misfortune

Wheel of Misfortune is an SRE-style role-playing game for simulated outage scenarios. Its useful patterns are:

- random scenario selection
- timed pressure
- explicit incident actions: acknowledge, triage, mitigate, resolve
- a facilitator/game-master model for hints and observations
- training in debugging under stress, not just finding the "right answer"

References:

- https://github.com/dastergon/wheel-of-misfortune
- https://dastergon.github.io/wheel-of-misfortune/
- https://sre.google/resources/practices-and-processes/incident-management-guide/

Design translation:

- The terminal game should have phases: `ack`, `triage`, `hypothesis`, `mitigate`, `validate`, `resolve`.
- The player should always know the current incident phase.
- Timing matters, but the timer should create pressure rather than force frantic guessing.
- The system should reward low-blast-radius mitigation and penalize noisy operational actions.

### SRE Incident Command

Google's SRE incident-management material emphasizes readiness, playbooks, automation, and the "three Cs" of incident management: coordinate, communicate, and control.

Reference:

- https://sre.google/resources/practices-and-processes/incident-management-guide/

Design translation:

- Add lightweight command verbs for incident-command behavior, not just debugging:
  - `ack`
  - `page data`
  - `page infra`
  - `update stakeholders`
  - `set severity`
  - `assign ops`
- These should not become mandatory bureaucracy, but they can unlock achievements and score bonuses.
- The game should distinguish diagnosis skill from incident-management discipline.

### Hack The Box / CTF Design

Hack The Box uses challenge structures, scoreboards, and dynamic scoring. CTF design guidance emphasizes clear objectives, logical progression, real-world relevance, balanced difficulty, and avoiding challenges that are too vague, too easy, or too hard.

References:

- https://help.hackthebox.com/en/articles/5200851-ctf-user-s-guide
- https://hackrocks.com/blog/tips-and-tactics-for-creating-your-own-capture-the-flag-ctf

Design translation:

- Each scenario should have a "flag chain": not a literal flag string, but a set of clue gates required to confidently solve.
- Clues should form a directed acyclic graph, with optional side clues and decoys.
- The player should be able to solve from multiple evidence paths, but not from one obvious log line.
- Scoring should account for difficulty, evidence quality, time, hints, and wrong mitigations.
- The game should include a short post-solve debrief explaining the causal chain.

### Text-Based Detective / RPG Games

Terminal detective games use command-line interaction, evidence collection, suspects, branching choices, and narrative pacing.

Reference:

- https://dev.to/shifa_2/terminal-detective-solve-the-mystery-from-your-cli-21ha

Design translation:

- Treat system layers as "rooms" the player can explore.
- Treat evidence as inventory.
- Treat teams/services as NPCs that can be consulted.
- Add optional "lore" and dry humor, but keep observations technically grounded.
- Let the player take wrong turns without immediately failing.

## Design Principles

1. Do not reveal the root cause in the briefing.
   - Briefings should describe symptoms, affected cohorts, business/user impact, and noisy recent changes.
   - Scenario names in-game should be neutral, for example `SEV-2 quality degradation`, not `Parser Regression`.

2. Evidence must be concrete.
   - Every command should expose a real layer: serving metrics, traces, deploy history, feature freshness, vector recall, parser output, ranker inputs, cache reads, event ingestion, or evaluation replay.
   - Outputs should be specific enough to reason from, but not self-solving.

3. Each scenario needs decoys.
   - Recent deploys should include at least two plausible suspects.
   - At least one early signal should point away from the real cause if interpreted shallowly.
   - Wrong fixes should have believable effects, not just a generic penalty.

4. The world must update after actions.
   - If the player rolls back a component, later `inspect deploys` must show the rollback.
   - If the player flushes a cache, cache and trace outputs must change.
   - If the wrong fix is applied, metrics may move slightly or not at all, and new evidence should explain why.

5. Feedback should support play, not give answers.
   - Avoid lines like `next: inspect logs`.
   - Prefer a checklist and evidence board: "root cause unsupported", "mitigation not validated", "confidence low because only one layer supports this".
   - After a wrong action, explain the operational lesson without naming the right answer.

6. Generalize the domain.
   - The fictional system is a recommender/document intelligence platform.
   - Avoid requiring Synexis-specific knowledge.
   - Use terms a technical player can understand: documents, users, candidates, constraints, embeddings, ranking, preferences, caches, visibility, evals.

7. Use clue-driven progression.
   - The player should infer the answer from multiple weak signals.
   - No command should print "this is the root cause".
   - Strong evidence should appear only when the player inspects the right layer or combines two related layers.

8. Make decoys honest.
   - A decoy should be plausible because it affects a nearby layer or happened near the incident.
   - A decoy should be refutable by evidence.
   - A decoy should not be random noise.

9. Make achievements meaningful.
   - Achievements should reward good incident practice, not just completion.
   - They should teach what "good" looks like: scoped mitigation, validation, no blind restarts, good communication, evidence discipline.

10. Keep player language consistent.
   - The same concept should not be called parser, extractor, template, and normalizer in different places unless the difference matters.
   - If an output uses a technical term, another command or help page should define it in context.

## Fictional System Architecture

The game system is a production AI application that recommends documents, companies, people, or opportunities to users. It combines document parsing, semantic retrieval, structured filters, personalization, ranking, and feedback loops.

The same product also has an MLOps plane and an LLM/RAG plane. These should not be separate games; they should be additional rooms/layers in the incident world. A high-quality incident can cross the product-serving path and the ML platform path.

### Request Path

```text
user request
  -> session/profile context
  -> preference feature fetch
  -> candidate recall
       -> vector index
       -> lexical fallback
       -> graph/metadata expansion
  -> document/user constraint compiler
  -> visibility and policy filter
  -> ranker
  -> diversity and dedupe post-processor
  -> response
  -> impression/click/accept feedback
```

### Data and Training Path

```text
document upload/profile edit
  -> parser/extractor
  -> normalized structured fields
  -> embedding job
  -> feature store write
  -> vector index publish
  -> cache invalidation
  -> offline eval replay
  -> production read path
```

### MLOps Control Plane

```text
experiment branch
  -> feature definitions
  -> training dataset snapshot
  -> model training job
       -> GPU scheduler
       -> distributed training runtime
       -> checkpoint artifacts
  -> offline evaluation
  -> model registry
  -> approval gate
  -> canary deployment
  -> online monitoring
  -> rollback/traffic-shift controls
```

Observable MLOps components:

- feature store and feature definitions
- dataset snapshots and lineage
- training/eval jobs
- model registry and model cards
- experiment tracking
- canary and shadow deployments
- model monitor/drift detector
- inference service autoscaling
- GPU/node health
- prompt/template registry for LLM paths

### LLM/RAG Plane

```text
user question/task
  -> intent/router
  -> query rewrite
  -> retrieval plan
       -> vector retrieval
       -> lexical retrieval
       -> graph/metadata retrieval
  -> reranker
  -> context packer
  -> tool executor
  -> LLM generation
  -> citation verifier / guardrails
  -> response
  -> evaluation and trace logging
```

Observable LLM/RAG components:

- prompt versions
- router decisions
- retrieval recall
- reranker scores
- context window packing
- tool-call traces
- citation coverage
- hallucination/groundedness evals
- token latency/cost
- model provider/version changes

### Portfolio-Aligned AI System Scope

The game should deliberately mirror the systems Daniel's portfolio emphasizes:

- recommender systems with recall, ranking, bandits, feedback, and profile/preference vectors
- source-scoped RAG and GraphRAG over sensitive document collections
- temporal knowledge graphs and bitemporal facts
- deterministic financial or business computation behind LLM workflows
- agentic routing across retrieval, graph, structured data, and tools
- MLOps infrastructure for training, evaluation, deployment, monitoring, rollback, and governance
- secure multi-tenant SaaS behavior: tenant isolation, grants, revoked access, ignored sources, auditability
- cloud/GPU operations: queueing, GPU scheduling, MIG slices, autoscaling, cost, and noisy-neighbor failures

This means an incident should feel like it belongs in a production AI platform, not a generic web app. The broken thing is often not "the model is dumb." It is usually one of:

- data contract drift
- retrieval or graph projection skew
- stale features or cache layers
- eval blind spots
- prompt/template rollout mismatch
- source-scope or tenant-isolation regression
- agent route selection failure
- train/serve skew
- GPU/platform contention affecting throughput or freshness
- feedback-loop bias

### AI Incident Planes

Every scenario should identify the plane where the fault enters the system:

```text
serving plane:
  request routing, retrieval, filters, ranking, agents, LLM calls, response assembly

data plane:
  parsing, extraction, source manifests, embeddings, feature views, graph projection, index publish

evaluation plane:
  offline evals, replay suites, canaries, groundedness checks, source-scope tests, regression thresholds

platform plane:
  orchestration, GPU scheduling, queues, autoscaling, secrets, service health, cost controls

governance plane:
  tenant isolation, grants, audit logs, model/prompt approval, risk controls, provenance
```

The most interesting scenarios cross planes. Example:

```text
symptom: LLM answers have citations, but some citations point to superseded facts.
entry fault: graph projection job skipped bitemporal validity window.
serving symptom: GraphRAG retrieves old-but-plausible facts.
eval blind spot: groundedness eval checks citation existence, not as-of-date correctness.
mitigation: pin graph projection alias to previous manifest and replay temporal citation eval.
```

### GraphRAG / Agentic RAG Request Path

```text
user question
  -> intent classifier
  -> planner / supervisor
  -> retrieval route selection
       -> document vector search
       -> lexical/BM25 search
       -> graph neighborhood expansion
       -> structured fact lookup
       -> deterministic calculator/tool call
  -> source-scope compiler
  -> reranker
  -> context packer
  -> LLM generation
  -> citation verifier
  -> numeric/temporal consistency checks
  -> response and trace log
```

Playable failure points:

- router sends financial metric questions to generic vector retrieval instead of structured facts
- graph expansion uses a stale projection alias
- source-scope compiler omits revoked document grants
- context packer drops the actual source span while keeping a summary
- citation verifier checks URL/document existence but not span-level support
- deterministic calculator is bypassed and the LLM free-hands a number
- supervisor loops between retrieval tools and exhausts latency/token budget

### MLOps / Research Workflow Path

```text
research change
  -> experiment config
  -> dataset snapshot
  -> training run
  -> checkpoint/model artifact
  -> offline eval suite
  -> model card / approval gate
  -> canary or shadow deployment
  -> online metrics and drift monitors
  -> rollback / promotion
```

Playable failure points:

- training run used a stale or leaky dataset snapshot
- offline eval suite passed because the affected cohort was not represented
- model registry alias points to the wrong checkpoint
- canary was healthy globally but failed a regulated or high-value cohort
- feature definition changed without matching inference transform
- GPU queue contention delayed embedding refresh, creating stale retrieval rather than hard errors
- monitoring threshold watches latency/errors, but product quality silently degrades

### Research-Realistic Incident Types

The game should include AI-native incidents that are common in real MLOps/RAG systems:

```text
retrieval quality:
  recall down, context wrong, reranker skew, graph expansion stale

groundedness:
  citation exists but does not support claim, temporal fact invalid, context span dropped

agent routing:
  wrong tool selected, calculator bypassed, supervisor loop, route policy rollout skew

evaluation:
  eval set leakage, missing cohort coverage, prompt/model version mismatch, canary aggregation hides slice failure

training/platform:
  train/serve skew, stale feature view, GPU queue freshness lag, checkpoint alias mismatch

governance/security:
  source-scope regression, tenant grant precedence bug, private/revoked document retrieval, audit event gap
```

### Observable Layers

The game should expose these layers through commands:

- `inspect slo`: health, quality SLOs, latency, error rate, affected cohort.
- `inspect metrics`: aggregate product and model metrics.
- `inspect deploys`: recent releases, config changes, data publishes, rollbacks already applied.
- `inspect trace <sample>`: one request across parser, recall, filters, ranker, cache, and response.
- `inspect cohorts`: slice comparison by tenant, language, document age, user profile age, traffic bucket.
- `inspect parser`: extracted fields and parser quality probes.
- `inspect index`: vector index version, recall probes, shard/model alignment.
- `inspect features`: feature store freshness, join keys, null rates, ranker input distributions.
- `inspect cache`: cache keys, TTLs, hit rates, invalidation events, stale reads.
- `inspect policy`: visibility, document grant filters, source scope, revoked/private document behavior.
- `run replay <suite>`: deterministic eval replay against saved samples.
- `hypothesis <cause>`: records a working theory.
- `mitigate <action>`: applies a fix or containment.
- `validate`: re-runs the scenario-relevant replay and checks live recovery.

Additional MLOps/LLM commands:

- `inspect lineage`: dataset, feature, model, prompt, and deployment lineage.
- `inspect registry`: current model version, aliases, approval status, eval summary.
- `inspect training`: last training job, checkpoint, hardware/runtime notes, data snapshot.
- `inspect canary`: traffic split, canary health, control-vs-treatment metrics.
- `inspect drift`: feature drift, embedding drift, label/feedback drift, data freshness.
- `inspect gpu`: GPU allocation, MIG slices, memory pressure, queue depth, throttling.
- `inspect prompt`: prompt/template version, rollout, guardrail config.
- `inspect rag`: retrieval/reranking/context/citation breakdown.
- `run replay groundedness`: LLM groundedness and citation replay.
- `run replay safety`: guardrail and source-scope replay.
- `run replay training-data`: train/serve skew and dataset lineage replay.
- `close incident`: closes only when cause, mitigation, and validation align.

## Gameplay Loop

### Briefing Phase

Timer paused. Player sees:

- incident severity
- broad symptom
- affected cohort
- business/user impact
- noisy timeline of changes
- objective
- command reference

The briefing must not contain root-cause labels. It can say:

```text
SEV-2 quality degradation
accepted recommendations down 27%
hard errors normal
latency normal
affected: new documents and recently edited profiles

recent timeline:
  63m ago: vector index publish completed
  41m ago: ranker exploration config changed for 20% traffic
  19m ago: document extraction template promoted
  12m ago: cache namespace warmup completed
```

This is intentionally noisy. The player needs evidence.

### World Map Phase

The terminal should frame investigation like a text RPG map. The player is not wandering a fantasy world; they are moving through production system layers.

```text
incident://quality-prod
├── war-room
├── dashboards
│   ├── slo
│   ├── product-metrics
│   └── quality-metrics
├── request-path
│   ├── parser
│   ├── retrieval
│   ├── policy-filter
│   ├── feature-store
│   ├── ranker
│   └── cache
├── data-path
│   ├── event-ingest
│   ├── materialization
│   ├── index-publish
│   └── eval-replays
└── comms
    ├── support
    ├── data-oncall
    └── infra-oncall
```

Supported navigation should feel natural:

```text
look
go dashboards
look slo
inspect quality-metrics
go ../request-path
inspect parser
ask support
inventory
```

Aliases can preserve operational commands:

```text
inspect slo == go dashboards && look slo
trace request == go request-path && inspect trace
evidence == inventory
```

This adds RPG flavor without making the system unserious. The "rooms" are concrete system surfaces.

### Investigation Phase

The player gathers evidence. Each command should add an evidence card internally:

```text
evidence:
  slo-reviewed
  trace-sample-a
  parser-probe-reviewed
  cohort-slice-reviewed
```

Confidence should increase only when evidence supports the current hypothesis. It should not increase equally for every command.

### Clue Chain Phase

Each scenario should define:

- primary clue chain: the minimum path to solve
- alternate clue chain: a second valid path for experienced players
- decoy chain: plausible but ultimately refutable
- optional clue chain: improves score/achievements but is not required

Example for parser schema drift:

```text
primary:
  inspect slo
    -> accepted recommendations down, errors normal
  inspect metrics
    -> filter rejection rate unexpectedly down
  inspect trace sample-a
    -> exclusions present in profile, absent in compiler input
  inspect parser
    -> new field shape differs from compiler contract

alternate:
  inspect cohorts
    -> only newly parsed docs affected
  run replay constraints
    -> replay fails only for new parser output
  inspect deploys
    -> parser template in plausible window

decoy:
  inspect deploys
    -> ranker exploration also changed
  inspect ranker
    -> ranker scores candidates normally after receiving bad inputs
```

The game should not say "go inspect parser". It should let the player see "filter rejection rate is down" and think, "What controls filtering?"

### Hypothesis Phase

Use `hypothesis <cause>` instead of `declare <cause>` to feel less artificial. The player can change hypotheses without automatic failure, but changing too often costs time or confidence.

Supported causes:

- `parser-schema-drift`
- `index-publish-skew`
- `feature-freshness-lag`
- `policy-filter-regression`
- `bandit-overexploration`
- `telemetry-feedback-bias`
- `cache-invalidation-gap`
- `ranker-config-regression`

### Mitigation Phase

Use targeted commands:

- `mitigate rollback-parser-template`
- `mitigate rollback-index-alias`
- `mitigate pin-feature-view`
- `mitigate disable-policy-compiler-vnext`
- `mitigate clamp-bandit-exploration`
- `mitigate pause-feedback-training`
- `mitigate flush-affected-cache`
- `mitigate rollback-ranker-config`

Generic commands like `restart service` or `scale workers` can exist, but should be bad moves when latency/errors are normal.

### Validation Phase

`validate` should run the most relevant suite based on hypothesis and mitigation:

- parser scenario: parse replay + constraint replay + live slice check
- index scenario: recall@k replay + shard canary + live candidate depth
- feature freshness scenario: feature age distribution + rank replay
- policy scenario: grant/revocation replay + source-scope audit
- bandit scenario: counterfactual replay + exploration bucket health
- telemetry scenario: feedback dedupe replay + training sample audit

Close is rejected unless:

- at least 3 evidence cards exist
- hypothesis matches the scenario
- mitigation matches the scenario
- validation passed
- health is above 0

### Debrief Phase

After a win or loss, show a short post-incident report:

```text
POST-INCIDENT REPORT
root cause: parser schema drift
customer impact: recommendations violated explicit negative constraints
what solved it: rollback parser template + constraint replay validation
what was a decoy: ranker exploration config
missed optional evidence: cohort comparison
```

For losses, explain the causal path without mocking the player:

```text
incident failed
you mitigated ranking, but the trace showed the wrongness entered before ranking.
use request-path order: parser -> retrieval -> policy/filter -> features -> ranker -> response.
```

This makes the game teachable and replayable.

## Scoring

Score should reward:

- correct diagnosis
- fewer commands
- lower blast radius
- no generic restarts
- validation before close
- preserving user trust

Score should penalize:

- closing without validation
- unsupported hypothesis
- broad mitigations when a scoped mitigation exists
- repeated hypothesis churn
- time spent after clear validation

Suggested scoring:

```text
base: 1000
+ remaining_seconds * 1.5
+ health * 3
+ validated_on_first_try * 100
- commands * 20
- wrong_mitigations * 120
- generic_ops_actions * 80
- broad_blast_radius * 150
```

### Difficulty-Weighted Scoring

Each scenario should have a difficulty rating:

```text
1 = training
2 = normal
3 = senior
4 = principal
5 = cursed pager
```

Final score:

```text
raw_score =
  base
  + time_bonus
  + trust_bonus
  + evidence_quality_bonus
  + validation_bonus
  + incident_command_bonus
  - action_costs
  - hint_costs
  - blast_radius_costs
  - wrong_hypothesis_costs
  - wrong_mitigation_costs

final_score = raw_score * difficulty_multiplier
```

Difficulty multipliers:

```text
training:       0.80
normal:         1.00
senior:         1.15
principal:      1.30
cursed pager:   1.50
```

### Evidence Quality Scoring

The game should score not just how many commands were run, but whether the evidence actually supports the solution.

Evidence categories:

```text
impact:       slo, product metrics, affected users
localization: cohorts, trace, request-path order
causality:    deploy/config/data publish, replay failure, before/after comparison
refutation:   checks that eliminate decoys
validation:   post-mitigation replay and live recovery
```

Evidence quality bonus:

```text
+80  if all five categories are represented
+50  if at least one decoy is explicitly refuted before mitigation
+40  if trace evidence supports the hypothesis
+40  if replay evidence supports the hypothesis
+30  if cohort slicing supports the hypothesis
-50  if hypothesis is set with fewer than 2 supporting evidence cards
-80  if mitigation is applied before any localization evidence
```

### AI-Specific Evidence Scoring

For MLOps/RAG/agent scenarios, award bonuses for evidence that reflects mature AI operations:

```text
+60  lineage proof
     player connects dataset/model/prompt/index/graph artifact to production behavior

+60  eval gap proof
     player shows aggregate eval/canary is green but a critical slice fails

+50  source-grounding proof
     player distinguishes "citation exists" from "citation supports the claim"

+50  temporal proof
     player validates as-of-date correctness or bitemporal fact validity

+50  route proof
     player shows the agent chose the wrong tool/path, not that the model is broadly bad

+40  platform freshness proof
     player ties GPU/queue/platform behavior to stale embeddings/features/context

+40  governance proof
     player validates source scope, tenant grant behavior, or auditability
```

Penalties:

```text
-100 "just use a bigger model" mitigation when evidence shows routing/retrieval/data fault
-100 disabling guardrails to improve answer rate
-80  global cache flush when scoped invalidation or alias pin is available
-80  model rollback when trace shows data/feature/index issue
-60  declaring hallucination when the failure is grounded but temporally wrong
```

This keeps scoring aligned with the portfolio thesis: durable AI products are systems, not demos.

### Incident Command Scoring

Borrowing from incident-response drills, reward command discipline:

```text
+40  ack within first 60 seconds after start
+40  update stakeholders after impact is understood
+40  page correct specialist before mitigation
+40  keep severity unchanged when impact does not justify escalation
+60  resolve only after validation
-60  no stakeholder update before close
-40  page irrelevant team repeatedly
-100 downgrade severity while health is still falling
```

These should be optional bonuses, not mandatory chores. A player can still win without them, but high scores require good incident behavior.

### Hint Economy

Hints should exist, but they should cost score and preserve challenge.

Commands:

```text
hint
hint subtle
hint strong
ask gm
```

Hint levels:

```text
subtle: points to a system layer, not a command
  "The badness seems to enter before ranking."

strong: points to an evidence gap
  "You have not compared parser output with compiler input."

gm: gives a concrete next diagnostic
  "Trace a request and compare profile constraints to filter input."
```

Hint penalties:

```text
subtle: -50
strong: -120
gm:     -220
```

No achievement that says "expert" should be granted if strong or GM hints were used.

### Dynamic CTF-Style Scoring

If the site ever stores aggregate results, borrow the Hack The Box idea of difficulty-adjusted challenge value:

```text
scenario_value = base_value + rarity_bonus - common_solve_discount
```

For the static portfolio site, do not require backend storage. Instead, simulate local rarity labels:

```text
training incident: common
normal incident: uncommon
senior incident: rare
principal incident: epic
cursed pager: legendary
```

This gives the player CTF flavor without needing accounts or a leaderboard.

## Achievements

Achievements should reward diagnosis quality, operational discipline, and replay mastery. They should not leak the answer before completion.

### Core Completion Achievements

```text
Incident Closed
  Close any incident with a correct hypothesis, mitigation, and validation.

First Clean Close
  Close an incident without wrong mitigations.

Evidence-Based
  Close with impact, localization, causality, refutation, and validation evidence.

Validated, Not Vibes
  Attempt close only after validation passes.
```

### Skill Achievements

```text
Read the Request Path
  Use trace evidence to localize where the failure enters the system.

Decoy Defused
  Refute a plausible decoy before applying mitigation.

Low Blast Radius
  Apply the correct scoped mitigation without broad restarts or global disables.

Before and After
  Inspect the affected layer both before and after mitigation.

Cohort Cartographer
  Use cohort slicing to narrow the affected population.

Replay Enjoyer
  Use the correct replay suite before and after mitigation.
```

### Incident Command Achievements

```text
Calm On-Call
  Acknowledge, triage, mitigate, validate, and resolve in order.

Good Comms
  Send a stakeholder update after impact is known and before mitigation.

Right Page
  Page the correct specialist based on evidence.

No Heroics
  Solve without restart, scale-up, global disable, or unrelated rollback.
```

### Mastery Achievements

```text
Principal Debugger
  Close a senior-or-harder incident with no strong hints and no wrong mitigations.

Cursed Pager Survivor
  Close a difficulty-5 incident.

Three-Layer Proof
  Support the hypothesis with three independent layers before mitigation.

Silent Pager
  Close with health above 90 and no generic ops actions.

Speedrun, But Sane
  Close quickly while still collecting required evidence and validation.
```

### Scenario-Specific Achievements

These should be hidden until unlocked:

```text
Contract Lawyer
  Solve parser schema drift by comparing parsed output to compiler input.

Alias Whisperer
  Solve index publish skew by finding shard/model mismatch.

Freshness Freak
  Solve feature freshness lag without relying on cache flush alone.

Policy Wonk
  Solve policy filter regression by replaying grants and revocations.

Exploration Tamer
  Solve bandit overexploration by comparing control and exploration cohorts.

Telemetry Skeptic
  Solve feedback bias by finding duplicate positive feedback.

Temporal Mechanic
  Solve GraphRAG temporal fact regression by validating as-of-date source support.

Tool Router
  Solve agent routing bypass by restoring deterministic tool execution.

GPU Diplomat
  Solve embedding freshness lag by separating training throughput from serving freshness.

Slice Guardian
  Solve eval coverage blind spot by finding the missing high-value cohort.
```

### Anti-Achievements

These can be humorous but should not feel insulting:

```text
Button Masher
  Applied three mitigations before forming a supported hypothesis.

Restart Sorcery
  Restarted a healthy service during a quality incident.

Dashboard Goblin
  Ran many inspections but never formed a hypothesis.

Flag Hoarder
  Validated the fix but kept running commands for more than 90 seconds before closing.
```

Note: if the final UI includes anti-achievements, allow users to hide them. They are fun once, annoying if overdone.

### Achievement Display

At incident close:

```text
ACHIEVEMENTS
[x] Incident Closed
[x] Low Blast Radius
[x] Before and After
[ ] Good Comms
[ ] Decoy Defused
```

In the terminal:

```text
achievements
achievements unlocked
achievements hidden
```

Persist locally in `localStorage`:

```ts
incidentCommanderAchievements: {
  unlocked: Record<string, { firstUnlockedAt: string; count: number }>;
  bestScores: Record<scenarioId, number>;
}
```

## Scenario Architecture

Each scenario should be represented as data, not hard-coded `if` statements scattered through command handlers.

```ts
type Scenario = {
  id: string;
  publicBriefing: Briefing;
  hiddenRootCause: RootCause;
  correctMitigation: Mitigation;
  decoys: Decoy[];
  affectedCohorts: Cohort[];
  evidence: Record<CommandId, EvidenceOutput>;
  postMitigationEvidence: Record<CommandId, EvidenceOutput>;
  validation: ValidationSuite;
};
```

Command output should be generated from:

- scenario
- current hypothesis
- applied mitigations
- evidence already seen
- elapsed time
- validation state

### Scenario Schema Expanded

```ts
type Scenario = {
  id: ScenarioId;
  difficulty: 1 | 2 | 3 | 4 | 5;
  neutralTitle: string;
  hiddenRootCause: RootCause;
  correctMitigation: Mitigation;
  validationSuite: ReplaySuite;
  briefing: {
    severity: 'SEV-1' | 'SEV-2' | 'SEV-3';
    symptom: string;
    affectedCohort: string;
    impact: string;
    timeline: TimelineEvent[];
  };
  rooms: Record<RoomId, RoomState>;
  clueGraph: {
    required: EvidenceId[];
    strong: EvidenceId[];
    optional: EvidenceId[];
    decoys: DecoyId[];
    refutations: Record<DecoyId, EvidenceId[]>;
  };
  evidence: Record<EvidenceId, EvidenceCard>;
  outputs: {
    beforeMitigation: CommandOutputMap;
    afterCorrectMitigation: CommandOutputMap;
    afterWrongMitigation: Record<Mitigation, CommandOutputMap>;
  };
  achievements: ScenarioAchievement[];
};
```

### Evidence Cards

Each meaningful observation should create an evidence card:

```ts
type EvidenceCard = {
  id: string;
  title: string;
  category: 'impact' | 'localization' | 'causality' | 'refutation' | 'validation';
  supports: RootCause[];
  refutes: RootCause[];
  text: string;
  weight: 1 | 2 | 3;
};
```

Evidence examples:

```text
filter-rejection-drop
  category: localization
  supports: parser-schema-drift, policy-filter-regression
  refutes: index-publish-skew
  weight: 2

trace-compiler-missing-exclusions
  category: causality
  supports: parser-schema-drift
  refutes: bandit-overexploration, index-publish-skew
  weight: 3
```

The game should calculate support:

```text
hypothesis_support =
  sum(weights of cards supporting hypothesis)
  - sum(weights of cards refuting hypothesis)
```

Close should require enough support, not only the exact string match.

### Clue Gate Rules

Each scenario should require:

- at least one impact clue
- at least one localization clue
- at least one causality clue
- one validation clue after mitigation

Harder scenarios should also require:

- one decoy refutation
- one cohort comparison or replay
- one post-mitigation before/after check

Difficulty table:

```text
training:
  required evidence: impact + causality + validation
  decoys: 1
  strong hints allowed without achievement penalty

normal:
  required evidence: impact + localization + causality + validation
  decoys: 2
  subtle hint allowed

senior:
  required evidence: impact + localization + causality + decoy refutation + validation
  decoys: 2-3
  wrong mitigation has persistent side effect

principal:
  required evidence: impact + two localization clues + causality + decoy refutation + validation
  decoys: 3
  at least one early clue is misleading if read in isolation

cursed pager:
  same as principal
  symptom evolves during timer
  one command output changes as background jobs catch up
```

### Text RPG Mechanics

Keep it compact, but add a small RPG grammar:

```text
look
look <room>
go <room>
inspect <object>
ask <team>
inventory
use <mitigation>
```

Operational aliases:

```text
ack
triage
hypothesis <cause>
mitigate <action>
validate
resolve
```

RPG-style entities:

```text
Rooms: dashboards, request-path, data-path, war-room, comms
Objects: trace, parser probe, index canary, feature watermark, cache key, policy replay
NPCs: support, data-oncall, infra-oncall, ml-oncall, product
Inventory: evidence cards, hypotheses, mitigations, stakeholder updates
```

NPCs should provide partial, biased information:

```text
ask support
  "Customers say results are 'almost right but disallowed.' I do not know if this is ranking or filtering."

ask infra-oncall
  "CPU, memory, queues, and vector DB health are boring. I am happy and therefore suspicious."

ask ml-oncall
  "Offline ranker eval from yesterday is clean. Live data path may differ."
```

This gives flavor and direction without printing answers.

## Scenario 1: Constraint Leakage From Parser Schema Drift

### Player-Facing Briefing

```text
SEV-2 quality degradation
accepted recommendations down 27%
complaints: "looks relevant, but violates my requirements"
hard errors normal
latency normal
affected: newly ingested documents and profiles edited today
```

Recent timeline:

```text
63m ago: vector index publish completed
41m ago: ranker exploration config changed for 20% traffic
19m ago: document extraction template promoted
12m ago: cache namespace warmup completed
```

### Hidden Root Cause

`parser-schema-drift`

A document/profile parser template changed the representation of exclusion constraints. The downstream constraint compiler expects `excluded_categories[]`, but the parser now emits `negative_preferences[]`. The compiler silently treats missing exclusions as empty. Recommendations look semantically plausible, but violate hard user constraints.

This is more realistic than "parser warning says stage=null" because:

- the parser did not fully fail
- semantic recall is healthy
- ranker appears healthy
- the issue is a contract mismatch between parser output and filter compiler

### Evidence Map

`inspect slo`

```text
availability: 99.98%
p95 latency: 410ms normal
accepted recommendations: -27%
complaint tag: violates_requirements +4.1x
affected: documents parsed after 14:10 UTC
```

`inspect metrics`

```text
semantic similarity median: unchanged
candidate depth: unchanged
filter rejection rate: down from 34% to 19%
post-serve negative feedback: up 3.8x
```

This suggests candidates are present and ranking is not starved, but filters reject fewer items.

`inspect parser`

```text
parse success: 99.1%
field null rate: normal
new field observed: negative_preferences[]
legacy field observed: excluded_categories[] down 76% for new parses
```

This points toward a schema contract issue but does not say "root cause".

`inspect trace sample-a`

```text
profile says: "no healthcare, no pre-revenue"
parser output: negative_preferences=["healthcare", "pre-revenue"]
constraint compiler input: excluded_categories=[]
filter result: healthcare candidate allowed
ranker score: high semantic fit
```

This is the strongest evidence.

`inspect deploys`

```text
vector index publish: completed 63m ago
ranker exploration config: 20% traffic, completed 41m ago
document extraction template: promoted 19m ago
cache warmup: completed 12m ago
```

This gives suspects but no answer.

### Correct Mitigation

`mitigate rollback-parser-template`

Post-mitigation `inspect deploys`:

```text
document extraction template: rolled back to previous contract just now
constraint compiler: receiving excluded_categories[] again
```

Post-mitigation `inspect trace sample-a`:

```text
parser output: excluded_categories=["healthcare", "pre-revenue"]
constraint compiler input: excluded_categories=["healthcare", "pre-revenue"]
filter result: healthcare candidate rejected
```

Validation:

```text
validate
parse contract replay: PASS
constraint replay: PASS
affected live slice: recovering
```

### Decoys

- Ranker config changed recently, but unaffected cohorts in the same bucket are healthy.
- Cache warmup is recent, but traces show fresh parser output and deterministic compiler behavior.
- Vector index is recent, but candidate depth and similarity are unchanged.

### Clue Gates

Required:

```text
impact:
  inspect slo -> complaints mention violated requirements

localization:
  inspect metrics -> filter rejection rate down while candidate depth unchanged

causality:
  inspect trace sample-a -> profile exclusions exist but compiler input is empty

validation:
  validate -> parse contract replay and constraint replay pass after mitigation
```

Optional:

```text
refutation:
  inspect ranker -> ranker correctly scores the bad candidate after filter lets it through
  inspect index -> recall depth and similarity stable

before/after:
  inspect parser before and after rollback
```

Failure mode to avoid:

```text
Do not print "document parser is broken."
The player should infer parser schema drift from contract mismatch.
```

## Scenario 2: Vector Index Alias Skew

### Player-Facing Briefing

```text
SEV-2 quality degradation
users report "thin" or repetitive recommendations
empty candidate sets up 9%
accepted recommendations down 21%
affected: long-form documents and one language slice
```

Recent timeline:

```text
74m ago: parser model patched for PDF tables
52m ago: vector index alias switched after rebuild
37m ago: ranker calibration published
15m ago: feature cache prefetch enabled
```

### Hidden Root Cause

`index-publish-skew`

One vector index shard was rebuilt with a different embedding normalization setting. The alias switch succeeded, the vector DB is healthy, and most queries work. A specific document slice has lower recall because query vectors and document vectors are no longer comparable on that shard.

### Evidence Map

`inspect slo`

```text
availability: normal
p95 latency: normal
empty candidate sets: +9%
accepted recommendations: -21%
affected: long-form documents, pt/en mixed-language slice
```

`inspect metrics`

```text
ranker score distribution: compressed low
candidate depth p50: down from 320 to 148
candidate depth p95: normal
filter rejection rate: unchanged
```

This says the ranker is not getting enough candidates for some requests.

`inspect index`

```text
active alias: rec-docs-2026-06-16-b
shard health: green
shard-3 norm mean: 0.71, expected 1.00
canary recall shard-3: -34%
other shards: within tolerance
```

`inspect trace sample-b`

```text
query language: mixed pt/en
vector search shard-3: 72 candidates, low similarity
lexical fallback: 44 candidates
filter compiler: normal
ranker: normal given weak candidates
```

`inspect parser`

```text
parse success: normal
language detection: normal
tables extracted: normal
```

This refutes the parser decoy.

### Correct Mitigation

`mitigate rollback-index-alias`

Post-mitigation `inspect index`:

```text
active alias: rec-docs-2026-06-15-stable
shard norm means: within tolerance
canary recall: recovering
```

Validation:

```text
recall@50 replay: PASS
mixed-language canary: PASS
candidate depth live slice: recovering
```

### Decoys

- Parser patch is recent and language-related, but parser probes pass.
- Ranker calibration is recent, but ranker behaves normally when candidates are healthy.
- Feature cache prefetch is recent, but cache age is normal and not cohort-specific.

### Clue Gates

Required:

```text
impact:
  inspect slo -> empty candidate sets and thin recommendations

localization:
  inspect metrics -> candidate depth down but filters unchanged

causality:
  inspect index -> one shard has vector norm/alias mismatch

validation:
  validate -> recall@50 and mixed-language canary pass after alias rollback
```

Optional:

```text
refutation:
  inspect parser -> language and table extraction pass
  inspect ranker -> ranker has low-quality inputs, not bad scoring

before/after:
  inspect index before and after alias rollback
```

Failure mode to avoid:

```text
Do not make every index metric red.
The interesting clue is partial shard skew with normal service health.
```

## Scenario 3: Feature Store Freshness Lag

### Player-Facing Briefing

```text
SEV-2 personalization degradation
users who edited profiles still see old recommendations
accepted recommendations down 18%
latency unusually low
affected: recently edited profiles only
```

Recent timeline:

```text
66m ago: ranker v18 promoted
43m ago: feature materialization DAG retried after worker eviction
28m ago: cache invalidation topic compacted
17m ago: embedding refresh completed
```

### Hidden Root Cause

`feature-freshness-lag`

The feature materialization job fell behind after a retry. Events are ingested and cache invalidation works, but the ranker reads a feature view whose watermark is stale. Cache flush alone does not fix it because the cache reloads stale features from the feature store.

### Evidence Map

`inspect slo`

```text
recently edited profiles: degraded
unchanged profiles: normal
latency: lower than normal
error rate: normal
```

`inspect cache`

```text
cache hit rate: high
invalidations received: normal
post-invalidation reload source: feature_view:user_profile_v18
cached value age after reload: 2h 14m
```

This makes cache suspicious, but not sufficient.

`inspect features`

```text
profile event ingest lag: 22s
feature view watermark: 2h 13m behind
ranker input preference_age_p95: 129m
join null rate: normal
```

This identifies the real layer.

`inspect trace sample-c`

```text
profile edit event: received
cache invalidation: received
feature fetch: user_profile_v18, watermark stale
ranker input: old preference vector
response: old-topic recommendation
```

`inspect deploys`

```text
ranker v18: promoted 66m ago
feature materialization DAG: retried after worker eviction 43m ago
cache invalidation compaction: completed 28m ago
embedding refresh: completed 17m ago
```

### Correct Mitigation

`mitigate pin-feature-view`

This pins serving to the last fresh feature view or replays the materialization from the correct checkpoint, depending on implementation.

Post-mitigation `inspect features`:

```text
serving feature view: user_profile_v17-stable
feature watermark: 4m behind
ranker input preference_age_p95: 6m
```

Validation:

```text
fresh-profile replay: PASS
ranker input freshness: PASS
recent-edit live slice: recovering
```

### Decoys

- Cache is suspicious, but flushing it alone reloads stale features.
- Ranker v18 is recent, but the same ranker works with fresh feature vectors.
- Embedding refresh is recent, but semantic recall is healthy.

### Clue Gates

Required:

```text
impact:
  inspect slo -> only recently edited profiles degraded

localization:
  inspect cache -> invalidation works, but reloaded value is old

causality:
  inspect features -> feature view watermark is behind while event ingest is fresh

validation:
  validate -> freshness replay and live recent-edit slice pass after feature view pin/replay
```

Optional:

```text
refutation:
  flush cache alone -> cache reloads stale features, proving cache is not root layer
  inspect index -> semantic recall healthy

before/after:
  inspect features before and after mitigation
```

Failure mode to avoid:

```text
Do not make "cache" the answer just because cache looks suspicious.
The clue is that cache correctly reloads bad/stale source data.
```

## Scenario 4: Policy Filter Regression

### Player-Facing Briefing

```text
SEV-2 source-scope anomaly
some users see fewer documents than expected
support reports "missing known-good sources"
hard errors normal
affected: team-shared workspaces
```

Recent timeline:

```text
81m ago: visibility compiler v9 released
58m ago: document parser hotfix released
35m ago: index refresh completed
22m ago: ranker diversity cap updated
```

### Hidden Root Cause

`policy-filter-regression`

A visibility compiler change incorrectly treats inherited team grants as lower priority than per-user denies. It excludes allowed team-shared documents for a subset of users. Retrieval and ranking are healthy, but the policy filter removes too much.

### Evidence Map

`inspect slo`

```text
accepted recommendations: -16%
source coverage: -29%
affected: team-shared workspaces
private workspace traffic: healthy
```

`inspect policy`

```text
team grant documents: excluded unexpectedly
revoked documents: excluded correctly
private documents: scoped correctly
grant precedence replay: failing for inherited team grants
```

`inspect trace sample-d`

```text
candidate recall: 390 candidates
visibility filter input: 390
visibility filter output: 104
excluded reason top: inherited_grant_shadowed
ranker: normal after filter
```

`inspect index`

```text
candidate recall: normal before policy filter
```

### Correct Mitigation

`mitigate disable-policy-compiler-vnext`

Validation:

```text
grant precedence replay: PASS
source-scope audit: PASS
team workspace live slice: recovering
```

### Decoys

- Index refresh is recent, but candidate recall before the policy filter is normal.
- Diversity cap changed recently, but source loss happens before ranker post-processing.
- Parser hotfix is recent, but document metadata is present.

### Clue Gates

Required:

```text
impact:
  inspect slo -> team-shared workspaces lose source coverage

localization:
  inspect trace sample-d -> candidate recall normal before visibility filter

causality:
  inspect policy -> inherited team grants fail precedence replay

validation:
  validate -> grant precedence replay and source-scope audit pass
```

Optional:

```text
refutation:
  inspect index -> recall normal before policy
  inspect parser -> grant metadata present

before/after:
  inspect policy before and after disabling compiler vnext
```

Failure mode to avoid:

```text
Do not turn this into a security breach scenario.
The symptom is over-filtering allowed documents, not leaking private documents.
```

## Scenario 5: Bandit Exploration Over-Amplification

### Player-Facing Briefing

```text
SEV-2 ranking quality regression
recommendations look novel but less useful
accepted recommendations down 23%
complaints: "why am I seeing experiments?"
affected: active users in exploration bucket
```

Recent timeline:

```text
70m ago: candidate recall index refreshed
49m ago: exploration policy config promoted
31m ago: feedback dedupe job restarted
16m ago: parser template patched
```

### Hidden Root Cause

`bandit-overexploration`

A contextual bandit policy config increased exploration weight for a segment with already sparse feedback. Candidate recall and parsing are healthy. The ranker is intentionally serving too many low-confidence candidates.

### Evidence Map

`inspect metrics`

```text
candidate depth: normal
filter rejection: normal
exploration served ratio: up from 8% to 31%
accepted recommendations: -23%
```

`inspect cohorts`

```text
exploration bucket: degraded
control bucket: healthy
new users: mildly affected
active users with stable preferences: worst affected
```

`inspect trace sample-e`

```text
candidate recall: normal
constraints: applied
ranker base score top result: high
bandit adjustment: replaced 4/10 with exploration candidates
served result: low confidence, high novelty
```

`inspect parser`

```text
parser probes: pass
field distributions: normal
```

### Correct Mitigation

`mitigate clamp-bandit-exploration`

Validation:

```text
counterfactual ranking replay: PASS
exploration ratio guardrail: PASS
acceptance live slice: recovering
```

### Decoys

- Feedback dedupe job restarted, but training samples are not yet used in live policy.
- Parser template patched, but constraints are healthy.
- Index refreshed, but candidate depth and recall are normal.

### Clue Gates

Required:

```text
impact:
  inspect slo -> active users in exploration bucket degraded

localization:
  inspect cohorts -> control bucket healthy, exploration bucket degraded

causality:
  inspect trace sample-e -> bandit replaces good base-ranked items with low-confidence exploration items

validation:
  validate -> exploration ratio guardrail and counterfactual replay pass
```

Optional:

```text
refutation:
  inspect parser -> constraints healthy
  inspect index -> candidate depth healthy

before/after:
  inspect cohorts before and after clamping exploration
```

Failure mode to avoid:

```text
Do not imply all exploration is bad.
The issue is over-amplification for a segment with sparse feedback.
```

## Scenario 6: Telemetry Feedback Bias

### Player-Facing Briefing

```text
SEV-2 recommendation drift
system increasingly favors one content type
acceptance down slowly over 2h
affected: all traffic, strongest in high-volume tenants
```

Recent timeline:

```text
3h ago: analytics event schema migration completed
2h ago: feedback training snapshot started
89m ago: parser model patched
44m ago: ranker config promoted
```

### Hidden Root Cause

`telemetry-feedback-bias`

The analytics schema migration changed impression dedupe keys. One content type is over-counted as positive feedback, biasing near-real-time training or bandit updates. The recommender drifts toward that content even though recall, parsing, and constraints are healthy.

### Evidence Map

`inspect metrics`

```text
content_type_a served share: up 2.7x
base ranker score distribution: stable
feedback positive rate: suspiciously high for content_type_a
acceptance: down slowly, not cliff-like
```

`inspect trace sample-f`

```text
candidate recall: normal
constraints: normal
ranker features: normal
policy prior: shifted toward content_type_a
```

`inspect telemetry`

```text
impression dedupe key cardinality: down 62%
duplicate positives: up 4.4x
affected content type: content_type_a
```

`run replay feedback`

```text
dedupe replay: FAIL
training sample balance: FAIL
ranking replay without new feedback: PASS
```

### Correct Mitigation

`mitigate pause-feedback-training`

or, if implemented more granularly:

`mitigate rollback-telemetry-schema`

Validation:

```text
feedback dedupe replay: PASS
policy prior reset: PASS
served share live slice: normalizing
```

### Decoys

- Ranker config was promoted, but replay without new feedback passes.
- Parser patch is recent, but parse probes are normal.
- The issue is gradual, not a sharp deploy cliff.

### Clue Gates

Required:

```text
impact:
  inspect slo -> slow drift, high-volume tenants hit hardest

localization:
  inspect metrics -> one content type served far more often over time

causality:
  inspect telemetry -> dedupe key cardinality drops and duplicate positives rise

validation:
  validate -> feedback replay passes and served-share live slice normalizes
```

Optional:

```text
refutation:
  run replay ranking without new feedback -> ranker itself passes
  inspect parser -> parse probes normal

before/after:
  inspect telemetry before and after pausing feedback training or rolling back schema
```

Failure mode to avoid:

```text
Do not make this look like an instant deploy regression.
The clue is gradual feedback-loop drift.
```

## Scenario 7: GraphRAG Temporal Fact Regression

### Player-Facing Briefing

```text
SEV-2 answer quality degradation
users report "the answer cites sources, but the answer is out of date"
groundedness score appears normal
affected: time-sensitive due diligence and financial-summary questions
hard errors normal
```

Recent timeline:

```text
91m ago: graph projection job completed
64m ago: citation verifier prompt revised
42m ago: vector index refresh completed
18m ago: structured fact cache warmed
```

### Hidden Root Cause

`temporal-graph-projection-skew`

The GraphRAG projection job materialized relationship edges without respecting `valid_from` / `valid_to` windows for superseded facts. Retrieval finds real sources and citations pass basic existence checks, but the graph route surfaces stale facts that were true historically and false as of the question date.

This fits the portfolio because it uses:

- source manifests
- bitemporal facts
- graph projection
- GraphRAG retrieval
- citation verification
- as-of-date reasoning

### Evidence Map

`inspect slo`

```text
answer acceptance: -22%
citation missing rate: normal
correction requests: +3.6x
affected: questions with "current", "as of", "latest", "now"
```

`inspect rag`

```text
route selection: graph + vector hybrid
top graph facts: high confidence
source documents: real and accessible
temporal filter in retrieval trace: not applied to graph expansion
```

`inspect graph`

```text
active projection: kg-proj-2026-06-16-b
edge count: +11%
superseded fact edges: present in active neighborhood
projection manifest: temporal_window=false
```

`inspect trace sample-g`

```text
question: "current ARR as of this quarter"
structured fact ledger: ARR=42M valid_from=2026-04-01
graph neighborhood: ARR=31M valid_to=2026-03-31
context packer: includes stale graph fact before current ledger fact
citation verifier: PASS document exists
temporal consistency: not run
```

`run replay groundedness`

```text
citation existence: PASS
span support: PASS
temporal validity: FAIL
as-of-date replay: FAIL
```

### Correct Mitigation

`mitigate rollback-graph-projection`

or:

`mitigate pin-kg-manifest`

Post-mitigation:

```text
active projection: kg-proj-2026-06-15-stable
temporal_window=true
superseded fact edges excluded from current-answer route
```

Validation:

```text
groundedness replay: PASS
temporal citation replay: PASS
as-of-date live slice: recovering
```

### Decoys

- Citation verifier prompt changed recently, but citation existence is not the failing dimension.
- Vector index refreshed recently, but vector-only retrieval contains the current source.
- Structured fact cache warmed recently, but ledger lookup is correct.

### Clue Gates

Required:

```text
impact:
  inspect slo -> corrections mention out-of-date answers despite citations

localization:
  inspect rag -> graph route involved, temporal filter missing in graph expansion

causality:
  inspect trace sample-g -> stale graph fact outranks current ledger fact

validation:
  validate -> temporal groundedness replay passes after graph projection rollback
```

Optional:

```text
refutation:
  inspect citations -> cited documents exist, so this is not missing-source hallucination
  inspect structured-facts -> ledger has current values
```

Failure mode to avoid:

```text
Do not call this "hallucination" generically.
The answer is source-backed but temporally wrong.
```

## Scenario 8: Agent Tool Routing Bypass

### Player-Facing Briefing

```text
SEV-2 workflow reliability degradation
answers look fluent but numeric results are inconsistent
affected: questions requiring calculations or structured lookups
token cost up 19%
hard errors normal
```

Recent timeline:

```text
83m ago: supervisor route policy promoted
57m ago: calculator tool timeout raised
39m ago: prompt template revised for shorter answers
21m ago: model provider fallback enabled
```

### Hidden Root Cause

`agent-route-policy-regression`

A supervisor route policy now classifies some deterministic calculation tasks as "general reasoning." The LLM answers directly instead of calling the deterministic calculator or structured fact lookup. Outputs are fluent, sometimes close, and hard to catch without tool-call traces or numeric replay.

This fits the portfolio because it uses:

- agent orchestration
- tool routing
- deterministic financial computation
- LLM evals
- trace observability
- prompt/model rollout governance

### Evidence Map

`inspect slo`

```text
numeric correction requests: +4.2x
tool error rate: normal
calculator latency: normal
token cost: +19%
affected: multi-step metric questions
```

`inspect agent`

```text
supervisor route policy: route-v12
tool-call rate for numeric tasks: down from 74% to 28%
fallback-to-general-reasoning: up 3.1x
loop count: normal
```

`inspect trace sample-h`

```text
question: "compute runway using cash and monthly burn"
intent classifier: finance_metric
supervisor route: general_reasoning
calculator tool: not called
structured facts: retrieved
LLM answer: arithmetic mismatch
```

`inspect prompt`

```text
answer template: shorter-answer-v7
calculator instruction: unchanged
route policy binding: route-v12
```

`run replay numeric`

```text
fact retrieval: PASS
calculator route: FAIL
numeric consistency: FAIL
```

### Correct Mitigation

`mitigate rollback-route-policy`

Post-mitigation:

```text
supervisor route policy: route-v11-stable
tool-call rate for numeric tasks: recovering
calculator path restored for finance_metric intents
```

Validation:

```text
numeric replay: PASS
tool route replay: PASS
live correction slice: recovering
```

### Decoys

- Prompt template changed recently, but calculator instruction did not change.
- Calculator timeout changed recently, but the calculator is not being called.
- Provider fallback enabled recently, but failures occur before provider selection.

### Clue Gates

Required:

```text
impact:
  inspect slo -> numeric corrections up, hard errors normal

localization:
  inspect agent -> tool-call rate down specifically for numeric tasks

causality:
  inspect trace sample-h -> calculator bypassed despite structured facts

validation:
  validate -> numeric/tool-route replay passes after policy rollback
```

Failure mode to avoid:

```text
Do not make the LLM simply "bad at math."
The production failure is routing deterministic work to the wrong executor.
```

## Scenario 9: GPU Queue Freshness Lag

### Player-Facing Briefing

```text
SEV-2 retrieval freshness degradation
new documents are searchable by title but weak in semantic answers
latency normal
batch jobs appear "successful"
affected: documents uploaded in the last 90 minutes
```

Recent timeline:

```text
96m ago: GPU scheduler policy changed for shared training queues
72m ago: embedding batch started
51m ago: large training job requested high-priority A100 slices
24m ago: vector alias publish completed
```

### Hidden Root Cause

`embedding-freshness-starvation`

GPU scheduling allowed a large training job to preempt the embedding worker pool. The batch eventually completed status checks for metadata and lexical indexing, but semantic embeddings lagged. The vector alias publish included partial embeddings, so new documents are available through lexical fallback but weak in semantic retrieval/RAG.

This fits the portfolio because it uses:

- GPU scheduling and tenancy
- batch/stream ML jobs
- embedding pipelines
- vector search
- hybrid retrieval
- MLOps platform monitoring

### Evidence Map

`inspect slo`

```text
new-document semantic answer acceptance: -29%
title search: normal
overall latency: normal
affected: uploads in last 90m
```

`inspect gpu`

```text
embedding worker queue wait p95: 38m
training queue preemptions: +6
A100 MIG slices assigned to training: 92%
embedding pool starvation: observed
```

`inspect training`

```text
large training job: high-priority
checkpoint progress: normal
embedding batch: delayed, not failed
```

`inspect index`

```text
active alias: docs-2026-06-16-c
lexical document count: current
vector document count: 82% of expected for recent uploads
hybrid retrieval fallback: masking partial failure
```

`inspect trace sample-i`

```text
query targets new document
lexical retrieval: finds source
vector retrieval: missing recent embedding
context packer: weak context
LLM answer: generic summary
```

### Correct Mitigation

`mitigate reserve-embedding-gpu-pool`

and then:

`mitigate rebuild-recent-embeddings`

This scenario can require a two-step mitigation in senior/principal mode:

1. stop ongoing starvation
2. backfill affected embeddings

Validation:

```text
recent-upload recall replay: PASS
vector document count: matches expected
hybrid retrieval live slice: recovering
```

### Decoys

- Vector alias publish completed, but it published a partial corpus.
- Batch status says success, but success covered metadata/lexical stages, not semantic completeness.
- Latency is normal because missing vectors reduce retrieval work.

### Clue Gates

Required:

```text
impact:
  inspect slo -> recent uploads affected, title search healthy

localization:
  inspect index -> lexical current, vector partial

causality:
  inspect gpu + inspect training -> embedding pool starved by training priority

validation:
  validate -> recent-upload recall replay passes after GPU reservation and embedding backfill
```

Failure mode to avoid:

```text
Do not make this a generic "GPU down" incident.
The platform is healthy, but scheduling policy created freshness lag.
```

## Scenario 10: Eval Coverage Blind Spot

### Player-Facing Briefing

```text
SEV-2 model rollout quality regression
canary dashboard is green
support reports poor answers from a specific document type
affected: scanned PDFs and image-heavy documents
hard errors normal
```

Recent timeline:

```text
88m ago: multimodal extraction model promoted
62m ago: eval threshold updated after baseline refresh
36m ago: canary reached 25% traffic
12m ago: OCR fallback cache warmed
```

### Hidden Root Cause

`eval-cohort-coverage-gap`

The canary and offline eval suite under-sampled scanned/image-heavy PDFs. The promoted extraction model performs well on text-native PDFs but drops table/figure entities from scanned documents. Aggregate canary metrics are green because the affected cohort is small but high-value.

This fits the portfolio because it uses:

- multimodal retrieval/extraction
- eval design
- canary monitoring
- document intelligence
- MLOps release governance

### Evidence Map

`inspect canary`

```text
aggregate quality: green
traffic: 25%
text-native PDFs: green
scanned/image-heavy PDFs: not enough samples for threshold
```

`inspect parser`

```text
text-native extraction: normal
scanned PDF table extraction: entity recall down 37%
OCR fallback: invoked but not reconciled into structured fields
```

`inspect cohorts`

```text
text-native docs: healthy
scanned PDFs: degraded
image-heavy decks: degraded
high-value diligence workspaces: overrepresented in affected slice
```

`run replay extraction`

```text
default eval suite: PASS
scanned-doc slice replay: FAIL
table entity recall: FAIL
```

### Correct Mitigation

`mitigate rollback-extraction-model`

or in a more nuanced mode:

`mitigate route-scanned-docs-to-stable-extractor`

Validation:

```text
scanned-doc replay: PASS
table entity recall: PASS
canary slice guardrail: configured
```

### Decoys

- OCR fallback cache warmed recently, but fallback output exists; reconciliation is the failure.
- Aggregate canary is green, but slice coverage is insufficient.
- Eval threshold changed recently, but the deeper issue is missing cohort coverage.

### Clue Gates

Required:

```text
impact:
  inspect slo/cohorts -> only scanned/image-heavy docs degraded

localization:
  inspect parser -> table/entity extraction affected

causality:
  inspect canary + run replay extraction -> aggregate green hides missing cohort coverage

validation:
  validate -> scanned-doc replay passes after scoped rollback/route
```

Failure mode to avoid:

```text
Do not make "evals are bad" the generic answer.
The specific lesson is aggregate canary metrics can hide high-value slice failures.
```

## Randomization Model

Randomization should not mean arbitrary. It should vary details while preserving causal coherence.

Randomize:

- incident selected
- affected cohort name
- sample IDs
- metric magnitudes within bounded ranges
- decoy timeline order
- command output wording variants
- one optional extra decoy per incident
- time pressure flavor text

Do not randomize:

- hidden root cause for a selected incident
- required evidence relationships
- correct mitigation
- validation suite semantics
- post-mitigation world state

## Command Design

### Replace Current Commands

Current:

```text
declare parser-regression
rollback parser
run eval constraints
```

Proposed:

```text
hypothesis parser-schema-drift
mitigate rollback-parser-template
validate
```

This is less gamey and closer to actual incident workflow.

### Command Categories

Investigation:

```text
inspect slo
inspect metrics
inspect deploys
inspect trace sample-a
inspect cohorts
inspect parser
inspect index
inspect features
inspect cache
inspect policy
inspect telemetry
inspect lineage
inspect registry
inspect training
inspect canary
inspect drift
inspect gpu
inspect prompt
inspect rag
inspect graph
inspect agent
inspect citations
inspect structured-facts
```

Evaluation:

```text
run replay constraints
run replay retrieval
run replay ranking
run replay freshness
run replay policy
run replay feedback
run replay groundedness
run replay temporal
run replay numeric
run replay tool-routing
run replay extraction
run replay source-scope
run replay training-data
```

Decision:

```text
hypothesis parser-schema-drift
hypothesis index-publish-skew
hypothesis feature-freshness-lag
hypothesis policy-filter-regression
hypothesis bandit-overexploration
hypothesis telemetry-feedback-bias
hypothesis temporal-graph-projection-skew
hypothesis agent-route-policy-regression
hypothesis embedding-freshness-starvation
hypothesis eval-cohort-coverage-gap
```

Mitigation:

```text
mitigate rollback-parser-template
mitigate rollback-index-alias
mitigate pin-feature-view
mitigate disable-policy-compiler-vnext
mitigate clamp-bandit-exploration
mitigate pause-feedback-training
mitigate flush-affected-cache
mitigate rollback-ranker-config
mitigate rollback-graph-projection
mitigate pin-kg-manifest
mitigate rollback-route-policy
mitigate reserve-embedding-gpu-pool
mitigate rebuild-recent-embeddings
mitigate rollback-extraction-model
mitigate route-scanned-docs-to-stable-extractor
```

Lifecycle:

```text
brief
status
evidence
validate
close incident
reset
```

## UI/UX Changes

### Briefing

Show:

- incident title as neutral severity and symptom
- "timer paused"
- affected cohort
- noisy timeline
- objective
- start button

Do not show:

- root cause labels
- exact fix names
- scenario titles like "Parser Regression"

### During Play

Add panels above or beside the terminal:

- Incident clock
- User trust/health
- Current hypothesis
- Applied mitigation
- Evidence count
- Validation state

Add an evidence board:

```text
Evidence board
[x] SLO reviewed
[x] Trace sample reviewed
[ ] Cohort comparison
[ ] Replay validation
```

Do not print "next: inspect X" after every command. Use `status` or `evidence` for guidance.

### Command Buttons

Buttons should be grouped:

- Inspect
- Replay
- Hypothesize
- Mitigate
- Lifecycle

The button list should not imply the right solution by showing one obvious fix. It can show all available mitigations, or it can reveal mitigation options after a hypothesis is set.

### Feedback

Wrong hypothesis:

```text
hypothesis recorded, but support is weak.
conflicting evidence:
  candidate depth is normal
  parser probes are normal
```

Wrong mitigation:

```text
mitigation applied.
blast radius: medium
live quality signal: unchanged after 60s
lesson: this action changed the ranker, but the trace shows loss before ranking.
```

Correct mitigation:

```text
mitigation applied.
blast radius: low
world state updated.
run validate to confirm recovery.
```

## Implementation Plan

1. Replace current scenario data with the scenario schema in this document.
2. Replace `declare` commands with `hypothesis` commands, while keeping aliases for old commands during transition.
3. Add evidence board state:
   - seen command groups
   - supporting evidence
   - conflicting evidence
4. Add post-mitigation world state maps for each scenario.
5. Replace direct "next" hints with `status`, `evidence`, and close rejection feedback.
6. Group command chips by category in the modal UI.
7. Update unit tests:
   - each scenario has a valid win path
   - each scenario has at least two plausible decoys
   - wrong mitigation changes world state but does not validate
   - post-mitigation inspections reflect the action
8. Update Playwright tests:
   - randomized incident can be identified and solved
   - evidence board updates
   - close rejects unsupported hypothesis
   - validation passes only after correct mitigation

## Portfolio-Aligned Implementation Ideas

The expanded AI/MLOps scope can be implemented without making the UI overwhelming by keeping one core engine and adding scenario packs.

### Portfolio As Field Guide

The portfolio should become a diegetic help system for the incident game. Instead of isolated hints, the player can open relevant portfolio sections to understand the architecture patterns behind the current incident.

Commands:

```text
portfolio guide
guide
open guide
```

Output should list 2-4 relevant portfolio areas:

```text
portfolio field guide:
  open investment-graph.project architecture
    temporal facts, source manifests, graph projection, citation provenance

  open agentic-rag-platform.project architecture
    route planning, retrieval traces, citation verification, LLM evals

  open enterprise-mlops.project architecture
    model registry, GPU scheduling, canaries, eval governance
```

This should not reveal the answer. It should explain concepts and structures:

- "Graph projection can make old facts retrievable if temporal windows are wrong."
- "Agent traces show whether deterministic tools were called."
- "Embedding freshness failures can look like retrieval quality regressions."
- "Eval coverage can be green in aggregate while failing high-value slices."

Portfolio guide links should also appear:

- during briefing as optional reading
- in `portfolio guide`
- after successful close as "related portfolio systems"
- after failure as "study these concepts, then retry"

The mechanic should be framed as a field guide, not as a cheat sheet. It should help the player learn the system model without turning the game into a resume viewer.

Suggested mappings:

```text
parser schema drift:
  matching-engine.project / architecture
  agentic-rag-platform.project / evidence

GraphRAG temporal fact regression:
  investment-graph.project / architecture
  agentic-rag-platform.project / architecture

agent tool routing bypass:
  agentic-rag-platform.project / architecture
  synexis-product-platform.project / evidence

GPU queue freshness lag:
  enterprise-mlops.project / architecture
  cloud-devops-platform.project / architecture
```

Closeout reports should include portfolio links:

```text
RELATED PORTFOLIO SYSTEMS
  Investment Intelligence Graph
  Why it matters: source manifests, temporal facts, graph projection, provenance.
  [open architecture]

  Agentic RAG & ML Platform
  Why it matters: retrieval routing, citation verification, agent traces.
  [open architecture]
```

Implementation detail:

```ts
type PortfolioGuideLink = {
  projectFile: string;
  tab: 'overview' | 'architecture' | 'evidence';
  title: string;
  concept: string;
};
```

### Scenario Packs

Group incidents by domain:

```text
recommender-pack:
  parser schema drift
  index alias skew
  feature freshness lag
  bandit overexploration
  telemetry feedback bias

rag-pack:
  GraphRAG temporal fact regression
  source-scope policy regression
  context packing citation gap
  retrieval route skew

agent-pack:
  agent tool routing bypass
  supervisor loop/token exhaustion
  deterministic calculator bypass

mlops-pack:
  GPU queue freshness lag
  eval coverage blind spot
  registry alias mismatch
  train/serve skew
```

Default mode should draw from `recommender-pack`, `rag-pack`, and `mlops-pack` so the portfolio themes show up naturally. Expert mode can include agent and governance scenarios more often.

### Layered Command Reveal

Do not show every command button at once. Use contextual grouped buttons:

```text
always visible:
  status, evidence, inspect slo, inspect metrics, inspect deploys, inspect trace

visible after first localization clue:
  inspect parser, inspect index, inspect features, inspect cache, inspect rag, inspect graph, inspect agent

visible after hypothesis:
  relevant replay suites and mitigation group

advanced drawer:
  inspect gpu, inspect registry, inspect lineage, inspect canary, inspect drift, inspect telemetry
```

Terminal users can still type any command. Button reveal keeps the game approachable without making the right answer obvious.

### Evidence Graph Under the Hood

Use the same evidence-card system for all domains:

```text
evidence card:
  id: trace-tool-bypass
  layer: agent
  category: causality
  supports: agent-route-policy-regression
  refutes: prompt-template-regression, model-provider-regression
  unlocks: run replay numeric, inspect agent
```

This lets a RAG clue, MLOps clue, or recommender clue behave the same way in scoring and close validation.

### Portfolio Flavor Without Name-Dropping

The content should imply Daniel's background through realistic systems:

- bitemporal fact ledgers instead of generic "database"
- source manifests instead of generic "documents"
- ANN/vector recall and reranking instead of generic "search"
- deterministic calculation tools instead of generic "API call"
- model registry, canary, lineage, eval replay instead of generic "deploy"
- GPU queue freshness and MIG slices instead of generic "server load"

Avoid turning the game into a resume paragraph. The player should feel the engineering depth through the incident mechanics.

### Suggested First Implementation Slice

Implement four high-quality scenarios first:

```text
1. Constraint Leakage From Parser Schema Drift
   portfolio tie: document intelligence + recommender constraints

2. GraphRAG Temporal Fact Regression
   portfolio tie: temporal KG + GraphRAG + citation verification

3. Agent Tool Routing Bypass
   portfolio tie: agentic workflows + deterministic finance/runtime tools

4. GPU Queue Freshness Lag
   portfolio tie: MLOps + GPU infrastructure + embedding pipelines
```

This gives the game breadth across Daniel's strongest areas without requiring all ten scenarios on day one.

### How To Keep It Fun

Add small terminal-style moments that reinforce the genre:

```text
ask ml-oncall
  "The model is not haunted. The route policy is suspicious, but I only say that after coffee."

ask infra-oncall
  "No pods are on fire. That is both comforting and inconvenient."

inspect gpu
  "The training job has eaten the good slices. It left a note saying 'research velocity.'"
```

Keep jokes in NPC/team responses, not in evidence. Evidence should stay precise.

### How To Keep It Fair

Each scenario should have at least one "request path order" clue:

```text
failure enters before ranking
failure enters after retrieval but before generation
failure enters in offline data path before serving
failure enters in eval/approval plane, not request serving
```

This teaches players a useful debugging strategy:

```text
where does the badness first appear?
```

That question should be the core of the game.

## Scenario Quality Checklist

Before adding or shipping a scenario, it must pass this checklist:

```text
[ ] Briefing does not reveal root cause.
[ ] Scenario has at least two plausible decoys.
[ ] Each decoy has a concrete refuting clue.
[ ] At least four system layers are represented.
[ ] At least one command produces ambiguous evidence.
[ ] At least one command produces strong evidence only when combined with another clue.
[ ] Correct mitigation updates future outputs.
[ ] Wrong mitigation has a plausible but insufficient effect.
[ ] Validation cannot pass before correct mitigation.
[ ] Close requires impact, localization, causality, mitigation, and validation.
[ ] Post-incident debrief explains the causal chain.
[ ] At least three achievements can unlock naturally.
```

## Acceptance Tests

### Scenario Data Tests

```text
for each scenario:
  has neutralTitle that does not include hiddenRootCause words
  has >= 2 decoys
  has required impact/localization/causality/validation clues
  every decoy has at least one refutation clue
  correct mitigation changes at least two command outputs
  wrong mitigation does not set validation true
```

### Gameplay Tests

```text
can start randomized incident
can inspect evidence and see inventory update
cannot validate before mitigation
cannot close with correct hypothesis but no validation
cannot close with correct mitigation but unsupported hypothesis
can close each scenario through at least one primary clue path
can close at least one scenario through an alternate clue path
wrong mitigation lowers score and changes output, but does not immediately hard-fail
hint usage lowers score and blocks expert achievements
achievements persist in localStorage
```

### UX Tests

```text
briefing is understandable without Synexis context
command buttons are grouped by category
hidden root cause is not visible in briefing or button labels
evidence board shows collected clues
post-close report lists root cause, mitigation, validation, decoys, achievements, and score
mobile layout keeps terminal, evidence board, and command chips usable
```

## Difficulty Tuning Targets

Training:

```text
expected solve time: 2-3 minutes
wrong turns tolerated: 3
hint usage expected: low
```

Normal:

```text
expected solve time: 4-6 minutes
wrong turns tolerated: 2
requires at least one decoy refutation for high score
```

Senior:

```text
expected solve time: 6-8 minutes
wrong turns tolerated: 1-2
requires before/after validation
```

Principal:

```text
expected solve time: 8-10 minutes
timer should be longer than current 8 minutes
requires multiple independent evidence layers
```

Cursed pager:

```text
expected solve time: 10-12 minutes
timer: 12 minutes
one background signal changes mid-incident
designed as optional hard mode, not default
```

Default recommendation:

```text
ship three normal/senior scenarios first:
  parser schema drift
  index alias skew
  feature freshness lag

then add:
  policy filter regression
  bandit exploration
  telemetry feedback bias
```

## Review Questions

1. Should the game include all six scenarios, or start with three high-quality scenarios and expand later?
2. Should mitigation options be visible immediately, or revealed after the player records a hypothesis?
3. Should difficulty have modes?
   - Normal: command buttons visible.
   - Hard: terminal only, help shows categories.
   - Expert: noisy timeline, fewer labels, stricter scoring.
4. Should the game use deterministic daily incidents for shareability, or fully random incidents per reset?
5. Should final unlock content be tied to the solved scenario, for example a short production lesson about parsers, retrieval, features, policy, bandits, or telemetry?
6. Should achievements be visible up front, hidden until unlocked, or mixed?
7. Should hard mode remove command chips and require terminal navigation?
8. Should there be a daily seed so two people can compare scores on the same incident?
