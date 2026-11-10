import { Breadcrumbs, type Crumb } from "./breadcrumbs";
import { Container } from "./container";

export function PageHeader({
  title,
  intro,
  crumbs,
  children,
}: {
  title: string;
  intro?: string;
  crumbs: Crumb[];
  children?: React.ReactNode;
}) {
  return (
    <div className="border-b bg-surface">
      <Container className="pt-2 pb-8">
        <Breadcrumbs items={crumbs} />
        <h1 className="mt-2 text-3xl md:text-4xl">{title}</h1>
        {intro && <p className="mt-3 text-lg text-muted-foreground">{intro}</p>}
        {children}
      </Container>
    </div>
  );
}
