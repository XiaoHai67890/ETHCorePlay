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
  ,{
    id: 'governance-eval-template',
    category: 'research',
    title: '治理提案影响评估模板',
    whenToUse: '分析协议提案对验证者/用户/基础设施影响时',
    template: [
      '提案目标与受影响角色',
      '收益变化与风险变化拆解',
      '敏感性测试场景（高/中/低）',
      '观测指标与告警阈值',
      '执行后复盘与反馈路径'
    ]
  },
  {
    id: 'cross-rollup-recovery-template',
    category: 'ops',
    title: '跨 Rollup 失败补偿模板',
    whenToUse: '跨域消息失败、超时或重放异常时',
    template: [
      '异常类型（超时/失败/重放）',
      '影响范围与用户状态',
      '补偿动作与执行顺序',
      '幂等检查与回滚策略',
      '用户通知与后续追踪'
    ]
  }
  ,{
    id: 'wallet-signing-check-template',
    category: 'ops',
    title: '签名安全检查模板（前端/合约）',
    whenToUse: '设计签名流程、Permit 授权、风控提示时',
    template: [
      '签名域字段检查（chainId/verifyingContract/name/version）',
      '关键参数展示（spender/amount/deadline/nonce）',
      '授权最小化策略（额度+有效期）',
      '重放防护验证与异常告警',
      '用户提示与撤销授权入口'
    ]
  },
  {
    id: 'oracle-integrity-template',
    category: 'ops',
    title: '预言机完整性治理模板',
    whenToUse: '接入或升级预言机数据源时',
    template: [
      '数据源清单与聚合逻辑',
      '新鲜度阈值与异常检测规则',
      '降级模式触发条件',
      '恢复校验与回放验证',
      '事故复盘与参数优化记录'
    ]
  },
  {
    id: 'upgrade-oncall-template',
    category: 'ops',
    title: '协议升级值班模板（On-call）',
    whenToUse: '主网升级窗口与高风险变更值班',
    template: [
      '变更窗口与冻结范围',
      '值班人员与升级链路',
      'P0/P1/P2 告警与处置动作',
      '回滚触发条件与执行步骤',
      '复盘输出与改进项跟踪'
    ]
  }
  ,{
    id: 'ens-security-template',
    category: 'ops',
    title: 'ENS 解析安全模板',
    whenToUse: '钱包/应用展示 ENS 并执行转账或授权时',
    template: [
      '解析来源与更新时间',
      '域名-地址双展示与关键字段校验',
      '同形字符风险检测',
      '高风险操作二次确认策略',
      '异常解析降级与告警'
    ]
  },
  {
    id: 'orderflow-routing-template',
    category: 'ops',
    title: '订单流路由策略模板',
    whenToUse: '设计公开/私有路由切换与防夹策略时',
    template: [
      '交易类型分层（普通/高风险/高价值）',
      '路由选择规则与切换阈值',
      '失败回退与重试上限',
      '执行质量指标与告警',
      '策略复盘与参数回调'
    ]
  }
  ,{
    id: 'aa-hardening-template',
    category: 'ops',
    title: 'AA 生产化加固模板',
    whenToUse: 'EIP-4337 钱包从测试到生产上线时',
    template: [
      'Bundler 路由与失败回退策略',
      'Paymaster 风控阈值（额度/频率/信誉）',
      '关键指标与告警策略',
      '用户失败提示与重试入口',
      'EOA 紧急回退与复盘流程'
    ]
  }
  ,{
    id: 'bridge-incident-template',
    category: 'ops',
    title: 'Bridge 事故响应模板',
    whenToUse: '桥接异常、资金风险、对账差异出现时',
    template: [
      '异常信号与触发阈值',
      '冻结动作与审批链路',
      '资产快照与影响评估',
      '恢复前验证回放步骤',
      '用户沟通与补偿方案'
    ]
  },
  {
    id: 'gas-optimization-template',
    category: 'testing',
    title: 'Gas 优化实验模板',
    whenToUse: '进行热点路径优化与收益验证时',
    template: [
      '基线成本与测试向量',
      '优化方案A/B对比',
      '收益指标（gas/时延/失败率）',
      '安全回归检查',
      '上线建议与回滚条件'
    ]
  }
];
