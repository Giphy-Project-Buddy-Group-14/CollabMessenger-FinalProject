import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PropTypes from 'prop-types';

export default function AuthenticatedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/signin"
        path={location.pathname}
      ></Navigate>
    );
  }
  return children;
}

AuthenticatedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
