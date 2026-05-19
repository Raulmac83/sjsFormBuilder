import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

export default function About() {
  return (
    <Box sx={{ p: 4, overflow: 'auto', flex: 1 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        About
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        A front-end proof of concept for building forms with SurveyJS.
      </Typography>

      <Stack spacing={2} sx={{ maxWidth: 720 }}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Stack
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Vite + React + TypeScript, MUI for the shell, SurveyJS Creator for
            authoring, SurveyJS UI for rendering.
          </Typography>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Storage
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Form definitions are saved in your browser's localStorage. There is
            no backend — clearing site data will erase your forms.
          </Typography>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            How to use
          </Typography>
          <Typography
            variant="body2"
            component="div"
            sx={{ color: 'text.secondary' }}
          >
            <ol style={{ margin: 0, paddingLeft: 18 }}>
              <li>Create a form from the Forms page.</li>
              <li>
                Use the SurveyJS visual builder, JSON editor, logic and
                translation tabs to edit it. Edits autosave.
              </li>
              <li>Preview to fill the form as an end user would.</li>
            </ol>
          </Typography>
        </Paper>
      </Stack>
    </Box>
  );
}
