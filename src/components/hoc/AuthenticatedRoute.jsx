import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import useFirebaseAuth from '../../hooks/useFirebaseAuth';

export default function AuthenticatedRoute({ children }) {
  const location = useLocation();

  const { isAuthenticated, loading } = useFirebaseAuth();

  if (loading) {
    return;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" path={location.pathname}></Navigate>;
  }
  return children;
}

AuthenticatedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
