import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Student
import StudentDashboard from './pages/StudentDashboard';
import OutletMenu from './pages/OutletMenu';
import Checkout from './pages/Checkout';
import StudentOrders from './pages/StudentOrders';

// Outlet
import OutletDashboard from './pages/OutletDashboard';
import CreateOutlet from './pages/CreateOutlet';
import OutletOrders from './pages/OutletOrders';
import OutletMenuManager from './pages/OutletMenuManager';
import OutletFeedback from './pages/OutletFeedback';

// Admin
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="app-container">
            <main>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />

                {/* Student Routes */}
                <Route path="/student/dashboard" element={<ProtectedRoute roles={['student']} element={<StudentDashboard />} />} />
                <Route path="/outlet/:outletId" element={<ProtectedRoute roles={['student']} element={<OutletMenu />} />} />
                <Route path="/checkout" element={<ProtectedRoute roles={['student']} element={<Checkout />} />} />
                <Route path="/student/orders" element={<ProtectedRoute roles={['student']} element={<StudentOrders />} />} />

                {/* Outlet Routes */}
                <Route path="/outlet/dashboard" element={<ProtectedRoute roles={['outlet']} element={<OutletDashboard />} />} />
                <Route path="/outlet/create" element={<ProtectedRoute roles={['outlet']} element={<CreateOutlet />} />} />
                <Route path="/outlet/orders" element={<ProtectedRoute roles={['outlet']} element={<OutletOrders />} />} />
                <Route path="/outlet/manage-menu" element={<ProtectedRoute roles={['outlet']} element={<OutletMenuManager />} />} />
                <Route path="/outlet/feedback" element={<ProtectedRoute roles={['outlet']} element={<OutletFeedback />} />} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']} element={<AdminDashboard />} />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
