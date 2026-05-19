import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import FormsList from './pages/FormsList';
import FormEditor from './pages/FormEditor';
import FormPreview from './pages/FormPreview';
import ScreensList from './pages/ScreensList';
import ScreenPreview from './pages/ScreenPreview';
import About from './pages/About';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/forms" replace />} />
        <Route path="/forms" element={<FormsList />} />
        <Route path="/screens" element={<ScreensList />} />
        <Route path="/screens/preview/:id" element={<ScreenPreview />} />
        <Route path="/editor/:id" element={<FormEditor />} />
        <Route path="/preview/:id" element={<FormPreview />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/forms" replace />} />
      </Route>
    </Routes>
  );
}
