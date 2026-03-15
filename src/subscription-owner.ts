/**
 * Shared helper for resolving subscription ownership (user vs organization).
 *
 * When Better Auth's organization plugin is active, `session.activeOrganizationId`
 * will be present. In that case, subscriptions are scoped to the organization.
 * Otherwise, they are scoped to the individual user via `referenceId`.
 */

export interface SubscriptionOwner {
  userId: string;
  organizationId?: string;
}

/**
 * Resolve subscription ownership from the result of `getSessionFromCtx`.
 * Duck-types `activeOrganizationId` to avoid a hard dependency on the org plugin.
 *
 * `getSessionFromCtx` returns `{ session: { activeOrganizationId, ... }, user: { ... } }`.
 * We destructure so callers just pass the result directly.
 */
export function resolveSubscriptionOwner({
  session,
  user,
}: {
  session?: Record<string, any>;
  user: { id: string };
}): SubscriptionOwner {
  const organizationId = session?.activeOrganizationId as string | undefined;
  return {
    userId: user.id,
    organizationId: organizationId || undefined,
  };
}

/**
 * Build the database query filter for finding subscriptions by owner.
 * - If an org is present, filter by `organizationId`.
 * - Otherwise, filter by `referenceId` (userId) and exclude org-scoped subscriptions.
 */
export function getSubscriptionQueryFilter(
  owner: SubscriptionOwner,
): Array<{ field: string; value: string | null }> {
  if (owner.organizationId) {
    return [{ field: "organizationId", value: owner.organizationId }];
  }
  return [
    { field: "referenceId", value: owner.userId },
    { field: "organizationId", value: null },
  ];
}

export function isPersonalSubscriptionRecord(record: { organizationId?: string | null }): boolean {
  return record.organizationId == null;
}
