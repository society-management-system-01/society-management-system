import React from 'react';
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    AreaChart,
    Area,
    Legend
} from 'recharts';

// COMPLAINTS CATEGORY PIE CHART
const COMPLAINT_DATA = [
    { name: 'Plumbing', value: 35, color: '#0c92e7' },
    { name: 'Electrical', value: 25, color: '#f59e0b' },
    { name: 'Elevator', value: 15, color: '#f43f5e' },
    { name: 'Cleaning', value: 15, color: '#10b981' },
    { name: 'Carpentry', value: 10, color: '#8b5cf6' }
];

export const ComplaintsCategoryChart: React.FC = () => {
    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={COMPLAINT_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                    >
                        {COMPLAINT_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#0f172a',
                            borderColor: '#1e293b',
                            borderRadius: '12px',
                            color: '#fff',
                            fontSize: '12px'
                        }}
                    />
                    <Legend
                        formatter={(value) => <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

// MONTHLY FINANCIAL DUES COLLECTION BAR CHART
const FINANCIAL_DATA = [
    { month: 'Apr', collected: 420000, pending: 45000 },
    { month: 'May', collected: 435000, pending: 30000 },
    { month: 'Jun', collected: 410000, pending: 55000 },
    { month: 'Jul', collected: 450000, pending: 20000 },
    { month: 'Aug', collected: 440000, pending: 35000 },
    { month: 'Sep', collected: 390000, pending: 84500 }
];

export const MonthlyDuesChart: React.FC = () => {
    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={FINANCIAL_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#0f172a',
                            borderColor: '#1e293b',
                            borderRadius: '12px',
                            color: '#fff',
                            fontSize: '12px'
                        }}
                    />
                    <Bar dataKey="collected" name="Collected (₹)" fill="#10b981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="pending" name="Pending Dues (₹)" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

// TASK RESOLUTION PERFORMANCE AREA CHART
const TASK_PERFORMANCE_DATA = [
    { week: 'Week 1', raised: 14, resolved: 12 },
    { week: 'Week 2', raised: 18, resolved: 17 },
    { week: 'Week 3', raised: 12, resolved: 14 },
    { week: 'Week 4', raised: 22, resolved: 20 }
];

export const TaskPerformanceChart: React.FC = () => {
    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TASK_PERFORMANCE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorRaised" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#36aef8" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#36aef8" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#0f172a',
                            borderColor: '#1e293b',
                            borderRadius: '12px',
                            color: '#fff',
                            fontSize: '12px'
                        }}
                    />
                    <Area type="monotone" dataKey="raised" name="Complaints Raised" stroke="#36aef8" fillOpacity={1} fill="url(#colorRaised)" strokeWidth={2} />
                    <Area type="monotone" dataKey="resolved" name="Complaints Resolved" stroke="#10b981" fillOpacity={1} fill="url(#colorResolved)" strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
