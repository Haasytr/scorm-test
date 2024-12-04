import React, { useState, useEffect, useCallback } from 'react';
import { Scorm12API } from 'scorm-again';

const ScormPlayer = ({ 
  scormContentUrl, 
  onLessonComplete 
}) => {
  const [scormAPI, setScormAPI] = useState(null);
  const [lessonStatus, setLessonStatus] = useState('not attempted');
  const [lessonScore, setLessonScore] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize SCORM connection
  useEffect(() => {
    const initializeScorm = async () => {
      // Configure SCORM API settings
      const settings = {
        autocommit: true,
        autocommitSeconds: 30,
        logLevel: 4, // ERROR level
        lmsCommitUrl: false, // Run without actual LMS connection
        onLogMessage: (level, message) => {
          console.log(`[SCORM LOG] ${level}: ${message}`);
        }
      };

      // Initialize SCORM 1.2 API
      const api = new Scorm12API(settings);
      
      window.API = api;
      
      try {
        // Initialize LMS
        const initialized = api.LMSInitialize('');
        if (!initialized) {
          throw new Error('SCORM Initialization failed');
        }

        // Set student information
        // api.LMSSetValue('cmi.core.student_name', 'Student');

        // Add event listeners
        api.on('LMSSetValue.cmi.core.lesson_status', (element, value) => {
          console.log(`Lesson status updated: ${value}`);
          setLessonStatus(value);
        });

        api.on('LMSSetValue.cmi.core.score.raw', (element, value) => {
          console.log(`Score updated: ${value}`);
          setLessonScore(parseFloat(value));
        });

        setScormAPI(api);
      } catch (error) {
        console.error('SCORM Initialization Error:', error);
      }

      // Cleanup on unmount
      return () => {
        if (api) {
          api.LMSFinish('');
        }
      };
    };

    const cleanup = initializeScorm();

    return () => {
      cleanup.then(cleanupFn => cleanupFn && cleanupFn());
    };
  }, []);

  // Handle lesson completion
  const handleLessonCompletion = useCallback(() => {
    if (!scormAPI) return;

    try {
      // Set lesson status
      scormAPI.LMSSetValue('cmi.core.lesson_status', 'completed');
      
      // Set lesson score (if not already set)
      if (lessonScore === 0) {
        scormAPI.LMSSetValue('cmi.core.score.raw', '100');
      }

      // Commit changes
      scormAPI.LMSCommit('');

      // Open completion modal
      setIsModalOpen(true);

      // Call optional completion callback
      if (onLessonComplete) {
        onLessonComplete({
          status: 'completed',
          score: lessonScore
        });
      }
    } catch (error) {
      console.error('Lesson Completion Error:', error);
    }
  }, [scormAPI, lessonScore, onLessonComplete]);

  // Optional method to update lesson score externally
  const updateLessonScore = useCallback((score) => {
    if (!scormAPI) return;

    try {
      scormAPI.LMSSetValue('cmi.core.score.raw', score.toString());
      setLessonScore(score);
    } catch (error) {
      console.error('Score Update Error:', error);
    }
  }, [scormAPI]);

  return (
    <div className="scorm-player w-full h-full flex flex-col">
      <div className="flex-grow">
      <iframe 
          src={"scorm/html-onepage/html-Quiz/index_scorm.html"}
          className="w-full h-full border-none"
          title="SCORM Content"
          style={{ width: '100vw', height: '70vh' }}
        />
      </div>
      
      <div className="p-4 bg-gray-100 flex justify-between items-center">
        <div>
          <p>Lesson Status: {lessonStatus}</p>
          <p>Current Score: {lessonScore}</p>
        </div>
        <button 
          onClick={handleLessonCompletion}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Complete Lesson
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Lesson Completed</h2>
            <p className="mb-4">
              You have successfully completed the lesson with a score of {lessonScore}.
            </p>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScormPlayer;