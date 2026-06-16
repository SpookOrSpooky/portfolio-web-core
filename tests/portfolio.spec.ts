import { expect, test, type Page } from '@playwright/test';

async function openPortfolio(page: Page) {
  await page.goto('/');
  await page.mouse.wheel(0, 500);
  await expect(page.getByRole('dialog', { name: /Terminal intro/i })).toBeHidden({ timeout: 3000 });
}

async function runTerminalCommand(page: Page, command: string) {
  const input = page.getByLabel('Terminal command');
  await input.fill(command);
  await input.press('Enter');
}

test('project files, document tabs, and dock windows are interactive', async ({ page }) => {
  await openPortfolio(page);
  const portfolioWindow = page.locator('#portfolio-os');

  await page.getByRole('button', { name: /matching-engine/i }).click();
  await expect(portfolioWindow.getByRole('heading', { name: 'Investor & Attendee Matching Engine' })).toBeVisible();
  await expect(portfolioWindow.getByText('origin: Synexis')).toBeVisible();

  await page.getByRole('button', { name: 'architecture' }).click();
  await expect(portfolioWindow.getByText('Normalized investment thesis')).toBeVisible();

  await page.getByRole('button', { name: /^Resume$/ }).click();
  await expect(page.getByRole('heading', { name: /Founder & CTO @ Synexis/i })).toBeVisible();

  await page.getByRole('button', { name: /^Stack$/ }).click();
  await expect(page.getByRole('heading', { name: 'Application Engineering' })).toBeVisible();

  await page.getByRole('button', { name: /^Cloud$/ }).click();
  await expect(page.getByRole('heading', { name: 'Application and cloud engineering scope' })).toBeVisible();
});

test('geosat project exposes Vimeo player and slideshow artifacts', async ({ page }) => {
  await openPortfolio(page);
  const portfolioWindow = page.locator('#portfolio-os');

  await page.getByRole('button', { name: /geosat-aiops/i }).click();
  await expect(portfolioWindow.getByRole('heading', { name: 'GeoSat AIOps Inference Systems' })).toBeVisible();
  await expect(portfolioWindow.getByTitle('Larus Technologies GeoSat AIOps overview')).toBeVisible();
  await expect(portfolioWindow.getByRole('button', { name: 'Expand' })).toHaveCount(0);

  await portfolioWindow.getByRole('button', { name: 'Slideshow' }).click();
  await expect(portfolioWindow.getByAltText(/Real-time Threat Intelligence|Maritime Threat Intent Recognition|Predictive Naval Track Modelling|Historical Track Analysis/i).first()).toBeVisible();

  await portfolioWindow.getByRole('button', { name: 'Expand' }).click();
  await expect(page.getByRole('dialog', { name: /GeoSat AIOps Inference Systems expanded media/i })).toBeVisible();
});

test('enterprise mlops project shows RBC application context and NOMI video', async ({ page }) => {
  await openPortfolio(page);
  const portfolioWindow = page.locator('#portfolio-os');

  await page.getByRole('button', { name: /enterprise-mlops/i }).click();
  await expect(portfolioWindow.getByRole('heading', { name: 'Enterprise AI Platform & MLOps' })).toBeVisible();
  await expect(portfolioWindow.getByRole('link', { name: /NOMI Forecast/i })).toBeVisible();
  await expect(portfolioWindow.getByRole('link', { name: /Lumina/i })).toBeVisible();
  await expect(portfolioWindow.getByRole('link', { name: /Aiden/i })).toBeVisible();
  await expect(portfolioWindow.getByText('Did not own the quantitative forecasting mathematics')).toBeVisible();
  await expect(portfolioWindow.locator('video[title="NOMI Forecast customer experience award video"]')).toBeVisible();
  await expect(portfolioWindow.getByRole('button', { name: 'Expand' })).toHaveCount(0);
});

test('projects without media do not show artifact placeholder text', async ({ page }) => {
  await openPortfolio(page);
  const portfolioWindow = page.locator('#portfolio-os');

  await page.getByRole('button', { name: /investment-graph/i }).click();
  await expect(portfolioWindow.getByRole('heading', { name: 'Investment Intelligence Graph' })).toBeVisible();
  await expect(portfolioWindow.getByText('Project artifact view')).toHaveCount(0);
  await expect(portfolioWindow.getByText('Add graph projection diagrams')).toHaveCount(0);
});

test('terminal intro appears and scroll accelerates reveal', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('dialog', { name: /Terminal intro/i })).toBeVisible();
  await page.mouse.wheel(0, 500);
  await expect(page.getByRole('dialog', { name: /Terminal intro/i })).toBeHidden({ timeout: 3000 });
  await expect(page.getByRole('region', { name: 'Command terminal' })).toBeVisible();
  await expect(page.getByText('> "The next generation of AI products will not be demos"')).toBeVisible();
  await expect(page.getByText('> "They will be memory, judgment, and infrastructure at scale..."')).toBeVisible();
  await expect(page.getByText('type "help", "tree", or "cd portfolio://projects"')).toHaveCount(0);
  await expect(page.locator('.terminal-input-mirror')).toContainText('help', { timeout: 1500 });
  await page.getByLabel('Terminal command').press('Enter');
  await expect(page.getByText('portfolio shell:')).toBeVisible();
});

