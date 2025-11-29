import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import { useAuth } from '../../context/AuthContext';
import './InstructorCourses.css';

const STORAGE_KEY = 'lmsInstructorCourses';

const sampleCourses = [
  { id: 101, title: 'React Fundamentals', students: 124, avgProgress: 68, image: '/assets/course-1.svg' },
  { id: 102, title: 'Advanced JavaScript', students: 88, avgProgress: 54, image: '/assets/course-2.svg' },
  { id: 103, title: 'Node.js Backend', students: 62, avgProgress: 75, image: '/assets/course-7.svg' },
  { id: 104, title: 'Data Structures', students: 142, avgProgress: 49, image: '/assets/course-4.svg' },
];

const InstructorCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : sampleCourses;
    } catch (e) {
      return sampleCourses;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    } catch (e) {}
  }, [courses]);

  const updateProgress = (id, delta) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, avgProgress: Math.max(0, Math.min(100, c.avgProgress + delta)) } : c));
  };

  const colorFor = (i) => {
    const palette = ['#7c3aed', '#10b981', '#06b6d4', '#f97316'];
    return palette[i % palette.length];
  };

  return (
    <div className="page instructor-courses">
      <div className="page-header instructor-header">
        <div>
          <h1>My Courses</h1>
          <p>Courses you are teaching — quick glance at enrollment and average student progress.</p>
        </div>
        <div className="instructor-meta">
          <div className="instructor-name">{user?.name || 'Instructor'}</div>
          <div className="instructor-role">{user?.role || 'instructor'}</div>
        </div>
      </div>

      <div className="instructor-grid">
        {courses.map((course, idx) => (
          <Card key={course.id} className="inst-course-card" title={course.title} actions={
            <div className="card-actions-row">
              <button className="btn btn-sm" onClick={() => updateProgress(course.id, 5)}>Boost +5%</button>
              <button className="btn btn-sm" onClick={() => updateProgress(course.id, -5)}>Reduce -5%</button>
            </div>
          }>
            <div className="inst-card-body">
              <div className="inst-thumb">
                <img src={course.image} alt={course.title} />
                <div className="thumb-overlay" style={{ background: `linear-gradient(180deg, ${colorFor(idx)}33, ${colorFor(idx)}11)` }} />
              </div>
              <div className="inst-meta">
                <div className="inst-stats">
                  <div className="stat-item"><strong>{course.students}</strong><span>students</span></div>
                  <div className="stat-item"><strong>{course.avgProgress}%</strong><span>avg progress</span></div>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${course.avgProgress}%`, background: `linear-gradient(90deg, ${colorFor(idx)}, ${colorFor(idx)})` }} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InstructorCourses;
