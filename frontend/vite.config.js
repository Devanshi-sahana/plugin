import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({command}) => {
  if(command === 'serve') {
    return {
      plugins: [react()],
    }
  }
  else if(command === 'build') {
    return {
      plugins: [react()],
      define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
      build: {
        lib: {
          entry: './src/components/Chatbot.jsx',
          name: 'MyChatbot',
          fileName: (format) => `my-chatbot.${format}.js`,
          formats: ['umd', 'iife'],
        },
        rollupOptions: {
          external: ['react', 'react-dom'], 
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
            },
          },
        },
      },
    }
  }
});