import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LessonViewer from './components/LessonViewer';
import ProfileGate from './components/ProfileGate';
import { courseStructure } from './content/structure';
import { clearActiveProfileId } from './storage/settings';
import { getProgressMap, markLessonComplete } from './storage/progress';
import { getBestQuizScores, submitQuizResult } from './storage/quizzes';

function App() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({});
  const [quizResults, setQuizResults] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // App state is gated by ProfileGate; this effect only controls initial loading spinner.
    setLoading(false);
  }, []);

  useEffect(() => {
    if (profile) {
      loadProgress(profile.profileId);
      loadQuizResults(profile.profileId);
    }
  }, [profile]);

  const loadProgress = async (profileId) => {
    try {
      const map = await getProgressMap(profileId);
      setProgress(map || {});
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  };

  const loadQuizResults = async (profileId) => {
    try {
      const best = await getBestQuizScores(profileId);
      setQuizResults(best || {});
    } catch (error) {
      console.error('Failed to load quiz results:', error);
    }
  };

  const switchProfile = () => {
    clearActiveProfileId();
    setProfile(null);
    setProgress({});
    setQuizResults({});
  };

  const markComplete = async (lessonId) => {
    if (!profile) return;
    try {
      await markLessonComplete(profile.profileId, lessonId);
      setProgress((prev) => ({
        ...prev,
        [lessonId]: { completed: true, completedAt: new Date().toISOString() },
      }));
    } catch (error) {
      console.error('Failed to mark complete:', error);
    }
  };

  const submitQuiz = async (quizId, score, totalQuestions, answers) => {
    if (!profile) return;
    try {
      const { completedAt, percentage } = await submitQuizResult(
        profile.profileId,
        quizId,
        score,
        totalQuestions,
        answers
      );
      setQuizResults((prev) => {
        const prevBest = prev[quizId];
        if (!prevBest || percentage > prevBest.percentage) {
          return {
            ...prev,
            [quizId]: { score, totalQuestions, percentage, completedAt },
          };
        }
        return prev;
      });
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!profile) {
    return <ProfileGate onProfileReady={setProfile} />;
  }

  return (
    <div className="app">
      <Sidebar 
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        structure={courseStructure}
        progress={progress}
        quizResults={quizResults}
        profile={profile}
        onSwitchProfile={switchProfile}
      />
      <main className={`main-content ${sidebarOpen ? '' : 'sidebar-closed'}`}>
        <Routes>
          <Route 
            path="/" 
            element={
              <Dashboard 
                structure={courseStructure}
                progress={progress}
                quizResults={quizResults}
                profile={profile}
              />
            } 
          />
          <Route 
            path="/lesson/:phaseId/:moduleId/:lessonId" 
            element={
              <LessonViewer 
                progress={progress}
                quizResults={quizResults}
                onComplete={markComplete}
                onQuizSubmit={submitQuiz}
              />
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;


