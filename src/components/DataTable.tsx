import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

interface DataTableProps<T> {
  title: string;
  columns: string[];
  rows: T[];
  renderRow: (row: T) => React.ReactNode;
}

export default function DataTable<T>({ title, columns, rows, renderRow }: DataTableProps<T>) {
  return (
    <Paper elevation={0} sx={{ p: 2.5, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
      <Typography variant="h6" sx={{ color: '#f5f7fa', mb: 1.5 }}>
        {title}
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column} sx={{ color: '#98a7b7', borderColor: 'rgba(255,255,255,0.08)' }}>{column}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>{renderRow(row)}</TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
