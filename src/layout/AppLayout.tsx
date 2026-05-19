import { useMemo } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import ButtonBase from '@mui/material/ButtonBase';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const RAIL_WIDTH = 84;

type RailItem = {
  to: string;
  label: string;
  icon: React.ReactNode;
  match?: (pathname: string) => boolean;
};

const items: RailItem[] = [
  {
    to: '/forms',
    label: 'Forms',
    icon: <DescriptionOutlinedIcon />,
    match: (p) => p === '/' || p.startsWith('/forms') || p.startsWith('/editor') || p.startsWith('/preview'),
  },
  {
    to: '/forms?new=1',
    label: 'New',
    icon: <AddCircleOutlineIcon />,
    match: () => false,
  },
  {
    to: '/screens',
    label: 'Screens',
    icon: <ViewKanbanOutlinedIcon />,
    match: (p) => p.startsWith('/screens'),
  },
  {
    to: '/about',
    label: 'About',
    icon: <InfoOutlinedIcon />,
    match: (p) => p.startsWith('/about'),
  },
];

const NavRailItem = ({ item, active }: { item: RailItem; active: boolean }) => (
  <Tooltip title={item.label} placement="right" arrow>
    <ButtonBase
      component={NavLink}
      to={item.to}
      sx={{
        width: '100%',
        py: 1.25,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.5,
        color: active ? 'primary.main' : 'text.secondary',
        borderLeft: '3px solid',
        borderLeftColor: active ? 'primary.main' : 'transparent',
        bgcolor: active ? 'action.selected' : 'transparent',
        '&:hover': { bgcolor: 'action.hover' },
        textDecoration: 'none',
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 32,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: active ? 'primary.main' : 'transparent',
          color: active ? 'primary.contrastText' : 'inherit',
        }}
      >
        {item.icon}
      </Box>
      <Typography variant="caption" sx={{ fontSize: 11, lineHeight: 1.1 }}>
        {item.label}
      </Typography>
    </ButtonBase>
  </Tooltip>
);

export default function AppLayout() {
  const location = useLocation();
  const path = location.pathname;

  const activeIndex = useMemo(
    () => items.findIndex((item) => item.match?.(path)),
    [path],
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: RAIL_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: RAIL_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
            overflowX: 'hidden',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 1.5,
            gap: 0.25,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            SJS
          </Box>
          <Typography variant="caption" sx={{ fontSize: 10 }}>
            Builder
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1 }}>
          {items.map((item, i) => (
            <NavRailItem key={item.label} item={item} active={i === activeIndex} />
          ))}
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
