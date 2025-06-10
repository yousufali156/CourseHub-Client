import { useContext } from "react";
import AuthContext from "../FirebaseAuthContext/AuthContext";
import { useLocation } from "react-router";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (user) {
        return children;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
};