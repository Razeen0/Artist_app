import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { UserService, type User } from '../services/UserService';
import { Calendar, AlertCircle, Edit2, Trash2, Shield, User as UserIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/Button';
import './Dashboard.css';

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [updateLoading, setUpdateLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await UserService.getAllUsers();
            if (response.success) {
                setUsers(response.data);
            } else {
                setError(response.message);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUser = async (user: User, data: Partial<User>) => {
        setUpdateLoading(true);
        try {
            const response = await api.patch(`/users/${user.id}`, { user: data });
            if (response.data.success) {
                setUsers(users.map(u => u.id === user.id ? { ...u, ...data } : u));
                setEditingUser(null);
            } else {
                alert(response.data.message);
            }
        } catch (err: any) {
            alert(err.response?.data?.errors?.join(', ') || 'Failed to update user');
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        setUpdateLoading(true);
        try {
            const response = await api.delete(`/users/${userId}`);
            if (response.data.success) {
                setUsers(users.filter(u => u.id !== userId));
            } else {
                alert(response.data.message);
            }
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete user');
        } finally {
            setUpdateLoading(false);
        }
    };

    const getRoleBadgeClass = (role: string) => {
        switch (role) {
            case 'admin': return 'badge-purple';
            case 'artist': return 'badge-blue';
            default: return 'badge-gray';
        }
    };

    if (loading) return <div className="loading">Loading users...</div>;

    return (
        <div className="dashboard-content">
            <div className="dashboard-grid full-width">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card glass"
                >
                    {error && (
                        <div className="error-message">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}
                    <div className="card-header">
                        <h2>System Users</h2>
                        <p>Manage all users and their roles across the platform</p>
                    </div>

                    <div className="table-container">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="user-cell">
                                                <div className="avatar-small">
                                                    {user.email.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="user-details">
                                                    <span className="email">{user.email}</span>
                                                    <span className="id">#{user.id.slice(0, 8)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="date-cell">
                                                <Calendar size={14} />
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="action-btns">
                                                <button
                                                    className="icon-btn"
                                                    onClick={() => setEditingUser(user)}
                                                    title="Edit User"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    className="icon-btn delete"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            {users.length === 0 && (
                                <tbody>
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>
                                            No users found
                                        </td>
                                    </tr>
                                </tbody>
                            )}
                        </table>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {editingUser && (
                    <div className="modal-overlay">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="modal-card glass"
                        >
                            <div className="modal-header">
                                <h3>Edit User</h3>
                                <button onClick={() => setEditingUser(null)}><X size={20} /></button>
                            </div>
                            <div className="modal-body">
                                <div className="user-profile-preview">
                                    <div className="avatar-large">{editingUser.email.charAt(0).toUpperCase()}</div>
                                    <div className="user-meta">
                                        <input
                                            type="email"
                                            className="edit-input"
                                            defaultValue={editingUser.email}
                                            onBlur={(e) => handleUpdateUser(editingUser, { email: e.target.value })}
                                            disabled={updateLoading}
                                        />
                                        <p>ID: <span style={{ opacity: 0.5 }}>{editingUser.id}</span></p>
                                    </div>
                                </div>

                                <div className="edit-section">
                                    <label>Role</label>
                                    <select
                                        className="edit-select"
                                        defaultValue={editingUser.role}
                                        onBlur={(e) => handleUpdateUser(editingUser, { role: e.target.value })}
                                        disabled={updateLoading}
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="artist">Artist</option>
                                        <option value="customer">Customer</option>
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style dangerouslySetInnerHTML={{
                __html: `
                .full-width { grid-template-columns: 1fr !important; }
                .user-cell { display: flex; align-items: center; gap: 12px; }
                .avatar-small { 
                    width: 32px; 
                    height: 32px; 
                    border-radius: 50%; 
                    background: var(--primary-gradient); 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    font-weight: 600; 
                    font-size: 14px;
                }
                .avatar-large {
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    background: var(--primary-gradient);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 16px;
                }
                .user-details { display: flex; flex-direction: column; }
                .user-details .email { font-weight: 500; color: white; }
                .user-details .id { font-size: 11px; opacity: 0.5; }
                .badge { 
                    padding: 4px 10px; 
                    border-radius: 20px; 
                    font-size: 12px; 
                    font-weight: 600; 
                    text-transform: capitalize; 
                }
                .badge-purple { background: rgba(168, 85, 247, 0.2); color: #a855f7; border: 1px solid rgba(168, 85, 247, 0.3); }
                .badge-blue { background: rgba(59, 130, 246, 0.2); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3); }
                .badge-gray { background: rgba(156, 163, 175, 0.2); color: #9ca3af; border: 1px solid rgba(156, 163, 175, 0.3); }
                
                .date-cell { display: flex; align-items: center; gap: 6px; font-size: 13px; opacity: 0.8; }
                
                .custom-table { width: 100%; border-collapse: separate; border-spacing: 0 8px; }
                .custom-table th { text-align: left; padding: 12px; opacity: 0.6; font-weight: 500; font-size: 14px; }
                .custom-table td { padding: 12px; background: rgba(255, 255, 255, 0.03); border-top: 1px solid rgba(255, 255, 255, 0.05); border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
                .custom-table tr td:first-child { border-left: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px 0 0 12px; }
                .custom-table tr td:last-child { border-right: 1px solid rgba(255, 255, 255, 0.05); border-radius: 0 12px 12px 0; }
                
                .icon-btn { 
                    background: none; 
                    border: none; 
                    color: white; 
                    cursor: pointer; 
                    opacity: 0.5; 
                    transition: all 0.2s; 
                    padding: 8px; 
                    border-radius: 50%;
                }
                .icon-btn.delete:hover { opacity: 1; background: rgba(239, 68, 68, 0.1); color: #ef4444; }
                .action-btns { display: flex; gap: 8px; }

                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 20px;
                }
                .modal-card {
                    width: 100%;
                    max-width: 450px;
                    border-radius: 24px;
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .modal-header {
                    padding: 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                .modal-header h3 { margin: 0; font-size: 20px; }
                .modal-header button { background: none; border: none; color: white; opacity: 0.6; cursor: pointer; }
                .modal-body { padding: 24px; }
                
                .user-profile-preview {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 32px;
                    text-align: center;
                }
                .user-meta h4 { margin: 0 0 4px 0; font-size: 18px; }
                .user-meta p { margin: 0; opacity: 0.6; font-size: 14px; }
                
                .edit-section label { display: block; margin-bottom: 8px; font-size: 14px; opacity: 0.8; }

                .edit-input {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 8px;
                    font-size: 16px;
                    width: 100%;
                    margin-bottom: 8px;
                    text-align: center;
                }
                .edit-select {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    padding: 10px 12px;
                    border-radius: 8px;
                    font-size: 14px;
                    width: 100%;
                }
                .edit-section label { display: block; margin-bottom: 8px; font-size: 14px; opacity: 0.8; }
            `}} />
        </div>
    );
};

export default UsersPage;
