# Modular Design System (MDS)

> One `SKILL.md` for AI coding agents. Change one line, `category`, and the whole UI re-skins: layout, density, type scale, motion.

MDS is an agent skill plus token system for building production-grade, non-generic web UI. Pick a category (SaaS dashboard, landing, e-commerce, portfolio/blog/docs), a look (minimal-clean by default), and optional theme overrides (color, font, radius, UI library). The agent plans, reviews against an anti-slop contract, builds, then critiques.

Default preset: **React + Tailwind v4 + shadcn/ui, minimal clean (Linear/Vercel style)**.

## Features
- **One-line switch:** `category: saas-dashboard | landing-marketing | ecommerce | portfolio-blog-docs`
- **6 looks:** minimal-clean, dark-bold, soft-glass, playful, editorial, brutalist
- **Editable theme:** primary color, fonts, radius (`sharp` → `pill`), density, border, shadow, motion, light/dark
- **Bring your own stack:** shadcn/ui, Radix, Mantine, HeroUI, MUI and more; Tailwind v3/v4; any icon and animation lib
- **Onboarding built in:** the agent asks preferences once, or run the CLI, or keep defaults
- **Anti-slop contract:** banned patterns list, one-bold-move rule, copywriting rules
- **Quality floor:** a11y, Core Web Vitals budgets, reduced motion, empty/error/loading states
- **Extensible:** template + catalog of 24 more categories to add

## Quick start
```bash
# 1. Get the skill
npx degit YOUR_USERNAME/modular-design-system my-design-system
# or: git clone https://github.com/bye-shuvo/modular-design-system.git

# 2. (Optional) set preferences interactively
node scripts/configure.mjs SKILL.md

# 3. Give SKILL.md to your agent (see "Install per agent") and prompt:
#    "Use the modular-design-system skill. Build a pricing page."
```
No config? Skip step 2. The agent asks once, or uses the default preset.

## Install per agent
| Agent | Where to put `SKILL.md` |
|---|---|
| Claude Code | `.claude/skills/modular-design-system/SKILL.md` (project) or `~/.claude/skills/...` (global) |
| Claude.ai / Claude apps | Upload as a skill (zip the folder) or paste into project knowledge |
| Cursor | `.cursor/rules/modular-design-system.mdc` (add `alwaysApply: false`, description from frontmatter) |
| Windsurf | `.windsurf/rules/modular-design-system.md` |
| GitHub Copilot | `.github/instructions/modular-design-system.instructions.md` |
| Codex / others | Reference from `AGENTS.md`: "For UI work, follow `design-system/SKILL.md`" |

## Switching category
Edit the CONFIG block in `SKILL.md`:
```yaml
category: ecommerce     # was landing-marketing
look: minimal-clean
radius: sharp           # optional override
primary: "#0EA5A4"      # optional override
```
Then tell the agent: "Config changed, rebuild the shell." Content components stay; layouts change.

## Repository structure
```
modular-design-system/
├─ README.md                # this file
├─ SKILL.md                 # the skill: CONFIG, tokens, category presets, rules
├─ LICENSE                  # MIT
├─ CHANGELOG.md
├─ CONTRIBUTING.md
├─ scripts/
│  └─ configure.mjs         # CLI onboarding, rewrites CONFIG block
├─ examples/                # (add) sample CONFIG blocks and screenshots per category
│  ├─ saas-dashboard.yaml
│  ├─ landing-marketing.yaml
│  ├─ ecommerce.yaml
│  └─ portfolio-blog-docs.yaml
└─ .github/                 # (add)
   ├─ ISSUE_TEMPLATE/
   │  ├─ new-category.md
   │  └─ bug.md
   ├─ PULL_REQUEST_TEMPLATE.md
   └─ workflows/
      └─ validate.yml       # runs configure.mjs on a copy, checks CONFIG markers
```
Folders marked `(add)` are optional and not included yet.

## What is inside `SKILL.md`
| Section | Content |
|---|---|
| 0 | Agent protocol and token precedence |
| 1 | CONFIG block and quick presets |
| 2 | Onboarding questions |
| 3 | Look presets |
| 4 | Base tokens: color, radius, spacing, type, motion, layout |
| 5 | Category presets |
| 6 | Mounting: registry, provider, Tailwind mapping |
| 7 | Component behavior baseline |
| 8 | Suggestions: libraries, fonts, categories, patterns |
| 9 | Anti-slop contract |
| 10 | Build process and quality checklist |
| 11 | Template for new categories |
| 12 | CLI onboarding |

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md). New categories and looks welcome.

## License
MIT
