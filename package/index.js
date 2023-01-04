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


      // Define heading to inject and calculate its text
      const heading = {
          type: 'heading',
          depth: 1,
          children: [
              { 
                type: 'text',
                value:
                  frontmatter[_options.frontmatterToH1]
                  || ( typeof _options.defaultText === 'string'
                    ? _options.defaultText
                    : _options.defaultText(tree, file)
                  )
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
        // Add frontmatter property if not defined
        if (_options.h1ToFrontmatter) {
          if (options.override) frontmatter[_options.h1ToFrontmatter] = text
          else if (!frontmatter[_options.h1ToFrontmatter]) frontmatter[_options.h1ToFrontmatter] = text
        }
      }

      if (node) {
        const text = toString(node)
        if (!text) node = heading
        else addToFrontmatter(text)
      }
      else {
        // If no h1 found in file add one and try to add its text as a frontmatter property
        tree.children.unshift(heading)
        addToFrontmatter(toString(heading))
      }
      
      return
  }
}