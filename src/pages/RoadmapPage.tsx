import React from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import data from '../data.json';
import { Data } from '../types';

const typedData = data as Data;

interface RoadmapPageProps {
  sidebarOpen?: boolean;
}

const RoadmapPage: React.FC<RoadmapPageProps> = ({ sidebarOpen }) => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const role = typedData.roles.find(r => r.id === roleId);

  if (!role) return <Navigate to="/" />;

  const handleChapterClick = (lessonId: string) => {
    console.log(`[Roadmap] Chapter clicked, navigating to lesson: ${lessonId}`);
    navigate(`/role/${roleId}/lesson/${lessonId}`);
  };

  return (
    <div className="roadmap-page">
      <Sidebar role={role} isOpen={sidebarOpen} />
      <main className="main-content">
        <div className="roadmap-container">
          <h1 className="roadmap-title">{role.name} Roadmap</h1>
          <p className="roadmap-subtitle">
            Follow this structured path to master {role.name}. Each chapter contains lessons and practice problems to reinforce your learning.
          </p>

          {role.skills.map(skill => (
            <div key={skill.id} className="skill-section-roadmap">
              <h2 className="skill-title-roadmap">
                {skill.title}
              </h2>
              <div className="chapter-grid">
                {skill.chapters.map(chapter => (
                  <div 
                    key={chapter.id} 
                    className="chapter-card"
                    onClick={() => handleChapterClick(chapter.lessons[0].id)}
                  >
                    <h3 className="chapter-card-title">{chapter.title}</h3>
                    <ul className="chapter-lesson-list">
                      {chapter.lessons.map(lesson => (
                        <li key={lesson.id} className="chapter-lesson-item">
                          <span className="bullet">•</span>
                          {lesson.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default RoadmapPage;
