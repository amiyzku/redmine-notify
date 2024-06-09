import React, { useState } from 'react'
import { Button } from '@mui/material'
import { SvgIconComponent } from '@mui/icons-material'

interface ActionButtonProps {
  color: 'primary' | 'secondary' | 'success' | 'error'
  label: string
  Icon: SvgIconComponent
  onClick: () => void
  disabled: boolean
}

const ActionButton: React.FC<ActionButtonProps> = ({ color, label, Icon, onClick, disabled }) => {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAction = async () => {
    setIsProcessing(true)
    try {
      await onClick()
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Button
      color={color}
      variant="outlined"
      aria-label={label.toLowerCase()}
      size="medium"
      onClick={handleAction}
      startIcon={<Icon />}
      disabled={isProcessing || disabled}
    >
      {label}
    </Button>
  )
}

export default ActionButton
