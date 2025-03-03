import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute: React.FC = (): JSX.Element => {
    const token: string | null = localStorage.getItem("accessToken");  // Check if the user is authenticated

    return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
