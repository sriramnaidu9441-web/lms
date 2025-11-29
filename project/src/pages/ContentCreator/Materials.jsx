import React, { useEffect, useState } from 'react';

const Materials = () => {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem('lmsMaterials');
    if (raw) setMaterials(JSON.parse(raw));
  }, []);

  const save = (next) => {
    setMaterials(next);
    localStorage.setItem('lmsMaterials', JSON.stringify(next));
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this material?')) return;
    const next = materials.filter((m) => m.id !== id);
    save(next);
  };

  const renderPreview = (m) => {
    if (m.type === 'link') {
      return (
        <a href={m.url} target="_blank" rel="noreferrer" className="material-link">
          Open Link
        </a>
      );
    }

    if (!m.fileData) return null;

    if (m.fileData.startsWith('data:video')) {
      return <video src={m.fileData} controls className="material-video" />;
    }

    if (m.fileData.startsWith('data:image')) {
      return <img src={m.fileData} alt={m.title} className="material-image" />;
    }

    // default: download / open (PDF, docs)
    return (
      <a href={m.fileData} download={m.title} className="material-download">
        Download
      </a>
    );
  };

  const grouped = materials.reduce((acc, m) => {
    const key = m.course || 'Unassigned';
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  return (
    <div className="page cc-materials">
      <h1>Course Materials</h1>

      {materials.length === 0 && (
        <div className="empty">No materials yet. Create new content from the creator page.</div>
      )}

      {Object.keys(grouped).map((course) => (
        <section key={course} className="materials-group">
          <h2 className="course-title">{course}</h2>
          <div className="materials-list">
            {grouped[course].map((m) => (
              <article key={m.id} className="material-card">
                <div className="material-meta">
                  <h3 className="material-title">{m.title}</h3>
                  <div className="material-desc">{m.description}</div>
                  <div className="material-date">{new Date(m.createdAt).toLocaleString()}</div>
                </div>
                <div className="material-preview">{renderPreview(m)}</div>
                <div className="material-actions">
                  <button onClick={() => window.open(m.fileData || m.url, '_blank')} className="btn">View</button>
                  <button onClick={() => handleDelete(m.id)} className="btn btn-danger">Delete</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Materials;
