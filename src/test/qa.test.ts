import { describe, expect, it } from "vitest";
import { inviteProblem, issueSchema, jackboyHandoff, resolveQaRole } from "@/lib/qa";

const future = new Date(Date.now() + 3600_000).toISOString();
const base = { invited_email: "razul@example.com", expires_at: future, used_at: null, revoked_at: null };
const razul = { email: "razul@example.com", emailVerified: true };

describe("QA roles", () => {
  it("owner requires a verified email matching OWNER_EMAIL", () => {
    expect(resolveQaRole({ email: "o@x.com", emailVerified: true, ownerEmail: "O@x.com", hasActiveAccess: false })).toBe("owner");
    expect(resolveQaRole({ email: "o@x.com", emailVerified: false, ownerEmail: "o@x.com", hasActiveAccess: false })).toBeNull();
  });
  it("no OWNER_EMAIL means nobody is owner", () => {
    expect(resolveQaRole({ email: "o@x.com", emailVerified: true, ownerEmail: undefined, hasActiveAccess: false })).toBeNull();
  });
  it("reviewer only with an active access row", () => {
    expect(resolveQaRole({ email: "r@x.com", emailVerified: true, ownerEmail: "o@x.com", hasActiveAccess: true })).toBe("qa_reviewer");
    expect(resolveQaRole({ email: "r@x.com", emailVerified: true, ownerEmail: "o@x.com", hasActiveAccess: false })).toBeNull();
  });
});

describe("QA invitations", () => {
  it("valid for matching verified email", () => expect(inviteProblem(base, razul)).toBeNull());
  it("refuses used, revoked, expired, missing", () => {
    expect(inviteProblem({ ...base, used_at: future }, razul)).toMatch(/already used/);
    expect(inviteProblem({ ...base, revoked_at: future }, razul)).toMatch(/revoked/);
    expect(inviteProblem({ ...base, expires_at: new Date(Date.now() - 1).toISOString() }, razul)).toMatch(/expired/);
    expect(inviteProblem(null, razul)).toMatch(/does not exist/);
  });
  it("refuses another email or unverified email", () => {
    expect(inviteProblem(base, { email: "other@example.com", emailVerified: true })).toMatch(/email address/);
    expect(inviteProblem(base, { ...razul, emailVerified: false })).toMatch(/Confirm/);
  });
});

describe("QA issues", () => {
  const issue = { build_version: "0.1.0", category: "foot_sliding", title: "Feet slide", observed: "a", expected: "b", repro_steps: "c", severity: "high" as const };
  it("rejects unknown category and severity", () => {
    expect(issueSchema.safeParse({ ...issue, category: "billing" }).success).toBe(false);
    expect(issueSchema.safeParse({ ...issue, severity: "urgent" }).success).toBe(false);
    expect(issueSchema.safeParse(issue).success).toBe(true);
  });
  it("Jackboy export says it is manual", () => {
    const out = jackboyHandoff([{ ...issue, id: "1", status: "handed_off", created_at: "x" }]);
    expect(out.note).toMatch(/not connected/);
    expect(out.issues[0]!.severity).toBe("high");
  });
});
