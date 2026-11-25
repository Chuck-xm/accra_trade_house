# Working on Accra Trade House

`main` is the default branch and contains accepted work. Start a separate branch for each change, open a pull request into `main`, and merge only after the requested behaviour has been reviewed and the checks pass. This project does not need a separate permanent `develop` branch.

## Branch names

- `feature/short-description` for new behaviour.
- `fix/short-description` for corrections.
- `chore/short-description` for maintenance and tooling.
- `docs/short-description` for documentation.

The initial workflow setup lives on `chore/repository-workflow`.

## Starting work

First check for uncommitted changes with `git status`. Preserve existing work before switching branches; do not discard someone else's edits.

With a clean working tree:

```sh
git switch main
git pull --ff-only origin main
git switch -c feature/short-description
```

Use focused commits and push the work branch:

```sh
npm test
git add path/to/changed-file
git commit -m "feat: describe the change"
git push -u origin feature/short-description
```

In VS Code, **Publish Branch** publishes the active work branch. It does not approve the changes or merge them into `main`.

## Pull requests and acceptance

Open a pull request with the work branch as **compare** and `main` as **base**. Use the repository's PR checklist to record requirements, validation, and screenshots for visible changes. Draft PRs are useful while work is incomplete.

Before merging:

1. The requested behaviour and acceptance criteria are satisfied.
2. **Prototype tests** passes on GitHub; update the branch from `main` if GitHub requires it.
3. The affected flows and responsive layout have been manually reviewed. Automated tests do not certify visual correctness.
4. Review conversations are resolved, and the project owner accepts the result.

Merge with **Squash and merge** to keep `main` readable. Delete the remote work branch after merging. Do not merge a PR merely because its automated check passes.

For a solo-owned repository, the owner reviews the PR and makes the merge decision. The supplied protection configuration requires a PR but sets independent approvals to zero because GitHub does not let authors approve their own PRs. If another collaborator will review changes, change `required_approving_review_count` to `1` and apply that updated setting.

## Local branch guards

Enable the tracked hooks once per clone:

```sh
git config core.hooksPath .githooks
```

The hooks block commits on `main` and pushes targeting remote `main`, including attempts to push a different local branch directly to it. GitHub's PR merge operation is unaffected. Hooks are a local convenience and can be bypassed; GitHub protection is the actual remote enforcement.

## GitHub protection setup

Branch protection was activated and verified on `main` on 25 November 2026. It requires a pull request, the passing **Prototype tests** check, an up-to-date branch, conversation resolution, and linear history. It applies to administrators and blocks force pushes and branch deletion.

Repository files alone do not activate protection. The instructions below document the active settings for future maintenance. The connected GitHub app does not expose administration writes; the initial setup used the existing GitHub sign-in through Git’s credential helper, without storing credentials in the repository.

To inspect or maintain the active rule, open:

https://github.com/Chuck-xm/accra_trade_house/settings/branches

Add a classic branch protection rule for `main` with:

- Require a pull request before merging.
- Require status checks, select **Prototype tests**, and require the branch to be up to date.
- Require conversation resolution and a linear history.
- Apply the rule to administrators / do not allow bypassing the settings.
- Keep force pushes and branch deletion disabled.
- Leave required independent approvals disabled for solo work; require one when a separate reviewer is available.

An administrator with an authenticated GitHub CLI can apply the same prepared settings from the repository root:

```sh
gh api --method PUT repos/Chuck-xm/accra_trade_house/branches/main/protection --input docs/main-branch-protection.json
```

Verify changes in GitHub settings after applying them. Keep the protection active; local hooks alone cannot enforce the remote workflow. See [GitHub’s protected branch documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches).
