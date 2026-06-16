export type TerminalDockId = 'projects' | 'resume' | 'stack' | 'cloud';
export type TerminalProjectTab = 'overview' | 'architecture' | 'evidence';
export type PortfolioSection = 'home' | 'portfolio-os' | 'credentials';

export type TerminalProjectRef = {
  file: string;
  title: string;
  index: number;
  aliases: string[];
  summary?: string;
};

export type ParsedTerminalCommand =
  | { kind: 'empty' }
  | { kind: 'help' }
  | { kind: 'pwd' }
  | { kind: 'ls'; target?: string }
  | { kind: 'tree'; target?: string }
  | { kind: 'cd'; target: string }
  | { kind: 'open'; target: string }
  | { kind: 'cat'; target: string }
  | { kind: 'tab'; target: string }
  | { kind: 'projectDelta'; delta: 1 | -1 }
  | { kind: 'whoami' }
  | { kind: 'contact' }
  | { kind: 'clear' }
  | { kind: 'reboot' }
  | { kind: 'incidentCommander' }
  | { kind: 'invalid'; input: string };

export type TerminalAction =
  | { type: 'openProject'; projectIndex: number; cwd: string }
  | { type: 'openDock'; dockId: TerminalDockId; cwd: string }
  | { type: 'openCredentials'; cwd: string }
  | { type: 'setTab'; tab: TerminalProjectTab; cwd: string }
  | { type: 'projectDelta'; delta: 1 | -1 };

export type TerminalExecutionResult = {
  output: string[];
  action?: TerminalAction;
  nextCwd?: string;
  clear?: boolean;
  replayIntro?: boolean;
  openIncidentCommander?: boolean;
};

export type TerminalExecutionContext = {
  projects: TerminalProjectRef[];
  cwd: string;
  activeProjectIndex?: number;
};

export type TerminalCompletionResult = {
  value?: string;
  output?: string[];
};

type CompletionCandidate = {
  key: string;
  value: string;
  display: string;
  match: string;
};

const rootPath = 'portfolio://';
const projectRoot = 'portfolio://projects';
const dockIds = ['projects', 'resume', 'stack', 'cloud'] as const;
const tabs = ['overview', 'architecture', 'evidence'] as const;
const incidentCommanderScript = 'incident-commander.sh';
const incidentCommanderPath = `${rootPath}${incidentCommanderScript}`;
const rootEntries = [
  'projects/',
  'resume.workspace',
  'stack.workspace',
  'cloud.workspace',
  'credentials/',
  'profile.txt',
  'contact.txt',
  incidentCommanderScript,
];

const HELP_COLUMN = 24;

function helpEntry(synopsis: string, description: string) {
  return `  ${synopsis}`.padEnd(HELP_COLUMN) + description;
}

const helpLines = [
  'portfolio shell:',
  '',
  helpEntry('pwd', 'print working directory'),
  helpEntry('ls [path]', 'list directory entries'),
  helpEntry('tree [path]', 'display directory tree'),
  helpEntry('cd <path>', 'change working directory; e.g. .., projects'),
  helpEntry('open [path]', 'open workspace, project, or tab'),
  helpEntry('cat <file>', 'print file contents; e.g. profile.txt'),
  helpEntry('tab <view>', 'switch project tab; overview, architecture, evidence'),
  helpEntry('next project', 'select next project'),
  helpEntry('prev project', 'select previous project'),
  helpEntry('whoami', 'print identity summary'),
  helpEntry('contact', 'print contact details'),
  helpEntry('clear', 'clear terminal screen'),
  helpEntry('reboot', 'replay portfolio intro'),
  helpEntry('./incident-commander.sh', 'run production AI incident mini-game'),
];

export function normalizeTerminalInput(input: string) {
  return input.trim().replace(/\s+/g, ' ');
}

export function cwdForUiState(options: {
  section: PortfolioSection;
  dockId?: TerminalDockId;
  projectFile?: string;
  tab?: TerminalProjectTab;
}) {
  if (options.section === 'home') return rootPath;
  if (options.section === 'credentials') return `${rootPath}credentials`;

  const dockId = options.dockId ?? 'projects';
  if (dockId === 'projects') {
    const file = options.projectFile ?? 'synexis-product-platform.project';
    const tab = options.tab ?? 'overview';
    return `${projectRoot}/${file}/${tab}.tab`;
  }

  return `${rootPath}${dockId}.workspace`;
}

