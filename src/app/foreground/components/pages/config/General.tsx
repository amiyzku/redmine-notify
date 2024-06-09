import { Box, Button, Tooltip, Typography } from '@mui/material'
import React from 'react'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

interface General {
  enableDarkMode?: boolean
}

export const General = () => {
  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Typography sx={{ fontWeight: 500, mb: 1 }}>
          Keyboard shortcuts{' '}
          <Tooltip title="Keyboard shortcuts for Redmine Amplifier" placement="top">
            <HelpOutlineIcon sx={{ width: '16px', height: '16px' }} />
          </Tooltip>
        </Typography>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => chrome.tabs.create({ url: 'chrome://extensions/shortcuts' })}
        >
          Open settings
        </Button>
      </Box>
    </>
  )
}
