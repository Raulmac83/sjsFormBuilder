import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PublishIcon from '@mui/icons-material/Publish';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { SurveyCreator, SurveyCreatorComponent } from 'survey-creator-react';
import 'survey-core/survey-core.css';
import 'survey-creator-core/survey-creator-core.css';
import { createNewVersion, getForm, publishForm, saveFormJson } from '../store/forms';

export default function FormEditor() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(() => getForm(id));
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [toast, setToast] = useState(false);

  const isDraft = form?.status === 'draft';

  const creator = useMemo(() => {
    const c = new SurveyCreator({
      showLogicTab: true,
      showJSONEditorTab: true,
      showTranslationTab: true,
      isAutoSave: true,
    });
    return c;
  }, []);

  useEffect(() => {
    if (!form || !isDraft) return;
    creator.JSON = form.json;
    creator.saveSurveyFunc = (saveNo: number, callback: (n: number, ok: boolean) => void) => {
      saveFormJson(form.id, creator.JSON as Record<string, unknown>);
      setSavedAt(Date.now());
      setToast(true);
      callback(saveNo, true);
    };
  }, [form, creator, isDraft]);

  const handlePublish = () => {
    if (!form) return;
    if (confirm(`Publish "${form.name}"? Once live it cannot be edited.`)) {
      publishForm(form.id);
      setForm(getForm(form.id));
    }
  };

  const handleNewVersion = () => {
    if (!form) return;
    const next = createNewVersion(form.id);
    if (next) navigate(`/editor/${next.id}`);
  };

  if (!form) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">Form not found</Typography>
        <Button onClick={() => navigate('/forms')} sx={{ mt: 2 }}>
          Back to forms
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      {/* Header */}
      <Stack
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Stack spacing={1.5} sx={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton onClick={() => navigate('/forms')} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Stack spacing={1} sx={{ flexDirection: 'row', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {form.name}
              </Typography>
              {form.version > 1 && (
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                  v{form.version}
                </Typography>
              )}
              {form.status === 'live' ? (
                <Chip label="Live" color="success" size="small" />
              ) : (
                <Chip label="Draft" color="warning" size="small" variant="outlined" />
              )}
            </Stack>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {isDraft
                ? 'SurveyJS editor — autosaves to your browser'
                : 'This form is published and read-only'}
            </Typography>
          </Box>
        </Stack>

        <Stack spacing={1.5} sx={{ flexDirection: 'row', alignItems: 'center' }}>
          {isDraft && savedAt && (
            <Chip
              size="small"
              color="success"
              variant="outlined"
              label={`Saved ${new Date(savedAt).toLocaleTimeString()}`}
            />
          )}
          <Button
            variant="outlined"
            startIcon={<VisibilityIcon />}
            onClick={() => navigate(`/preview/${form.id}`)}
          >
            Preview
          </Button>
          {isDraft ? (
            <Button
              variant="contained"
              color="primary"
              startIcon={<PublishIcon />}
              onClick={handlePublish}
            >
              Publish
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleNewVersion}
            >
              New version
            </Button>
          )}
        </Stack>
      </Stack>

      {/* Live form banner */}
      {!isDraft && (
        <Alert
          severity="info"
          sx={{ borderRadius: 0, borderBottom: '1px solid', borderColor: 'divider' }}
          action={
            <Button size="small" startIcon={<AddCircleOutlineIcon />} onClick={handleNewVersion}>
              New version
            </Button>
          }
        >
          This form is <strong>live</strong> and cannot be edited. Create a new version to make
          changes — it will start as a draft until you publish it.
        </Alert>
      )}

      {/* Editor — only for drafts */}
      {isDraft && (
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <SurveyCreatorComponent creator={creator} />
        </Box>
      )}

      {/* Locked state for live forms */}
      {!isDraft && (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2,
            color: 'text.secondary',
          }}
        >
          <Typography variant="h6">Form is live</Typography>
          <Typography variant="body2">
            Preview it or create a new draft version to continue editing.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<VisibilityIcon />}
              onClick={() => navigate(`/preview/${form.id}`)}
            >
              Preview
            </Button>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleNewVersion}
            >
              New version
            </Button>
          </Stack>
        </Box>
      )}

      <Snackbar
        open={toast}
        autoHideDuration={1500}
        onClose={() => setToast(false)}
        message="Form saved"
      />
    </Box>
  );
}
