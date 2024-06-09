import * as React from 'react'
import { Box } from '@mui/material'
import { DataGrid, GridToolbar, GridNoRowsOverlay, GridRowId } from '@mui/x-data-grid'
import ActionButton from '../../ActionButton'
import { Add as AddIcon, Delete as DeleteIcon, Check as CheckIcon, Block as BlockIcon } from '@mui/icons-material'

import useTickets from '../../../hooks/useTickets'

const NotifyIndex = () => {
  const { tickets, addTicket, deleteTickets, activateTickets, inactivateTickets } = useTickets()
  const [selectionModel, setSelectionModel] = React.useState<GridRowId[]>([])

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <DataGrid
        getRowId={(row) => row.uri}
        columns={[
          {
            field: 'uri',
            headerName: 'Ref',
            renderCell: (params) => <>{new URL(params.row.uri).pathname.split('/')[2] || params.row.uri}</>,
          },
          {
            field: 'title',
            headerName: 'Title',
            flex: 1,
            renderCell: (params) => <>{params.row.title}</>,
          },
          {
            field: 'notificationStatus',
            headerName: 'Status',
            renderCell: (params) => (
              <>
                <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      position: 'relative',
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      marginRight: 1,
                      overflow: 'visible',
                      bgcolor: params.row.notificationStatus === 'enable' ? 'green' : 'red',
                      animation: 'pulse 2s infinite alternate',
                      '@keyframes pulse': {
                        '0%': { opacity: 0.7 },
                        '100%': { opacity: 1.0 },
                      },
                    }}
                  />
                  <Box component="span" sx={{ color: params.row.notificationStatus === 'enable' ? 'green' : 'red' }}>
                    {params.row.notificationStatus === 'enable' ? 'Active' : 'Inactive'}
                  </Box>
                </Box>
              </>
            ),
          },
        ]}
        rows={tickets.map((ticket) => ({
          uri: ticket.uri,
          title: `${ticket.tracker} ${ticket.title}`,
          notificationStatus: ticket.notificationStatus,
        }))}
        autoHeight
        autoPageSize
        checkboxSelection
        onRowSelectionModelChange={(newSelectionModel) => {
          setSelectionModel(newSelectionModel)
        }}
        rowSelectionModel={selectionModel}
        slots={{
          // ツールバーを表示
          toolbar: GridToolbar,
          // データがない場合の表示
          noRowsOverlay: GridNoRowsOverlay,
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            printOptions: { disableToolbarButton: true },
            csvOptions: { disableToolbarButton: true },
          },
        }}
        sx={{
          border: 'none',
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', paddingTop: 1, gap: 2 }}>
        <ActionButton
          color="primary"
          label="ADD"
          Icon={AddIcon}
          onClick={addTicket}
          disabled={selectionModel.length > 0}
        />
        <ActionButton
          color="secondary"
          label="DELETE"
          Icon={DeleteIcon}
          onClick={() => deleteTickets(selectionModel.map((model) => model.toString()))}
          disabled={selectionModel.length === 0}
        />
        <ActionButton
          color="success"
          label="ACTIVATE"
          Icon={CheckIcon}
          onClick={() => activateTickets(selectionModel.map((model) => model.toString()))}
          disabled={selectionModel.length === 0}
        />
        <ActionButton
          color="error"
          label="INACTIVATE"
          Icon={BlockIcon}
          onClick={() => inactivateTickets(selectionModel.map((model) => model.toString()))}
          disabled={selectionModel.length === 0}
        />
      </Box>
    </Box>
  )
}

export default NotifyIndex
