import { create } from 'zustand';
import { defaultKnowledgeMap, KnowledgeNode } from './knowledgeMap';

type WrongQuestion = {
  levelId: number;
  questionId: string;
  prompt: string;
  explanation: string;
  ts: number;
};

type ChapterResult = { score: number; total: number; passed: boolean; threshold?: number; wrongIds?: string[]; history?: number[] };

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
  completeLevel: (id: number, gainedXp: number) => void;
  addWrongQuestion: (q: WrongQuestion) => void;
  clearWrongBook: () => void;
  setKnowledgeStatus: (id: string, status: KnowledgeNode['status']) => void;
  setChapterResult: (chapterId: string, result: ChapterResult) => void;
  addStudyMinutes: (chapterId: string, minutes: number) => void;
  addStudyEvent: (chapterId: string, action: string, detail?: string) => void;
  awardBadge: (badge: string) => void;
  setLastVisitedChapter: (chapterId: string) => void;
};

export const useProgressStore = create<ProgressState>((set) => ({
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
      const avg = history.reduce((a,b)=>a+b,0)/history.length;
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
  setLastVisitedChapter: (chapterId) => set({ lastVisitedChapter: chapterId })
}));
