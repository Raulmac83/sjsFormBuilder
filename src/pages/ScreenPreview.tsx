import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ViewModuleOutlinedIcon from '@mui/icons-material/ViewModuleOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import 'survey-core/survey-core.css';
import { getScreen, type ScreenSlot } from '../store/screens';
import { getForm, type FormDefinition } from '../store/forms';

const slotTypeLabel = (slot: ScreenSlot) =>
  slot.type === 'single' ? 'Single form' : 'Grid';

const formatDate = (ts: number) =>
  new Date(ts).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

export default function ScreenPreview() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const screen = useMemo(() => getScreen(id), [id]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const slotsWithForms = useMemo(() => {
    if (!screen) return [];
    return screen.slots.map((slot) => ({
      ...slot,
      forms: slot.formIds.map((formId) => getForm(formId)).filter(Boolean),
    }));
  }, [screen]);

  useEffect(() => {
    if (!screen) return;
    setExpanded((prev) => {
      const next: Record<string, boolean> = {};
      screen.slots.forEach((slot) => {
        next[slot.id] = prev[slot.id] ?? true;
      });
      return next;
    });
  }, [screen]);

  const toggleSection = (slotId: string) => {
    setExpanded((prev) => ({ ...prev, [slotId]: !prev[slotId] }));
  };

  const setAllSections = (value: boolean) => {
    setExpanded(
      Object.fromEntries(slotsWithForms.map((slot) => [slot.id, value])) as Record<string, boolean>,
    );
  };

  const jumpToSection = (slotId: string) => {
    setExpanded((prev) => ({ ...prev, [slotId]: true }));
    const el = document.getElementById(`screen-slot-${slotId}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!screen) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">Screen not found</Typography>
        <Button onClick={() => navigate('/screens')} sx={{ mt: 2 }}>
          Back to screens
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <Stack
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          px: 3,
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Stack spacing={1.5} sx={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton onClick={() => navigate('/screens')} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {screen.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Screen preview
            </Typography>
          </Box>
        </Stack>
      </Stack>

      <Box sx={{ flex: 1, overflow: 'auto', p: { xs: 2, md: 3 } }}>
        <Stack spacing={2} sx={{ maxWidth: 1200, mx: 'auto' }}>
          {slotsWithForms.length === 0 ? (
            <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                No sections configured
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Add sections and assign forms in the screens builder first.
              </Typography>
            </Paper>
          ) : (
            <>
              <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                <Stack
                  sx={{
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'stretch', md: 'center' },
                    justifyContent: 'space-between',
                    gap: 1,
                  }}
                >
                  <Box sx={{ overflowX: 'auto', pb: 0.5 }}>
                    <Stack
                      sx={{
                        flexDirection: 'row',
                        flexWrap: { xs: 'nowrap', md: 'wrap' },
                        gap: 1,
                        minWidth: 'fit-content',
                      }}
                    >
                      {slotsWithForms.map((slot, index) => (
                        <Chip
                          key={`jump-${slot.id}`}
                          label={`${index + 1}. ${slot.name}`}
                          onClick={() => jumpToSection(slot.id)}
                          clickable
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </Box>
                  <Stack sx={{ flexDirection: 'row', gap: 1 }}>
                    <Button size="small" variant="text" onClick={() => setAllSections(true)}>
                      Expand all
                    </Button>
                    <Button size="small" variant="text" onClick={() => setAllSections(false)}>
                      Collapse all
                    </Button>
                  </Stack>
                </Stack>
              </Paper>

              {slotsWithForms.map((slot) => (
              <Paper
                key={slot.id}
                id={`screen-slot-${slot.id}`}
                variant="outlined"
                sx={{ p: 2, borderRadius: 2 }}
              >
                <Stack spacing={1.5}>
                  <Stack
                    sx={{
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      justifyContent: 'space-between',
                      gap: 1,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {slot.name}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        size="small"
                        icon={
                          slot.type === 'single' ? (
                            <ListAltOutlinedIcon />
                          ) : (
                            <ViewModuleOutlinedIcon />
                          )
                        }
                        label={slotTypeLabel(slot)}
                      />
                      <IconButton
                        size="small"
                        onClick={() => toggleSection(slot.id)}
                        title={expanded[slot.id] ? 'Collapse section' : 'Expand section'}
                      >
                        {expanded[slot.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Stack>
                  </Stack>

                  {expanded[slot.id] && (slot.forms.length === 0 ? (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      No forms assigned to this section.
                    </Typography>
                  ) : slot.type === 'single' ? (
                    <FormRenderer formId={slot.forms[0].id} />
                  ) : (
                    <GridSectionRuntime
                      slotId={slot.id}
                      sectionName={slot.name}
                      forms={slot.forms}
                    />
                  ))}
                </Stack>
              </Paper>
            ))}
            </>
          )}
        </Stack>
      </Box>
    </Box>
  );
}

function FormRenderer({ formId }: { formId: string }) {
  const form = useMemo(() => getForm(formId), [formId]);
  const model = useMemo(() => {
    if (!form) return null;
    return new Model(form.json);
  }, [form]);

  if (!form || !model) {
    return (
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Form not found.
      </Typography>
    );
  }

  return <Survey model={model} />;
}

type GridRecord = {
  id: string;
  formId: string;
  data: Record<string, unknown>;
  updatedAt: number;
};

function GridSectionRuntime({
  slotId,
  sectionName,
  forms,
}: {
  slotId: string;
  sectionName: string;
  forms: FormDefinition[];
}) {
  const theme = useTheme();
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down('sm'));
  const [records, setRecords] = useState<GridRecord[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeFormId, setActiveFormId] = useState<string>(forms[0]?.id ?? '');
  const [draftModel, setDraftModel] = useState<Model | null>(null);
  const [saveError, setSaveError] = useState('');

  const editingRecord = useMemo(
    () => records.find((r) => r.id === editingId),
    [records, editingId],
  );

  const fieldColumns = useMemo(() => {
    const keys = new Set<string>();
    records.forEach((record) => {
      Object.keys(record.data).forEach((k) => keys.add(k));
    });
    return Array.from(keys).slice(0, 5);
  }, [records]);

  useEffect(() => {
    if (!forms.length) {
      setActiveFormId('');
      return;
    }
    if (!forms.some((f) => f.id === activeFormId)) {
      setActiveFormId(forms[0].id);
    }
  }, [forms, activeFormId]);

  useEffect(() => {
    if (!open || !activeFormId) return;
    const form = getForm(activeFormId);
    if (!form) return;

    const model = new Model(form.json);
    if (editingRecord?.data) {
      model.data = structuredClone(editingRecord.data);
    }
    model.showCompleteButton = false;
    setDraftModel(model);
  }, [open, activeFormId, editingRecord]);

  const openCreate = () => {
    setEditingId(null);
    setSaveError('');
    setActiveFormId(forms[0]?.id ?? '');
    setOpen(true);
  };

  const openEdit = (record: GridRecord) => {
    setEditingId(record.id);
    setSaveError('');
    setActiveFormId(record.formId);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setSaveError('');
  };

  const handleSave = () => {
    if (!draftModel) return;
    const valid = draftModel.validate();
    if (!valid) {
      setSaveError('Please complete required fields before saving.');
      return;
    }

    const nextData = structuredClone(draftModel.data as Record<string, unknown>);
    const now = Date.now();
    if (editingRecord) {
      setRecords((prev) =>
        prev.map((r) =>
          r.id === editingRecord.id
            ? { ...r, data: nextData, formId: activeFormId, updatedAt: now }
            : r,
        ),
      );
    } else {
      setRecords((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          formId: activeFormId,
          data: nextData,
          updatedAt: now,
        },
      ]);
    }
    closeModal();
  };

  const renderCellValue = (value: unknown): string => {
    if (value == null) return '-';
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }
    if (Array.isArray(value)) {
      return value.map((v) => (typeof v === 'string' ? v : JSON.stringify(v))).join(', ');
    }
    return JSON.stringify(value);
  };

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, p: 1.5 }}>
      <Stack spacing={1.5}>
        <Stack
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'space-between',
            gap: 1,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Data Grid
          </Typography>
          <Button
            size="small"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreate}
            sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' } }}
          >
            Add New
          </Button>
        </Stack>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Form</TableCell>
                {fieldColumns.map((col) => (
                  <TableCell key={`${slotId}:${col}`}>{col}</TableCell>
                ))}
                <TableCell>Updated</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={fieldColumns.length + 3}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      No records yet for "{sectionName}".
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => {
                  const sourceForm = forms.find((f) => f.id === record.formId);
                  return (
                    <TableRow key={record.id} hover>
                      <TableCell>{sourceForm?.name ?? 'Unknown form'}</TableCell>
                      {fieldColumns.map((col) => (
                        <TableCell
                          key={`${record.id}:${col}`}
                          sx={{ maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                          title={renderCellValue(record.data[col])}
                        >
                          {renderCellValue(record.data[col])}
                        </TableCell>
                      ))}
                      <TableCell>{formatDate(record.updatedAt)}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => openEdit(record)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>

      <Dialog
        open={open}
        onClose={closeModal}
        fullWidth
        maxWidth="md"
        fullScreen={fullScreenDialog}
      >
        <DialogTitle>{editingRecord ? 'Edit record' : 'Add new record'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            {forms.length > 1 && (
              <TextField
                select
                label="Form"
                value={activeFormId}
                onChange={(e) => setActiveFormId(e.target.value)}
                SelectProps={{ native: true }}
                size="small"
                disabled={Boolean(editingRecord)}
              >
                {forms.map((form) => (
                  <option key={form.id} value={form.id}>
                    {form.name}
                  </option>
                ))}
              </TextField>
            )}

            {draftModel ? (
              <Survey model={draftModel} />
            ) : (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Form is not available.
              </Typography>
            )}

            {saveError && (
              <Typography variant="body2" color="error">
                {saveError}
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
