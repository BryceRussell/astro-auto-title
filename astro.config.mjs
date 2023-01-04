import { defineConfig } from 'astro/config';
import { autoTitle } from 'astro-auto-title';

// https://astro.build/config
export default defineConfig({
    markdown: { 
        remarkPlugins: [
            [autoTitle, {}]
        ]
    }
});
