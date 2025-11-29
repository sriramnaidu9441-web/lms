import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import './Assignments.css';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'lmsAssignments';

const defaultAssignments = [
  { id: 1, title: 'React Project', course: 'React Fundamentals', dueDate: '2025-12-01', status: 'pending' },
  { id: 2, title: 'JS Quiz', course: 'JavaScript Advanced', dueDate: '2025-11-30', status: 'pending' },
  { id: 3, title: 'Python Assignment', course: 'Python for Beginners', dueDate: '2025-12-05', status: 'submitted' },
  { id: 4, title: 'Data Structures Homework', course: 'Data Structures', dueDate: '2025-12-10', status: 'pending' },
  { id: 5, title: 'CSS Challenge', course: 'CSS Layouts', dueDate: '2025-12-03', status: 'graded', grade: 'A-' },
];

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultAssignments;
    } catch (e) {
      return defaultAssignments;
    }
  });

  const navigate = useNavigate();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
    } catch (e) {
      // ignore
    }
  }, [assignments]);

  const handleSubmit = (id) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, status: 'submitted' } : a));
  };

  const handleView = (id) => {
    navigate(`/student/assignments/${id}`);
  };

  return (
    <div className="page student-assignments">
      <div className="page-header">
        <h1>Assignments</h1>
        <p>View and manage your upcoming and past assignments.</p>
      </div>

      <div className="assignments-list">
        {assignments.map(a => {
          // determine numeric progress for visual bar
          let pct = 0;
          if (a.status === 'pending') pct = 10;
          if (a.status === 'submitted') pct = 60;
          if (a.status === 'graded') {
            // extract numeric percent if grade like "85%" else fallback
            const m = String(a.grade || '').match(/(\d{1,3})/);
            pct = m ? Math.max(0, Math.min(100, Number(m[1]))) : 100;
          }

          return (
            <Card key={a.id} className="assignment-card" title={a.title} actions={
              <div className="assignment-actions">
                <button className="btn btn-sm" onClick={() => handleView(a.id)}>View</button>
                {a.status === 'pending' && (
                  <button className="btn btn-sm btn-primary" onClick={() => handleSubmit(a.id)}>Submit</button>
                )}
              </div>
            }>
              <div className="assignment-body">
                <div className="assignment-meta">
                  <div>
                    <div className="assignment-course">{a.course}</div>
                    <div className={`status-badge ${a.status}`}>{a.status}{a.grade ? ` • ${a.grade}` : ''}</div>
                  </div>
                  <div className="assignment-due">Due: {new Date(a.dueDate).toLocaleDateString()}</div>
                </div>

                <div className="assignment-progress">
                  <div className="progress-label">
                    <span>Completion</span>
                    <strong>{pct}%</strong>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default StudentAssignments;
