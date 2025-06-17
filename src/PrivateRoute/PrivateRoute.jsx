import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "../FirebaseAuthContext/AuthContext";
import LoadingSpinner from "../Components/LoadingSpinner";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // 🔄 Show loading spinner while auth state is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  // ✅ If user is authenticated, allow access
  if (user) {
    return children;
  }

  // 🔐 If not authenticated, redirect to login and preserve current location
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
