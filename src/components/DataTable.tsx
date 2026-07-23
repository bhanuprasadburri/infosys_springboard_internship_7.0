import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

interface DataTableProps<T> {
  title: string;
  columns: string[];
  rows: T[];
  renderRow: (row: T) => React.ReactNode;
  emptyText?: string;
  footer?: React.ReactNode;
}

export default function DataTable<T>({ title, columns, rows, renderRow, emptyText = 'No records found', footer }: DataTableProps<T>) {
  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 2.5 }, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 3, boxShadow: '0 10px 24px rgba(15,23,42,0.04)' }}>
      <Typography variant="h6" sx={{ color: 'text.primary', mb: 1.5, fontWeight: 700 }}>
        {title}
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column}>{column}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} sx={{ color: 'text.secondary', py: 4, textAlign: 'center' }}>
                  {emptyText}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                <TableRow key={index} sx={{ '&:hover': { bgcolor: 'background.secondary' } }}>{renderRow(row)}</TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {footer ? <Box sx={{ mt: 2 }}>{footer}</Box> : null}
    </Paper>
  );
}
