import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import React, { useState } from 'react'
import { General } from './General'
import { Notify } from './Notify'

const ConfigIndex = () => {
  const [tab, setTab] = useState('General')

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setTab(newValue)
  }

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex' }}>
      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, border: 0 }}>
          <TabList
            onChange={handleTabChange}
            centered
            textColor="primary"
            indicatorColor="primary"
            orientation="vertical"
            variant="scrollable"
            sx={{ borderRight: 1, borderColor: 'divider' }}
          >
            <Tab label="General" value="General" />
            <Tab label="Notify" value="Notify" />
          </TabList>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <TabPanel value="General">
            <General />
          </TabPanel>
          <TabPanel value="Notify">
            <Notify />
          </TabPanel>
        </Box>
      </TabContext>
    </Box>
  )
}

export default ConfigIndex
