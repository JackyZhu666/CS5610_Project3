import PageHero from '../components/PageHero';

export default function RulesPage() {
  return (
      <div className="container">
        <PageHero
            title="Rules"
            subtitle="Learn the basic rules of Sudoku before playing."
        />

        <section className="content-card">
          <ol className="rules-list">
            <li>Each row must contain every number exactly once.</li>
            <li>Each column must contain every number exactly once.</li>
            <li>Each sub-grid must contain every number exactly once.</li>
            <li>Easy games use numbers 1–6.</li>
            <li>Normal games use numbers 1–9.</li>
          </ol>

          <h2>Credits</h2>
          <p>Made by Jackie Zhu.</p>

          <div className="button-row">
            <a className="secondary-btn" href="mailto:jackie@example.com">Email</a>
            <a className="secondary-btn" href="https://github.com/example">GitHub</a>
            <a className="secondary-btn" href="https://linkedin.com/in/example">LinkedIn</a>
          </div>
        </section>
      </div>
  );
}