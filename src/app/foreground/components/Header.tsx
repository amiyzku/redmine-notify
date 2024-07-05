import { Box, Typography } from '@mui/material'
import React from 'react'

const Header = () => {
  return (
    <>
      <Box component="header" sx={{ padding: '10px 0', textAlign: 'center' }}>
        <Typography component="h1" sx={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          Redmine Notify
        </Typography>
      </Box>
    </>
  )
}

export default Header
