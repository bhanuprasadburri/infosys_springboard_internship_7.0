import { Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, MenuItem, Paper, Snackbar, Stack, TextField, Typography, TableCell } from '@mui/material';
import { useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import { useAppState } from '../context/AppStateContext';
import { useAuth, canPerformAction } from '../auth/AuthContext';
import type { Incident, IncidentNote } from '../types';

const teamOptions = [
  { team: 'Security Team', assignees: ['Ava Chen', 'Mina Patel'] },
  { team: 'Network Team', assignees: ['Daniel Kim', 'Luis Ortega'] },
  { team: 'Compliance Team', assignees: ['Priya Shah', 'Noah Brooks'] },
  { team: 'DevSecOps Team', assignees: ['Sara Ortiz', 'Ethan Cole'] },
];

const defaultSlaHours = (severity: Incident['severity']) => {
  if (severity === 'critical') return 2;
  if (severity === 'high') return 4;
  return 8;
};

export default function Incidents() {
  const { incidents, updateIncident, addAuditLog } = useAppState();
  const { user } = useAuth();
  const canAssign = canPerformAction(user, 'assign');
  const canResolve = canPerformAction(user, 'resolve');
  const canClose = canPerformAction(user, 'close');
  const canInvestigate = canPerformAction(user, 'assign') || canPerformAction(user, 'escalate');
  const canReview = canPerformAction(user, 'review');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [assignIncident, setAssignIncident] = useState<Incident | null>(null);
  const [team, setTeam] = useState('Security Team');
  const [assignee, setAssignee] = useState('Ava Chen');
  const [slaHours, setSlaHours] = useState(4);
  const [notes, setNotes] = useState('');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [toast, setToast] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  const summary = useMemo(() => {
    const active = incidents.filter((incident) => incident.status !== 'Resolved').length;
    const resolved = incidents.filter((incident) => incident.status === 'Resolved').length;
    return { active, resolved, mttr: '47 min' };
  }, [incidents]);

  const applyIncidentUpdate = (incidentId: string, updater: (incident: Incident) => Incident) => {
    const currentIncident = incidents.find((incident) => incident.id === incidentId) ?? selectedIncident;
    if (!currentIncident) return;
    const nextIncident = updater(currentIncident);
    updateIncident(incidentId, () => nextIncident);
    if (selectedIncident?.id === incidentId) {
      setSelectedIncident(nextIncident);
    }
  };

  const openInvestigate = (incident: Incident) => {
    setSelectedIncident(incident);
    if (incident.status === 'Open' && canInvestigate) {
      applyIncidentUpdate(incident.id, (current) => ({
        ...current,
        status: 'Investigation',
        activityLog: [...(current.activityLog ?? []), 'Opened investigation workflow'],
      }));
      addAuditLog({
        id: `AUD-${Date.now()}`,
        action: `Investigation started for ${incident.id}`,
        user: user?.fullName ?? 'Unknown',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString().slice(0, 10),
        source: 'Incidents',
      });
    }
  };

  const openAssignDialog = (incident: Incident) => {
    setAssignIncident(incident);
    setTeam(incident.assignedTeam || 'Security Team');
    setAssignee(incident.assignee || teamOptions.find((option) => option.team === (incident.assignedTeam || 'Security Team'))?.assignees[0] || 'Ava Chen');
    setSlaHours(incident.slaHours || defaultSlaHours(incident.severity));
  };

  const handleAssignConfirm = () => {
    if (!assignIncident) return;
    if (!canAssign) {
      setToast({ open: true, message: 'Permission denied: cannot assign incidents.' });
      return;
    }
    setLoadingAction(assignIncident.id);
    window.setTimeout(() => {
      const nextIncident = {
        ...assignIncident,
        assignedTeam: team,
        assignee,
        eta: `${slaHours}h`,
        slaHours,
        status: assignIncident.status === 'Resolved' ? 'Resolved' : assignIncident.status === 'Assigned' || assignIncident.status === 'Investigation' ? assignIncident.status : 'Assigned',
        activityLog: [...(assignIncident.activityLog ?? []), `Assigned to ${team} (${assignee}) — SLA: ${slaHours}h`],
      } as Incident;
      updateIncident(assignIncident.id, () => nextIncident);
      addAuditLog({
        id: `AUD-${Date.now()}`,
        action: `Assigned ${assignIncident.id} to ${team}`,
        user: user?.fullName ?? 'Unknown',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString().slice(0, 10),
        source: 'Incidents',
      });
      if (selectedIncident?.id === assignIncident.id) {
        setSelectedIncident(nextIncident);
      }
      setLoadingAction(null);
      setAssignIncident(null);
      setToast({ open: true, message: `✅ ${assignIncident.id} assigned to ${team}` });
    }, 1000);
  };

  const handleNoteAdd = () => {
    if (!selectedIncident || !notes.trim()) return;
    const note: IncidentNote = { id: `${Date.now()}`, text: notes.trim(), timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    applyIncidentUpdate(selectedIncident.id, (current) => ({
      ...current,
      notes: [...(current.notes ?? []), note],
      activityLog: [...(current.activityLog ?? []), `Note added: ${note.text}`],
    }));
    addAuditLog({
      id: `AUD-${Date.now()}`,
      action: `Note added to ${selectedIncident.id}`,
      user: user?.fullName ?? 'Unknown',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().slice(0, 10),
      source: 'Incidents',
    });
    setNotes('');
    setToast({ open: true, message: `📝 Note added to ${selectedIncident.id}` });
  };

  const handleActionExecute = (incident: Incident, action: string) => {
    if (!canReview) {
      setToast({ open: true, message: 'Permission denied: review actions are restricted.' });
      return;
    }
    setLoadingAction(`${incident.id}-${action}`);
    window.setTimeout(() => {
      applyIncidentUpdate(incident.id, (current) => ({
        ...current,
        activityLog: [...(current.activityLog ?? []), `✅ ${action} executed at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`],
      }));
      addAuditLog({
        id: `AUD-${Date.now()}`,
        action: `${action} executed for ${incident.id}`,
        user: user?.fullName ?? 'Unknown',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString().slice(0, 10),
        source: 'Incidents',
      });
      setLoadingAction(null);
      setToast({ open: true, message: `✅ ${action} executed for ${incident.id}` });
    }, 1000);
  };

  const resolveIncident = (incident: Incident) => {
    if (!canResolve) {
      setToast({ open: true, message: 'Permission denied: cannot resolve incidents.' });
      return;
    }
    setLoadingAction(`${incident.id}-resolve`);
    window.setTimeout(() => {
      applyIncidentUpdate(incident.id, (current) => ({
        ...current,
        status: 'Resolved',
        resolvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        activityLog: [...(current.activityLog ?? []), 'Resolved by incident workflow'],
      }));
      addAuditLog({
        id: `AUD-${Date.now()}`,
        action: `Resolved ${incident.id}`,
        user: user?.fullName ?? 'Unknown',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString().slice(0, 10),
        source: 'Incidents',
      });
      setLoadingAction(null);
      setSelectedIncident(null);
      setToast({ open: true, message: `✅ ${incident.id} marked as resolved` });
    }, 1000);
  };

  const closeIncident = (incident: Incident) => {
    if (!canClose) {
      setToast({ open: true, message: 'Permission denied: cannot close incidents.' });
      return;
    }
    setLoadingAction(`${incident.id}-close`);
    window.setTimeout(() => {
      applyIncidentUpdate(incident.id, (current) => ({
        ...current,
        status: 'Closed',
        activityLog: [...(current.activityLog ?? []), 'Closed by incident workflow'],
      }));
      addAuditLog({
        id: `AUD-${Date.now()}`,
        action: `Closed ${incident.id}`,
        user: user?.fullName ?? 'Unknown',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString().slice(0, 10),
        source: 'Incidents',
      });
      setLoadingAction(null);
      setSelectedIncident(null);
      setToast({ open: true, message: `✅ ${incident.id} closed successfully` });
    }, 1000);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#050b13', color: '#f5f7fa' }}>
      <TopBar />
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <Sidebar />
        <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>Incident Tracking & Resolution</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }, gap: 2, mb: 3 }}>
            <StatCard title="Active Incidents" value={summary.active.toString()} subtitle="Live" />
            <StatCard title="MTTR" value={summary.mttr} subtitle="Mean resolution" />
            <StatCard title="Resolved" value={summary.resolved.toString()} subtitle="This month" />
          </Box>
          <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>Workflow Stages</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              {['Open', 'Assigned', 'Investigation', 'Resolved'].map((stage) => <Chip key={stage} label={stage} color={stage === 'Resolved' ? 'success' : stage === 'Investigation' ? 'warning' : stage === 'Assigned' ? 'info' : 'error'} />)}
            </Stack>
          </Paper>
          <DataTable<Incident>
            title="Incidents"
            columns={['ID', 'Severity', 'Type', 'Source IP', 'Status', 'Assigned Team', 'SLA/ETA', 'Action']}
            rows={incidents}
            renderRow={(incident) => (
              <>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{incident.id}</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}><Chip label={incident.severity} color={incident.severity === 'critical' ? 'error' : incident.severity === 'high' ? 'warning' : 'success'} size="small" /></TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{incident.title}</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{incident.sourceIp}</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}><Chip label={incident.status} color={incident.status === 'Resolved' ? 'success' : incident.status === 'Assigned' ? 'warning' : incident.status === 'Investigation' ? 'info' : 'error'} size="small" /></TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{incident.assignedTeam}</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255.08)' }}>{incident.eta}</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}><Stack direction="row" spacing={1}><Button size="small" variant="outlined" onClick={() => openInvestigate(incident)} disabled={!canInvestigate}>Investigate</Button><Button size="small" variant="outlined" onClick={() => openAssignDialog(incident)} disabled={!canAssign}>Assign</Button></Stack></TableCell>
              </>
            )}
          />
        </Box>
      </Box>
      <Drawer anchor="right" open={Boolean(selectedIncident)} onClose={() => setSelectedIncident(null)}>
        <Box sx={{ width: { xs: '100vw', sm: 460 }, p: 3 }}>
          {selectedIncident && (
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="h6">{selectedIncident.id}</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Chip label={selectedIncident.severity} color={selectedIncident.severity === 'critical' || selectedIncident.severity === 'high' ? 'error' : selectedIncident.severity === 'medium' ? 'warning' : 'success'} size="small" />
                  <Chip label={selectedIncident.status} color={selectedIncident.status === 'Resolved' ? 'success' : selectedIncident.status === 'Investigation' ? 'info' : selectedIncident.status === 'Assigned' ? 'warning' : 'error'} size="small" />
                </Stack>
              </Box>
              <Box>
                <Typography variant="subtitle2">Incident</Typography>
                <Typography color="text.secondary">{selectedIncident.title}</Typography>
                <Typography color="text.secondary">Source: {selectedIncident.source ?? selectedIncident.sourceIp}</Typography>
                <Typography color="text.secondary">Affected asset: {selectedIncident.affectedAsset ?? 'Unknown'}</Typography>
                <Typography color="text.secondary">Affected user: {selectedIncident.affectedUser ?? 'Unknown'}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Workflow timeline</Typography>
                <Stack spacing={0.8} sx={{ mt: 1 }}>
                  {['Open', 'Assigned', 'Investigation', 'Resolved'].map((stage) => (
                    <Box key={stage} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: stage === selectedIncident.status || (stage === 'Investigation' && selectedIncident.status === 'Resolved') ? 'success.main' : stage === 'Investigation' ? 'warning.main' : 'info.main' }} />
                      <Typography variant="body2">{stage}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
              <Box>
                <Typography variant="subtitle2">Investigation notes</Typography>
                <TextField fullWidth multiline minRows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add investigation notes" sx={{ mt: 1 }} />
                <Button variant="outlined" sx={{ mt: 1 }} onClick={handleNoteAdd}>Add Note</Button>
                <Stack spacing={1} sx={{ mt: 1.5 }}>
                  {(selectedIncident.notes ?? []).map((note) => (
                    <Paper key={note.id} sx={{ p: 1, bgcolor: 'rgba(255,255,255,0.04)' }}>
                      <Typography variant="body2">{note.text}</Typography>
                      <Typography variant="caption" color="text.secondary">{note.timestamp}</Typography>
                    </Paper>
                  ))}
                </Stack>
              </Box>
              <Box>
                <Typography variant="subtitle2">Recommended actions</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                  {(selectedIncident.recommendedActions ?? []).map((action) => (
                    <Button key={action} size="small" variant="outlined" onClick={() => handleActionExecute(selectedIncident, action)} disabled={!canReview || Boolean(loadingAction && loadingAction.startsWith(`${selectedIncident.id}-`))}>
                      {loadingAction === `${selectedIncident.id}-${action}` ? <CircularProgress size={14} sx={{ mr: 1 }} /> : null}
                      {action}
                    </Button>
                  ))}
                </Stack>
              </Box>
              <Box>
                <Typography variant="subtitle2">Activity log</Typography>
                <Stack spacing={0.8} sx={{ mt: 1 }}>
                  {(selectedIncident.activityLog ?? []).map((entry) => (
                    <Typography key={entry} variant="body2" color="text.secondary">• {entry}</Typography>
                  ))}
                </Stack>
              </Box>
              {selectedIncident.status === 'Resolved' ? (
                <Button variant="contained" color="success" onClick={() => closeIncident(selectedIncident)} disabled={!canClose || Boolean(loadingAction && loadingAction === `${selectedIncident.id}-close`)}>
                  {loadingAction === `${selectedIncident.id}-close` ? <CircularProgress size={16} sx={{ mr: 1 }} /> : null}
                  Close Incident
                </Button>
              ) : (
                <Button variant="contained" color="success" onClick={() => resolveIncident(selectedIncident)} disabled={!canResolve || Boolean(loadingAction && loadingAction === `${selectedIncident.id}-resolve`)}>
                  {loadingAction === `${selectedIncident.id}-resolve` ? <CircularProgress size={16} sx={{ mr: 1 }} /> : null}
                  Mark as Resolved
                </Button>
              )}
            </Stack>
          )}
        </Box>
      </Drawer>
      <Dialog open={Boolean(assignIncident)} onClose={() => !loadingAction && setAssignIncident(null)}>
        <DialogTitle>Assign Incident — {assignIncident?.id}</DialogTitle>
        <DialogContent>
          {assignIncident && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField select label="Team" value={team} onChange={(e) => { const nextTeam = e.target.value; setTeam(nextTeam); const selected = teamOptions.find((option) => option.team === nextTeam); setAssignee(selected?.assignees[0] || ''); }}>
                {teamOptions.map((option) => <MenuItem key={option.team} value={option.team}>{option.team}</MenuItem>)}
              </TextField>
              <TextField select label="Assignee" value={assignee} onChange={(e) => setAssignee(e.target.value)}>
                {(teamOptions.find((option) => option.team === team)?.assignees || []).map((name) => <MenuItem key={name} value={name}>{name}</MenuItem>)}
              </TextField>
              <TextField label="SLA / ETA" type="number" value={slaHours} onChange={(e) => setSlaHours(Number(e.target.value))} />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignIncident(null)} disabled={Boolean(loadingAction)} >Cancel</Button>
          <Button onClick={handleAssignConfirm} variant="contained" disabled={Boolean(loadingAction)}>
            {loadingAction === assignIncident?.id ? <CircularProgress size={16} sx={{ mr: 1 }} /> : null}
            Confirm Assignment
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast((prev) => ({ ...prev, open: false }))} message={toast.message} />
    </Box>
  );
}
