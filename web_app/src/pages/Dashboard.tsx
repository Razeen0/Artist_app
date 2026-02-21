import React from 'react';
import {
    Users,
    Handshake,
    CalendarCheck,
    TrendingUp,
    Clock,
    ChevronRight
} from 'lucide-react';
import { useResource } from '../hooks/useResource';
import './Dashboard.css';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
    const { data, loading } = useResource<any>('/dashboard');
    const stats = data?.stats;

    const statCards = [
        { label: 'Total Artists', value: stats?.total_artists || 0, icon: <Users />, color: '#3b82f6' },
        { label: 'Total Bookings', value: stats?.total_bookings || 0, icon: <CalendarCheck />, color: '#10b981' },
        { label: 'Active Services', value: stats?.total_services || 12, icon: <Handshake />, color: '#f59e0b' },
        { label: 'Revenue', value: `$${stats?.total_payments || 0}`, icon: <TrendingUp />, color: '#8b5cf6' },
    ];

    if (loading) {
        return (
            <div className="center-loader">
                <div className="loader large" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="dashboard"
        >
            <div className="stats-grid">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={index}
                        className="stat-card glass"
                        whileHover={{ y: -5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">{stat.label}</p>
                            <h3 className="stat-value">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="dashboard-grid">
                <div className="recent-section glass">
                    <div className="section-header">
                        <h3>Recent Bookings</h3>
                        <button className="view-all">View All <ChevronRight size={16} /></button>
                    </div>
                    <div className="recent-list">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="recent-item">
                                <div className="item-avatar">JD</div>
                                <div className="item-info">
                                    <p className="item-name">John Doe</p>
                                    <p className="item-sub">Digital Portrait Session</p>
                                </div>
                                <div className="item-meta">
                                    <p className="item-time"><Clock size={12} /> 2 hours ago</p>
                                    <span className="status-badge pending">Pending</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="performance-section glass">
                    <h3>Quick Actions</h3>
                    <div className="actions-grid">
                        <button className="action-card btn-glass">
                            <span className="action-title">Add Service</span>
                            <p className="action-desc">Offer a new creative service</p>
                        </button>
                        <button className="action-card btn-glass">
                            <span className="action-title">Update Availability</span>
                            <p className="action-desc">Manage your working hours</p>
                        </button>
                        <button className="action-card btn-glass">
                            <span className="action-title">Promote Profile</span>
                            <p className="action-desc">Get more visibility</p>
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
