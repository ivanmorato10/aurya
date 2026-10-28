/** Card editorial: sobretítulo, título serifado e texto. Sem sombra; borda sutil. */
export function EditorialCard({ overline, title, children, media }: { overline?: string; title: string; children?: React.ReactNode; media?: React.ReactNode }) {
  return (
    <article className="editorial-card">
      {media && <div className="editorial-card-media">{media}</div>}
      <div className="editorial-card-body">
        {overline && <p className="overline">{overline}</p>}
        <h3 className="title">{title}</h3>
        {children && <div className="editorial-card-text">{children}</div>}
      </div>
    </article>
  );
}
