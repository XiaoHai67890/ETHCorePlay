export type LearningPath = {
  id: 'basic' | 'builder' | 'core';
  title: string;
  audience: string;
  milestones: string[];
};

export const learningPaths: LearningPath[] = [
  {
    id: 'basic',
    title: '基础路径（Protocol Fundamentals）',
    audience: '想系统理解以太坊协议但尚未贡献代码的学习者',
    milestones: [
      '完成 EL/CL/EVM/交易生命周期四章',
      '完成术语页复习并通过章节测评',
      '能独立讲清一笔交易从发送到最终性的全过程'
    ]
  },
  {
    id: 'builder',
    title: '开发者路径（Builder Track）',
    audience: '有开发经验，目标进入协议实现/工具建设',
    milestones: [
      '完成 Engine API、EIP 流程、客户端测试专题',
      '提交 1 次文档/测试贡献',
      '输出 1 篇结构化协议技术总结（可验证来源）'
    ]
  },
  {
    id: 'core',
    title: '核心贡献者路径（Core Contributor Track）',
    audience: '目标进入客户端/规范协作与长期贡献者角色',
    milestones: [
      '完成测试体系、安全、L2/DA 专题',
      '完成 1 次最小可合并 PR 或高质量 issue',
      '形成 4 周协议贡献计划并执行至少 1 周'
    ]
  }
];
