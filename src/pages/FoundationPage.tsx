import { foundationFixtures, type UiLabState } from '../fixtures';
import { getUiLabState } from '../mock/state';

type FoundationPageProps = {
  routePath?: string;
  state?: UiLabState;
};

export function FoundationPage({
  routePath = '/foundation',
  state = getUiLabState(),
}: FoundationPageProps) {
  const fixture = foundationFixtures[state];

  return (
    <main className="foundation-page">
      <h1>M1 Foundation</h1>
      <p>React rendered</p>
      <dl>
        <div>
          <dt>Hash route</dt>
          <dd data-testid="route-path">{routePath}</dd>
        </div>
        <div>
          <dt>UI Lab state</dt>
          <dd data-testid="uilab-state">{state}</dd>
        </div>
        <div>
          <dt>Fixture</dt>
          <dd>{fixture.label}</dd>
        </div>
      </dl>
    </main>
  );
}
