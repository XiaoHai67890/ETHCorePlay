export type ChapterMapNode = {
  chapterId: string;
  chapterTitle: string;
  keyTerms: string[];
  practiceTitles: string[];
};

export const chapterMap: ChapterMapNode[] = [
  {
    chapterId: 'el-core',
    chapterTitle: 'EL 执行层核心',
    keyTerms: ['State Transition', 'Nonce', 'Gas', 'Base Fee', 'Receipt'],
    practiceTitles: ['手动追踪一笔交易状态变化', '费用参数调优']
  },
  {
    chapterId: 'cl-core',
    chapterTitle: 'CL 共识层核心',
    keyTerms: ['Fork Choice', 'Finality', 'Slot', 'Epoch', 'Slashing'],
    practiceTitles: ['构建 CL 事件时间线', '分析短重组案例']
  },
  {
    chapterId: 'evm-core',
    chapterTitle: 'EVM 执行模型',
    keyTerms: ['Opcode', 'Memory', 'Storage', 'Calldata', 'Revert'],
    practiceTitles: ['函数执行成本拆解', '错误路径分析']
  },
  {
    chapterId: 'tx-lifecycle-core',
    chapterTitle: '交易生命周期全链路',
    keyTerms: ['Signed Tx', 'Txpool', 'Inclusion', 'Finality', 'Replacement Tx'],
    practiceTitles: ['交易全链路观测日志', '失败案例复盘模板']
  },
  {
    chapterId: 'engine-api-core',
    chapterTitle: 'Engine API 协同',
    keyTerms: ['Engine API', 'Execution Payload', 'Client Compatibility'],
    practiceTitles: ['版本兼容检查', '接口故障排障演练']
  },
  {
    chapterId: 'eip-workflow-core',
    chapterTitle: 'EIP 流程实践',
    keyTerms: ['EIP Lifecycle', 'Draft', 'Review', 'Reference Implementation'],
    practiceTitles: ['拆解经典 EIP', '写微型提案草稿']
  },
  {
    chapterId: 'client-testing-core',
    chapterTitle: '客户端实现与测试',
    keyTerms: ['Unit Test', 'Integration Test', 'Regression', 'PR Review'],
    practiceTitles: ['最小贡献任务设计', 'PR 交付包']
  },
  {
    chapterId: 'testing-systems-core',
    chapterTitle: '测试体系专题',
    keyTerms: ['Test Vector', 'Determinism', 'Regression'],
    practiceTitles: ['历史 bug 回归测试', '一致性测试向量设计']
  },
  {
    chapterId: 'security-core',
    chapterTitle: '安全专题',
    keyTerms: ['Reorg', 'Censorship Resistance', 'Incident Response'],
    practiceTitles: ['确认策略分级设计', '安全事件复盘模板']
  },
  {
    chapterId: 'l2-da-core',
    chapterTitle: 'L2/DA 专题',
    keyTerms: ['Rollup', 'Settlement', 'Data Availability', 'Bridge'],
    practiceTitles: ['L2→L1 结算路径图', 'DA 假设对比表']
  }
];
