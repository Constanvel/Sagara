type CatalogIntroProps = {
  headingId: string;
  label: string;
  title: string;
  description: string;
};

export function CatalogIntro({ headingId, label, title, description }: CatalogIntroProps) {
  return (
    <header>
      <div className="flex h-[14px] items-center gap-2 text-[11px] font-extrabold text-primary">
        <span aria-hidden="true" className="h-[3px] w-[18px] rounded-[2px] bg-red" />
        {label}
      </div>
      <h1 id={headingId} className="mt-[7px] text-[32px] leading-[1.23] font-extrabold tracking-[-0.035em] text-ink">
        {title}
      </h1>
      <p className="text-[13px] leading-[1.65] text-muted">
        {description}
      </p>
    </header>
  );
}
