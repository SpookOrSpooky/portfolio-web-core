import { describe, expect, it } from 'vitest';
import { createIncidentState, getIncidentPortfolioLinks, runIncidentCommand, type IncidentState } from './incidentGame';

function runCommands(state: IncidentState, commands: string[]) {
  return commands.reduce((currentState, command) => runIncidentCommand(command, currentState).state, state);
}

describe('incident commander game', () => {
  it.each([
    [
      'parser-schema-drift',
      [
        'start incident',
        'inspect slo',
        'inspect metrics',
        'inspect parser',
        'trace request',
        'hypothesis parser-schema-drift',
        'mitigate rollback-parser-template',
        'run replay constraints',
        'close incident',
      ],
      'Contract Lawyer',
    ],
    [
      'temporal-graph-projection-skew',
      [
        'start incident',
        'inspect slo',
        'inspect rag',
        'inspect graph',
        'trace request',
        'hypothesis temporal-graph-projection-skew',
        'mitigate rollback-graph-projection',
        'run replay temporal',
        'close incident',
      ],
      'Temporal Mechanic',
    ],
    [
      'agent-route-policy-regression',
      [
        'start incident',
        'inspect slo',
        'inspect agent',
        'trace request',
        'inspect prompt',
        'hypothesis agent-route-policy-regression',
        'mitigate rollback-route-policy',
        'run replay numeric',
        'close incident',
      ],
      'Tool Router',
    ],
    [
      'embedding-freshness-starvation',
      [
        'start incident',
        'inspect slo',
        'inspect index',
        'inspect gpu',
        'trace request',
        'hypothesis embedding-freshness-starvation',
        'mitigate reserve-embedding-gpu-pool',
        'mitigate rebuild-recent-embeddings',
        'run replay retrieval',
        'close incident',
      ],
      'GPU Diplomat',
    ],
  ])('can close %s through evidence, hypothesis, mitigation, and validation', (scenarioId, commands, achievement) => {
    const state = runCommands(createIncidentState(scenarioId), commands);

    expect(state.status).toBe('won');
    expect(state.rootCause).toBe(scenarioId);
    expect(state.validated).toBe(true);
    expect(state.achievements).toContain(achievement);
    expect(state.score).toBeGreaterThan(0);
  });

  it('rejects close without impact, localization, causality, mitigation, and validation gates', () => {
    let state = createIncidentState('parser-schema-drift');
    state = runIncidentCommand('start incident', state).state;
    state = runIncidentCommand('hypothesis parser-schema-drift', state).state;

    const result = runIncidentCommand('close incident', state);

    expect(result.state.status).toBe('active');
    expect(result.output.join(' ')).toContain('close rejected');
    expect(result.output.join(' ')).toContain('impact evidence');
    expect(result.output.join(' ')).toContain('passing validation replay');
  });

  it('does not allow investigation commands before the briefing is started', () => {
    const state = createIncidentState();
    const result = runIncidentCommand('inspect slo', state);

    expect(result.state.status).toBe('briefing');
    expect(result.output[0]).toContain('briefing paused');
  });

  it('updates later observations after the correct mitigation changes the world', () => {
    let state = createIncidentState('temporal-graph-projection-skew');
    state = runIncidentCommand('start incident', state).state;

    let result = runIncidentCommand('inspect graph', state);
    expect(result.output.join(' ')).toContain('temporal_window=false');

    state = runCommands(state, [
      'inspect slo',
      'inspect rag',
      'trace request',
      'hypothesis temporal-graph-projection-skew',
      'mitigate rollback-graph-projection',
    ]);
    result = runIncidentCommand('inspect graph', state);

    expect(result.output.join(' ')).toContain('temporal_window=true');
  });

  it('exposes portfolio guide links without marking the incident solved', () => {
    let state = createIncidentState('agent-route-policy-regression');

    const result = runIncidentCommand('portfolio guide', state);
    state = result.state;

    expect(result.output.join(' ')).toContain('Agentic RAG & ML Platform');
    expect(getIncidentPortfolioLinks(state)).toHaveLength(2);
    expect(state.status).toBe('briefing');
    expect(state.validated).toBe(false);
  });

  it('provides score-affecting hints without validating or closing the incident', () => {
    let state = createIncidentState('temporal-graph-projection-skew');
    state = runIncidentCommand('start incident', state).state;

    const result = runIncidentCommand('hint strong', state);

    expect(result.output.join(' ')).toContain('strong hint');
    expect(result.state.hintsUsed).toBeGreaterThan(state.hintsUsed);
    expect(result.state.health).toBeLessThan(state.health);
    expect(result.state.validated).toBe(false);
    expect(result.state.status).toBe('active');
  });
});
