import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import './InstructorStudents.css';

// We'll derive students from enrolled courses stored under lmsEnrolledCourses.
// Each enrolled course may have an optional `studentsList` field; if not present
// we'll synthesize a couple of mock students for demo purposes.
const ENROLLED_KEY = 'lmsEnrolledCourses';

const InstructorStudents = () => {
  const [byCourse, setByCourse] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(ENROLLED_KEY);
      const enrolled = stored ? JSON.parse(stored) : [];
      // helper to synthesize names
      const firstNames = ['Alex','Jamie','Taylor','Jordan','Casey','Riley','Parker','Morgan','Avery','Sydney','Sam','Charlie','Robin','Drew','Bailey','Cameron','Devon','Elliott','Hayden','Jesse','Kai','Logan','Max','Noah','Quinn','Reese','Rowan','Sage','Shawn','Teagan','Zion','Kim'];
      const lastNames = ['Smith','Johnson','Brown','Lee','Garcia','Martinez','Davis','Lopez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin','White','Harris','Clark','Lewis','Robinson','Walker','Perez','Hall','Young','Allen','King','Wright','Scott','Torres','Nguyen','Hill','Flores'];

      const grouped = enrolled.map(c => {
        // existing students list or empty
        const base = Array.isArray(c.studentsList) ? [...c.studentsList] : [];

        // ensure at least 32 students
        const needed = Math.max(0, 32 - base.length);
        for (let i = 0; i < needed; i++) {
          const idx = base.length + i + 1;
          const fn = firstNames[(idx + c.id) % firstNames.length];
          const ln = lastNames[(idx * 7 + c.id) % lastNames.length];
          const name = `${fn} ${ln}`;
          const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${idx}@example.edu`;
          base.push({ id: `${c.id}-s${idx}`, name, email, progress: Math.floor(Math.random() * 81) + 10 });
        }

        // attach studentsList back onto course so it persists next time
        c.studentsList = base;
        return { courseId: c.id, courseTitle: c.title || c.name || `Course ${c.id}`, students: base };
      });

      // persist updated enrolled with studentsList so generations are stable
      try {
        localStorage.setItem(ENROLLED_KEY, JSON.stringify(enrolled));
      } catch (e) {
        // ignore storage errors
      }

      setByCourse(grouped);
    } catch (e) {
      setByCourse([]);
    }
  }, []);

  const exportCourseStudents = (course) => {
    const blob = new Blob([JSON.stringify(course.students, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${course.courseTitle.replace(/\s+/g,'_')}_students.json`;
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };

  const messageStudent = (s) => {
    alert(`Message sent to ${s.name} (simulated)`);
  };

  return (
    <div className="page instructor-students">
      <div className="page-header">
        <h1>Students</h1>
        <p>Students enrolled in your courses. Export or message students from here.</p>
      </div>

      <div className="students-grid">
        {byCourse.length === 0 && (
          <Card>
            <p>No enrolled courses found. Students will appear here once students enroll.</p>
          </Card>
        )}

        {byCourse.map(course => (
          <Card key={course.courseId} className="students-card" title={course.courseTitle} actions={
            <div className="card-actions">
              <button className="btn btn-sm" onClick={() => exportCourseStudents(course)}>Export</button>
            </div>
          }>
            <div className="students-list">
              {course.students.map(s => (
                <div key={s.id} className="student-row">
                  <div className="student-info">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=7c3aed&color=fff`} alt={s.name} className="avatar" />
                    <div>
                      <div className="student-name">{s.name}</div>
                      <div className="student-email">{s.email}</div>
                    </div>
                  </div>
                  <div className="student-actions">
                    <div className="student-progress">
                      <div className="progress-track"><div className="progress-fill" style={{ width: `${s.progress || 0}%` }} /></div>
                      <div className="progress-text">{s.progress || 0}%</div>
                    </div>
                    <div className="actions-row">
                      <button className="btn btn-sm" onClick={() => messageStudent(s)}>Message</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InstructorStudents;