test('terminal commands navigate projects, tabs, docks, and errors', async ({ page }) => {
  await openPortfolio(page);
  const portfolioWindow = page.locator('#portfolio-os');

  await runTerminalCommand(page, 'cd portfolio://projects/enterprise-mlops.project');
  await expect(portfolioWindow.getByRole('heading', { name: 'Enterprise AI Platform & MLOps' })).toBeVisible();

  await runTerminalCommand(page, 'cd architecture.tab');
  await expect(portfolioWindow.getByText('Red Hat OpenShift 4.x')).toBeVisible();

  await runTerminalCommand(page, 'cd portfolio://resume.workspace');
  await expect(page.getByRole('heading', { name: /Founder & CTO @ Synexis/i })).toBeVisible();

  await runTerminalCommand(page, 'cd portfolio://stack.workspace');
  await expect(page.getByRole('heading', { name: 'Application Engineering' })).toBeVisible();

  await runTerminalCommand(page, 'cd portfolio://cloud.workspace');
  await expect(page.getByRole('heading', { name: 'Application and cloud engineering scope' })).toBeVisible();

  await runTerminalCommand(page, 'nope');
  await expect(page.getByText('command not found: nope. Try "help".')).toBeVisible();
});

test('incident commander opens from terminal and can be resolved', async ({ page }) => {
  await openPortfolio(page);
  for (const command of ['incident-commander', './incident-commander.sh', 'open incident-commander']) {
    await runTerminalCommand(page, command);
    const incident = page.getByRole('dialog', { name: /Incident Commander/i });
    await expect(incident).toBeVisible();
    await incident.getByRole('button', { name: 'Close', exact: true }).click();
    await expect(incident).toHaveCount(0);
  }

  await runTerminalCommand(page, 'incident-commander');
  const incident = page.getByRole('dialog', { name: /Incident Commander/i });
  await expect(incident).toBeVisible();
  await expect(incident.getByText(/quality alert:/)).toBeVisible();
  await expect(incident.getByText('briefing: timer is paused until you run "start incident".')).toBeVisible();
  await expect(incident.locator('.incident-briefing-actions').getByRole('button', { name: 'start incident' })).toBeVisible();
  await expect(incident.getByText('Evidence board')).toBeVisible();
  await expect(incident.getByText('Portfolio field guide')).toBeVisible();
  await incident.getByRole('button', { name: 'portfolio guide' }).click();
  await expect(incident.getByText('guide note: these explain the system patterns.')).toBeVisible();

  const incidentText = (await incident.textContent()) ?? '';
  const scenario = incidentText.includes('graphrag-answering.prod')
    ? 'temporal'
    : incidentText.includes('agent-workflows.prod')
      ? 'agent'
      : incidentText.includes('semantic-ingestion.prod')
        ? 'gpu'
        : 'parser';
  const commands = scenario === 'temporal'
    ? [
        'start incident',
        'inspect slo',
        'inspect rag',
        'inspect graph',
        'trace request',
        'hypothesis temporal-graph-projection-skew',
        'mitigate rollback-graph-projection',
        'run replay temporal',
        'close incident',
      ]
    : scenario === 'agent'
      ? [
          'start incident',
          'inspect slo',
          'inspect agent',
          'trace request',
          'inspect prompt',
          'hypothesis agent-route-policy-regression',
          'mitigate rollback-route-policy',
          'run replay numeric',
          'close incident',
        ]
      : scenario === 'gpu'
        ? [
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
          ]
        : [
          'start incident',
          'inspect slo',
          'inspect metrics',
          'inspect parser',
          'trace request',
          'hypothesis parser-schema-drift',
          'mitigate rollback-parser-template',
          'run replay constraints',
          'close incident',
        ];

  for (const command of commands) {
    await incident.getByLabel('Incident command').fill(command);
    await incident.getByRole('button', { name: 'Run', exact: true }).click();
  }

  await expect(incident.locator('.incident-unlock').getByText('Incident closed')).toBeVisible();
  await expect(incident.getByText(/rank:/)).toBeVisible();
  await expect(incident.getByText('portfolio closeout:')).toBeVisible();
  await incident.locator('.incident-unlock').getByRole('button', { name: /^open / }).first().click();
  await expect(page.locator('#portfolio-os')).toBeVisible();
});

test('mobile terminal docks at the bottom and accepts commands', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 820 });
  await openPortfolio(page);

  await expect(page.getByRole('region', { name: 'Command terminal' })).toBeVisible();
  await runTerminalCommand(page, 'cd geosat');
  await expect(page.locator('#portfolio-os').getByRole('heading', { name: 'GeoSat AIOps Inference Systems' })).toBeVisible();
});
