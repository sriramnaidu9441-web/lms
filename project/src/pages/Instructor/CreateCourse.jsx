import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateCourse.css';

const STORAGE_KEY = 'lmsInstructorCourses';

const assetOptions = Array.from({ length: 12 }).map((_, i) => `/assets/course-${i + 1}.svg`);

const CreateCourse = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(assetOptions[0]);
  const [students, setStudents] = useState(0);
  const [avgProgress, setAvgProgress] = useState(0);
  const [error, setError] = useState('');

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImage(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a course title');
      return;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const list = stored ? JSON.parse(stored) : [];
      const id = Date.now();
      const newCourse = { id, title: title.trim(), students: Number(students) || 0, avgProgress: Number(avgProgress) || 0, image, description };
      const updated = [newCourse, ...list];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      navigate('/instructor/courses');
    } catch (e) {
      console.error('create course error', e);
      setError('Unable to create course');
    }
  };

  return (
    <div className="page instructor-create-course">
      <div className="page-header">
        <h1>Create Course</h1>
        <p>Create a new course and it will appear in your instructor dashboard.</p>
      </div>

      <form className="create-form card" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Course title" />
        </div>

        <div className="form-row">
          <label>Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Short course description" />
        </div>

        <div className="form-row grid-2">
          <div>
            <label>Thumbnail</label>
            <div className="file-row">
              <select value={image} onChange={e => setImage(e.target.value)} className="form-control">
                {assetOptions.map(src => (
                  <option key={src} value={src}>{src.split('/').pop()}</option>
                ))}
              </select>
              <label className="file-input-label">
                Upload
                <input type="file" accept="image/*" onChange={e => handleFile(e.target.files[0])} />
              </label>
            </div>
          </div>

          <div>
            <label>Initial students</label>
            <input className="form-control" type="number" value={students} min={0} onChange={e => setStudents(e.target.value)} />
          </div>
        </div>

        <div className="form-row grid-2">
          <div>
            <label>Average progress (%)</label>
            <input type="number" value={avgProgress} min={0} max={100} onChange={e => setAvgProgress(e.target.value)} />
          </div>
          <div className="preview-wrap">
            <label>Preview</label>
            <div className="preview">
              <img src={image} alt="preview" />
            </div>
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="form-row actions">
          <button type="submit" className="btn btn-primary">Create Course</button>
          <button type="button" className="btn" onClick={() => navigate('/instructor/courses')}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourse;
