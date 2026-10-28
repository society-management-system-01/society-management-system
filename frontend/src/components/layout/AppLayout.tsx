import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';
import { Breadcrumbs } from './Breadcrumbs';

interface AppLayoutProps {
    children: React.ReactNode;
    currentPath: string;
    onNavigate: (path: string) => void;
    onOpenQuickAction?: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
    children,
    currentPath,
    onNavigate,
    onOpenQuickAction
}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
            {/* Sidebar Navigation */}
            <Sidebar
                currentPath={currentPath}
                onNavigate={onNavigate}
                isOpen={isSidebarOpen}
                onCloseMobile={() => setIsSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 md:pl-64">
                {/* Top Navbar */}
                <Navbar
                    onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
                    onNavigate={onNavigate}
                    onOpenQuickAction={onOpenQuickAction}
                />

                {/* Dynamic Page Container */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-12">
                    <Breadcrumbs currentPath={currentPath} onNavigate={onNavigate} />
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Bar */}
            <MobileNav currentPath={currentPath} onNavigate={onNavigate} />
        </div>
    );
};
