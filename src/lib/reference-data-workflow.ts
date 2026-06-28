import { AuditActionType, UserStatus } from "../generated/prisma/enums";
import { canAccessAdmin } from "./auth/permissions";
import type { AuthSession } from "./auth/session-codec";
import { prisma } from "./prisma";

export type ReferenceDataCategoryKey =
  | "capacity-areas"
  | "course-levels"
  | "organization-types"
  | "regions"
  | "languages";

export type ReferenceDataStatusFilter = "all" | "active" | "inactive";

export type ReferenceDataFilters = {
  category?: ReferenceDataCategoryKey | "all";
  query?: string;
  status?: ReferenceDataStatusFilter;
};

export type ReferenceDataMetric = {
  helperText: string;
  label: string;
  tone: "blue" | "green" | "gray" | "orange" | "red";
  value: number | string;
};

export type ReferenceDataCategorySummary = {
  activeCount: number;
  description: string;
  examples: string;
  key: ReferenceDataCategoryKey;
  label: string;
  totalCount: number;
  usedBy: string;
};

export type ReferenceDataItemSummary = {
  category: ReferenceDataCategoryKey;
  categoryLabel: string;
  description: string;
  id: string;
  isActive: boolean;
  key: string;
  label: string;
  order: number;
  statusLabel: string;
  statusTone: "green" | "gray";
};

export type ReferenceDataPageData = {
  categories: ReferenceDataCategorySummary[];
  filters: Required<ReferenceDataFilters>;
  items: ReferenceDataItemSummary[];
  metrics: ReferenceDataMetric[];
  selectedCategory: ReferenceDataCategorySummary;
};

export type ReferenceDataMutationInput = {
  category: ReferenceDataCategoryKey;
  description?: string | null;
  isActive?: boolean;
  itemId?: string;
  key?: string;
  label: string;
  order?: number;
  session: AuthSession | null;
};

export type ReferenceDataMutationResult = {
  code: string;
  itemId?: string;
  success: boolean;
};

export const referenceDataCategoryDefinitions = [
  {
    description:
      "Lightweight learning areas used for course setup, catalogue labels, and admin review.",
    examples: "Proposal Development, Financial Management, Safeguarding",
    key: "capacity-areas",
    label: "Capacity Areas",
    usedBy: "Creator course setup, course catalogue, admin courses",
  },
  {
    description:
      "Course difficulty labels shown to creators, learners, and administrators.",
    examples: "Introductory, Foundational, Intermediate",
    key: "course-levels",
    label: "Course Levels",
    usedBy: "Course setup, learner course cards, admin courses",
  },
  {
    description:
      "Simple organization type labels for CSO and cohort administration.",
    examples: "Local CSO, Community-based organization, Network",
    key: "organization-types",
    label: "Organization Types",
    usedBy: "Admin organizations, monitoring filters",
  },
  {
    description:
      "Geographic labels used in user, organization, cohort, and monitoring views.",
    examples: "Addis Ababa, Amhara, Oromia",
    key: "regions",
    label: "Regions",
    usedBy: "Users, organizations, cohorts, monitoring filters",
  },
  {
    description:
      "Learning language labels used in course setup and course discovery.",
    examples: "English, Amharic, Afaan Oromo",
    key: "languages",
    label: "Languages",
    usedBy: "Course setup, course catalogue, learner pages",
  },
] as const satisfies readonly {
  description: string;
  examples: string;
  key: ReferenceDataCategoryKey;
  label: string;
  usedBy: string;
}[];

const categoryByKey = new Map(
  referenceDataCategoryDefinitions.map((category) => [category.key, category]),
);

function isReferenceDataCategory(value: unknown): value is ReferenceDataCategoryKey {
  return (
    typeof value === "string" &&
    referenceDataCategoryDefinitions.some((category) => category.key === value)
  );
}

function normalizeStatusFilter(value: unknown): ReferenceDataStatusFilter {
  return value === "active" || value === "inactive" ? value : "all";
}

function normalizeCategoryFilter(value: unknown): ReferenceDataCategoryKey | "all" {
  return isReferenceDataCategory(value) ? value : "all";
}

function nullableText(value: string | null | undefined) {
  const trimmed = value?.trim() ?? "";

  return trimmed.length > 0 ? trimmed : null;
}

