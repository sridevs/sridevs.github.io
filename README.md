# Open-source project hub

A small directory of open-source projects by [sridevs](https://github.com/sridevs), with enough context to help people choose a project and find a way to contribute.

The site is published at <https://sridevs.github.io>. Project details live in [`projects.json`](projects.json); update that catalog when adding or changing a project.

## Local preview

From the repository root, serve the site with any static file server. For example:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Categories

- **Personal** — tools and assistants for personal workflows, privacy, and finances.
- **SDLC & engineering agents** — agents and tools for building and delivering software.
- **Research & experiments** — explorations, prototypes, and emerging ideas.

Only projects with a catalog entry are shown. Add new categories as projects are added; avoid empty or aspirational project cards.

## Publish

GitHub Pages is configured to deploy the `main` branch's root folder. Project code, issues, roadmaps, and contribution instructions remain in each project's own repository.
