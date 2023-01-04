import { visit } from 'unist-util-visit'
import { remove } from 'unist-util-remove';
import { toString } from 'mdast-util-to-string'

export function autoTitle (
  options
) {
  return function transformer (tree, file) {
      var frontmatter = file.data.astro.frontmatter
      const _options = {
        frontmatterToH1: 'title',
        h1ToFrontmatter: 'title',
        defaultText: (_, _f) => (
          _f.history
            .pop()
            ?.replace(_f.cwd, '')
            .replace(/(\/\/)|(\\)+/g, '/')
            .replace('/src/pages','')
            .replace('/index.md', '')
            .replace('.md', '')
        ),
        override: false,
        trimExtraH1: true,
        shiftExtraH1: false,
        ...options
      }


      // calculate what text the injected heading should have
      let text = frontmatter[_options.frontmatterToH1] || undefined;
      if (!text && _options.defaultText !== false) {
        if ( typeof _options.defaultText === 'string') text = _options.defaultText
        else text = _options.defaultText(tree, file)
      }

      const heading = {
        type: 'heading',
        depth: 1,
        children: [
            { 
              type: 'text',
              value: text
            }
        ]
    }

      // Walk tree, find first h1 to assign to 'node', all other h1s get removed or shifted downwards in depth
      var node;
      visit(tree, 'heading', n => {
          if (n.depth === 1) {
            if (node) {
              if (_options.trimExtraH1) remove(tree, n)
              else if (_options.shiftExtraH1 && _options.shiftExtraH1 <= 6) {
                if (_options.shiftExtraH1 === true) n.depth = 2
                else n.depth = _options.shiftExtraH1
              }
            }
            else node = n
          }
      })

      function addToFrontmatter(text) {
        if (_options.h1ToFrontmatter) {
          // override frontmatter
          if (options.override) frontmatter[_options.h1ToFrontmatter] = text
          // Add frontmatter property if not defined
          else if (!frontmatter[_options.h1ToFrontmatter]) frontmatter[_options.h1ToFrontmatter] = text
        }
      }

      if (node) {
        const _text = toString(node)
        if (!_text && text) node = heading
        else if (text) addToFrontmatter(_text)
      }
      else {
        // If no h1 found in file add one and try to add its text as a frontmatter property
        const _text = toString(heading)
        if (text) tree.children.unshift(heading)
        if (text && _text) addToFrontmatter(_text)
      }
      
      return
  }
}