function normalizeKey(value: string | null | undefined, fallback: string) {
  const source = nullableText(value) ?? fallback;

  return source
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function isValidOrder(value: number | undefined) {
  return value === undefined || Number.isInteger(value);
}

function categoryLabel(category: ReferenceDataCategoryKey) {
  return categoryByKey.get(category)?.label ?? category;
}

async function resolveActorUser(session: AuthSession | null) {
  if (!canAccessAdmin(session)) {
    return null;
  }

  return prisma.user.findFirst({
    select: { fullName: true, id: true },
    where: {
      id: session?.userId,
      status: { not: UserStatus.DEACTIVATED },
    },
  });
}

function toItemSummary(item: {
  category: string;
  description: string | null;
  id: string;
  isActive: boolean;
  key: string;
  label: string;
  order: number;
}): ReferenceDataItemSummary {
  const category = isReferenceDataCategory(item.category)
    ? item.category
    : "capacity-areas";

  return {
    category,
    categoryLabel: categoryLabel(category),
    description: item.description ?? "",
    id: item.id,
    isActive: item.isActive,
    key: item.key,
    label: item.label,
    order: item.order,
    statusLabel: item.isActive ? "Active" : "Inactive",
    statusTone: item.isActive ? "green" : "gray",
  };
}

export async function getReferenceDataPageData(
  session: AuthSession | null,
  filters: ReferenceDataFilters = {},
): Promise<ReferenceDataPageData | null> {
  if (!canAccessAdmin(session)) {
    return null;
  }

  const normalizedFilters = {
    category: normalizeCategoryFilter(filters.category),
    query: filters.query?.trim() ?? "",
    status: normalizeStatusFilter(filters.status),
  };

  const where = {
    category:
      normalizedFilters.category === "all"
        ? { in: referenceDataCategoryDefinitions.map((category) => category.key) }
        : normalizedFilters.category,
    isActive:
      normalizedFilters.status === "all"
        ? undefined
        : normalizedFilters.status === "active",
    OR:
      normalizedFilters.query.length > 0
        ? [
            { label: { contains: normalizedFilters.query } },
            { key: { contains: normalizedFilters.query } },
            { description: { contains: normalizedFilters.query } },
          ]
        : undefined,
  };

  const [items, allItems] = await Promise.all([
    prisma.referenceDataItem.findMany({
      orderBy: [{ category: "asc" }, { order: "asc" }, { label: "asc" }],
      where,
    }),
    prisma.referenceDataItem.findMany({
      select: { category: true, isActive: true },
      where: {
        category: {
          in: referenceDataCategoryDefinitions.map((category) => category.key),
        },
      },
    }),
  ]);

  const summaries = items.map(toItemSummary);
  const totalCount = allItems.length;
  const activeCount = allItems.filter((item) => item.isActive).length;
  const inactiveCount = totalCount - activeCount;
  const categorySummaries = referenceDataCategoryDefinitions.map((category) => {
    const categoryItems = allItems.filter((item) => item.category === category.key);

    return {
      ...category,
      activeCount: categoryItems.filter((item) => item.isActive).length,
      totalCount: categoryItems.length,
    };
  });
  const selectedCategory =
    categorySummaries.find((category) => category.key === normalizedFilters.category) ??
    categorySummaries[0];

  return {
    categories: categorySummaries,
    filters: normalizedFilters,
    items: summaries,
    metrics: [
      {
        helperText: "Phase 1 reference groups available to administrators",
        label: "Categories",
        tone: "blue",
        value: categorySummaries.length,
      },
      {
        helperText: "Values available for active forms and reports",
        label: "Active values",
        tone: "green",
        value: activeCount,
      },
      {
        helperText: "Values preserved but hidden from active selection",
        label: "Inactive values",
        tone: inactiveCount > 0 ? "orange" : "gray",
        value: inactiveCount,
      },
      {
        helperText: "Total values saved in the reference list",
        label: "Saved values",
        tone: "blue",
        value: totalCount,
      },
    ],
    selectedCategory,
  };
}

export async function getActiveReferenceDataItems(
  category: ReferenceDataCategoryKey,
) {
  return prisma.referenceDataItem.findMany({
    orderBy: [{ order: "asc" }, { label: "asc" }],
    select: {
      id: true,
      key: true,
      label: true,
    },
    where: {
      category,
      isActive: true,
    },
  });
}

export async function createReferenceDataItem(
  input: ReferenceDataMutationInput,
): Promise<ReferenceDataMutationResult> {
  const actor = await resolveActorUser(input.session);
  if (!actor) {
    return { code: "unauthorized", success: false };
  }

  if (!isReferenceDataCategory(input.category)) {
    return { code: "invalid-category", success: false };
  }

  const label = input.label.trim();
  const key = normalizeKey(input.key, label);

  if (!label) {
    return { code: "reference-label-required", success: false };
  }

  if (!key) {
    return { code: "reference-key-required", success: false };
  }

  if (!isValidOrder(input.order)) {
    return { code: "invalid-order", success: false };
  }

  return prisma.$transaction(async (tx) => {
    const existing = await tx.referenceDataItem.findUnique({
      select: { id: true },
      where: {
        category_key: {
          category: input.category,
          key,
        },
      },
    });

    if (existing) {
      return { code: "reference-key-exists", success: false };
    }

    const item = await tx.referenceDataItem.create({
      data: {
        category: input.category,
        description: nullableText(input.description),
        isActive: input.isActive ?? true,
        key,
        label,
        order: input.order ?? 0,
      },
      select: { id: true, label: true },
    });

    await tx.auditLog.create({
      data: {
        actionType: AuditActionType.REFERENCE_DATA_UPDATED,
        actorUserId: actor.id,
        description: `Created reference value ${item.label}.`,
        entityId: item.id,
        entityType: "ReferenceDataItem",
        metadataJson: {
          category: input.category,
          key,
        },
      },
    });

    return { code: "reference-created", itemId: item.id, success: true };
  });
}

export async function updateReferenceDataItem(
  input: ReferenceDataMutationInput & { itemId: string },
): Promise<ReferenceDataMutationResult> {
  const actor = await resolveActorUser(input.session);
  if (!actor) {
    return { code: "unauthorized", itemId: input.itemId, success: false };
  }

  if (!isReferenceDataCategory(input.category)) {
    return { code: "invalid-category", itemId: input.itemId, success: false };
  }

  const label = input.label.trim();
  const key = normalizeKey(input.key, label);

  if (!label) {
    return { code: "reference-label-required", itemId: input.itemId, success: false };
  }

  if (!key) {
    return { code: "reference-key-required", itemId: input.itemId, success: false };
  }

  if (!isValidOrder(input.order)) {
    return { code: "invalid-order", itemId: input.itemId, success: false };
  }

  return prisma.$transaction(async (tx) => {
    const existing = await tx.referenceDataItem.findUnique({
      select: { category: true, id: true, key: true, label: true },
      where: { id: input.itemId },
    });

    if (!existing) {
      return { code: "reference-not-found", itemId: input.itemId, success: false };
    }

    const duplicate = await tx.referenceDataItem.findUnique({
      select: { id: true },
      where: {
        category_key: {
          category: input.category,
          key,
        },
      },
    });

    if (duplicate && duplicate.id !== input.itemId) {
      return { code: "reference-key-exists", itemId: input.itemId, success: false };
    }

    const item = await tx.referenceDataItem.update({
      data: {
        category: input.category,
        description: nullableText(input.description),
        isActive: input.isActive ?? true,
        key,
        label,
        order: input.order ?? 0,
      },
      select: { id: true, label: true },
      where: { id: input.itemId },
    });

    await tx.auditLog.create({
      data: {
        actionType: AuditActionType.REFERENCE_DATA_UPDATED,
        actorUserId: actor.id,
        description: `Updated reference value ${item.label}.`,
        entityId: item.id,
        entityType: "ReferenceDataItem",
        metadataJson: {
          category: input.category,
          key,
          previousCategory: existing.category,
          previousKey: existing.key,
          previousLabel: existing.label,
        },
      },
    });

    return { code: "reference-updated", itemId: item.id, success: true };
  });
}

export async function setReferenceDataItemStatus({
  isActive,
  itemId,
  session,
}: {
  isActive: boolean;
  itemId: string;
  session: AuthSession | null;
}): Promise<ReferenceDataMutationResult> {
  const actor = await resolveActorUser(session);
  if (!actor) {
    return { code: "unauthorized", itemId, success: false };
  }

  return prisma.$transaction(async (tx) => {
    const existing = await tx.referenceDataItem.findUnique({
      select: { id: true, isActive: true, label: true },
      where: { id: itemId },
    });

    if (!existing) {
      return { code: "reference-not-found", itemId, success: false };
    }

    if (existing.isActive === isActive) {
      return {
        code: isActive ? "reference-already-active" : "reference-already-inactive",
        itemId,
        success: true,
      };
    }

    const item = await tx.referenceDataItem.update({
      data: { isActive },
      select: { id: true, label: true },
      where: { id: itemId },
    });

    await tx.auditLog.create({
      data: {
        actionType: AuditActionType.REFERENCE_DATA_UPDATED,
        actorUserId: actor.id,
        description: `${isActive ? "Reactivated" : "Deactivated"} reference value ${item.label}.`,
        entityId: item.id,
        entityType: "ReferenceDataItem",
        metadataJson: {
          isActive,
          previousActiveState: existing.isActive,
        },
      },
    });

    return {
      code: isActive ? "reference-reactivated" : "reference-deactivated",
      itemId: item.id,
      success: true,
    };
  });
}
