import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import Dashboard from '../pages/Dashboard';
import PrivateRoute from './PrivateRoute'; // Assuming this is a custom route guard component

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Route for Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Private Route for Dashboard */}
      <Route path="/dashboard" element={<PrivateRoute />}>
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
