import { crx, defineManifest } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import hotReloadExtension from 'hot-reload-extension-vite'

const manifest = defineManifest({
  manifest_version: 3,
  description: 'This is redmine amplifier extension',
  name: 'Redmine Amplifier',
  version: '0.1.0',
  permissions: ['tabs', 'activeTab', 'notifications', 'alarms', 'storage'],
  host_permissions: ['*://*/*'],
  action: {
    default_popup: 'src/app/foreground/index.html',
  },
  background: {
    service_worker: 'src/app/background/main.ts',
  },
  commands: {
    _execute_action: {
      suggested_key: {
        default: 'Ctrl+Shift+I',
      },
    },
  },
})

export default defineConfig({
  plugins: [
    crx({ manifest }),
    react(),
    hotReloadExtension({ log: true, backgroundPath: 'src/app/background/main.ts' }),
  ],
})
