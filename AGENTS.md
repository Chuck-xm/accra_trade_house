# Repository workflow

- Treat `main` as the approved baseline. Make changes on a named feature, fix, chore, or docs branch.
- Preserve existing uncommitted changes. Do not include unrelated edits in a commit.
- Follow CONTRIBUTING.md. Run the applicable checks, including `npm test`, before handing work over for review.
- Changes reach `main` through a pull request after its requirements, visual changes, and automated checks have been reviewed.
- Do not merge into or push directly to `main`, bypass checks, force-push, or change protection rules to get work merged.
- A passing test run alone is not permission to merge. Obtain the user's explicit instruction before merging a PR.
