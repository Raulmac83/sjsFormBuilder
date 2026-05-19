import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import PublishIcon from '@mui/icons-material/Publish';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import {
  createForm,
  createNewVersion,
  deleteForm,
  listForms,
  publishForm,
  renameForm,
  type FormDefinition,
} from '../store/forms';

const formatDate = (ts: number) =>
  new Date(ts).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

const countQuestions = (form: FormDefinition): number => {
  const pages = (form.json?.pages as Array<{ elements?: unknown[] }>) ?? [];
  return pages.reduce((sum, p) => sum + (p.elements?.length ?? 0), 0);
};

export default function FormsList() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [forms, setForms] = useState<FormDefinition[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'live'>('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [renaming, setRenaming] = useState<FormDefinition | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const refresh = () => setForms(listForms());
  useEffect(refresh, []);

  useEffect(() => {
    if (params.get('new') === '1') {
      setCreateOpen(true);
      params.delete('new');
      setParams(params, { replace: true });
    }
  }, [params, setParams]);

  const hasForms = useMemo(() => forms.length > 0, [forms]);

  const filteredForms = useMemo(() => {
    const query = search.trim().toLowerCase();
    return forms.filter((form) => {
      const matchesStatus = statusFilter === 'all' || form.status === statusFilter;
      if (!matchesStatus) return false;
      if (!query) return true;
      return form.name.toLowerCase().includes(query);
    });
  }, [forms, search, statusFilter]);

  const hasFilteredForms = filteredForms.length > 0;

  const handleCreate = () => {
    const form = createForm(newName);
    setNewName('');
    setCreateOpen(false);
    navigate(`/editor/${form.id}`);
  };

  const handleRename = () => {
    if (!renaming) return;
    renameForm(renaming.id, renameValue);
    setRenaming(null);
    setRenameValue('');
    refresh();
  };

  const handleDelete = (form: FormDefinition) => {
    if (confirm(`Delete "${form.name}"? This cannot be undone.`)) {
      deleteForm(form.id);
      refresh();
    }
  };

  const handlePublish = (form: FormDefinition) => {
    if (confirm(`Publish "${form.name}"? Once live it cannot be edited.`)) {
      publishForm(form.id);
      refresh();
    }
  };

  const handleNewVersion = (form: FormDefinition) => {
    const next = createNewVersion(form.id);
    if (next) navigate(`/editor/${next.id}`);
  };

  return (
    <Box sx={{ p: 4, overflow: 'auto', flex: 1 }}>
      <Stack
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Forms
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Define and edit forms with the SurveyJS visual builder.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
        >
          New form
        </Button>
      </Stack>

      {hasForms ? (
        <Stack spacing={2.5}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Stack
              sx={{
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'stretch', sm: 'center' },
                gap: 1.5,
                justifyContent: 'space-between',
              }}
            >
              <TextField
                size="small"
                label="Search forms"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by form name"
                sx={{ minWidth: { xs: '100%', sm: 320 } }}
              />

              <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                <Chip
                  label="All"
                  clickable
                  color={statusFilter === 'all' ? 'primary' : 'default'}
                  variant={statusFilter === 'all' ? 'filled' : 'outlined'}
                  onClick={() => setStatusFilter('all')}
                />
                <Chip
                  label="Draft"
                  clickable
                  color={statusFilter === 'draft' ? 'warning' : 'default'}
                  variant={statusFilter === 'draft' ? 'filled' : 'outlined'}
                  onClick={() => setStatusFilter('draft')}
                />
                <Chip
                  label="Live"
                  clickable
                  color={statusFilter === 'live' ? 'success' : 'default'}
                  variant={statusFilter === 'live' ? 'filled' : 'outlined'}
                  onClick={() => setStatusFilter('live')}
                />
              </Stack>
            </Stack>
          </Paper>

          {hasFilteredForms ? (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'stretch',
          }}
        >
          {filteredForms.map((form) => (
            <Paper
              key={form.id}
              variant="outlined"
              sx={{
                p: 2,
                minHeight: 180,
                flex: '1 1 320px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: 2,
              }}
            >
              <Stack spacing={1.25}>
                <Stack
                  sx={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 1,
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600 }}
                      noWrap
                      title={form.name}
                    >
                      {form.name}
                    </Typography>
                    {form.version > 1 && (
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Version {form.version}
                      </Typography>
                    )}
                  </Box>
                  {form.status === 'live' ? (
                    <Chip label="Live" color="success" size="small" />
                  ) : (
                    <Chip label="Draft" color="warning" size="small" variant="outlined" />
                  )}
                </Stack>

                <Stack spacing={0.5}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Questions: {countQuestions(form)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Updated: {formatDate(form.updatedAt)}
                  </Typography>
                </Stack>
              </Stack>

              <Stack
                sx={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mt: 1.5,
                }}
              >
                <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
                  {form.status === 'draft' ? (
                    <>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/editor/${form.id}`)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Rename">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setRenaming(form);
                            setRenameValue(form.name);
                          }}
                        >
                          <DriveFileRenameOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(form)}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </>
                  ) : (
                    <Tooltip title="Preview">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/preview/${form.id}`)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>

                {form.status === 'draft' ? (
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<PublishIcon />}
                    onClick={() => handlePublish(form)}
                  >
                    Publish
                  </Button>
                ) : (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => handleNewVersion(form)}
                  >
                    New version
                  </Button>
                )}
              </Stack>
            </Paper>
          ))}
        </Box>
          ) : (
            <Paper variant="outlined" sx={{ p: 5, textAlign: 'center', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                No matching forms
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                Try a different name or filter.
              </Typography>
              <Button
                variant="text"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('all');
                }}
              >
                Clear filters
              </Button>
            </Paper>
          )}
        </Stack>
      ) : (
        <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            No forms yet
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            Create your first form to start building with SurveyJS.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateOpen(true)}
          >
            Create a form
          </Button>
        </Paper>
      )}

      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>New form</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Form name"
            fullWidth
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreate();
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>
            Create & edit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(renaming)}
        onClose={() => setRenaming(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Rename form</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Form name"
            fullWidth
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename();
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenaming(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleRename}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

