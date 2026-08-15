import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { resolveDeploymentMetadata } from "../scripts/write-deployment-metadata.mjs";

test("Cloudflare build metadata takes precedence over Jenkins and local Git", () => {
  const metadata = resolveDeploymentMetadata(
    {
      ...process.env,
      CF_PAGES_COMMIT_SHA: "cloudflare-sha",
      CF_PAGES_BRANCH: "main",
      GIT_COMMIT: "jenkins-sha",
      BRANCH_NAME: "develop",
    },
    () => "local-value",
  );

  assert.deepEqual(metadata, { commitSha: "cloudflare-sha", branch: "main" });
});

test("Jenkins metadata is used when Cloudflare variables are unavailable", () => {
  const metadata = resolveDeploymentMetadata(
    { ...process.env, GIT_COMMIT: "jenkins-sha", BRANCH_NAME: "feature/example" },
    () => "local-value",
  );

  assert.deepEqual(metadata, { commitSha: "jenkins-sha", branch: "feature/example" });
});

test("Jenkins production verification matches the expected commit without quote-sensitive parsing", async () => {
  const jenkinsfile = await readFile(resolve(import.meta.dirname, "../../Jenkinsfile"), "utf8");

  assert.match(jenkinsfile, /case "\$metadata" in\s+\*"\$expected"\*\)/);
});
