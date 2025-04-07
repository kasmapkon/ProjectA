import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef<(typeof rows)[number]>[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'title',
    headerName: 'Title',
    width: 150,
    editable: true,
  },
  {
    field: 'imagelink',
    headerName: 'Image Link',
    width: 150,
    editable: true,
  },
  {
    field: 'price',
    headerName: 'Price',
    type: 'number',
    width: 110,
    editable: true,
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    type: 'number',
    width: 110,
    editable: true,
  },
  {
    field: 'category',
    headerName: 'Category',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
  },
];

const rows = [
    { id: 1, title: 'Laptop', imagelink: 'https://example.com/laptop.jpg', price: 1200, quantity: 10, category: 'Electronics' },
    { id: 2, title: 'Smartphone', imagelink: 'https://example.com/smartphone.jpg', price: 800, quantity: 15, category: 'Electronics' },
    { id: 3, title: 'Headphones', imagelink: 'https://example.com/headphones.jpg', price: 150, quantity: 30, category: 'Accessories' },
    { id: 4, title: 'Gaming Mouse', imagelink: 'https://example.com/mouse.jpg', price: 50, quantity: 20, category: 'Accessories' },
    { id: 5, title: 'Keyboard', imagelink: 'https://example.com/keyboard.jpg', price: 70, quantity: 25, category: 'Accessories' },
    { id: 6, title: 'Office Chair', imagelink: 'https://example.com/chair.jpg', price: 200, quantity: 12, category: 'Furniture' },
    { id: 7, title: 'Desk Lamp', imagelink: 'https://example.com/lamp.jpg', price: 40, quantity: 18, category: 'Home Decor' },
    { id: 8, title: 'Backpack', imagelink: 'https://example.com/backpack.jpg', price: 90, quantity: 22, category: 'Bags' },
    { id: 9, title: 'Monitor', imagelink: 'https://example.com/monitor.jpg', price: 300, quantity: 8, category: 'Electronics' }
  ];
  

export default function DataGridDemo() {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}
