import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import 'survey-core/survey-core.css';
import { getForm } from '../store/forms';

export default function FormPreview() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const form = useMemo(() => getForm(id), [id]);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  const survey = useMemo(() => {
    if (!form) return null;
    const model = new Model(form.json);
    model.onComplete.add((sender) => {
      setResult(sender.data);
    });
    return model;
  }, [form]);

  if (!form || !survey) {
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
        <Stack
          spacing={1.5}
          sx={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <IconButton onClick={() => navigate('/forms')} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {form.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Preview — responses are not persisted
            </Typography>
          </Box>
        </Stack>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/editor/${form.id}`)}
        >
          Back to editor
        </Button>
      </Stack>

      <Box sx={{ flex: 1, overflow: 'auto', p: { xs: 2, md: 4 } }}>
        <Box sx={{ maxWidth: 880, mx: 'auto' }}>
          <Paper variant="outlined" sx={{ p: { xs: 1, md: 2 } }}>
            <Survey model={survey} />
          </Paper>

          {result && (
            <Paper variant="outlined" sx={{ mt: 3, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Submitted data
              </Typography>
              <Box
                component="pre"
                sx={{
                  m: 0,
                  p: 2,
                  bgcolor: 'grey.100',
                  borderRadius: 1,
                  fontSize: 13,
                  overflow: 'auto',
                }}
              >
                {JSON.stringify(result, null, 2)}
              </Box>
              <Button
                size="small"
                sx={{ mt: 1 }}
                onClick={() => {
                  survey.clear();
                  setResult(null);
                }}
              >
                Reset
              </Button>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
}
