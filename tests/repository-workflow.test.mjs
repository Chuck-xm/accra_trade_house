import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const hooks = fileURLToPath(new URL("../.githooks/", import.meta.url));

test("commit guard blocks main and permits a work branch", () => {
  const directory = mkdtempSync(join(tmpdir(), "ath-hook-test-"));
  try {
    const init = spawnSync("git", ["init", "-b", "main", directory], {
      encoding: "utf8",
    });
    assert.equal(init.status, 0, init.stderr);
    const blocked = spawnSync("sh", [join(hooks, "pre-commit")], {
      cwd: directory,
      encoding: "utf8",
    });
    assert.equal(blocked.status, 1);
    assert.match(blocked.stderr, /main is reserved/);
    const branch = spawnSync("git", ["switch", "-c", "feature/test"], {
      cwd: directory,
      encoding: "utf8",
    });
    assert.equal(branch.status, 0, branch.stderr);
    const allowed = spawnSync("sh", [join(hooks, "pre-commit")], {
      cwd: directory,
      encoding: "utf8",
    });
    assert.equal(allowed.status, 0, allowed.stderr);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("push guard blocks any destination main, including a renamed source and deletion", () => {
  const oid = "1".repeat(40);
  const zero = "0".repeat(40);
  const inputs = [
    `refs/heads/main ${oid} refs/heads/main ${oid}\n`,
    `refs/heads/feature/test ${oid} refs/heads/main ${oid}\n`,
    `(delete) ${zero} refs/heads/main ${oid}\n`,
    `refs/heads/feature/test ${oid} refs/heads/feature/test ${zero}\nrefs/heads/main ${oid} refs/heads/main ${oid}\n`,
  ];
  for (const input of inputs) {
    const result = spawnSync("sh", [join(hooks, "pre-push")], {
      input,
      encoding: "utf8",
    });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /approved pull request/);
  }
});

test("push guard permits feature branches and release tags", () => {
  const oid = "1".repeat(40);
  const zero = "0".repeat(40);
  const result = spawnSync("sh", [join(hooks, "pre-push")], {
    input: `refs/heads/feature/test ${oid} refs/heads/feature/test ${zero}\nrefs/tags/v1 ${oid} refs/tags/v1 ${zero}\n`,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
});
