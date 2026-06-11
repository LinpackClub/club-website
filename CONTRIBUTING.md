# Contributing to the Club Website

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to this open-source student club website. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Local Setup Guide

1. **Clone the repository**

   ```sh
   git clone https://github.com/LinpackClub/club-website.git
   cd club-website
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Start the development server**

   ```sh
   npm run dev
   ```

   The app will be running at `http://localhost:5000`.

## How to Create an Issue

If you find a bug or have a feature request, please open an issue!

1. Go to the **Issues** tab.
2. Click **New issue**.
3. Choose either the **Bug Report** or **Feature Request** template.
4. Fill out the fields as detailed in the template to help us understand the problem or request.

## How to Create a Pull Request (PR)

1. Check if there is an existing issue for your work. If not, consider creating one to discuss your changes first.
2. Create a new branch from `main` using the Branch Naming Conventions below.
3. Make your changes locally.
4. Run formatting and linting: `npm run lint` and `npm run format:write`.
5. Commit your changes using the Commit Naming Conventions below.
6. Push to your branch and open a PR against the `main` branch.
7. Fill out the **Pull Request Template**.

## Branch Naming Convention

Please name your branches according to the type of work you are doing:

- Features: `feature/<feature-name>` (e.g., `feature/auth-page`)
- Bug Fixes: `fix/<bug-name>` (e.g., `fix/navbar-mobile`)
- Documentation: `docs/<docs-name>` (e.g., `docs/setup-guide`)
- Chores/Refactoring: `chore/<chore-name>` or `refactor/<refactor-name>`

## Commit Naming Convention

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). The commit message should be structured as follows:

```
<type>: <description>
```

**Allowed Types:**

- `feat:` (New feature)
- `fix:` (Bug fix)
- `docs:` (Documentation changes)
- `refactor:` (Code refactoring)
- `style:` (Code style/formatting)
- `chore:` (Maintenance, dependencies)
- `test:` (Adding or updating tests)
- `ci:` (CI/CD changes)

## Release Safety & Branch Protection

To maintain the quality and stability of the `main` branch, the following GitHub branch protection rules are applied:

- **Minimum 1 review required** before a pull request can be merged.
- **All GitHub Actions must pass** (Build, Lint, Type Check, PR Validation).
- **Dismiss stale approvals** when new commits are pushed.
- **Require branch to be up to date** before merging.
- **Squash merge only** to keep a clean linear history.
- **Merge commits, force pushing, and branch deletion are disabled** for the `main` branch.