export function sectionFromHash(hash: string): PortfolioSection {
  if (hash === '#credentials') return 'credentials';
  if (hash === '#portfolio-os') return 'portfolio-os';
  return 'home';
}

export function buildProjectRefs(projects: { file: string; title: string; summary?: string }[]): TerminalProjectRef[] {
  return projects.map((project, index) => {
    const fileBase = project.file.replace(/\.project$/i, '');
    const titleSlug = project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const firstSegment = fileBase.split('-')[0];

    return {
      file: project.file,
      title: project.title,
      index,
      summary: project.summary,
      aliases: uniqueAliases([
        project.file,
        fileBase,
        firstSegment,
        project.title,
        project.title.toLowerCase(),
        titleSlug,
      ]),
    };
  });
}

export function parseTerminalCommand(rawInput: string): ParsedTerminalCommand {
  const input = normalizeTerminalInput(rawInput);
  const lower = input.toLowerCase();

  if (!input) return { kind: 'empty' };
  if (lower === 'help' || lower === 'man portfolio') return { kind: 'help' };
  if (lower === 'pwd') return { kind: 'pwd' };
  if (lower === 'ls') return { kind: 'ls' };
  if (lower.startsWith('ls ')) return { kind: 'ls', target: input.slice(3).trim() };
  if (lower === 'tree') return { kind: 'tree' };
  if (lower.startsWith('tree ')) return { kind: 'tree', target: input.slice(5).trim() };
  if (lower === 'cd') return { kind: 'cd', target: rootPath };
  if (lower.startsWith('cd ')) return { kind: 'cd', target: input.slice(3).trim() };
  if (lower === 'open') return { kind: 'open', target: '.' };
  if (lower.startsWith('open ')) return { kind: 'open', target: input.slice(5).trim() };
  if (lower.startsWith('cat ')) return { kind: 'cat', target: input.slice(4).trim() };
  if (lower.startsWith('tab ')) return { kind: 'tab', target: input.slice(4).trim().toLowerCase() };
  if (lower === 'next project') return { kind: 'projectDelta', delta: 1 };
  if (lower === 'prev project' || lower === 'previous project') return { kind: 'projectDelta', delta: -1 };
  if (lower === 'whoami') return { kind: 'whoami' };
  if (lower === 'contact') return { kind: 'contact' };
  if (lower === 'clear' || lower === 'ctrl+l') return { kind: 'clear' };
  if (lower === 'reboot') return { kind: 'reboot' };
  if (isIncidentCommanderInvocation(input)) return { kind: 'incidentCommander' };

  return { kind: 'invalid', input };
}

export function executeTerminalCommand(rawInput: string, context: TerminalExecutionContext): TerminalExecutionResult {
  const parsed = parseTerminalCommand(rawInput);

  switch (parsed.kind) {
    case 'empty':
      return { output: [] };
    case 'help':
      return {
        output: helpLines,
      };
    case 'pwd':
      return { output: [context.cwd] };
    case 'ls':
      return listPath(parsed.target ?? '.', context);
    case 'tree':
      return treePath(parsed.target ?? '.', context);
    case 'cd':
      return changeDirectory(parsed.target, context);
    case 'open':
      return openPath(parsed.target, context, true);
    case 'cat':
      return catPath(parsed.target, context);
    case 'tab':
      if (isTab(parsed.target)) {
        const cwd = withProjectTab(context.cwd, parsed.target);
        return {
          output: [`tab -> ${parsed.target}`],
          nextCwd: cwd,
          action: { type: 'setTab', tab: parsed.target, cwd },
        };
      }
      return { output: [`tab: ${parsed.target} is invalid. Use overview, architecture, or evidence.`] };
    case 'projectDelta':
      return {
        output: [parsed.delta > 0 ? 'selecting next project' : 'selecting previous project'],
        action: { type: 'projectDelta', delta: parsed.delta },
      };
    case 'whoami':
      return {
        output: [
          'Daniel Campbell: CTO and applied AI systems builder.',
          'Focus: cloud/platform engineering, GraphRAG, recommenders, agentic RAG, MLOps, secure multi-tenant AI.',
        ],
      };
    case 'contact':
      return { output: ['dcamp049@uottawa.ca', 'https://github.com/SpookOrSpooky'] };
    case 'clear':
      return { output: [], clear: true };
    case 'reboot':
      return { output: ['rebooting portfolio intro...'], replayIntro: true };
    case 'incidentCommander':
      return launchIncidentCommander();
    case 'invalid':
      return { output: [`command not found: ${parsed.input}. Try "help".`] };
  }
}

