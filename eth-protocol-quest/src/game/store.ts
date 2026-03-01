import { create } from 'zustand';
import { defaultKnowledgeMap, KnowledgeNode } from './knowledgeMap';

type WrongQuestion = {
  levelId: number;
  questionId: string;
  prompt: string;
  explanation: string;
  ts: number;
};

type ChapterResult = { score: number; total: number; passed: boolean; threshold?: number; wrongIds?: string[] };

type ProgressState = {
  xp: number;
  unlockedLevel: number;
  completed: Record<number, boolean>;
  wrongBook: WrongQuestion[];
  knowledgeMap: KnowledgeNode[];
  chapterResults: Record<string, ChapterResult>;
  completeLevel: (id: number, gainedXp: number) => void;
  addWrongQuestion: (q: WrongQuestion) => void;
  clearWrongBook: () => void;
  setKnowledgeStatus: (id: string, status: KnowledgeNode['status']) => void;
  setChapterResult: (chapterId: string, result: ChapterResult) => void;
};

export const useProgressStore = create<ProgressState>((set) => ({
  xp: 0,
  unlockedLevel: 1,
  completed: {},
  wrongBook: [],
  knowledgeMap: defaultKnowledgeMap,
  chapterResults: {},
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
    set((s) => ({
      chapterResults: { ...s.chapterResults, [chapterId]: result }
    }))
}));
