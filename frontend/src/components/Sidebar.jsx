import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';

function Sidebar({ isOpen, onToggle, structure, progress, quizResults, profile, onSwitchProfile }) {
  const [expandedPhases, setExpandedPhases] = useState({ phase1: true });
  const location = useLocation();

  const togglePhase = (phaseId) => {
    setExpandedPhases(prev => ({
      ...prev,
      [phaseId]: !prev[phaseId]
    }));
  };

  const getLessonProgress = (phaseId, moduleId, lessonId) => {
    const id = `${phaseId}-${moduleId}-${lessonId}`;
    return progress[id]?.completed || false;
  };

  const getModuleProgress = (phaseId, module) => {
    const completed = module.lessons.filter(lesson => 
      getLessonProgress(phaseId, module.id, lesson.id)
    ).length;
    return { completed, total: module.lessons.length };
  };

  const getPhaseProgress = (phase) => {
    let completed = 0;
    let total = 0;
    phase.modules.forEach(module => {
      const moduleProgress = getModuleProgress(phase.id, module);
      completed += moduleProgress.completed;
      total += moduleProgress.total;
    });
    return { completed, total };
  };

  return (
    <>
      <button 
        className={`sidebar-toggle ${isOpen ? 'open' : ''}`} 
        onClick={onToggle}
        aria-label="Toggle sidebar"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <NavLink to="/" className="logo-link">
            <span className="logo">&lt;/&gt;</span>
            <span className="logo-text">DevApp</span>
          </NavLink>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" className="nav-item dashboard-link" end>
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </NavLink>

          <div className="nav-divider"></div>

          {structure.map(phase => {
            const phaseProgress = getPhaseProgress(phase);
            const isExpanded = expandedPhases[phase.id];
            
            return (
              <div key={phase.id} className="phase-group">
                <button 
                  className={`phase-header ${isExpanded ? 'expanded' : ''}`}
                  onClick={() => togglePhase(phase.id)}
                >
                  <span className="phase-icon">{phase.icon}</span>
                  <span className="phase-title">{phase.title}</span>
                  <span className="phase-progress">
                    {phaseProgress.completed}/{phaseProgress.total}
                  </span>
                  <span className="expand-icon">{isExpanded ? '−' : '+'}</span>
                </button>

                {isExpanded && (
                  <div className="phase-content">
                    {phase.modules.map(module => {
                      const moduleProgress = getModuleProgress(phase.id, module);
                      
                      return (
                        <div key={module.id} className="module-group">
                          <div className="module-header">
                            <span className="module-title">{module.title}</span>
                            <span className="module-progress">
                              {moduleProgress.completed}/{moduleProgress.total}
                            </span>
                          </div>
                          
                          <ul className="lesson-list">
                            {module.lessons.map(lesson => {
                              const isComplete = getLessonProgress(phase.id, module.id, lesson.id);
                              const path = `/lesson/${phase.id}/${module.id}/${lesson.id}`;
                              const isActive = location.pathname === path;
                              
                              return (
                                <li key={lesson.id}>
                                  <NavLink 
                                    to={path}
                                    className={`lesson-link ${isComplete ? 'complete' : ''} ${isActive ? 'active' : ''}`}
                                  >
                                    <span className="lesson-status">
                                      {isComplete ? '✓' : '○'}
                                    </span>
                                    <span className="lesson-title">{lesson.title}</span>
                                  </NavLink>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-avatar">👤</span>
            <span className="user-name">{profile?.name}</span>
          </div>
          <button onClick={onSwitchProfile} className="logout-btn">
            Switch Profile
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;


