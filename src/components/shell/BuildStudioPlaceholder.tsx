export function BuildStudioPlaceholder() {
  return (
    <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)_340px]">
      <aside className="rounded-card border border-design-border bg-white-surface p-4 shadow-soft">
        <p className="text-sm font-semibold text-dark-ink">Block Library and Course Outline</p>
        <p className="mt-2 text-sm leading-6 text-muted-text">
          Course creators will use this area to choose learning blocks and move through course structure.
        </p>
      </aside>
      <section className="min-h-[360px] rounded-card border border-design-border bg-white-surface p-4 shadow-soft">
        <p className="text-sm font-semibold text-dark-ink">Course Canvas</p>
        <p className="mt-2 text-sm leading-6 text-muted-text">
          Lessons and content blocks will be arranged here in the main authoring workspace.
        </p>
      </section>
      <aside className="rounded-card border border-design-border bg-white-surface p-4 shadow-soft">
        <p className="text-sm font-semibold text-dark-ink">Block Configuration</p>
        <p className="mt-2 text-sm leading-6 text-muted-text">
          Selected block settings will appear here while the course canvas stays focused on content.
        </p>
      </aside>
    </div>
  );
}
