import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AppLayout } from './components/layout/AppLayout';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

// Resident Pages
import { ResidentDashboard } from './pages/resident/ResidentDashboard';
import { ResidentComplaints } from './pages/resident/ResidentComplaints';
import { ResidentAmenities } from './pages/resident/ResidentAmenities';
import { ResidentBills } from './pages/resident/ResidentBills';
import { ResidentVisitors } from './pages/resident/ResidentVisitors';
import { ResidentDeliveries } from './pages/resident/ResidentDeliveries';
import { ResidentAnnouncements } from './pages/resident/ResidentAnnouncements';
import { ResidentProfile } from './pages/resident/ResidentProfile';

// Staff Pages
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { StaffTasksPage } from './pages/staff/StaffTasksPage';
import { MaterialRequestsPage } from './pages/staff/MaterialRequestsPage';
import { StaffProfilePage } from './pages/staff/StaffProfilePage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ResidentManagement } from './pages/admin/ResidentManagement';
import { ComplaintManagement } from './pages/admin/ComplaintManagement';
import { StaffManagement } from './pages/admin/StaffManagement';
import { InventoryManagement } from './pages/admin/InventoryManagement';
import { FacilitiesManagement } from './pages/admin/FacilitiesManagement';
import { BillsManagement } from './pages/admin/BillsManagement';
import { VisitorDeliveryAdmin } from './pages/admin/VisitorDeliveryAdmin';
import { AnnouncementsAdmin } from './pages/admin/AnnouncementsAdmin';
import { SettingsPage } from './pages/admin/SettingsPage';

const RouterContent: React.FC = () => {
    const { isAuthenticated, currentUser } = useAuth();
    const [currentPath, setCurrentPath] = useState<string>(window.location.pathname || '/');

    const handleNavigate = (path: string) => {
        setCurrentPath(path);
        window.history.pushState({}, '', path);
    };

    // Listen to browser Back/Forward buttons
    React.useEffect(() => {
        const onPopState = () => setCurrentPath(window.location.pathname);
        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, []);

    // Handle Unauthenticated State & Auth routes
    if (!isAuthenticated) {
        if (currentPath === '/forgot-password') {
            return <ForgotPasswordPage onNavigate={handleNavigate} />;
        }
        if (currentPath === '/reset-password') {
            return <ResetPasswordPage onNavigate={handleNavigate} />;
        }
        return <LoginPage onNavigate={handleNavigate} />;
    }

    // Helper to render role-based active page view
    const renderActivePage = () => {
        const role = currentUser.role;

        // RESIDENT ROUTES
        if (role === 'resident') {
            switch (currentPath) {
                case '/resident/complaints':
                    return <ResidentComplaints onNavigate={handleNavigate} />;
                case '/resident/amenities':
                    return <ResidentAmenities onNavigate={handleNavigate} />;
                case '/resident/bills':
                    return <ResidentBills onNavigate={handleNavigate} />;
                case '/resident/visitors':
                    return <ResidentVisitors onNavigate={handleNavigate} />;
                case '/resident/deliveries':
                    return <ResidentDeliveries onNavigate={handleNavigate} />;
                case '/resident/announcements':
                    return <ResidentAnnouncements onNavigate={handleNavigate} />;
                case '/resident/profile':
                    return <ResidentProfile onNavigate={handleNavigate} />;
                default:
                    return <ResidentDashboard onNavigate={handleNavigate} />;
            }
        }

        // STAFF / WORKER ROUTES
        if (role === 'staff') {
            switch (currentPath) {
                case '/staff/tasks':
                    return <StaffTasksPage onNavigate={handleNavigate} />;
                case '/staff/requests':
                    return <MaterialRequestsPage onNavigate={handleNavigate} />;
                case '/staff/profile':
                    return <StaffProfilePage onNavigate={handleNavigate} />;
                default:
                    return <StaffDashboard onNavigate={handleNavigate} />;
            }
        }

        // COMMITTEE / ADMIN ROUTES
        if (role === 'admin') {
            switch (currentPath) {
                case '/admin/residents':
                    return <ResidentManagement onNavigate={handleNavigate} />;
                case '/admin/complaints':
                    return <ComplaintManagement onNavigate={handleNavigate} />;
                case '/admin/staff':
                    return <StaffManagement onNavigate={handleNavigate} />;
                case '/admin/inventory':
                    return <InventoryManagement onNavigate={handleNavigate} />;
                case '/admin/facilities':
                    return <FacilitiesManagement onNavigate={handleNavigate} />;
                case '/admin/bills':
                    return <BillsManagement onNavigate={handleNavigate} />;
                case '/admin/visitors':
                    return <VisitorDeliveryAdmin onNavigate={handleNavigate} />;
                case '/admin/announcements':
                    return <AnnouncementsAdmin onNavigate={handleNavigate} />;
                case '/admin/settings':
                    return <SettingsPage onNavigate={handleNavigate} />;
                default:
                    return <AdminDashboard onNavigate={handleNavigate} />;
            }
        }

        return <ResidentDashboard onNavigate={handleNavigate} />;
    };

    return (
        <AppLayout currentPath={currentPath} onNavigate={handleNavigate}>
            {renderActivePage()}
        </AppLayout>
    );
};

export const App: React.FC = () => {
    return (
        <ThemeProvider>
            <ToastProvider>
                <AuthProvider>
                    <RouterContent />
                </AuthProvider>
            </ToastProvider>
        </ThemeProvider>
    );
};

export default App;
