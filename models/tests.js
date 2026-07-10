/**
 * MODEL: tests.js
 * Central registry of all IELTS & PTE test metadata.
 * Controllers use this to build navigation and test listings.
 */

const TestsModel = {

  /**
   * IELTS Exam structure with all modules and sub-types
   */
  ielts: {
    id: 'ielts',
    name: 'IELTS',
    fullName: 'International English Language Testing System',
    icon: '🎓',
    color: 'purple',
    description: 'The world\'s most popular English proficiency test accepted by over 11,000 organizations globally.',
    modules: {
      listening: {
        id: 'listening',
        name: 'Listening',
        icon: '🎧',
        color: 'teal',
        description: '40 questions across 4 sections. Duration: 30 minutes + 10 minutes transfer.',
        duration: 40,
        totalTests: 204,
        totalQuestions: 40,
        sections: 4
      },
      reading: {
        id: 'reading',
        name: 'Reading',
        icon: '📖',
        color: 'purple',
        description: '40 questions across 3 passages. Academic: 60 minutes. General: 60 minutes.',
        duration: 60,
        totalTests: 350,
        totalQuestions: 40,
        passages: 3,
        types: ['Academic', 'General Training']
      },
      writing: {
        id: 'writing',
        name: 'Writing',
        icon: '✍️',
        color: 'orange',
        description: 'Task 1 (150 words) + Task 2 (250 words). Duration: 60 minutes.',
        duration: 60,
        totalTests: 15,
        tasks: 2,
        types: ['Academic', 'General Training']
      },
      speaking: {
        id: 'speaking',
        name: 'Speaking',
        icon: '🎤',
        color: 'green',
        description: 'Face-to-face interview with 3 parts. Duration: 11–14 minutes.',
        duration: 14,
        totalTests: 15,
        parts: 3
      }
    }
  },

  /**
   * PTE Academic Exam structure
   */
  pte: {
    id: 'pte',
    name: 'PTE Academic',
    fullName: 'Pearson Test of English Academic',
    icon: '💼',
    color: 'teal',
    description: 'AI-scored computer-based English proficiency test accepted by thousands of universities worldwide.',
    modules: {
      speaking: {
        id: 'speaking',
        name: 'Speaking & Writing',
        icon: '🎤',
        color: 'teal',
        description: '5 task types including Read Aloud, Repeat Sentence, Describe Image, Re-tell Lecture, Answer Short Question, and Essay.',
        duration: 77,
        totalTests: 15
      },
      reading: {
        id: 'reading',
        name: 'Reading',
        icon: '📖',
        color: 'purple',
        description: 'Multiple choice, reordering paragraphs, filling blanks. Duration: 32–41 minutes.',
        duration: 41,
        totalTests: 15
      },
      listening: {
        id: 'listening',
        name: 'Listening',
        icon: '🎧',
        color: 'orange',
        description: 'Summarize spoken text, multiple choice, highlight correct summary, fill blanks. Duration: 45–57 minutes.',
        duration: 57,
        totalTests: 15
      }
    }
  },

  /**
   * Get all test types for an exam module
   * @param {string} exam - 'ielts' | 'pte'
   * @param {string} module - 'listening' | 'reading' | 'writing' | 'speaking'
   * @param {number} count - number of tests to generate
   * @returns {Array} list of test metadata objects
   */
  getTestList(exam, module, count = 1) {
    const examData = this[exam];
    if (!examData) return [];
    const moduleData = examData.modules[module];
    if (!moduleData) return [];

    // Default to 0 tests. Only show tests that are actively loaded in the models.
    let realCount = 0;
    if (exam === 'ielts' && module === 'listening' && typeof ListeningModel !== 'undefined' && ListeningModel.getAvailableIELTSTests) {
      realCount = ListeningModel.getAvailableIELTSTests().length;
    }
    if (exam === 'ielts' && module === 'reading' && typeof ReadingModel !== 'undefined' && ReadingModel.getAvailableIELTSTests) {
      realCount = ReadingModel.getAvailableIELTSTests().length;
    }
    if (exam === 'ielts' && module === 'writing' && typeof WritingModel !== 'undefined' && WritingModel.getAvailableIELTSTests) {
      realCount = WritingModel.getAvailableIELTSTests().length;
    }
    if (exam === 'ielts' && module === 'speaking' && typeof SpeakingModel !== 'undefined' && SpeakingModel.getAvailableIELTSTests) {
      realCount = SpeakingModel.getAvailableIELTSTests().length;
    }
    
    return Array.from({ length: realCount }, (_, i) => ({
      id: i + 1,
      exam,
      module,
      title: `${examData.name} ${moduleData.name} Test ${i + 1}`,
      shortTitle: `Test ${i + 1}`,
      duration: moduleData.duration,
      questions: moduleData.totalQuestions || 20,
      difficulty: 'Intermediate',
      difficultyColor: 'orange',
      completed: false,
      score: null
    }));
  }
};
