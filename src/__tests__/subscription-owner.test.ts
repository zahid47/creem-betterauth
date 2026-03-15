import { describe, it, expect } from "vitest";
import {
  resolveSubscriptionOwner,
  getSubscriptionQueryFilter,
} from "../subscription-owner.js";

describe("resolveSubscriptionOwner", () => {
  it("returns org filter when session has activeOrganizationId", () => {
    const owner = resolveSubscriptionOwner({
      user: { id: "user_123" },
      activeOrganizationId: "org_456",
    });
    expect(owner).toEqual({
      userId: "user_123",
      organizationId: "org_456",
    });
  });

  it("returns user-only when no activeOrganizationId", () => {
    const owner = resolveSubscriptionOwner({
      user: { id: "user_123" },
    });
    expect(owner).toEqual({
      userId: "user_123",
      organizationId: undefined,
    });
  });

  it("treats empty string activeOrganizationId as absent", () => {
    const owner = resolveSubscriptionOwner({
      user: { id: "user_123" },
      activeOrganizationId: "",
    });
    expect(owner.organizationId).toBeUndefined();
  });
});

describe("getSubscriptionQueryFilter", () => {
  it("returns organizationId filter when org is present", () => {
    const filter = getSubscriptionQueryFilter({
      userId: "user_123",
      organizationId: "org_456",
    });
    expect(filter).toEqual([{ field: "organizationId", value: "org_456" }]);
  });

  it("returns referenceId filter when no org", () => {
    const filter = getSubscriptionQueryFilter({
      userId: "user_123",
    });
    expect(filter).toEqual([{ field: "referenceId", value: "user_123" }]);
  });
});
