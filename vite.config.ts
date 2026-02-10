import { defineConfig } from 'vite'

export default defineConfig({
    base: '/my-pixi-game/dev',
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: 'index.html',
                game: 'game.html',
            },
        },
    },
})
