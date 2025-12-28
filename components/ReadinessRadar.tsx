
import React, { useState, useEffect } from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import { DimensionScores } from '../types';

interface Props {
  scores: DimensionScores;
}

const ReadinessRadar: React.FC<Props> = ({ scores }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const data = [
    { subject: 'Concepts', A: scores.concepts, fullMark: 100 },
    { subject: 'Application', A: scores.application, fullMark: 100 },
    { subject: 'Problem Solving', A: scores.problemSolving, fullMark: 100 },
    { subject: 'Fluency', A: scores.technicalFluency, fullMark: 100 },
    { subject: 'Discipline', A: scores.discipline, fullMark: 100 },
    { subject: 'Self-Awareness', A: scores.selfAwareness, fullMark: 100 },
  ];

  const gridColor = isDark ? '#334155' : '#e2e8f0'; // slate-700 : slate-200
  const textColor = isDark ? '#94a3b8' : '#64748b'; // slate-400 : slate-500
  const tooltipBg = isDark ? '#1e293b' : '#ffffff'; // slate-800 : white

  return (
    <div className="h-[450px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke={gridColor} />
          <PolarAngleAxis dataKey="subject" tick={{ fill: textColor, fontSize: 13, fontWeight: 600 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              backgroundColor: tooltipBg,
              color: isDark ? '#f1f5f9' : '#0f172a'
            }}
            itemStyle={{ color: '#6366f1', fontWeight: 'bold' }}
          />
          <Radar
            name="Readiness Score"
            dataKey="A"
            stroke="#6366f1"
            strokeWidth={3}
            fill="#6366f1"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReadinessRadar;
