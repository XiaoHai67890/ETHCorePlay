import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { defaultKnowledgeMap, KnowledgeNode } from './knowledgeMap';

type WrongQuestion = {
  levelId: number;
  questionId: string;
  prompt: string;
  explanation: string;
  ts: number;
};

type ChapterResult = { score: number; total: number; passed: boolean; threshold?: number; wrongIds?: string[]; history?: number[] };
type ModuleExecution = { sourceRead: boolean; checkpointDone: boolean; outputSubmitted: boolean; outputLink?: string };

type ProgressState = {
  xp: number;
  unlockedLevel: number;
  completed: Record<number, boolean>;
  wrongBook: WrongQuestion[];
  knowledgeMap: KnowledgeNode[];
  chapterResults: Record<string, ChapterResult>;
  chapterMastery: Record<string, '初学' | '掌握' | '巩固'>;
  studyMinutes: Record<string, number>;
  studyHistory: Record<string, Array<{ ts: number; action: string; detail?: string }>>;
  badges: string[];
  lastVisitedChapter?: string;
  lastVisitedSection?: string;

  // unified persisted learning UI states
  curriculumDone: Record<string, boolean>;
  curriculumChecklist: Record<string, Record<number, boolean>>;
  curriculumExpanded: Record<string, boolean>;
  onboardingTasks: Record<string, boolean>;
  moduleProgress: Record<string, ModuleExecution>;

  completeLevel: (id: number, gainedXp: number) => void;
  addWrongQuestion: (q: WrongQuestion) => void;
  clearWrongBook: () => void;
  setKnowledgeStatus: (id: string, status: KnowledgeNode['status']) => void;
  setChapterResult: (chapterId: string, result: ChapterResult) => void;
  addStudyMinutes: (chapterId: string, minutes: number) => void;
  addStudyEvent: (chapterId: string, action: string, detail?: string) => void;
  awardBadge: (badge: string) => void;
  setLastVisitedChapter: (chapterId: string) => void;
  setLastVisitedSection: (sectionId: string) => void;

  setCurriculumDone: (chapterId: string, done: boolean) => void;
  toggleCurriculumChecklist: (chapterId: string, idx: number) => void;
  markCurriculumChecklist: (chapterId: string, idx: number, checked: boolean) => void;
  toggleCurriculumExpanded: (chapterId: string) => void;
  setOnboardingTask: (key: string, checked: boolean) => void;
  setModuleSourceRead: (moduleSlug: string, checked: boolean) => void;
  setModuleCheckpointDone: (moduleSlug: string, checked: boolean) => void;
  setModuleOutput: (moduleSlug: string, checked: boolean, outputLink?: string) => void;
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      xp: 0,
      unlockedLevel: 1,
      completed: {},
      wrongBook: [],
      knowledgeMap: defaultKnowledgeMap,
      chapterResults: {},
      chapterMastery: {},
      studyMinutes: {},
      studyHistory: {},
      badges: [],
      lastVisitedChapter: undefined,
      lastVisitedSection: undefined,
      curriculumDone: {},
      curriculumChecklist: {},
      curriculumExpanded: {},
      onboardingTasks: { read: false, quiz: false, replay: false, report: false },
      moduleProgress: {},
      completeLevel: (id, gainedXp) =>
        set((s) => ({
          xp: s.xp + gainedXp,
          completed: { ...s.completed, [id]: true },
          unlockedLevel: Math.max(s.unlockedLevel, id + 1)
        })),
      addWrongQuestion: (q) =>
        set((s) => {
          const existed = s.wrongBook.find((x) => x.questionId === q.questionId && x.levelId === q.levelId);
          if (existed) return s;
          return { wrongBook: [q, ...s.wrongBook].slice(0, 100) };
        }),
      clearWrongBook: () => set({ wrongBook: [] }),
      setKnowledgeStatus: (id, status) =>
        set((s) => ({
          knowledgeMap: s.knowledgeMap.map((n) => (n.id === id ? { ...n, status } : n))
        })),
      setChapterResult: (chapterId, result) =>
        set((s) => {
          const prev = s.chapterResults[chapterId];
          const prevHist = prev?.history || [];
          const currRate = result.score / Math.max(1, result.total);
          const history = [...prevHist, currRate].slice(-5);
          const avg = history.reduce((a, b) => a + b, 0) / history.length;
          let mastery: '初学' | '掌握' | '巩固' = '初学';
          if (avg >= 0.7) mastery = '掌握';
          if (avg >= 0.85 && history.length >= 2) mastery = '巩固';

          return {
            chapterResults: { ...s.chapterResults, [chapterId]: { ...result, history } },
            chapterMastery: { ...s.chapterMastery, [chapterId]: mastery }
          };
        }),
      addStudyMinutes: (chapterId, minutes) =>
        set((s) => ({
          studyMinutes: {
            ...s.studyMinutes,
            [chapterId]: Math.max(0, (s.studyMinutes[chapterId] || 0) + minutes)
          },
          studyHistory: {
            ...s.studyHistory,
            [chapterId]: [
              ...(s.studyHistory[chapterId] || []),
              { ts: Date.now(), action: 'study_minutes', detail: `+${minutes}min` }
            ].slice(-40)
          }
        })),
      addStudyEvent: (chapterId, action, detail) =>
        set((s) => ({
          studyHistory: {
            ...s.studyHistory,
            [chapterId]: [
              ...(s.studyHistory[chapterId] || []),
              { ts: Date.now(), action, detail }
            ].slice(-40)
          }
        })),
      awardBadge: (badge) =>
        set((s) => ({ badges: s.badges.includes(badge) ? s.badges : [...s.badges, badge] })),
      setLastVisitedChapter: (chapterId) => set({ lastVisitedChapter: chapterId }),
      setLastVisitedSection: (sectionId) => set({ lastVisitedSection: sectionId }),
      setCurriculumDone: (chapterId, done) =>
        set((s) => ({ curriculumDone: { ...s.curriculumDone, [chapterId]: done } })),
      toggleCurriculumChecklist: (chapterId, idx) =>
        set((s) => ({
          curriculumChecklist: {
            ...s.curriculumChecklist,
            [chapterId]: {
              ...(s.curriculumChecklist[chapterId] || {}),
              [idx]: !(s.curriculumChecklist[chapterId] || {})[idx]
            }
          }
        })),
      markCurriculumChecklist: (chapterId, idx, checked) =>
        set((s) => ({
          curriculumChecklist: {
            ...s.curriculumChecklist,
            [chapterId]: {
              ...(s.curriculumChecklist[chapterId] || {}),
              [idx]: checked
            }
          }
        })),
      toggleCurriculumExpanded: (chapterId) =>
        set((s) => ({ curriculumExpanded: { ...s.curriculumExpanded, [chapterId]: !s.curriculumExpanded[chapterId] } })),
      setOnboardingTask: (key, checked) =>
        set((s) => ({ onboardingTasks: { ...s.onboardingTasks, [key]: checked } })),
      setModuleSourceRead: (moduleSlug, checked) =>
        set((s) => ({
          moduleProgress: {
            ...s.moduleProgress,
            [moduleSlug]: {
              sourceRead: checked,
              checkpointDone: s.moduleProgress[moduleSlug]?.checkpointDone || false,
              outputSubmitted: s.moduleProgress[moduleSlug]?.outputSubmitted || false,
              outputLink: s.moduleProgress[moduleSlug]?.outputLink || ''
            }
          }
        })),
      setModuleCheckpointDone: (moduleSlug, checked) =>
        set((s) => ({
          moduleProgress: {
            ...s.moduleProgress,
            [moduleSlug]: {
              sourceRead: s.moduleProgress[moduleSlug]?.sourceRead || false,
              checkpointDone: checked,
              outputSubmitted: s.moduleProgress[moduleSlug]?.outputSubmitted || false,
              outputLink: s.moduleProgress[moduleSlug]?.outputLink || ''
            }
          }
        })),
      setModuleOutput: (moduleSlug, checked, outputLink) =>
        set((s) => ({
          moduleProgress: {
            ...s.moduleProgress,
            [moduleSlug]: {
              sourceRead: s.moduleProgress[moduleSlug]?.sourceRead || false,
              checkpointDone: s.moduleProgress[moduleSlug]?.checkpointDone || false,
              outputSubmitted: checked,
              outputLink: outputLink ?? s.moduleProgress[moduleSlug]?.outputLink ?? ''
            }
          }
        }))
    }),
    {
      name: 'epq-progress-v2',
      version: 3,
      storage: createJSONStorage(() => localStorage),
      migrate: (persisted: any) => {
        if (!persisted || typeof persisted !== 'object') return persisted;
        return {
          ...persisted,
          curriculumDone: persisted.curriculumDone || persisted.done || {},
          curriculumChecklist: persisted.curriculumChecklist || persisted.checklistState || {},
          curriculumExpanded: persisted.curriculumExpanded || persisted.expandedChapters || {},
          onboardingTasks: persisted.onboardingTasks || { read: false, quiz: false, replay: false, report: false },
          moduleProgress: persisted.moduleProgress || {}
        };
      }
    }
  )
);