export function completeTerminalInput(input: string, context: TerminalExecutionContext): TerminalCompletionResult {
  const commandNames = [
    'help',
    'pwd',
    'ls',
    'tree',
    'cd',
    'open',
    'cat',
    'tab',
    'next project',
    'prev project',
    'whoami',
    'contact',
    'clear',
    'reboot',
    'incident-commander',
    'sev2',
  ];

  const commandCompletion = completeToken(input, commandNames);
  if (commandCompletion.value && commandCompletion.value !== input) {
    return commandCompletion;
  }

  const commandMatch = input.match(/^(\S+)(?:\s+(.+))?$/);
  if (!commandMatch) return {};

  const [, command, arg = ''] = commandMatch;
  const lowerCommand = command.toLowerCase();

  if (!input.includes(' ')) {
    return completeToken(input, commandNames);
  }

  if (lowerCommand === 'tab') {
    return completeToken(arg, tabs, `${command} `);
  }

  if (['cd', 'open', 'ls', 'tree', 'cat'].includes(lowerCommand)) {
    return completePathToken(arg, listCompletionsForInput(arg, context), `${command} `);
  }

  return {};
}

function changeDirectory(target: string, context: TerminalExecutionContext): TerminalExecutionResult {
  return openPath(target, context, false);
}

function openPath(target: string, context: TerminalExecutionContext, opening: boolean): TerminalExecutionResult {
  const resolved = resolvePath(target, context);

  if (!resolved) {
    return { output: [`${opening ? 'open' : 'cd'}: ${target}: No such file or directory`] };
  }

  const cwdOnly = !opening && isNavigatingToAncestor(context.cwd, resolvedPathFor(resolved));

  if (resolved.kind === 'root' || resolved.kind === 'projects') {
    return {
      output: [opening ? `opened ${resolved.path}` : resolved.path],
      nextCwd: resolved.path,
      action: !cwdOnly && resolved.kind === 'projects' ? { type: 'openDock', dockId: 'projects', cwd: resolved.path } : undefined,
    };
  }

  if (resolved.kind === 'dock') {
    return {
      output: [opening ? `opened ${resolved.path}` : resolved.path],
      nextCwd: resolved.path,
      action: cwdOnly ? undefined : { type: 'openDock', dockId: resolved.dockId, cwd: resolved.path },
    };
  }

  if (resolved.kind === 'credentials') {
    return {
      output: [opening ? `opened ${resolved.path}` : resolved.path],
      nextCwd: resolved.path,
      action: cwdOnly ? undefined : { type: 'openCredentials', cwd: resolved.path },
    };
  }

  if (resolved.kind === 'project') {
    const output = opening
      ? [`opened ${resolved.path}`, `selected: ${resolved.project.title}`]
      : [resolved.path];
    return {
      output,
      nextCwd: resolved.path,
      action: cwdOnly
        ? undefined
        : { type: 'openProject', projectIndex: resolved.project.index, cwd: resolved.path },
    };
  }

  if (resolved.kind === 'tab') {
    return {
      output: [opening ? `opened ${resolved.path}` : resolved.path],
      nextCwd: resolved.path,
      action: cwdOnly ? undefined : { type: 'setTab', tab: resolved.tab, cwd: resolved.path },
    };
  }

  if (resolved.kind === 'profile') {
    return { output: profileLines(), nextCwd: context.cwd };
  }

  if (resolved.kind === 'contact') {
    return { output: contactLines(), nextCwd: context.cwd };
  }

  if (resolved.kind === 'executable') {
    if (opening) return launchIncidentCommander(`executing ${resolved.name}...`);
    return { output: [`cd: ${target}: Not a directory`] };
  }

  return { output: [`${target}: unsupported path`] };
}

