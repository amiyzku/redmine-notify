import * as React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import type {} from '@mui/x-data-grid/themeAugmentation'
import { Box, Tab } from '@mui/material'
import { TabContext, TabPanel, TabList } from '@mui/lab'

import NotifyIndex from './components/pages/notify/NotifyIndex'
import { AlertProvider } from './components/AlertContext'
import Header from './components/Header'
import { useState } from 'react'
import ConfigIndex from './components/pages/config/ConfigIndex'

const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          // DataGridのセルにフォーカス時にアウトラインを表示させない
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          // DataGridのセルにフォーカス時にアウトラインを表示させない
          '& .MuiDataGrid-cell:focus-within': {
            outline: 'none',
          },
        },
      },
    },
  },
})

const App = () => {
  const [tab, setTab] = useState('Notify')

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setTab(newValue)
  }

  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box component="section" sx={{ width: 800, maxHeight: 600, padding: '1rem' }}>
          <AlertProvider>
            {/* 以下にコンポーネントを配置する */}
            <Header />
            <TabContext value={tab}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleTabChange} centered textColor="primary" indicatorColor="primary">
                  <Tab label="Notify" value="Notify" />
                  <Tab label="Config" value="Config" />
                </TabList>
              </Box>
              <TabPanel value="Notify">
                <NotifyIndex />
              </TabPanel>
              <TabPanel value="Config">
                <ConfigIndex />
              </TabPanel>
            </TabContext>
          </AlertProvider>
        </Box>
      </ThemeProvider>
    </React.StrictMode>
  )
}

export default App
