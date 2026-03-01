export type ChapterChecklist = {
  chapterId: string;
  items: string[];
};

export const chapterChecklists: ChapterChecklist[] = [
  { chapterId: 'el-core', items: ['读完核心概念', '完成章节测评', '完成至少1个实战任务'] },
  { chapterId: 'cl-core', items: ['理解fork choice与finality差异', '完成章节测评', '输出1条确认策略笔记'] },
  { chapterId: 'evm-core', items: ['区分memory/storage/calldata', '完成章节测评', '完成1次gas成本分析'] },
  { chapterId: 'tx-lifecycle-core', items: ['画出交易生命周期', '完成章节测评', '做1次失败交易复盘'] },
  { chapterId: 'engine-api-core', items: ['理解EL/CL接口协同', '完成章节测评', '完成1次兼容性检查'] },
  { chapterId: 'eip-workflow-core', items: ['读1篇高质量EIP', '完成章节测评', '写1份微型提案草稿'] },
  { chapterId: 'client-testing-core', items: ['掌握最小贡献路径', '完成章节测评', '准备1份PR交付包'] },
  { chapterId: 'testing-systems-core', items: ['理解测试金字塔', '完成章节测评', '补1条回归测试设计'] },
  { chapterId: 'security-core', items: ['理解重组与确认分层', '完成章节测评', '完成1次安全复盘模板'] },
  { chapterId: 'l2-da-core', items: ['理解L2/L1结算关系', '完成章节测评', '完成1份DA对比表'] },
  { chapterId: 'el-deep-state-trie', items: ['理解状态树与证明', '完成章节测评（如有）', '完成热点路径分析'] },
  { chapterId: 'cl-deep-forkchoice-finality', items: ['理解最终性延迟场景', '完成章节测评（如有）', '完成演练记录'] }
];
