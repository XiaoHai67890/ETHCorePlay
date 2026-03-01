export type PracticeTemplate = {
  id: string;
  category: 'client' | 'testing' | 'ops' | 'research';
  title: string;
  whenToUse: string;
  template: string[];
};

export const practiceTemplates: PracticeTemplate[] = [
  {
    id: 'issue-repro-template',
    category: 'client',
    title: '客户端 Issue 复现模板',
    whenToUse: '提交 bug 或行为异常问题时',
    template: [
      '环境信息：客户端版本/OS/网络',
      '复现步骤：1..2..3..（最小可复现）',
      '期望行为 vs 实际行为',
      '日志片段与时间戳',
      '临时绕过方案（如有）'
    ]
  },
  {
    id: 'pr-delivery-template',
    category: 'client',
    title: 'PR 交付说明模板',
    whenToUse: '提交客户端改动 PR 时',
    template: [
      '变更动机（为什么改）',
      '改动范围（改了哪些文件/模块）',
      '验证方式（测试命令与结果）',
      '风险评估（潜在影响）',
      '回滚策略（必要时）'
    ]
  },
  {
    id: 'regression-test-template',
    category: 'testing',
    title: '回归测试模板',
    whenToUse: '修复缺陷后防止复发',
    template: [
      '关联缺陷编号/描述',
      '最小失败用例（修复前应失败）',
      '修复后期望结果',
      '边界输入覆盖',
      'CI 执行记录'
    ]
  },
  {
    id: 'consistency-vector-template',
    category: 'testing',
    title: '跨客户端一致性向量模板',
    whenToUse: '验证不同客户端行为一致',
    template: [
      '输入向量定义（交易/区块/状态）',
      '客户端A输出',
      '客户端B输出',
      '差异分析',
      '结论与后续动作'
    ]
  }
  ,{
    id: 'client-min-lab-template',
    category: 'client',
    title: '客户端最小可跑实验模板（EL/CL）',
    whenToUse: '搭建 geth/nethermind + lighthouse/prysm 最小实验时',
    template: [
      '客户端组合与版本矩阵',
      '启动命令与关键参数',
      '健康检查指标（同步/peer/最终性）',
      '异常场景与恢复步骤',
      '实验结论与后续优化项'
    ]
  },
  {
    id: 'chaos-lite-template',
    category: 'ops',
    title: 'Chaos-lite 故障注入模板',
    whenToUse: '做最终性延迟/peer 抖动/relay 中断演练时',
    template: [
      '演练目标与影响范围',
      '注入动作与持续时长',
      '观测指标与告警阈值',
      '恢复动作与回滚开关',
      '复盘结论与改进 backlog'
    ]
  },
  {
    id: 'eip-workbench-template',
    category: 'research',
    title: 'EIP 阅读工作台模板（五栏）',
    whenToUse: '阅读/评审 EIP 并准备实现方案时',
    template: [
      '动机：问题定义与边界',
      '规范：MUST/SHOULD 条款清单',
      '兼容：向后兼容与迁移成本',
      '安全：新增攻击面与缓解机制',
      '实现影响：客户端改动点与测试向量'
    ]
  }
];
