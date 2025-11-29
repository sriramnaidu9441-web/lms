import React, { useEffect, useState } from 'react';

const CreateContent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [type, setType] = useState('file');
  const [fileData, setFileData] = useState(null);
  const [url, setUrl] = useState('');
  const [coursesOptions, setCoursesOptions] = useState([]);

  useEffect(() => {
    const inst = localStorage.getItem('lmsInstructorCourses');
    let opts = [];
    if (inst) {
      try {
        const parsed = JSON.parse(inst);
        opts = parsed.map((c) => ({ id: c.id, title: c.title }));
      } catch (e) {
        // ignore
      }
    }
    setCoursesOptions(opts);
    if (opts.length > 0) setCourse(opts[0].title);
  }, []);

  const handleFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFileData(ev.target.result);
    reader.readAsDataURL(f);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return alert('Please add a title.');

    const raw = localStorage.getItem('lmsMaterials');
    const materials = raw ? JSON.parse(raw) : [];
    const newM = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      course: course || 'Unassigned',
      type,
      fileData: type === 'file' ? fileData : null,
      url: type === 'link' ? url : null,
      createdAt: Date.now(),
    };
    const next = [newM, ...materials];
    localStorage.setItem('lmsMaterials', JSON.stringify(next));
    // reset form
    setTitle('');
    setDescription('');
    setFileData(null);
    setUrl('');
    alert('Content created.');
  };

  return (
    <div className="page cc-create">
      <h1>Create Content</h1>

      <form className="create-content-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="form-row">
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="form-row">
          <label>Course (optional)</label>
          <select value={course} onChange={(e) => setCourse(e.target.value)}>
            <option value="">Unassigned</option>
            {coursesOptions.map((c) => (
              <option key={c.id} value={c.title}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="file">File Upload</option>
            <option value="link">External Link</option>
          </select>
        </div>

        {type === 'file' && (
          <div className="form-row">
            <label>Upload File</label>
            <input type="file" onChange={handleFile} />
            {fileData && (
              <div className="preview">Preview available</div>
            )}
          </div>
        )}

        {type === 'link' && (
          <div className="form-row">
            <label>External URL</label>
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/video" />
          </div>
        )}

        <div className="form-row">
          <button className="btn btn-primary" type="submit">Create</button>
        </div>
      </form>
    </div>
  );
};

export default CreateContent;
