import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Role } from '../types';

interface SidebarProps {
  role: Role;
  isOpen?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ role, isOpen }) => {
  const { lessonId } = useParams<{ lessonId: string }>();

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <h2 className="sidebar-title">{role.name} Roadmap</h2>
      {role.skills.map(skill => (
        <div key={skill.id} className="skill-section">
          {skill.chapters.map(chapter => (
            <div key={chapter.id} className="chapter-item">
              <h3 className="chapter-title">{chapter.title}</h3>
              <div className="lesson-list">
                {chapter.lessons.map(lesson => (
                  <Link
                    key={lesson.id}
                    to={`/role/${role.id}/lesson/${lesson.id}`}
                    className={`lesson-link ${lessonId === lesson.id ? 'active' : ''}`}
                  >
                    {lesson.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </aside>
  );
};

export default Sidebar;
