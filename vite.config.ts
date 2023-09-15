import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  //base: '/sap/bc/ui5_ui5/sap/zenth_Z0231220/',
  
  build: {

    sourcemap: true

  },

  server: {
    proxy: {
      "/zfz/": {
        target: `https://swdzx1.zf-world.com/`,
        secure: false,
        auth: "test:test",
      },
    }
  }
})
