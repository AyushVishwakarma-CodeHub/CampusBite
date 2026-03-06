import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_HOME = {
    student: '/student/dashboard',
    outlet: '/outlet/dashboard',
    admin: '/admin/dashboard',
};

/**
 * ProtectedRoute - wraps a route element with auth + role gating.
 * 
 * Props:
 *  element   - the JSX element to render when access is granted
 *  roles     - array of allowed roles, e.g. ['student'], or omit for any auth
 */
const ProtectedRoute = ({ element, roles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div className="spinner" />
            </div>
        );
    }

    // Not logged in at all → send to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Wrong role → send to their own dashboard
    if (roles && !roles.includes(user.role)) {
        return <Navigate to={ROLE_HOME[user.role] || '/'} replace />;
    }

    return element;
};

export default ProtectedRoute;
