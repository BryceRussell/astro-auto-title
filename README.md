# astro-auto-title

A [Remark](https://github.com/remarkjs/remark) plugin for [Astro](https://docs.astro.build/en/guides/markdown-content/#markdown-plugins) that automatically adds an `<h1>` element to markdown using a variable from the frontmatter or vice versa, add the text of `<h1>` as a variable to frontmatter

> **Note**: This plugin requires Astro version 2.0.0-beta.0 or above

## Features

- Automatically add `<h1>` heading using frontmatter variable
- Copy the text of `<h1>` to the frontmatter as a variable
- Create dynamic default titles using the documents `mdast` and `vfile`
- Option to force only one `<h1>` per document by removing any extras
- Option to shift extra `<h1>` headings to a lower depth
- Option to override frontmatter variables defined in file

## When do I Use This?

Use this plugin when you have a CMS that enforces a variable in the frontmatter like `title` but you forget to add a `# Heading` in the markdown body. This can also be useful when using the `getHeadings` function from Astro because it can fail if there is no `<h1>` heading

There are also other useful options like:
- Create dyanmic default titles using the document `mdast` and `vfile` if document has nethier a `# Heading` or frontmatter variable
- Add the text of the documents `<h1>` to the frontmatter as a variable
- forcing only one `<h1>` to a document by removing extras or shifting their depth downwards

## How to Use

**Setup Config**:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';

import { autoTitle } from 'astro-auto-title';

export default defineConfig({
    markdown: { 
        remarkPlugins: [
            [autoTitle, {
                frontmatterToH1: 'title',
                h1ToFrontmatter: 'title',
            }]
        ]
    }
});

```

**These 3 Markdown Files**:

```
// 1
---
title: H1 Heading
---

This is a description
```

```
// 2
# H1 Heading

This is a description
```

```
// 3
---
title: I dont override existing h1
---
# H1 Heading

This is a description
```

**Are rendered into this HTML**:

```html
<h1>H1 Heading</h1>
<p>This is a description</p>
```

## Options

### Defaults

```js
{
    frontmatterToH1: 'title',
    h1ToFrontmatter: 'title',
    defaultText: (mdast, vfile) => (
        // Tries to return a string similar to Astro.url.pathname
        // assumes your .md is located in src/pages
        vfile.history
            .pop()
            ?.replace(vfile.cwd, '')
            .replace(/(\/\/)|(\\)+/g, '/')
            .replace('/src/pages','')
            .replace('/index.md', '')
            .replace('.md', '')
    ),
    override: false,
    trimExtraH1: true,
    shiftExtraH1: false
}
```

### `frontmatterToH1?: string|false`

**Default**: `title`

If no `<h1>` is found in document inject one with the text of this frontmatter variable

If `false` is passed it uses the text defined in `default`

**Example**:

```js
{
    frontmatterToH1: 'title'
}
```

```
---
title: H1 Heading
---

This is a description
```

```html
<h1>H1 Heading</h1>
<p>This is a description</p>
```

### `h1ToFrontmatter?: string|false`

**Default**: `title`

This variable is added to frontmatter containing the first `<h1>` element's text

If `false` is passed no variable is added to frontmatter

**Example**:

```js
{
    h1ToFrontmatter: 'title'
}
```

```
# Heading defined in file

This is a description
```

```js
frontmatter = {
    title: 'Heading defined in file'
}
```

### `defaultText?: false | string | (MDAST, VFile) => string`

**Default**

```js
(mdast, vfile) => (
    // Tries to return a string similar to Astro.url.pathname
    // assumes your .md is located in src/pages
    vfile.history
        .pop()
        ?.replace(vfile.cwd, '')
        .replace(/(\/\/)|(\\)+/g, '/')
        .replace('/src/pages','')
        .replace('/index.md', '')
        .replace('.md', '')
)
```

Can be a static string or a function that calculates a default string using the documents `mdast` tree and `vfile`

Pass `false` to disable adding a `<h1>` by default if none if found or there is no frontmatter variable to create one from


### `override?: boolean`

**Default**: `false`

Option to override frontmatter variable if one is already defined in file

### `trimExtraH1?: boolean`

**Default**: `true`

Enforces only one `<h1>` per document, keeps the first `<h1>` and removes all extras

**Example**:

```
# First h1
# Second h1
# Third h1
```

```html
<h1>First h1</h1>
```

### `shiftExtraH1?: 2-6|boolean`

**Default**: `false`

> **Note**: `trimExtraH1` must be set to `false` to use

Enforces only one `<h1>` per document by keeping the first `<h1>` and shifting all extra `<h1>` elements downwards to defined depth

Passing `true` shifts extra `<h1>` elements to `<h2>`

Passing `false` stops shifting from happening

**Example**:

```js
{
    trimExtraH1: false,
    shiftExtraH1: 3
}
```

```
# First h1
# Second h1
# Third h1
```

```html
<h1>First h1</h1>
<h3>Second h1</h3>
<h3>Third h1</h3>
```