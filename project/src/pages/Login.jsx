import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const { login } = useAuth();
  const navigate = useNavigate();


  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple client-side stub for login (replace with real API in production)
    if (!email || !password) {
      alert('Please enter your email and password.');
      return;
    }

    const name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const userData = {
      email,
      name,
      role: selectedRole,
      id: Math.random().toString(36).substr(2, 9),
    };

    login(userData);

    // Navigate to appropriate dashboard
    switch (selectedRole) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'instructor':
        navigate('/instructor/dashboard');
        break;
      case 'student':
        navigate('/student/dashboard');
        break;
      case 'content-creator':
        navigate('/content-creator/dashboard');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="logo-large">🎓</div>
          <h1>EduLearn LMS</h1>
          <p>Learning Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="role">Select Role</label>
            <select
              id="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="form-control"
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
              <option value="content-creator">Content Creator</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="form-control"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Sign In
          </button>
        </form>

        {/* Demo credentials removed */}
      </div>
    </div>
  );
};

export default Login;
