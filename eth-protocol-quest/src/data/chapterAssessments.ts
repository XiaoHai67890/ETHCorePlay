export type AssessmentQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

export type ChapterAssessment = {
  chapterId: string;
  passThreshold: number; // 0-1
  questions: AssessmentQuestion[];
};

export const chapterAssessments: ChapterAssessment[] = [
  {
    chapterId: 'el-core',
    passThreshold: 0.7,
    questions: [
      { id: 'el-a1', prompt: 'EL 的主要职责是？', options: ['执行交易并更新状态', '做媒体传播', '提供 DNS', '管理钱包 UI'], answerIndex: 0, explanation: 'EL 是执行与状态层。' },
      { id: 'el-a2', prompt: 'Nonce 的主要作用是？', options: ['增加 gas', '防重放并排序', '提高 TPS', '降低延迟'], answerIndex: 1, explanation: 'Nonce 防重放并限制顺序。' },
      { id: 'el-a3', prompt: '1559 中动态变化的是？', options: ['chainId', 'baseFee', 'nonce', 'logs'], answerIndex: 1, explanation: 'baseFee 随拥堵动态调整。' }
    ]
  },
  {
    chapterId: 'cl-core',
    passThreshold: 0.7,
    questions: [
      { id: 'cl-a1', prompt: 'Finality 表示？', options: ['刚打包', '几乎不可逆', '钱包已签名', '节点已同步'], answerIndex: 1, explanation: 'Finality 是强不可逆保障。' },
      { id: 'cl-a2', prompt: 'Fork choice 解决什么问题？', options: ['手续费计算', '链头选择', '密钥管理', 'RPC 限流'], answerIndex: 1, explanation: '核心是链头选择。' },
      { id: 'cl-a3', prompt: 'Slashing 用于？', options: ['奖励恶意行为', '惩罚有害行为', '增加区块容量', '替代共识'], answerIndex: 1, explanation: '经济惩罚维护安全。' }
    ]
  },
  {
    chapterId: 'evm-core',
    passThreshold: 0.7,
    questions: [
      { id: 'evm-a1', prompt: 'EVM 是？', options: ['确定性栈机', '关系数据库', '流媒体服务', '消息队列'], answerIndex: 0, explanation: 'EVM 为确定性栈机。' },
      { id: 'evm-a2', prompt: '持久数据位置是？', options: ['Memory', 'Storage', 'Stack', 'Calldata'], answerIndex: 1, explanation: 'Storage 持久化。' },
      { id: 'evm-a3', prompt: 'Revert 的影响是？', options: ['提交状态', '回滚状态并报错', '跳过 gas', '强制成功'], answerIndex: 1, explanation: '回滚状态。' }
    ]
  },
  {
    chapterId: 'tx-lifecycle-core',
    passThreshold: 0.7,
    questions: [
      { id: 'tx-a1', prompt: '交易广播后通常先进入？', options: ['mempool', 'IPFS', '冷钱包', 'DNS'], answerIndex: 0, explanation: '先入 mempool。' },
      { id: 'tx-a2', prompt: '“已打包”是否等于最终不可逆？', options: ['是', '否'], answerIndex: 1, explanation: '需最终性确认。' },
      { id: 'tx-a3', prompt: '同 nonce 替换交易通常需？', options: ['更高费率', '更低费率', '更短 data', '不同 chain'], answerIndex: 0, explanation: '更高费率常用于替换。' }
    ]
  },
  {
    chapterId: 'engine-api-core',
    passThreshold: 0.7,
    questions: [
      { id: 'eng-a1', prompt: 'Engine API 主要连接哪两层？', options: ['EL 和 CL', 'L1 和 L2', '钱包和浏览器', '数据库和缓存'], answerIndex: 0, explanation: 'Merge 后核心是 EL/CL 协同。' },
      { id: 'eng-a2', prompt: 'EL/CL 版本不兼容可能导致？', options: ['主题色变化', '提议/同步异常', '自动扩容', '自动降费'], answerIndex: 1, explanation: '接口不兼容会导致链路异常。' },
      { id: 'eng-a3', prompt: 'Engine API 的工程价值是？', options: ['层间边界标准化', '替代全部 P2P 协议', '管理私钥', '替代 EIP'], answerIndex: 0, explanation: '核心是标准化层间接口。' }
    ]
  },
  {
    chapterId: 'eip-workflow-core',
    passThreshold: 0.7,
    questions: [
      { id: 'eip-a1', prompt: '高质量 EIP 核心是？', options: ['营销口号', '规范清晰可验证', '点赞数高', '图片精美'], answerIndex: 1, explanation: 'EIP 首先是规范文档。' },
      { id: 'eip-a2', prompt: 'EIP 通过后是否自动上主网？', options: ['是', '否'], answerIndex: 1, explanation: '仍需实现、测试、协调。' },
      { id: 'eip-a3', prompt: '推进提案最重要习惯是？', options: ['忽略反馈', '持续回应审阅意见', '隐藏细节', '跳过测试'], answerIndex: 1, explanation: '迭代反馈是关键。' }
    ]
  },
  {
    chapterId: 'client-testing-core',
    passThreshold: 0.7,
    questions: [
      { id: 'ct-a1', prompt: '新手贡献更稳路径是？', options: ['大重构', '小修复+测试', '直接改主分支', '只提想法'], answerIndex: 1, explanation: '可验证小步贡献更稳。' },
      { id: 'ct-a2', prompt: 'PR 说明应优先包含？', options: ['情绪感受', '改动目的与验证方式', '头像链接', '粉丝数量'], answerIndex: 1, explanation: 'review 关注可验证信息。' },
      { id: 'ct-a3', prompt: '测试最核心价值是？', options: ['增加文件数量', '防回归和明确边界', '减少文档', '替代代码评审'], answerIndex: 1, explanation: '测试是稳定性核心。' }
    ]
  },
  {
    chapterId: 'testing-systems-core',
    passThreshold: 0.7,
    questions: [
      { id: 'ts-a1', prompt: '回归测试的主要目的？', options: ['让 CI 更慢', '防止历史 bug 再次出现', '替代需求评审', '替代监控'], answerIndex: 1, explanation: '回归测试保障修复有效。' },
      { id: 'ts-a2', prompt: '一致性测试重点是？', options: ['UI 一致', '不同实现结果一致', '日志格式一致', '图片尺寸一致'], answerIndex: 1, explanation: '协议层看结果一致性。' },
      { id: 'ts-a3', prompt: '高质量测试向量应？', options: ['随机且不可复现', '可复现且边界清晰', '只有正常路径', '不包含期望输出'], answerIndex: 1, explanation: '可复现是关键。' }
    ]
  },
  {
    chapterId: 'security-core',
    passThreshold: 0.7,
    questions: [
      { id: 'sec-a1', prompt: '重组（reorg）本质是？', options: ['链头分支切换', '钱包签名失败', '私钥泄露', '代币增发'], answerIndex: 0, explanation: 'reorg 是分支重选。' },
      { id: 'sec-a2', prompt: '提升系统鲁棒性的重要做法？', options: ['客户端单一化', '客户端多样性', '禁用测试', '关闭监控'], answerIndex: 1, explanation: '多样性降低系统性风险。' },
      { id: 'sec-a3', prompt: '安全运营应包含？', options: ['仅上线一次', '持续监控与演练', '仅靠人工记忆', '仅看社媒'], answerIndex: 1, explanation: '持续运营是安全前提。' }
    ]
  },
  {
    chapterId: 'l2-da-core',
    passThreshold: 0.7,
    questions: [
      { id: 'l2-a1', prompt: 'Rollup 的核心是？', options: ['L2 执行 + L1 结算', '完全脱离 L1', '只改前端', '只改钱包'], answerIndex: 0, explanation: '主流 rollup 模式。' },
      { id: 'l2-a2', prompt: 'DA 的重要性在于？', options: ['提高头像清晰度', '保障状态可验证性', '替代签名', '减少节点数量'], answerIndex: 1, explanation: '无 DA 难以独立验证。' },
      { id: 'l2-a3', prompt: '跨域消息通常具备？', options: ['同步即时', '异步与延迟', '免费无限', '无需验证'], answerIndex: 1, explanation: '跨域多数是异步流程。' }
    ]
  }
];
