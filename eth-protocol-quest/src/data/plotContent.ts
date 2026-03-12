export type PlotContent = {
  id: string;
  title: string;
  subtitle: string;
  sections: {
    intuition: string;
    definition: string;
    mechanism: string;
    failure: string;
    miniLab: string[];
    quiz: { q: string; opts: string[]; ans: number }[];
  };
  prereqs: string[];
};

export const plotContentMap: Record<string, PlotContent> = {
  'el-core': {
    id: 'el-core',
    title: 'EL 执行层核心',
    subtitle: '状态转移与 gas 机制',
    sections: {
      intuition: '执行层像状态机引擎：输入交易，输出新状态与回执。',
      definition: 'EL 负责交易执行、状态更新、回执日志；最终性由 CL 提供。',
      mechanism: '交易进入 txpool -> 提议者打包 -> EVM 执行 -> receipt 返回。',
      failure: '常见失败：nonce 冲突、gas 估算偏差、执行 revert。',
      miniLab: ['发送一笔测试交易', '记录 nonce/balance 前后变化', '分析 gasUsed 与回执字段'],
      quiz: [
        { q: 'EL 的核心职责是？', opts: ['执行交易更新状态', '提供最终性', '管理 DNS'], ans: 0 },
        { q: '最终性由谁提供？', opts: ['EL', 'CL', '钱包'], ans: 1 },
        { q: 'revert 的结果是？', opts: ['状态提交', '状态回滚', '强制成功'], ans: 1 }
      ]
    },
    prereqs: ['tx-lifecycle-core']
  }
};
