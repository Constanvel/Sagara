import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const lockfile = JSON.parse(readFileSync(new URL("../../package-lock.json", import.meta.url), "utf8"));

// Keep the complete audit visible. Only this known development-tool advisory
// may be nonblocking; do not downgrade Next.js/ESLint to npm's suggested fix.
const knownDevelopmentAdvisory = "https://github.com/advisories/GHSA-vfj7-8cjw-p6xm";
const result = process.platform === "win32"
  ? spawnSync("cmd.exe", ["/d", "/s", "/c", "npm audit --json"], { encoding: "utf8" })
  : spawnSync("npm", ["audit", "--json"], { encoding: "utf8" });

if (result.error || ![0, 1].includes(result.status)) {
  console.error("npm audit could not complete.", result.error?.message ?? result.stderr);
  process.exit(1);
}

let report;
try {
  report = JSON.parse(result.stdout);
} catch {
  console.error("npm audit returned invalid JSON.");
  process.exit(1);
}
if (report.error || report.auditReportVersion !== 2 || !report.vulnerabilities) {
  console.error("npm audit returned an error or an unsupported report format.");
  process.exit(1);
}

const vulnerabilities = report.vulnerabilities;
function isKnownDevelopmentChain(name, visited = new Set()) {
  if (visited.has(name)) return false;
  const vulnerability = vulnerabilities[name];
  if (!vulnerability || !Array.isArray(vulnerability.via) || !vulnerability.via.length) return false;
  // Never let the tooling exception silently cover a future production dependency.
  if (!Array.isArray(vulnerability.nodes) || !vulnerability.nodes.length ||
      !vulnerability.nodes.every(node => lockfile.packages?.[node]?.dev === true)) return false;
  const next = new Set([...visited, name]);
  return vulnerability.via.every((cause) => typeof cause === "string"
    ? isKnownDevelopmentChain(cause, next)
    : cause.name === "braces" && cause.url === knownDevelopmentAdvisory && cause.severity === "high");
}

let blocked = false;
for (const [name, vulnerability] of Object.entries(vulnerabilities)) {
  console.log(`Audit: ${name}, severity=${vulnerability.severity}, range=${vulnerability.range}`);
  for (const cause of vulnerability.via ?? []) {
    if (typeof cause !== "string") console.log(`  Advisory: ${cause.url} (${cause.severity}): ${cause.title}`);
  }
  if (["high", "critical"].includes(vulnerability.severity)) {
    if (vulnerability.severity === "high" && isKnownDevelopmentChain(name)) {
      console.warn(`Known development-only exception: ${name}; ${knownDevelopmentAdvisory}. Upgrade the supported toolchain when fixed.`);
    } else {
      console.error(`Unapproved high/critical vulnerability: ${name}`);
      blocked = true;
    }
  }
}
console.log(`Audit totals: ${JSON.stringify(report.metadata?.vulnerabilities ?? {})}`);
process.exitCode = blocked ? 1 : 0;
