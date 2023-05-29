import { defineConfig } from 'npm:vite@^4.0.4'
import react from 'npm:@vitejs/plugin-react@^3.0.1'

import 'npm:react@^18.2.0'
import 'npm:react-dom@^18.2.0'
import "npm:react-router-dom@^6.4"; // Add this line
import "npm:redux-react-session@2.6.1"
import "npm:redux@^4.2.1"
import "npm:jwt-decode@latest"
import "npm:swr@latest"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()]
})
