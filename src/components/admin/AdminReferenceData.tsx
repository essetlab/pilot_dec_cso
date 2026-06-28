import {
  createReferenceDataItemAction,
  setReferenceDataItemStatusAction,
  updateReferenceDataItemAction,
} from "@/lib/reference-data-actions";
import type {
  ReferenceDataCategoryKey,
  ReferenceDataPageData,
} from "@/lib/reference-data-workflow";
import { ActionButton, AlertMessage, EmptyState, FilterBar, MetricCard, StatusBadge } from "@/components/ui";

const noticeCopy: Record<string, { message: string; title: string; tone: "success" | "warning" | "error" | "info" }> = {
  "invalid-category": {
    message: "Choose one of the Phase 1 reference categories and try again.",
    title: "Choose a valid category",
    tone: "error",
  },
  "invalid-order": {
    message: "Use a whole number for the display order.",
    title: "Check the display order",
    tone: "error",
  },
  "reference-already-active": {
    message: "This value is already available for use.",
    title: "Already active",
    tone: "info",
  },
  "reference-already-inactive": {
    message: "This value is already hidden from active selections.",
    title: "Already inactive",
    tone: "info",
  },
  "reference-created": {
    message: "The reference value has been saved and is ready to use.",
    title: "Reference value created",
    tone: "success",
  },
  "reference-deactivated": {
    message: "The value has been kept for history and hidden from active selections.",
    title: "Reference value deactivated",
    tone: "success",
  },
  "reference-key-exists": {
    message: "Use a different short key for this category.",
    title: "Short key already used",
    tone: "error",
  },
  "reference-key-required": {
    message: "Add a short key or use a label that can create one.",
    title: "Short key required",
    tone: "error",
  },
  "reference-label-required": {
    message: "Add a clear label before saving this reference value.",
    title: "Label required",
    tone: "error",
  },
  "reference-not-found": {
    message: "The selected reference value could not be found.",
    title: "Reference value unavailable",
    tone: "error",
  },
  "reference-reactivated": {
    message: "The value is available again for active selections.",
    title: "Reference value reactivated",
    tone: "success",
  },
  "reference-updated": {
    message: "The reference value has been updated.",
    title: "Reference value updated",
    tone: "success",
  },
  unauthorized: {
    message: "Sign in with a platform admin account to manage reference data.",
    title: "Admin access required",
    tone: "error",
  },
};

function Field({
  defaultValue,
  form,
  helperText,
  label,
  name,
  required = false,
  type = "text",
}: {
  defaultValue?: number | string;
  form?: string;
  helperText?: string;
  label: string;
  name: string;
  required?: boolean;
  type?: "number" | "text";
}) {
  return (
    <label className="block text-sm font-semibold text-dark-ink">
      {label}
      <input
        className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
        defaultValue={defaultValue}
        form={form}
        min={type === "number" ? 0 : undefined}
        name={name}
        required={required}
        type={type}
      />
      {helperText ? (
        <span className="mt-2 block text-xs leading-5 text-muted-text">
          {helperText}
        </span>
      ) : null}
    </label>
  );
}

function TextAreaField({
  defaultValue,
  form,
  label,
  name,
}: {
  defaultValue?: string;
  form?: string;
  label: string;
  name: string;
}) {
  return (
    <label className="block text-sm font-semibold text-dark-ink">
      {label}
      <textarea
        className="mt-2 min-h-24 w-full rounded-control border border-design-border bg-white px-4 py-3 text-sm leading-6 text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
        defaultValue={defaultValue}
        form={form}
        name={name}
      />
    </label>
  );
}

