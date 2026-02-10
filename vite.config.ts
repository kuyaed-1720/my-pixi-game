import { defineConfig } from 'vite'

export default defineConfig({
    base: '/my-pixi-game/',
    build: {
        outDir: 'dist/dev',
        rollupOptions: {
            input: {
                main: 'index.html',
                game: 'game.html',
            },
        },
    },
})
