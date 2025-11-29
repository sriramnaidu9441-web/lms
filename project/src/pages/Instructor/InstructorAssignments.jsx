import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import './InstructorAssignments.css';

const STORAGE_KEY = 'lmsAssignments';

const InstructorAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [editing, setEditing] = useState(null); // id of assignment being graded
  const [scoreInput, setScoreInput] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const list = stored ? JSON.parse(stored) : [];
      setAssignments(list);
    } catch (e) {
      setAssignments([]);
    }
  }, []);

  const save = (next) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setAssignments(next);
    } catch (e) {
      console.error('save assignments', e);
    }
  };

  const markSubmitted = (id) => {
    const next = assignments.map(a => a.id === id ? { ...a, status: 'submitted' } : a);
    save(next);
  };

  const startGrading = (a) => {
    setEditing(a.id);
    // prefill with numeric part of grade if exists
    const m = String(a.grade || '').match(/(\d{1,3})/);
    setScoreInput(m ? m[1] : '');
  };

  const applyGrade = (id) => {
    const pct = Math.max(0, Math.min(100, Number(scoreInput || 0)));
    const gradeStr = `${pct}%`;
    const next = assignments.map(a => a.id === id ? { ...a, status: 'graded', grade: gradeStr } : a);
    save(next);
    setEditing(null);
    setScoreInput('');
  };

  const filtered = assignments.filter(a => filter === 'all' ? true : a.status === filter);

  const navigate = useNavigate();

  const exportJSON = (a) => {
    const blob = new Blob([JSON.stringify(a, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const aEl = document.createElement('a');
    aEl.href = url;
    aEl.download = `${a.title.replace(/\s+/g,'_')}_assignment.json`;
    document.body.appendChild(aEl);
    aEl.click();
    aEl.remove();
    URL.revokeObjectURL(url);
  };

  const remind = (a) => {
    // placeholder: in real app would send notification
    console.log(`[InstructorAssignments] remind students for assignment ${a.id}`);
    alert(`Reminder sent for "${a.title}" (simulated)`);
  };

  return (
    <div className="page instructor-assignments">
      <div className="page-header">
        <h1>Instructor — Assignments</h1>
        <p>Review submissions and grade student work.</p>
      </div>

      <div className="assign-controls">
        <label>Show: </label>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="submitted">Submitted</option>
          <option value="graded">Graded</option>
        </select>
      </div>

      <div className="instr-assign-list">
        {filtered.length === 0 && (
          <Card>
            <p>No assignments found for the selected filter.</p>
          </Card>
        )}

        {filtered.map(a => {
          // compute progress percent similar to student view
          let pct = 0;
          if (a.status === 'pending') pct = 10;
          if (a.status === 'submitted') pct = 60;
          if (a.status === 'graded') {
            const m = String(a.grade || '').match(/(\d{1,3})/);
            pct = m ? Math.max(0, Math.min(100, Number(m[1]))) : 100;
          }

          return (
            <Card key={a.id} className="instr-assign-card" title={a.title}>
              <div className="instr-assign-body">
                <div className="left">
                  <div className="assign-course">{a.course}</div>
                  <div className={`status-badge ${a.status}`}>{a.status}{a.grade ? ` • ${a.grade}` : ''}</div>
                  <div className="due">Due: {new Date(a.dueDate).toLocaleDateString()}</div>

                  <div className="assign-progress">
                    <div className="progress-label"><span>Avg completion</span><strong>{pct}%</strong></div>
                    <div className="progress-track"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
                  </div>
                </div>

                <div className="right">
                  <div className="action-buttons">
                    <button className="btn btn-sm" onClick={() => navigate(`/student/assignments/${a.id}`)}>View</button>
                    <button className="btn btn-sm" onClick={() => exportJSON(a)}>Export</button>
                    <button className="btn btn-sm btn-primary" onClick={() => remind(a)}>Remind</button>
                  </div>

                  {a.status === 'pending' && (
                    <button className="btn btn-sm btn-secondary" onClick={() => markSubmitted(a.id)}>Mark Submitted</button>
                  )}

                  {a.status === 'submitted' && editing !== a.id && (
                    <button className="btn btn-sm" onClick={() => startGrading(a)}>Grade</button>
                  )}

                  {editing === a.id && (
                    <div className="grade-row">
                      <input className="form-control" value={scoreInput} onChange={e => setScoreInput(e.target.value)} placeholder="Score %" />
                      <button className="btn btn-sm btn-primary" onClick={() => applyGrade(a.id)}>Save</button>
                      <button className="btn btn-sm" onClick={() => { setEditing(null); setScoreInput(''); }}>Cancel</button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default InstructorAssignments;
