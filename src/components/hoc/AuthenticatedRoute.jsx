import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { SIGNIN_PATH } from '../../common/routes';

export default function AuthenticatedRoute({ children }) {
  const location = useLocation();

  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirect to the sign-in page, and pass the current location in state
    return <Navigate to={SIGNIN_PATH} state={{ from: location }} replace />;
  }

  return children;
}

AuthenticatedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
