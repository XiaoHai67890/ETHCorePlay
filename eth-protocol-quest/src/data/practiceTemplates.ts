export type PracticeTemplate = {
  id: string;
  category: 'client' | 'testing';
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
];
