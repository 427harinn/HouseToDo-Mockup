type PlaceholderPageProps = {
  title: string;
};

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <section className="screen-content" data-testid="screen-placeholder">
      <h1>{title}</h1>
    </section>
  );
}
