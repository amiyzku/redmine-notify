import { Box, MenuItem, TextField, Tooltip, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { useStateWithStore } from '../../../hooks/useStateWithStore'
import { TicketUseCase } from '../../../../../service/ticketUseCase'

const options = [
  { value: 30, label: '30 sec' },
  { value: 60, label: '1 min' },
  { value: 120, label: '2 min' },
  { value: 180, label: '3 min' },
  { value: 240, label: '4 min' },
  { value: 300, label: '5 min' },
  { value: 600, label: '10 min' },
  { value: 900, label: '15 min' },
  { value: 1800, label: '30 min' },
  { value: 3600, label: '60 min' },
]
const defaultOption = options[1]

interface NotifyConfig {
  poolingInterval?: (typeof options)[number]['value']
}

export const Notify = () => {
  const [config, setConfig] = useStateWithStore<NotifyConfig>('notifyConfig', {})
  const ticketUseCase = new TicketUseCase()

  useEffect(() => {
    ;(async () => {
      await ticketUseCase.updateAll({ poolingIntervalSec: config.poolingInterval })
    })()
  }, [config])

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Typography sx={{ fontWeight: 500, mb: 1 }}>
          Pooling interval{' '}
          <Tooltip title="Interval to check for updates on tickets" placement="top">
            <HelpOutlineIcon sx={{ width: '16px', height: '16px' }} />
          </Tooltip>
        </Typography>
        <TextField
          select
          required
          type="number"
          value={config.poolingInterval ?? defaultOption.value}
          onChange={(e) => setConfig((prev) => ({ ...prev, poolingInterval: Number(e.target.value) }))}
          fullWidth
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </>
  )
}
