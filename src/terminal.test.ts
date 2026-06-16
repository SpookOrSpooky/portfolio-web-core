import { describe, expect, it } from 'vitest';
import { buildProjectRefs, completeTerminalInput, cwdForUiState, executeTerminalCommand, parseTerminalCommand, sectionFromHash } from './terminal';

const projects = buildProjectRefs([
  { file: 'synexis-product-platform.project', title: 'Synexis Product Platform', summary: 'Synexis summary' },
  { file: 'enterprise-mlops.project', title: 'Enterprise AI Platform & MLOps', summary: 'Enterprise summary' },
  { file: 'geosat-aiops.project', title: 'GeoSat AIOps Inference Systems', summary: 'GeoSat summary' },
]);

const rootContext = { projects, cwd: 'portfolio://', activeProjectIndex: 0 };

describe('terminal filesystem parser', () => {
  it('parses unix-style filesystem commands', () => {
    expect(parseTerminalCommand('pwd')).toEqual({ kind: 'pwd' });
    expect(parseTerminalCommand('cd portfolio://stack.workspace')).toEqual({
      kind: 'cd',
      target: 'portfolio://stack.workspace',
    });
    expect(parseTerminalCommand('tree projects')).toEqual({ kind: 'tree', target: 'projects' });
  });

  it('opens workspaces through cd and absolute portfolio URLs', () => {
    expect(executeTerminalCommand('cd portfolio://stack.workspace', rootContext).action).toEqual({
      type: 'openDock',
      dockId: 'stack',
      cwd: 'portfolio://stack.workspace',
    });

    expect(executeTerminalCommand('cd portfolio://projects/enterprise', rootContext).action).toEqual({
      type: 'openProject',
      projectIndex: 1,
      cwd: 'portfolio://projects/enterprise-mlops.project',
    });
  });

  it('traverses project directories and tabs', () => {
    const projectContext = { projects, cwd: 'portfolio://projects/enterprise-mlops.project', activeProjectIndex: 1 };

    expect(executeTerminalCommand('ls', projectContext).output[0]).toContain('architecture.tab');
    expect(executeTerminalCommand('cd architecture.tab', projectContext).action).toEqual({
      type: 'setTab',
      tab: 'architecture',
      cwd: 'portfolio://projects/enterprise-mlops.project/architecture.tab',
    });
  });

  it('supports parent-directory cd without forcing UI navigation', () => {
    const tabContext = {
      projects,
      cwd: 'portfolio://projects/enterprise-mlops.project/architecture.tab',
      activeProjectIndex: 1,
    };

    expect(executeTerminalCommand('cd ../', tabContext)).toEqual({
      output: ['portfolio://projects/enterprise-mlops.project'],
      nextCwd: 'portfolio://projects/enterprise-mlops.project',
    });
    expect(executeTerminalCommand('cd ..', tabContext).nextCwd).toBe('portfolio://projects/enterprise-mlops.project');
    expect(executeTerminalCommand('cd ../../', tabContext)).toEqual({
      output: ['portfolio://projects'],
      nextCwd: 'portfolio://projects',
    });
    expect(completeTerminalInput('cd ..', tabContext).output?.[0]).toContain('..');
  });

  it('lists sections and project files', () => {
    expect(executeTerminalCommand('ls', rootContext).output[0]).toContain('stack.workspace');
    expect(executeTerminalCommand('ls', rootContext).output[0]).toContain('incident-commander.sh');
    expect(executeTerminalCommand('ls projects', rootContext).output).toContain('enterprise-mlops.project');
  });

  it('treats incident commander as an executable script', () => {
    expect(parseTerminalCommand('./incident-commander.sh')).toEqual({ kind: 'incidentCommander' });
    expect(parseTerminalCommand('incident-commander.sh')).toEqual({ kind: 'incidentCommander' });
    expect(executeTerminalCommand('incident-commander', rootContext).openIncidentCommander).toBe(true);
    expect(executeTerminalCommand('./incident-commander.sh', rootContext).output[0]).toBe('executing incident-commander.sh...');
    expect(executeTerminalCommand('open incident-commander', rootContext).openIncidentCommander).toBe(true);
    expect(executeTerminalCommand('open incident-commander.sh', rootContext).output[0]).toBe('executing incident-commander.sh...');
    expect(executeTerminalCommand('cd incident-commander.sh', rootContext).output[0]).toBe(
      'cd: incident-commander.sh: Not a directory',
    );
    expect(executeTerminalCommand('cat incident-commander.sh', rootContext).output[0]).toBe('#!/bin/bash');
    expect(completeTerminalInput('open incident', rootContext).value).toBe('open incident-commander.sh');
  });

  it('prints unix-style help with aligned command descriptions', () => {
    const output = executeTerminalCommand('help', rootContext).output;

    expect(output[0]).toBe('portfolio shell:');
    expect(output.find((line) => line.startsWith('  pwd') && line.includes('print working directory'))).toBeTruthy();
    expect(output.find((line) => line.startsWith('  cat <file>') && line.includes('e.g. profile.txt'))).toBeTruthy();
    expect(
      output.find((line) => line.startsWith('  tab <view>') && line.includes('overview, architecture, evidence')),
    ).toBeTruthy();
    expect(output.find((line) => line.startsWith('  whoami') && line.includes('print identity summary'))).toBeTruthy();
    expect(output.join('\n')).not.toContain('cat profile.txt|contact.txt|README.md');
    expect(output.join('\n')).not.toContain('whoami | contact | clear | reboot');
  });

  it('maps portfolio UI state to terminal cwd paths', () => {
    expect(
      cwdForUiState({
        section: 'portfolio-os',
        dockId: 'projects',
        projectFile: 'matching-engine.project',
        tab: 'architecture',
      }),
    ).toBe('portfolio://projects/matching-engine.project/architecture.tab');
    expect(cwdForUiState({ section: 'portfolio-os', dockId: 'stack' })).toBe('portfolio://stack.workspace');
    expect(cwdForUiState({ section: 'credentials' })).toBe('portfolio://credentials');
    expect(cwdForUiState({ section: 'home' })).toBe('portfolio://');
    expect(sectionFromHash('#credentials')).toBe('credentials');
    expect(sectionFromHash('#portfolio-os')).toBe('portfolio-os');
    expect(sectionFromHash('#home')).toBe('home');
  });

  it('handles autocomplete, clear, contact, and invalid commands', () => {
    expect(completeTerminalInput('next', rootContext).value).toBe('next project');
    expect(completeTerminalInput('incident', rootContext).value).toBe('incident-commander');
    expect(completeTerminalInput('cd portfolio://s', rootContext).value).toBe('cd portfolio://stack.workspace');
    expect(completeTerminalInput('cd enterprise', { ...rootContext, cwd: 'portfolio://projects' }).value).toBe('cd enterprise-mlops.project');
    expect(completeTerminalInput('cd portfolio://projects/enterprise', rootContext).value).toBe('cd portfolio://projects/enterprise-mlops.project');
    expect(executeTerminalCommand('clear', rootContext).clear).toBe(true);
    expect(executeTerminalCommand('contact', rootContext).output).toContain('dcamp049@uottawa.ca');
    expect(executeTerminalCommand('wat', rootContext).output[0]).toBe('command not found: wat. Try "help".');
  });

  it('prints each canonical project only once when autocomplete is ambiguous', () => {
    const ambiguousProjects = buildProjectRefs([
      { file: 'enterprise-mlops.project', title: 'Enterprise AI Platform & MLOps' },
      { file: 'enterprise-cloud.project', title: 'Enterprise Cloud Platform' },
    ]);
    const result = completeTerminalInput('cd enterprise', {
      projects: ambiguousProjects,
      cwd: 'portfolio://projects',
    });

    expect(result.value).toBeUndefined();
    expect(result.output).toEqual(['enterprise-mlops.project  enterprise-cloud.project']);
  });

  it('rejects nonexistent nested workspace paths', () => {
    const stackContext = { projects, cwd: 'portfolio://stack.workspace', activeProjectIndex: 0 };

    expect(executeTerminalCommand('cd cloud.workspace', stackContext).output[0]).toBe(
      'cd: cloud.workspace: No such file or directory',
    );
    expect(executeTerminalCommand('cd ../cloud.workspace', stackContext).action).toEqual({
      type: 'openDock',
      dockId: 'cloud',
      cwd: 'portfolio://cloud.workspace',
    });
  });
});
