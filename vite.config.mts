import { defineConfig } from 'npm:vite@^4.0.4'
import react from 'npm:@vitejs/plugin-react@^3.0.1'

import 'npm:react@^18.2.0'
import 'npm:react-dom@^18.2.0'
import "npm:react-router-dom@^6.4"; // Add this line
import "npm:universal-cookie@latest"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()]
})
