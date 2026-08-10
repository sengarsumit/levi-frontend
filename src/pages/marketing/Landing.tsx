import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';
import { Box } from '@mui/material';
import type { RootState } from '../../app/store';
import { LandingNavbar } from '../../components/marketing/LandingNavbar';
import { HeroSection } from '../../components/marketing/HeroSection';
import { FeatureGrid } from '../../components/marketing/FeatureGrid';
import { RoadmapSection } from '../../components/marketing/RoadmapSection';
import { LandingFooter } from '../../components/marketing/LandingFooter';

export default function Landing() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <LandingNavbar />
      <HeroSection />
      <FeatureGrid />
      <RoadmapSection />
      <LandingFooter />
    </Box>
  );
}