function listPath(target: string, context: TerminalExecutionContext): TerminalExecutionResult {
  const resolved = resolvePath(target, context);
  if (!resolved) return { output: [`ls: cannot access ${target}: No such file or directory`] };

  if (resolved.kind === 'root') return { output: [rootEntries.join('  ')] };
  if (resolved.kind === 'projects') return { output: context.projects.map((project) => project.file) };
  if (resolved.kind === 'project') return { output: ['overview.tab  architecture.tab  evidence.tab  README.md'] };
  if (resolved.kind === 'tab') return { output: [`${resolved.tab}.tab`] };
  if (resolved.kind === 'dock') return { output: [`${resolved.dockId}.workspace`] };
  if (resolved.kind === 'credentials') return { output: ['certifications  policy  education'] };
  if (resolved.kind === 'profile') return { output: ['profile.txt'] };
  if (resolved.kind === 'contact') return { output: ['contact.txt'] };
  if (resolved.kind === 'executable') return { output: [resolved.name] };
  return { output: [] };
}

function treePath(target: string, context: TerminalExecutionContext): TerminalExecutionResult {
  const resolved = resolvePath(target, context);
  if (!resolved) return { output: [`tree: ${target}: No such file or directory`] };

  if (resolved.kind === 'projects') {
    return {
      output: [
        'projects/',
        ...context.projects.flatMap((project) => [
          `  ${project.file}/`,
          '    overview.tab',
          '    architecture.tab',
          '    evidence.tab',
        ]),
      ],
    };
  }

  return {
    output: [
      'portfolio://',
      '  projects/',
      ...context.projects.map((project) => `    ${project.file}/`),
      '  resume.workspace',
      '  stack.workspace',
      '  cloud.workspace',
      '  credentials/',
      '  profile.txt',
      '  contact.txt',
      `  ${incidentCommanderScript}`,
    ],
  };
}

function catPath(target: string, context: TerminalExecutionContext): TerminalExecutionResult {
  const resolved = resolvePath(target, context);
  if (!resolved) return { output: [`cat: ${target}: No such file or directory`] };
  if (resolved.kind === 'profile') return { output: profileLines() };
  if (resolved.kind === 'contact') return { output: contactLines() };
  if (resolved.kind === 'executable') return { output: incidentCommanderScriptLines() };
  if (resolved.kind === 'project') {
    return {
      output: [
        `# ${resolved.project.title}`,
        resolved.project.summary ?? 'Project system notes are available in overview, architecture, and evidence tabs.',
        `open ${resolved.path}/architecture.tab`,
      ],
    };
  }
  return { output: [`cat: ${target}: Is a directory or workspace`] };
}

function resolvePath(target: string, context: TerminalExecutionContext): ResolvedPath | null {
  const normalizedTarget = stripPathPrefix(target.trim() || '.');
  const current = normalizePath(context.cwd);

  if (normalizedTarget === '.') return classifyPath(current, context);
  if (isParentOnlyPath(normalizedTarget)) {
    return classifyPath(normalizePath(joinPath(current, normalizedTarget)), context);
  }

  const candidate = normalizedTarget.startsWith('portfolio://')
    ? normalizePath(normalizedTarget)
    : normalizePath(joinPath(current, normalizedTarget));

  const exact = classifyPath(candidate, context);
  if (exact) return exact;

  const candidateSegments = pathSegments(candidate);
  if (candidateSegments[0] === 'projects' && candidateSegments[1]) {
    const projectFromPathAlias = findProject(candidateSegments[1], context.projects);
    if (projectFromPathAlias) return classifyPath(`${projectRoot}/${projectFromPathAlias.file}`, context);
  }

  const projectAlias = findProject(normalizedTarget, context.projects);
  if (projectAlias) return classifyPath(`${projectRoot}/${projectAlias.file}`, context);

  return null;
}

type ResolvedPath =
  | { kind: 'root'; path: string }
  | { kind: 'projects'; path: string }
  | { kind: 'dock'; path: string; dockId: TerminalDockId }
  | { kind: 'credentials'; path: string }
  | { kind: 'project'; path: string; project: TerminalProjectRef }
  | { kind: 'tab'; path: string; project: TerminalProjectRef; tab: TerminalProjectTab }
  | { kind: 'profile'; path: string }
  | { kind: 'contact'; path: string }
  | { kind: 'executable'; path: string; name: string };

