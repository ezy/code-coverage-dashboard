import { render, screen } from '@testing-library/react';
import App from '../templates/App';

const summary = {
  total: {
    statements: { total: 100, covered: 90, skipped: 0, pct: 90 },
    lines: { total: 100, covered: 80, skipped: 0, pct: 80 },
    functions: { total: 100, covered: 70, skipped: 0, pct: 70 },
    branches: { total: 100, covered: 60, skipped: 0, pct: 60 },
  },
  'server/user/user.controller.js': {
    statements: { total: 10, covered: 5, skipped: 0, pct: 50 },
  },
};

beforeEach(() => {
  // jsdom reports no layout, so the charts would render nothing
  Object.defineProperty(document.documentElement, 'offsetWidth', {
    value: 1200,
    configurable: true,
  });
  localStorage.clear();
  localStorage.setItem('fileName', 'unchanged.json');
  global.fetch = vi.fn()
    .mockResolvedValueOnce({
      json: () => Promise.resolve([
        { name: 'coverage-summary.json', download_url: 'https://example.test/coverage-summary.json' },
      ]),
    })
    .mockResolvedValueOnce({
      json: () => Promise.resolve(summary),
    });
});

afterEach(() => {
  vi.restoreAllMocks();
});

it('renders without crashing', async () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Code Coverage Dashboard');
  await screen.findByText('100 TOTAL STATEMENTS');
});

it('renders the totals fetched from the configured report', async () => {
  render(<App />);
  expect(await screen.findByText('100 TOTAL STATEMENTS')).toBeInTheDocument();
  expect(screen.getAllByText('90').length).toBeGreaterThan(0);
});
