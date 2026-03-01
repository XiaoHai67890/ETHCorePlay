export type LessonSection = {
  heading: string;
  points: string[];
};

export type PracticeTask = {
  title: string;
  steps: string[];
};

export type Chapter = {
  id: string;
  title: string;
  level: 'basic' | 'intermediate' | 'advanced';
  objective: string;
  sections: LessonSection[];
  pitfalls: string[];
  glossary: string[];
  practice: PracticeTask[];
};
