import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CodeEditor from './CodeEditor';
import Quiz from './Quiz';
import { courseStructure } from '../content/structure';
import { getLesson } from '../content/lessons';

function LessonViewer({ progress, quizResults, onComplete, onQuizSubmit }) {
  const { phaseId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  const lessonProgressId = `${phaseId}-${moduleId}-${lessonId}`;
  const isComplete = progress[lessonProgressId]?.completed || false;

  useEffect(() => {
    setLoading(true);
    const lessonData = getLesson(phaseId, moduleId, lessonId);
    setLesson(lessonData);
    setLoading(false);
  }, [phaseId, moduleId, lessonId]);

  const findCurrentPosition = () => {
    let prevLesson = null;
    let nextLesson = null;
    let found = false;

    for (const phase of courseStructure) {
      for (const module of phase.modules) {
        for (const l of module.lessons) {
          if (found) {
            nextLesson = { phase, module, lesson: l };
            return { prevLesson, nextLesson };
          }
          if (phase.id === phaseId && module.id === moduleId && l.id === lessonId) {
            found = true;
          } else {
            prevLesson = { phase, module, lesson: l };
          }
        }
      }
    }
    return { prevLesson, nextLesson };
  };

  const { prevLesson, nextLesson } = findCurrentPosition();

  const handleMarkComplete = () => {
    onComplete(lessonProgressId);
  };

  const handleQuizSubmit = (score, total, answers) => {
    const quizId = `${lessonProgressId}-quiz`;
    onQuizSubmit(quizId, score, total, answers);
    // Also mark lesson complete when quiz is passed
    if (score / total >= 0.7) {
      onComplete(lessonProgressId);
    }
  };

  if (loading) {
    return (
      <div className="lesson-loading">
        <div className="loading-spinner"></div>
        <p>Loading lesson...</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="lesson-not-found">
        <h2>Lesson Not Found</h2>
        <p>This lesson is not available yet.</p>
        <Link to="/" className="btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  const phase = courseStructure.find(p => p.id === phaseId);
  const module = phase?.modules.find(m => m.id === moduleId);

  return (
    <div className="lesson-viewer">
      <div className="lesson-breadcrumb">
        <Link to="/">Dashboard</Link>
        <span>/</span>
        <span>{phase?.title}</span>
        <span>/</span>
        <span>{module?.title}</span>
      </div>

      <article className="lesson-content">
        <header className="lesson-header">
          <div className="lesson-meta">
            <span className="phase-badge">{phase?.title}</span>
            {isComplete && <span className="complete-badge">✓ Complete</span>}
          </div>
          <h1>{lesson.title}</h1>
          {lesson.duration && (
            <p className="lesson-duration">⏱ {lesson.duration}</p>
          )}
        </header>

        <div className="lesson-body">
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {lesson.content}
          </ReactMarkdown>
        </div>

        {lesson.exercise && (
          <section className="lesson-exercise">
            <h2>💻 Exercise</h2>
            <p>{lesson.exercise.description}</p>
            <CodeEditor 
              initialCode={lesson.exercise.starterCode}
              expectedOutput={lesson.exercise.expectedOutput}
              hint={lesson.exercise.hint}
            />
          </section>
        )}

        {lesson.quiz && (
          <section className="lesson-quiz">
            <h2>📝 Quiz</h2>
            <Quiz 
              key={`${lessonProgressId}-quiz`}
              questions={lesson.quiz}
              quizId={`${lessonProgressId}-quiz`}
              previousResult={quizResults[`${lessonProgressId}-quiz`]}
              onSubmit={handleQuizSubmit}
            />
          </section>
        )}

        {!lesson.quiz && !isComplete && (
          <div className="lesson-complete-section">
            <button onClick={handleMarkComplete} className="btn-primary btn-complete">
              ✓ Mark as Complete
            </button>
          </div>
        )}
      </article>

      <nav className="lesson-navigation">
        {prevLesson ? (
          <Link 
            to={`/lesson/${prevLesson.phase.id}/${prevLesson.module.id}/${prevLesson.lesson.id}`}
            className="nav-btn prev"
          >
            <span className="nav-direction">← Previous</span>
            <span className="nav-title">{prevLesson.lesson.title}</span>
          </Link>
        ) : <div></div>}
        
        {nextLesson ? (
          <Link 
            to={`/lesson/${nextLesson.phase.id}/${nextLesson.module.id}/${nextLesson.lesson.id}`}
            className="nav-btn next"
          >
            <span className="nav-direction">Next →</span>
            <span className="nav-title">{nextLesson.lesson.title}</span>
          </Link>
        ) : (
          <Link to="/" className="nav-btn next">
            <span className="nav-direction">Finish →</span>
            <span className="nav-title">Back to Dashboard</span>
          </Link>
        )}
      </nav>
    </div>
  );
}

export default LessonViewer;


