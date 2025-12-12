import { Link } from 'react-router-dom';

function Dashboard({ structure, progress, quizResults, profile }) {
  const getTotalLessons = () => {
    let total = 0;
    structure.forEach(phase => {
      phase.modules.forEach(module => {
        total += module.lessons.length;
      });
    });
    return total;
  };

  const getCompletedLessons = () => {
    return Object.values(progress).filter(p => p.completed).length;
  };

  const getPhaseStats = (phase) => {
    let completed = 0;
    let total = 0;
    phase.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        total++;
        const id = `${phase.id}-${module.id}-${lesson.id}`;
        if (progress[id]?.completed) completed++;
      });
    });
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const getNextLesson = () => {
    for (const phase of structure) {
      for (const module of phase.modules) {
        for (const lesson of module.lessons) {
          const id = `${phase.id}-${module.id}-${lesson.id}`;
          if (!progress[id]?.completed) {
            return { phase, module, lesson };
          }
        }
      }
    }
    return null;
  };

  const totalLessons = getTotalLessons();
  const completedLessons = getCompletedLessons();
  const overallPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const nextLesson = getNextLesson();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome back, {profile.name}!</h1>
        <p>Continue your journey to becoming a better software engineer.</p>
      </header>

      <section className="stats-overview">
        <div className="stat-card primary">
          <div className="stat-ring">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" className="ring-bg" />
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                className="ring-progress"
                style={{ 
                  strokeDasharray: `${overallPercentage * 2.83} 283`,
                }}
              />
            </svg>
            <span className="stat-percentage">{overallPercentage}%</span>
          </div>
          <div className="stat-info">
            <h3>Overall Progress</h3>
            <p>{completedLessons} of {totalLessons} lessons completed</p>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">📚</span>
          <div className="stat-info">
            <h3>{completedLessons}</h3>
            <p>Lessons Completed</p>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">🎯</span>
          <div className="stat-info">
            <h3>{Object.keys(quizResults).length}</h3>
            <p>Quizzes Passed</p>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">🔥</span>
          <div className="stat-info">
            <h3>{totalLessons - completedLessons}</h3>
            <p>Lessons Remaining</p>
          </div>
        </div>
      </section>

      {nextLesson && (
        <section className="continue-learning">
          <h2>Continue Learning</h2>
          <Link 
            to={`/lesson/${nextLesson.phase.id}/${nextLesson.module.id}/${nextLesson.lesson.id}`}
            className="next-lesson-card"
          >
            <div className="next-lesson-info">
              <span className="phase-badge">{nextLesson.phase.title}</span>
              <h3>{nextLesson.lesson.title}</h3>
              <p>{nextLesson.module.title}</p>
            </div>
            <span className="continue-arrow">→</span>
          </Link>
        </section>
      )}

      <section className="phase-overview">
        <h2>Learning Path</h2>
        <div className="phase-cards">
          {structure.map(phase => {
            const stats = getPhaseStats(phase);
            return (
              <div key={phase.id} className="phase-card">
                <div className="phase-card-header">
                  <span className="phase-icon-large">{phase.icon}</span>
                  <div className="phase-card-title">
                    <h3>{phase.title}</h3>
                    <span className="phase-weeks">{phase.weeks}</span>
                  </div>
                </div>
                <p className="phase-description">{phase.description}</p>
                <div className="phase-progress-bar">
                  <div 
                    className="phase-progress-fill"
                    style={{ width: `${stats.percentage}%` }}
                  ></div>
                </div>
                <div className="phase-progress-text">
                  <span>{stats.completed}/{stats.total} lessons</span>
                  <span>{stats.percentage}%</span>
                </div>
                <div className="phase-modules">
                  {phase.modules.map(module => (
                    <Link 
                      key={module.id}
                      to={`/lesson/${phase.id}/${module.id}/${module.lessons[0].id}`}
                      className="module-link"
                    >
                      {module.title}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;


