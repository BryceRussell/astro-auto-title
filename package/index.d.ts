import type { Transformer } from "unified";
import type { Root } from "mdast";
import type { VFile } from 'vfile';

export interface Options {
    frontmatterToH1?: string|false;
    h1ToFrontmatter?: string|false;
    defaultText?: string|((tree: Root, file: VFile) => string)|false
    override?: boolean;
    trimExtraH1?: boolean;
    shiftExtraH1?: number|boolean;
}

export default function autoTitle(
  options?: Options
): Transformer<Root, Root>;