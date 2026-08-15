import { execFileSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

function readGitValue(args) {
  try {
    return execFileSync("git", args, {
      cwd: resolve(dirname(fileURLToPath(import.meta.url)), "../.."),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "unknown";
  }
}

export function resolveDeploymentMetadata(environment = process.env, gitValue = readGitValue) {
  return {
    commitSha: environment.CF_PAGES_COMMIT_SHA || environment.GIT_COMMIT || gitValue(["rev-parse", "HEAD"]),
    branch: environment.CF_PAGES_BRANCH || environment.BRANCH_NAME || gitValue(["branch", "--show-current"]),
  };
}

export async function writeDeploymentMetadata(environment = process.env) {
  const outputPath = resolve(dirname(fileURLToPath(import.meta.url)), "../out/deployment.json");
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(resolveDeploymentMetadata(environment))}\n`, "utf8");
  return outputPath;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const outputPath = await writeDeploymentMetadata();
  process.stdout.write(`deployment_metadata=${outputPath}\n`);
}
