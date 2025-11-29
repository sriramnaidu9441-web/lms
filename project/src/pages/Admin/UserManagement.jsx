import { useState } from 'react';
import Card from '../../components/Card';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Smith', email: 'john@example.com', role: 'instructor', status: 'active', joinDate: '2024-01-15' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com', role: 'student', status: 'active', joinDate: '2024-02-20' },
    { id: 3, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'content-creator', status: 'active', joinDate: '2024-03-10' },
    { id: 4, name: 'Mike Wilson', email: 'mike@example.com', role: 'student', status: 'inactive', joinDate: '2024-01-05' },
    { id: 5, name: 'Emily Brown', email: 'emily@example.com', role: 'instructor', status: 'active', joinDate: '2024-04-12' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [filterRole, setFilterRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleDeleteUser = (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleToggleStatus = (userId) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  return (
    <div className="user-management">
      <div className="page-header">
        <div>
          <h1>User Management</h1>
          <p>Manage all users and their roles</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          ➕ Add New User
        </button>
      </div>

      <Card>
        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterRole === 'all' ? 'active' : ''}`}
              onClick={() => setFilterRole('all')}
            >
              All Users
            </button>
            <button
              className={`filter-btn ${filterRole === 'student' ? 'active' : ''}`}
              onClick={() => setFilterRole('student')}
            >
              Students
            </button>
            <button
              className={`filter-btn ${filterRole === 'instructor' ? 'active' : ''}`}
              onClick={() => setFilterRole('instructor')}
            >
              Instructors
            </button>
            <button
              className={`filter-btn ${filterRole === 'content-creator' ? 'active' : ''}`}
              onClick={() => setFilterRole('content-creator')}
            >
              Content Creators
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        {user.name.charAt(0)}
                      </div>
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role.replace('-', ' ')}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>{new Date(user.joinDate).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon edit"
                        title="Edit user"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-icon toggle"
                        title="Toggle status"
                        onClick={() => handleToggleStatus(user.id)}
                      >
                        {user.status === 'active' ? '🔒' : '🔓'}
                      </button>
                      <button
                        className="btn-icon delete"
                        title="Delete user"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New User</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>
                ✕
              </button>
            </div>
            <form className="modal-form">
              <div className="form-group">
                <label>Name</label>
                <input type="text" className="form-control" placeholder="Enter name" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="form-control" placeholder="Enter email" />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select className="form-control">
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="content-creator">Content Creator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" placeholder="Enter password" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
