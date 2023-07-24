# Contributing to Cubik

This page provides information about contributing code to the Cubik's core codebase.

## Getting started

1. Fork the repository on GitHub

2. Clone the forked repository to your machine

3. Install dependencies:

```bash
    pnpm install
```

4. Genrate prisma schema.

```bash
    pnpm run generate
```

5. Run the frontend

```bash
    pnpm run ui:dev
```
## Proposing Changes

The Cubik project source code repositories are hosted at GitHub.
All proposed changes are submitted, and code reviewed, using a [GitHub pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests) process.

To submit a pull request:

1. Commit your changes and push them to your fork on GitHub.
   It is a good practice is to create branches instead of pushing to master.
2. In the GitHub Web UI, click the _New Pull Request_ button.
3. Select `cubik` as _base fork_ and `main` as `base`, then click _Create Pull Request_.
   - We integrate all changes into the master branch.
4. Fill in the Pull Request description according to the [proposed template](https://github.com/cubik-so/cubik/blob/contribution/PULL_REQUEST_TEMPLATE.md).
5. Click _Create Pull Request_.
6. Wait for results/reviews, process the feedback.
   - If you do not get feedback after 3 days, feel free to ping maintainers in the comments.

Once your Pull Request is ready to be merged,
the repository maintainers will integrate it, prepare changelogs, and
ensure it gets released.
There is no additional action required from pull request authors at this point.

### Code formatting for frontend files

Install the Prettier plugin in your desired editor.

# Links

- [Cubik Pull Request Template](https://github.com/cubik-so/cubik/blob/contribution/PULL_REQUEST_TEMPLATE.md)
- [List of newbie-friendly issues in the core](<https://github.com/cubik-so/cubik/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22>)
```
