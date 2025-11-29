import React from 'react';
import './Progress.css';

const BarChart = ({ points = [], width = 640, height = 220, color = '#667eea', padding = 24, gap = 8 }) => {
  if (!points || points.length === 0) return null;
  const max = Math.max(...points, 100);
  const innerWidth = width - padding * 2;
  const barCount = points.length;
  const totalGap = Math.max(0, (barCount - 1) * gap);
  const barWidth = Math.max(4, (innerWidth - totalGap) / barCount);

  const scaleY = (v) => {
    const pct = v / max;
    return Math.round(pct * (height - padding * 2));
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="bar-svg">
      <defs>
        <linearGradient id={`bg-${color.replace('#','')}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0.04" />
        </linearGradient>
      </defs>
      {points.map((p, i) => {
        const h = scaleY(p);
        const x = padding + i * (barWidth + gap);
        const y = height - padding - h;
        return (
          <g key={i} className="bar-group">
            <rect x={x} y={y} width={barWidth} height={h} rx={4} fill={color} className="bar-rect" />
            <rect x={x} y={y} width={barWidth} height={h} rx={4} fill={`url(#bg-${color.replace('#','')})`} opacity={0.18} />
          </g>
        );
      })}
    </svg>
  );
};

const StudentProgress = () => {
  const weekly = [55, 60, 62, 70, 68, 72, 75];
  const monthly = [40, 45, 50, 55, 60, 63, 66, 68, 70, 72, 74, 75];

  return (
    <div className="page student-progress">
      <div className="page-header">
        <h1>Progress</h1>
        <p>Overview of your learning progress — weekly and monthly.</p>
      </div>

      <div className="progress-grid">
        <div className="progress-card">
          <h3>Weekly Progress</h3>
          <div className="chart-wrap bars-wrap">
            <BarChart points={weekly} width={640} height={220} color="#10b981" />
          </div>
          <div className="chart-meta">
            <div className="meta-item"><strong>{weekly[weekly.length - 1]}%</strong><span>Current</span></div>
            <div className="meta-item"><strong>{Math.round(weekly.reduce((a,b)=>a+b,0)/weekly.length)}%</strong><span>Average</span></div>
            <div className="meta-item"><strong>{weekly[0]}%</strong><span>Start</span></div>
          </div>
        </div>

        <div className="progress-card">
          <h3>Monthly Progress</h3>
          <div className="chart-wrap bars-wrap">
            <BarChart points={monthly} width={640} height={220} color="#667eea" gap={6} />
          </div>
          <div className="chart-meta">
            <div className="meta-item"><strong>{monthly[monthly.length - 1]}%</strong><span>Current</span></div>
            <div className="meta-item"><strong>{Math.round(monthly.reduce((a,b)=>a+b,0)/monthly.length)}%</strong><span>Average</span></div>
            <div className="meta-item"><strong>{monthly[0]}%</strong><span>Start</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProgress;