function classifyPath(path: string, context: TerminalExecutionContext): ResolvedPath | null {
  const normalized = normalizePath(path);
  const segments = pathSegments(normalized);

  if (normalized === rootPath) return { kind: 'root', path: rootPath };
  if (normalized === projectRoot) return { kind: 'projects', path: projectRoot };
  if (normalized === 'portfolio://credentials') return { kind: 'credentials', path: normalized };
  if (normalized === 'portfolio://profile.txt') return { kind: 'profile', path: normalized };
  if (normalized === 'portfolio://contact.txt') return { kind: 'contact', path: normalized };
  if (segments.length === 1 && isIncidentCommanderAlias(segments[0])) {
    return { kind: 'executable', path: incidentCommanderPath, name: incidentCommanderScript };
  }

  const rootItem = segments[0];
  if (rootItem?.endsWith('.workspace') && segments.length === 1) {
    const dockId = rootItem.replace('.workspace', '');
    return isDockId(dockId) ? { kind: 'dock', path: normalized, dockId } : null;
  }

  if (segments[0] !== 'projects') return null;
  const project = context.projects.find((item) => item.file === segments[1]);
  if (!project) return null;
  if (segments.length === 2) return { kind: 'project', path: normalized, project };

  const tab = segments[2]?.replace(/\.tab$/i, '').toLowerCase();
  if (segments.length === 3 && isTab(tab)) {
    return { kind: 'tab', path: `${projectRoot}/${project.file}/${tab}.tab`, project, tab };
  }
  if (segments.length === 3 && segments[2]?.toLowerCase() === 'readme.md') {
    return { kind: 'project', path: `${projectRoot}/${project.file}`, project };
  }

  return null;
}

function listCompletionsForCwd(context: TerminalExecutionContext): CompletionCandidate[] {
  const resolved = classifyPath(context.cwd, context);
  const parentCandidate = pathSegments(context.cwd).length > 0 ? [simpleCandidate('..')] : [];

  if (!resolved || resolved.kind === 'root') return rootEntries.map((entry) => simpleCandidate(entry));
  if (resolved.kind === 'projects') {
    return [
      ...parentCandidate,
      ...context.projects.flatMap((project) =>
        project.aliases.map((alias) => ({
          key: project.file,
          value: project.file,
          display: project.file,
          match: alias,
        })),
      ),
    ];
  }
  if (resolved.kind === 'project') {
    return [
      ...parentCandidate,
      ...['overview.tab', 'architecture.tab', 'evidence.tab', 'README.md'].map((entry) => simpleCandidate(entry)),
    ];
  }
  if (resolved.kind === 'tab') {
    return [
      ...parentCandidate,
      ...['../overview.tab', '../architecture.tab', '../evidence.tab', '../README.md'].map((entry) => simpleCandidate(entry)),
    ];
  }

  return [...parentCandidate, ...rootEntries.map((entry) => simpleCandidate(entry))];
}

function listCompletionsForInput(input: string, context: TerminalExecutionContext): CompletionCandidate[] {
  if (input.startsWith('portfolio://')) {
    const suffix = input.replace('portfolio://', '');
    const segments = suffix.split('/').filter(Boolean);
    if (segments.length <= 1) {
      return rootEntries.map((entry) => {
        const value = `portfolio://${entry.replace(/\/$/, '')}`;
        return {
          key: value,
          value,
          display: value,
          match: value,
        };
      });
    }

    if (segments[0] === 'projects' && segments.length <= 2) {
      return context.projects.flatMap((project) =>
        project.aliases.map((alias) => {
          const value = `${projectRoot}/${project.file}`;
          return {
            key: value,
            value,
            display: value,
            match: `${projectRoot}/${alias}`,
          };
        }),
      );
    }
  }

  return listCompletionsForCwd(context);
}

function completeToken(token: string, candidates: readonly string[], prefix = ''): TerminalCompletionResult {
  const matches = candidates.filter((candidate) => candidate.toLowerCase().startsWith(token.toLowerCase()));
  if (matches.length === 1) return { value: `${prefix}${matches[0]}` };
  if (matches.length > 1) return { output: [matches.join('  ')] };
  return {};
}

function completePathToken(token: string, candidates: CompletionCandidate[], prefix = ''): TerminalCompletionResult {
  const normalizedToken = token.toLowerCase();
  const matches = candidates.filter((candidate) => candidate.match.toLowerCase().startsWith(normalizedToken));
  const uniqueMatches = uniqueCompletionCandidates(matches);

  if (uniqueMatches.length === 1) {
    return { value: `${prefix}${uniqueMatches[0].value}` };
  }

  if (uniqueMatches.length > 1) {
    return { output: [uniqueMatches.map((candidate) => candidate.display).join('  ')] };
  }

  return {};
}

