# veslx

A CLI tool for turning markdown directories into beautiful documentation sites and slide presentations.

## Installation

```bash
bun install -g veslx
```

## Quick Start

```bash
# Initialize in your content directory
veslx init

# Start development server
veslx serve

# Build for production
veslx build
```

## Commands

| Command | Description |
|---------|-------------|
| `veslx init` | Create a `veslx.config.ts` configuration file |
| `veslx serve` | Start development server with hot reload |
| `veslx build` | Build for production to `dist/` |
| `veslx start` | Run as a background daemon (PM2) |
| `veslx stop` | Stop the daemon |

## Content Structure

veslx scans your content directory for markdown files and renders them as posts or slides:

```
content/
├── my-post/
│   ├── README.mdx      # Rendered as a blog post
│   └── SLIDES.mdx      # Rendered as a presentation
├── another-post/
│   └── README.mdx
└── ...
```

### Frontmatter

Add YAML frontmatter to control metadata:

```mdx
---
title: My Post Title
date: 2025-01-15
description: A brief description of the post
visibility: public
---

Your content here...
```

| Field | Description |
|-------|-------------|
| `title` | Display title (falls back to directory name) |
| `date` | Publication date |
| `description` | Short description shown in listings |
| `visibility` | Set to `hidden` to hide from listings |

### Slides

Create presentations in `SLIDES.mdx` files. Separate slides with `---`:

```mdx
---
title: My Presentation
---

# Slide 1

Content for the first slide

---

# Slide 2

Content for the second slide
```

Navigate slides with arrow keys or `j`/`k`.

## Configuration

The `veslx.config.ts` file specifies your content directory:

```typescript
export default {
  dir: './content',
}
```

## Features

- **MDX Support** - Write with React components in markdown
- **Math Rendering** - LaTeX equations via KaTeX
- **Syntax Highlighting** - Code blocks with Shiki
- **Hot Reload** - See changes instantly during development
- **Slide Presentations** - Keyboard-navigable slides from markdown
- **Dark Mode** - Automatic theme switching
- **Daemon Mode** - Run as a background service with PM2

## Development

```bash
# Install dependencies
bun install

# Run locally
bun run dev

# Type check
bun run typecheck

# Lint
bun run lint
```

## License

MIT
