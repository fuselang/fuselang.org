# The Fuse Programming Language Website

This is the repository for the official Fuse website: [https://fuselang.org](https://fuselang.org)

## How to Build

The website is built with [Hugo](https://gohugo.io/) and uses [tree-sitter](https://tree-sitter.github.io/) for Fuse syntax highlighting.

Install dependencies:

```
npm install
```

Generate syntax highlighting and start the dev server:

```
npm run dev
```

To build for production:

```
npm run build
```

## Miscellaneous

Styling is custom SCSS. Fuse code blocks use a `{{< fuse >}}` shortcode with tree-sitter-based highlighting generated at build time.
