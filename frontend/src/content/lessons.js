// Lesson content loader
// This file imports all lesson content and provides a lookup function

import * as phase1Dsa from './phase1/dsa';
import * as phase1CoreCs from './phase1/core-cs';
import * as phase2CleanArch from './phase2/clean-arch';
import * as phase2Patterns from './phase2/patterns';
import * as phase2Backend from './phase2/backend';
import * as phase2Testing from './phase2/testing';
import * as phase3Reading from './phase3/reading-code';
import * as phase4JobQueue from './phase4/job-queue';

const lessonModules = {
  'phase1': {
    'dsa': phase1Dsa,
    'core-cs': phase1CoreCs,
  },
  'phase2': {
    'clean-arch': phase2CleanArch,
    'patterns': phase2Patterns,
    'backend': phase2Backend,
    'testing': phase2Testing,
  },
  'phase3': {
    'reading-code': phase3Reading,
  },
  'phase4': {
    'job-queue': phase4JobQueue,
  },
};

export function getLesson(phaseId, moduleId, lessonId) {
  const phaseModules = lessonModules[phaseId];
  if (!phaseModules) return null;
  
  const moduleContent = phaseModules[moduleId];
  if (!moduleContent) return null;
  
  // Convert lesson-id to lessonId (kebab to camel)
  const lessonKey = lessonId.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  
  return moduleContent[lessonKey] || moduleContent.default?.[lessonId] || null;
}


