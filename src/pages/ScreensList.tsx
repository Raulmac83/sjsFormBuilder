import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ViewModuleOutlinedIcon from '@mui/icons-material/ViewModuleOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import {
  addScreenSlot,
  createScreen,
  deleteScreen,
  listScreens,
  removeScreenSlot,
  renameScreen,
  updateScreenSlot,
  type ScreenDefinition,
  type ScreenSlot,
  type ScreenSlotType,
} from '../store/screens';
import { listForms, type FormDefinition } from '../store/forms';

const formatDate = (ts: number) =>
  new Date(ts).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

const typeLabel = (type: ScreenSlotType) => (type === 'single' ? 'Single form' : 'Grid');

export default function ScreensList() {
  const navigate = useNavigate();
  const [screens, setScreens] = useState<ScreenDefinition[]>(() => listScreens());
  const [forms] = useState<FormDefinition[]>(() => listForms());
  const [activeScreenId, setActiveScreenId] = useState<string>('');

  const [createOpen, setCreateOpen] = useState(false);
  const [newScreenName, setNewScreenName] = useState('');
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState('');

  const [newSlotName, setNewSlotName] = useState('');
  const [newSlotType, setNewSlotType] = useState<ScreenSlotType>('single');

  const refresh = () => setScreens(listScreens());

  const activeScreen = useMemo(
    () => screens.find((s) => s.id === activeScreenId) ?? screens[0],
    [screens, activeScreenId],
  );

  const liveForms = useMemo(() => forms.filter((f) => f.status === 'live'), [forms]);
  const selectableForms = liveForms.length > 0 ? liveForms : forms;

  const selectedCount = (screen: ScreenDefinition) =>
    screen.slots.reduce((sum, slot) => sum + slot.formIds.length, 0);

  const handleCreateScreen = () => {
    const created = createScreen(newScreenName);
    setNewScreenName('');
    setCreateOpen(false);
    refresh();
    setActiveScreenId(created.id);
  };

  const handleRenameScreen = () => {
    if (!activeScreen) return;
    renameScreen(activeScreen.id, renameValue);
    setRenameOpen(false);
    setRenameValue('');
    refresh();
  };

  const handleDeleteScreen = (screen: ScreenDefinition) => {
    if (confirm(`Delete screen "${screen.name}"?`)) {
      deleteScreen(screen.id);
      refresh();
      if (activeScreenId === screen.id) {
        setActiveScreenId('');
      }
    }
  };

  const handleAddSlot = () => {
    if (!activeScreen) return;
    addScreenSlot(activeScreen.id, {
      name: newSlotName,
      type: newSlotType,
    });
    setNewSlotName('');
    setNewSlotType('single');
    refresh();
  };

  const setSlotType = (slot: ScreenSlot, type: ScreenSlotType) => {
    if (!activeScreen) return;
    updateScreenSlot(activeScreen.id, slot.id, { type });
    refresh();
  };

  const toggleFormSelection = (slot: ScreenSlot, formId: string) => {
    if (!activeScreen) return;
    const has = slot.formIds.includes(formId);

    if (slot.type === 'single') {
      updateScreenSlot(activeScreen.id, slot.id, {
        formIds: has ? [] : [formId],
      });
      refresh();
      return;
    }

    const next = has
      ? slot.formIds.filter((id) => id !== formId)
      : [...slot.formIds, formId];
    updateScreenSlot(activeScreen.id, slot.id, { formIds: next });
    refresh();
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
            Screens
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Build screens by composing forms as single blocks or one-to-many grids.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
          New screen
        </Button>
      </Stack>

      {screens.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            No screens yet
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            Create a screen and assign forms as single or grid sections.
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
            Create screen
          </Button>
        </Paper>
      ) : (
        <Stack spacing={2.5}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {screens.map((screen) => {
              const active = activeScreen?.id === screen.id;
              return (
                <Paper
                  key={screen.id}
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    cursor: 'pointer',
                    minWidth: 260,
                    flex: '1 1 260px',
                    borderColor: active ? 'primary.main' : 'divider',
                    bgcolor: active ? 'action.selected' : 'background.paper',
                  }}
                  onClick={() => setActiveScreenId(screen.id)}
                >
                  <Stack spacing={1}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {screen.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Sections: {screen.slots.length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Assigned forms: {selectedCount(screen)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                      Updated: {formatDate(screen.updatedAt)}
                    </Typography>
                  </Stack>
                </Paper>
              );
            })}
          </Box>

          {activeScreen && (
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
              <Stack spacing={2}>
                <Stack
                  sx={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {activeScreen.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Configure sections as single (one form) or grid (many forms).
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      onClick={() => navigate(`/screens/preview/${activeScreen.id}`)}
                    >
                      Preview
                    </Button>
                    <Tooltip title="Rename screen">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setRenameValue(activeScreen.name);
                          setRenameOpen(true);
                        }}
                      >
                        <DriveFileRenameOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete screen">
                      <IconButton size="small" onClick={() => handleDeleteScreen(activeScreen)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>

                <Divider />

                <Stack
                  sx={{
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'stretch', md: 'center' },
                    gap: 1.25,
                  }}
                >
                  <TextField
                    size="small"
                    label="Section name"
                    value={newSlotName}
                    onChange={(e) => setNewSlotName(e.target.value)}
                    sx={{ flex: 1 }}
                  />
                  <Stack direction="row" spacing={1}>
                    <Chip
                      icon={<ListAltOutlinedIcon />}
                      label="Single"
                      clickable
                      color={newSlotType === 'single' ? 'primary' : 'default'}
                      variant={newSlotType === 'single' ? 'filled' : 'outlined'}
                      onClick={() => setNewSlotType('single')}
                    />
                    <Chip
                      icon={<ViewModuleOutlinedIcon />}
                      label="Grid"
                      clickable
                      color={newSlotType === 'grid' ? 'primary' : 'default'}
                      variant={newSlotType === 'grid' ? 'filled' : 'outlined'}
                      onClick={() => setNewSlotType('grid')}
                    />
                  </Stack>
                  <Button variant="contained" onClick={handleAddSlot}>
                    Add section
                  </Button>
                </Stack>

                {activeScreen.slots.length === 0 ? (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    No sections yet. Add one above.
                  </Typography>
                ) : (
                  <Stack spacing={2}>
                    {activeScreen.slots.map((slot) => (
                      <Paper key={slot.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Stack spacing={1.5}>
                          <Stack
                            sx={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: 1,
                            }}
                          >
                            <TextField
                              size="small"
                              label="Section name"
                              value={slot.name}
                              onChange={(e) => {
                                if (!activeScreen) return;
                                updateScreenSlot(activeScreen.id, slot.id, {
                                  name: e.target.value,
                                });
                                refresh();
                              }}
                              sx={{ flex: 1 }}
                            />
                            <Stack direction="row" spacing={1}>
                              <Chip
                                size="small"
                                icon={<ListAltOutlinedIcon />}
                                label="Single"
                                clickable
                                color={slot.type === 'single' ? 'primary' : 'default'}
                                variant={slot.type === 'single' ? 'filled' : 'outlined'}
                                onClick={() => setSlotType(slot, 'single')}
                              />
                              <Chip
                                size="small"
                                icon={<ViewModuleOutlinedIcon />}
                                label="Grid"
                                clickable
                                color={slot.type === 'grid' ? 'primary' : 'default'}
                                variant={slot.type === 'grid' ? 'filled' : 'outlined'}
                                onClick={() => setSlotType(slot, 'grid')}
                              />
                              <Tooltip title="Remove section">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    if (!activeScreen) return;
                                    removeScreenSlot(activeScreen.id, slot.id);
                                    refresh();
                                  }}
                                >
                                  <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </Stack>

                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {typeLabel(slot.type)}: {slot.type === 'single' ? 'Pick one form' : 'Pick one or many forms'}
                          </Typography>

                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {selectableForms.length === 0 ? (
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                No forms available yet. Create forms first.
                              </Typography>
                            ) : (
                              selectableForms.map((form) => {
                                const selected = slot.formIds.includes(form.id);
                                return (
                                  <Chip
                                    key={`${slot.id}:${form.id}`}
                                    label={form.name}
                                    clickable
                                    color={selected ? 'primary' : 'default'}
                                    variant={selected ? 'filled' : 'outlined'}
                                    onClick={() => toggleFormSelection(slot, form.id)}
                                  />
                                );
                              })
                            )}
                          </Box>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                )}
              </Stack>
            </Paper>
          )}
        </Stack>
      )}

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>New screen</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Screen name"
            fullWidth
            value={newScreenName}
            onChange={(e) => setNewScreenName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateScreen();
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateScreen}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={renameOpen} onClose={() => setRenameOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Rename screen</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Screen name"
            fullWidth
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRenameScreen();
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleRenameScreen}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
