import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import './Assignments.css';

const STORAGE_KEY = 'lmsAssignments';

const AssignmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [scores, setScores] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const list = stored ? JSON.parse(stored) : [];
      const a = list.find(item => String(item.id) === String(id));
      if (a) {
        setAssignment(a);
        // if graded, show a stored grade; otherwise generate sample score history
        if (a.status === 'graded' && a.grade) {
          setScores([{ date: new Date().toISOString(), score: a.grade }]);
        } else if (a.status === 'submitted') {
          setScores([{ date: new Date().toISOString(), score: Math.floor(Math.random() * 40) + 60 }]);
        } else {
          setScores([]);
        }
      }
    } catch (e) {
      // ignore
    }
  }, [id]);

  const handleSimulateGrade = () => {
    // simulate grading: compute a random percentage and store as grade
    const randomScore = Math.floor(Math.random() * 41) + 60; // 60-100
    const gradeStr = `${randomScore}%`;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const list = stored ? JSON.parse(stored) : [];
      const updated = list.map(item => item.id === assignment.id ? { ...item, status: 'graded', grade: gradeStr } : item);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setAssignment(prev => ({ ...prev, status: 'graded', grade: gradeStr }));
      setScores([{ date: new Date().toISOString(), score: randomScore }]);
    } catch (e) {
      console.error('grading error', e);
    }
  };

  if (!assignment) {
    return (
      <div className="page assignment-detail">
        <Card>
          <p>Assignment not found.</p>
          <div style={{ marginTop: 12 }}>
            <button className="btn btn-sm" onClick={() => navigate('/student/assignments')}>Back to assignments</button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="page assignment-detail">
      <div className="page-header">
        <h1>{assignment.title}</h1>
        <p className="assignment-course">{assignment.course}</p>
      </div>
      <div className="detail-grid">
        <Card className="detail-card">
          <h3>Status</h3>
          <p className="status">{assignment.status}{assignment.grade ? ` • ${assignment.grade}` : ''}</p>
          <p>Due: {new Date(assignment.dueDate).toLocaleString()}</p>
          <div style={{ marginTop: 12 }}>
            <div style={{ marginBottom: 8 }}>Overall completion</div>
            <div className="progress-track">
              {
                (() => {
                  let pct = 0;
                  if (assignment.status === 'pending') pct = 10;
                  if (assignment.status === 'submitted') pct = 60;
                  if (assignment.status === 'graded') {
                    const m = String(assignment.grade || '').match(/(\d{1,3})/);
                    pct = m ? Math.max(0, Math.min(100, Number(m[1]))) : 100;
                  }
                  return <div className="progress-fill" style={{ width: `${pct}%` }} />;
                })()
              }
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            {assignment.status === 'pending' && (
              <button className="btn btn-primary" onClick={() => {
                // mark submitted
                const stored = localStorage.getItem(STORAGE_KEY);
                const list = stored ? JSON.parse(stored) : [];
                const updated = list.map(item => item.id === assignment.id ? { ...item, status: 'submitted' } : item);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                setAssignment(prev => ({ ...prev, status: 'submitted' }));
              }}>Submit</button>
            )}

            {assignment.status !== 'graded' && (
              <button className="btn btn-sm" style={{ marginLeft: 8 }} onClick={handleSimulateGrade}>Simulate Grade</button>
            )}
          </div>
        </Card>

        <Card className="detail-card">
          <h3>Scores</h3>
          {scores.length === 0 && <p>No scores yet.</p>}
          {scores.length > 0 && (
            <ul>
              {scores.map((s, i) => (
                <li key={i}>{new Date(s.date).toLocaleString()} — {s.score}%</li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div style={{ marginTop: 16 }}>
        <button className="btn btn-sm" onClick={() => navigate('/student/assignments')}>Back</button>
      </div>
    </div>
  );
};

export default AssignmentDetail;
