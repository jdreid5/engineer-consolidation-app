import { useState, useEffect } from 'react';

function Quiz({ questions, quizId, previousResult, onSubmit }) {
  const storageKey = `quiz-answers-${quizId}`;
  
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  // Load saved answers from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Restore if the number of questions matches
        if (parsed.answers && Object.keys(parsed.answers).length <= questions.length) {
          setAnswers(parsed.answers);
          if (parsed.submitted) {
            setSubmitted(true);
            setScore(parsed.score);
          }
        }
      }
    } catch (e) {
      console.error('Failed to load saved quiz answers:', e);
    }
  }, [storageKey, questions.length]);

  // Save answers to localStorage whenever they change (including after submission)
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      try {
        localStorage.setItem(storageKey, JSON.stringify({
          answers,
          submitted,
          score
        }));
      } catch (e) {
        console.error('Failed to save quiz answers:', e);
      }
    }
  }, [answers, submitted, score, storageKey]);

  const handleAnswer = (questionIndex, answerIndex) => {
    if (submitted) return;
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) {
        correct++;
      }
    });
    
    setScore(correct);
    setSubmitted(true);
    onSubmit(correct, questions.length, answers);
    // State will be saved to localStorage via useEffect
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(null);
    
    // Clear saved answers on retry
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      console.error('Failed to clear saved quiz answers:', e);
    }
  };

  const allAnswered = Object.keys(answers).length === questions.length;
  const percentage = score !== null ? Math.round((score / questions.length) * 100) : null;
  const passed = percentage !== null && percentage >= 70;

  return (
    <div className="quiz-container">
      {previousResult && !submitted && (
        <div className="previous-result">
          <span>Previous best: {previousResult.percentage}%</span>
        </div>
      )}

      <div className="quiz-questions">
        {questions.map((question, qIndex) => {
          const isAnswered = answers[qIndex] !== undefined;
          const isCorrect = submitted && answers[qIndex] === question.correctAnswer;
          const isWrong = submitted && answers[qIndex] !== question.correctAnswer && isAnswered;

          return (
            <div key={qIndex} className={`quiz-question ${submitted ? (isCorrect ? 'correct' : isWrong ? 'wrong' : '') : ''}`}>
              <h4>
                <span className="question-number">{qIndex + 1}.</span>
                {question.question}
              </h4>
              
              <div className="quiz-options">
                {question.options.map((option, oIndex) => {
                  const isSelected = answers[qIndex] === oIndex;
                  const isCorrectAnswer = question.correctAnswer === oIndex;
                  
                  let optionClass = 'quiz-option';
                  if (isSelected) optionClass += ' selected';
                  if (submitted && isCorrectAnswer) optionClass += ' correct';
                  if (submitted && isSelected && !isCorrectAnswer) optionClass += ' wrong';

                  return (
                    <button
                      key={oIndex}
                      className={optionClass}
                      onClick={() => handleAnswer(qIndex, oIndex)}
                      disabled={submitted}
                    >
                      <span className="option-letter">
                        {String.fromCharCode(65 + oIndex)}
                      </span>
                      <span className="option-text">{option}</span>
                      {submitted && isCorrectAnswer && (
                        <span className="option-indicator">✓</span>
                      )}
                      {submitted && isSelected && !isCorrectAnswer && (
                        <span className="option-indicator">✗</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {submitted && question.explanation && (
                <div className="question-explanation">
                  <strong>Explanation:</strong> {question.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!submitted ? (
        <div className="quiz-actions">
          <button 
            onClick={handleSubmit} 
            disabled={!allAnswered}
            className="btn-primary"
          >
            Submit Quiz
          </button>
          {!allAnswered && (
            <p className="quiz-hint">Answer all questions to submit</p>
          )}
        </div>
      ) : (
        <div className="quiz-results">
          <div className={`result-card ${passed ? 'passed' : 'failed'}`}>
            <div className="result-score">
              <span className="score-number">{score}</span>
              <span className="score-divider">/</span>
              <span className="score-total">{questions.length}</span>
            </div>
            <div className="result-percentage">{percentage}%</div>
            <div className="result-message">
              {passed ? '🎉 Great job! You passed!' : '📚 Keep studying and try again!'}
            </div>
          </div>
          
          <button onClick={handleRetry} className="btn-secondary">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

export default Quiz;