function simpleCandidate(value: string): CompletionCandidate {
  return {
    key: value,
    value,
    display: value,
    match: value,
  };
}

function uniqueCompletionCandidates(candidates: CompletionCandidate[]) {
  const seen = new Set<string>();
  return candidates.filter((candidate) => {
    if (seen.has(candidate.key)) return false;
    seen.add(candidate.key);
    return true;
  });
}

function joinPath(cwd: string, target: string) {
  if (target.startsWith('/')) return `${rootPath}${target.slice(1)}`;
  return `${cwd.replace(/\/$/, '')}/${target}`;
}

function normalizePath(path: string) {
  const suffix = path.replace(/^portfolio:\/\//, '');
  const parts: string[] = [];

  for (const part of suffix.split('/')) {
    if (!part || part === '.') continue;
    if (part === '..') {
      parts.pop();
      continue;
    }
    const project = part.endsWith('.project') ? part.toLowerCase() : part;
    parts.push(project);
  }

  return parts.length ? `${rootPath}${parts.join('/')}` : rootPath;
}

function pathSegments(path: string) {
  return normalizePath(path).replace(rootPath, '').split('/').filter(Boolean);
}

function withProjectTab(cwd: string, tab: TerminalProjectTab) {
  const segments = pathSegments(cwd);
  if (segments[0] === 'projects' && segments[1]) return `${projectRoot}/${segments[1]}/${tab}.tab`;
  return `${projectRoot}/synexis-product-platform.project/${tab}.tab`;
}

function profileLines() {
  return [
    'Daniel Campbell',
    'Senior applied AI systems leader: recommenders, GraphRAG, agentic platforms, MLOps, and cloud engineering.',
  ];
}

function contactLines() {
  return ['dcamp049@uottawa.ca', 'https://github.com/SpookOrSpooky'];
}

function incidentCommanderScriptLines() {
  return [
    '#!/bin/bash',
    '# production AI incident response mini-game',
    'set -euo pipefail',
    'exec incident-commander "$@"',
  ];
}

function launchIncidentCommander(message = `executing ${incidentCommanderScript}...`): TerminalExecutionResult {
  return { output: [message], openIncidentCommander: true };
}

function stripPathPrefix(target: string) {
  return target.replace(/^\.\//, '');
}

function isParentOnlyPath(target: string) {
  return /^(\.\.\/?)+$/.test(target);
}

function resolvedPathFor(resolved: ResolvedPath) {
  return resolved.path;
}

function isNavigatingToAncestor(currentCwd: string, targetPath: string) {
  const current = normalizePath(currentCwd);
  const target = normalizePath(targetPath);
  if (current === target) return true;
  return isAncestorPath(target, current);
}

function isAncestorPath(ancestor: string, descendant: string) {
  const ancestorSegments = pathSegments(ancestor);
  const descendantSegments = pathSegments(descendant);
  if (ancestorSegments.length >= descendantSegments.length) return false;
  return ancestorSegments.every((segment, index) => segment === descendantSegments[index]);
}

function isIncidentCommanderAlias(target: string) {
  const normalized = stripPathPrefix(target).toLowerCase();
  return normalized === 'incident-commander' || normalized === incidentCommanderScript;
}

function isIncidentCommanderInvocation(input: string) {
  const normalized = stripPathPrefix(normalizeTerminalInput(input)).toLowerCase();
  return (
    normalized === 'incident-commander' ||
    normalized === incidentCommanderScript ||
    normalized === 'sev2' ||
    normalized === 'system-trace'
  );
}

function uniqueAliases(values: string[]) {
  return Array.from(new Set(values.map((value) => normalizeTerminalInput(value).toLowerCase()).filter(Boolean)));
}

function isDockId(value: string): value is TerminalDockId {
  return dockIds.includes(value as TerminalDockId);
}

function isTab(value: string): value is TerminalProjectTab {
  return tabs.includes(value as TerminalProjectTab);
}

function findProject(target: string, projects: TerminalProjectRef[]) {
  const normalizedTarget = normalizeTerminalInput(target).toLowerCase().replace(/\/$/, '');
  return projects.find((project) => project.aliases.includes(normalizedTarget));
}
