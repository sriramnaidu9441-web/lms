import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import { useNavigate } from 'react-router-dom';
import './Courses.css';

const STORAGE_KEY = 'lmsEnrolledCourses';

const catalog = [
  { id: 1, title: 'React Fundamentals', instructor: 'John Smith', short: 'Build interactive UIs with React', image: '/assets/course-1.svg' },
  { id: 2, title: 'JavaScript Advanced', instructor: 'Emily Brown', short: 'Deep dive into modern JS', image: '/assets/course-2.svg' },
  { id: 3, title: 'Python for Beginners', instructor: 'Sarah Johnson', short: 'Start programming with Python', image: '/assets/course-3.svg' },
  { id: 4, title: 'Data Structures', instructor: 'Alan Turing', short: 'Learn algorithms and data structures', image: '/assets/course-4.svg' },
  { id: 5, title: 'CSS Layouts', instructor: 'Rachel Green', short: 'Master Flexbox and Grid', image: '/assets/course-5.svg' },
  { id: 6, title: 'TypeScript Basics', instructor: 'Ada Lovelace', short: 'Add types to JavaScript', image: '/assets/course-6.svg' },
  { id: 7, title: 'Node.js Backend', instructor: 'Brendan Eich', short: 'Build server-side applications with Node', image: '/assets/course-7.svg' },
  { id: 8, title: 'Database Essentials', instructor: 'Grace Hopper', short: 'Learn SQL and NoSQL databases', image: '/assets/course-8.svg' },
  { id: 9, title: 'DevOps Fundamentals', instructor: 'Linus Torvalds', short: 'CI/CD and deployment practices', image: '/assets/course-9.svg' },
  { id: 10, title: 'Machine Learning Intro', instructor: 'Andrew Ng', short: 'Basics of ML and models', image: '/assets/course-10.svg' },
  { id: 11, title: 'Data Visualization', instructor: 'Hans Rosling', short: 'Visualize data effectively', image: '/assets/course-11.svg' },
  { id: 12, title: 'Mobile App Development', instructor: 'Margaret Hamilton', short: 'Build mobile apps with React Native', image: '/assets/course-12.svg' },
  { id: 13, title: 'Cloud Computing', instructor: 'Werner Vogels', short: 'Intro to AWS/GCP/Azure', image: '/assets/course-13.svg' },
  { id: 14, title: 'UI/UX Design', instructor: 'Don Norman', short: 'Design user-friendly interfaces', image: '/assets/course-14.svg' },
  { id: 15, title: 'Cybersecurity Basics', instructor: 'Whitfield Diffie', short: 'Protect systems and data', image: '/assets/course-15.svg' },
  { id: 16, title: 'Algorithms Advanced', instructor: 'Edsger Dijkstra', short: 'Advanced algorithm techniques', image: '/assets/course-16.svg' },
  { id: 17, title: 'Project Management', instructor: 'Katherine Johnson', short: 'Manage software projects effectively', image: '/assets/course-17.svg' },
  { id: 18, title: 'Digital Marketing', instructor: 'Seth Godin', short: 'Basics of SEO and ads', image: '/assets/course-18.svg' },
  { id: 19, title: 'Blockchain Essentials', instructor: 'Vitalik Buterin', short: 'Blockchain and smart contracts', image: '/assets/course-19.svg' },
  { id: 20, title: 'Testing & QA', instructor: 'Kent Beck', short: 'Automated testing and QA practices', image: '/assets/course-20.svg' },
  { id: 21, title: 'GraphQL in Practice', instructor: 'Lee Byron', short: 'APIs with GraphQL', image: '/assets/course-21.svg' },
  { id: 22, title: 'Performance Optimization', instructor: 'Ilya Grigorik', short: 'Speed up web apps', image: '/assets/course-22.svg' }
];

const StudentExplore = () => {
  const [available, setAvailable] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const enrolled = stored ? JSON.parse(stored) : [];
      const enrolledIds = new Set(enrolled.map(c => c.id));
      const notEnrolled = catalog.filter(c => !enrolledIds.has(c.id));
      setAvailable(notEnrolled);
    } catch (e) {
      setAvailable(catalog);
    }
  }, []);

  const enroll = (course) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const enrolled = stored ? JSON.parse(stored) : [];
      const exists = enrolled.find(c => c.id === course.id);
      if (!exists) {
        // add with default progress 0
        const toAdd = { ...course, progress: 0, nextLesson: 'Introduction', status: 'in-progress' };
        const updated = [...enrolled, toAdd];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        // remove from available list
        setAvailable(prev => prev.filter(c => c.id !== course.id));
        // navigate to courses page so student sees it
        navigate('/student/courses');
      }
    } catch (e) {
      console.error('enroll error', e);
    }
  };

  const avatarUrl = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff&size=64`;

  return (
    <div className="page student-explore">
      <div className="page-header">
        <h1>Explore Courses</h1>
        <p>Courses you are not enrolled in yet. Click Enroll to add them to your dashboard.</p>
      </div>

      <div className="courses-grid">
        {available.length === 0 && (
          <Card>
            <p>No new courses to explore — check back later.</p>
          </Card>
        )}

        {available.map(course => (
          <Card key={course.id} className="course-card" title={course.title} actions={
            <div className="course-actions">
              <button className="btn btn-sm btn-primary" onClick={() => enroll(course)}>Enroll</button>
              <button className="btn btn-sm" onClick={() => navigate(`/student/courses/${course.id}`)}>View</button>
            </div>
          }>
            <div className="course-body">
              <div className="course-image-wrap">
                <img src={course.image} alt={course.title} title={course.title} className="course-image" />
                <div className="image-overlay" />
                <button className="btn-register" onClick={() => enroll(course)}>Register</button>
                <div className="instructor-badge">
                  <img src={avatarUrl(course.instructor)} alt={course.instructor} className="avatar" title={course.instructor} />
                </div>
              </div>
              <p className="short">{course.short}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentExplore;
