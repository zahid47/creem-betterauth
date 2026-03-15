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
 * Resolve subscription ownership from a session object.
 * Duck-types `activeOrganizationId` to avoid a hard dependency on the org plugin.
 */
export function resolveSubscriptionOwner(session: {
  user: { id: string };
  activeOrganizationId?: string;
}): SubscriptionOwner {
  const organizationId = session.activeOrganizationId;
  return {
    userId: session.user.id,
    organizationId: organizationId || undefined,
  };
}

/**
 * Build the database query filter for finding subscriptions by owner.
 * - If an org is present, filter by `organizationId`.
 * - Otherwise, filter by `referenceId` (userId).
 */
export function getSubscriptionQueryFilter(owner: SubscriptionOwner): Array<{ field: string; value: string }> {
  if (owner.organizationId) {
    return [{ field: "organizationId", value: owner.organizationId }];
  }
  return [{ field: "referenceId", value: owner.userId }];
}