function CategorySelect({
  categories,
  defaultValue,
  form,
  name = "category",
}: {
  categories: ReferenceDataPageData["categories"];
  defaultValue?: ReferenceDataCategoryKey;
  form?: string;
  name?: string;
}) {
  return (
    <label className="block text-sm font-semibold text-dark-ink">
      Category
      <select
        className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
        defaultValue={defaultValue}
        form={form}
        name={name}
        required
      >
        {categories.map((category) => (
          <option key={category.key} value={category.key}>
            {category.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ReferenceDataHeader() {
  return (
    <section className="overflow-hidden rounded-[28px] border border-design-border bg-deep-navy p-6 text-white shadow-hero lg:p-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label="Controlled values" tone="blue" />
            <StatusBadge label="Admin managed" tone="green" />
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
            Reference Data
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/75">
            Manage the approved Phase 1 values used by course setup, organization
            records, course discovery, and monitoring filters.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ActionButton href="/admin/courses" size="lg">
              View Courses
            </ActionButton>
            <ActionButton
              className="bg-white text-deep-navy hover:text-dec-blue"
              href="/admin"
              size="lg"
              variant="secondary"
            >
              <span className="text-deep-navy">Back to Dashboard</span>
            </ActionButton>
          </div>
        </div>

        <article className="rounded-[24px] border border-white/15 bg-white/10 p-5">
          <p className="text-sm font-semibold text-dec-green">Reference context</p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight">
            Keep platform labels consistent.
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Deactivate values that should no longer appear in active selections;
            records are preserved for history and reporting.
          </p>
        </article>
      </div>
    </section>
  );
}

function FilterControls({ data }: { data: ReferenceDataPageData }) {
  return (
    <form action="/admin/reference-data" method="get">
      <FilterBar
        actions={
          <>
            <ActionButton href="/admin/reference-data" variant="secondary">
              Clear filters
            </ActionButton>
            <ActionButton type="submit">Apply filters</ActionButton>
          </>
        }
        filters={
          <>
            <label className="block min-w-48 text-sm font-semibold text-dark-ink">
              Category
              <select
                className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
                defaultValue={data.filters.category}
                name="referenceCategory"
              >
                <option value="all">All categories</option>
                {data.categories.map((category) => (
                  <option key={category.key} value={category.key}>
                    {category.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block min-w-40 text-sm font-semibold text-dark-ink">
              Status
              <select
                className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
                defaultValue={data.filters.status}
                name="referenceStatus"
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
          </>
        }
        search={
          <label className="block text-sm font-semibold text-dark-ink">
            Search reference values
            <input
              className="mt-2 min-h-11 w-full rounded-control border border-design-border bg-white px-4 text-sm text-dark-ink outline-none transition focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
              defaultValue={data.filters.query}
              name="referenceSearch"
              type="search"
            />
          </label>
        }
      />
    </form>
  );
}

function CreateReferenceForm({ data }: { data: ReferenceDataPageData }) {
  return (
    <section className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-semibold leading-tight text-dark-ink">
          Add reference value
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-text">
          Add concise values that belong to the approved Phase 1 categories only.
        </p>
      </div>
      <form action={createReferenceDataItemAction} className="mt-6 grid gap-4 lg:grid-cols-2">
        <CategorySelect
          categories={data.categories}
          defaultValue={data.selectedCategory.key}
        />
        <Field
          helperText="A short reference key is used to keep the value stable across forms."
          label="Short key"
          name="key"
        />
        <Field label="Label" name="label" required />
        <Field defaultValue={0} label="Display order" name="order" type="number" />
        <div className="lg:col-span-2">
          <TextAreaField label="Description" name="description" />
        </div>
        <label className="flex items-center gap-3 rounded-control border border-design-border bg-soft-bg px-4 py-3 text-sm font-semibold text-dark-ink">
          <input
            className="size-4 rounded border-design-border text-dec-blue focus:ring-dec-blue"
            defaultChecked
            name="isActive"
            type="checkbox"
          />
          Active for selection
        </label>
        <div className="flex items-end justify-start lg:justify-end">
          <ActionButton type="submit">Save reference value</ActionButton>
        </div>
      </form>
    </section>
  );
}

function CategoryOverview({ data }: { data: ReferenceDataPageData }) {
  return (
    <section className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-semibold leading-tight text-dark-ink">
          Phase 1 categories
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-text">
          These categories are deliberately limited to the current learning-hub
          workflow.
        </p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.categories.map((category) => (
          <article
            className="rounded-[20px] border border-design-border bg-soft-bg p-4"
            key={category.key}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold leading-6 text-dark-ink">
                {category.label}
              </h3>
              <StatusBadge label={`${category.activeCount} active`} tone="green" />
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-text">
              {category.description}
            </p>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="font-semibold text-dark-ink">Examples</dt>
                <dd className="mt-1 leading-6 text-muted-text">{category.examples}</dd>
              </div>
              <div>
                <dt className="font-semibold text-dark-ink">Used by</dt>
                <dd className="mt-1 leading-6 text-muted-text">{category.usedBy}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReferenceValueTable({ data }: { data: ReferenceDataPageData }) {
  if (data.items.length === 0) {
    return (
      <EmptyState
        description="Adjust filters or add a reference value for the selected category."
        title="No reference values match the current filters"
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-[20px] border border-design-border">
      <table className="w-full min-w-[1080px] border-collapse bg-white text-left text-sm">
        <thead className="bg-soft-bg text-xs font-semibold uppercase tracking-[0.12em] text-muted-text">
          <tr>
            <th className="px-4 py-4">Value</th>
            <th className="px-4 py-4">Category</th>
            <th className="px-4 py-4">Short key</th>
            <th className="px-4 py-4">Order</th>
            <th className="px-4 py-4">Status</th>
            <th className="px-4 py-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-design-border">
          {data.items.map((item) => (
            <tr className="align-top" key={item.id}>
              <td className="px-4 py-4">
                <form
                  action={updateReferenceDataItemAction}
                  className="grid gap-3"
                  id={`reference-update-${item.id}`}
                >
                  <input name="itemId" type="hidden" value={item.id} />
                  <input
                    name="isActive"
                    type="hidden"
                    value={item.isActive ? "on" : "off"}
                  />
                  <Field defaultValue={item.label} label="Label" name="label" required />
                  <TextAreaField
                    defaultValue={item.description}
                    label="Description"
                    name="description"
                  />
                </form>
              </td>
              <td className="px-4 py-4">
                <CategorySelect
                  categories={data.categories}
                  defaultValue={item.category}
                  form={`reference-update-${item.id}`}
                  name="category"
                />
              </td>
              <td className="px-4 py-4">
                <Field
                  defaultValue={item.key}
                  form={`reference-update-${item.id}`}
                  label="Short key"
                  name="key"
                />
              </td>
              <td className="px-4 py-4">
                <Field
                  defaultValue={item.order}
                  form={`reference-update-${item.id}`}
                  label="Display order"
                  name="order"
                  type="number"
                />
              </td>
              <td className="px-4 py-4">
                <StatusBadge label={item.statusLabel} tone={item.statusTone} />
              </td>
              <td className="px-4 py-4">
                <div className="flex flex-col gap-2">
                  <ActionButton
                    form={`reference-update-${item.id}`}
                    size="sm"
                    type="submit"
                  >
                    Save
                  </ActionButton>
                  <form action={setReferenceDataItemStatusAction}>
                    <input name="itemId" type="hidden" value={item.id} />
                    <input
                      name="isActive"
                      type="hidden"
                      value={item.isActive ? "false" : "true"}
                    />
                    <ActionButton
                      className="w-full"
                      size="sm"
                      type="submit"
                      variant={item.isActive ? "danger" : "secondary"}
                    >
                      {item.isActive ? "Deactivate" : "Reactivate"}
                    </ActionButton>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReferenceValues({ data }: { data: ReferenceDataPageData }) {
  return (
    <section className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-semibold leading-tight text-dark-ink">
          Reference values
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-text">
          Add, edit, deactivate, or reactivate values without removing their
          history.
        </p>
      </div>
      <div className="mt-6">
        <ReferenceValueTable data={data} />
      </div>
    </section>
  );
}

export function AdminReferenceData({
  adminNotice,
  data,
}: {
  adminNotice?: string;
  data: ReferenceDataPageData;
}) {
  const notice = adminNotice ? noticeCopy[adminNotice] : null;

  return (
    <div className="space-y-6">
      <ReferenceDataHeader />
      {notice ? (
        <AlertMessage title={notice.title} tone={notice.tone}>
          {notice.message}
        </AlertMessage>
      ) : null}
      <section aria-labelledby="reference-summary-heading" className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold leading-tight text-dark-ink" id="reference-summary-heading">
            Reference summary
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-text">
            A concise view of the values currently available for Phase 1 operations.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {data.metrics.map((metric, index) => (
            <MetricCard
              helperText={metric.helperText}
              icon={
                <span className="text-sm font-bold">
                  {String(index + 1).padStart(2, "0")}
                </span>
              }
              key={metric.label}
              label={metric.label}
              tone={metric.tone}
              value={metric.value}
            />
          ))}
        </div>
      </section>
      <FilterControls data={data} />
      <CreateReferenceForm data={data} />
      <CategoryOverview data={data} />
      <ReferenceValues data={data} />
    </div>
  );
}
