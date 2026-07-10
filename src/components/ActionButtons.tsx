import { Button, Stack } from '@mui/material';

export default function ActionButtons() {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 2 }}>
      <Button variant="contained" sx={{ bgcolor: '#c62828', '&:hover': { bgcolor: '#8b1e1e' } }}>
        View Assets
      </Button>
      <Button variant="outlined" color="warning">
        Scale
      </Button>
      <Button variant="outlined" color="info">
        Investigate
      </Button>
    </Stack>
  );
}
