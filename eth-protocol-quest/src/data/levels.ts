import { Level } from '../game/types';

export const levels: Level[] = [
  {
    id: 1,
    slug: 'el-state-garden',
    title: 'EL 花圃：状态转移基础',
    topic: 'EL',
    goal: '理解账户、nonce、gas 与状态转移。',
    story: '你进入无限花园的执行花圃，每一笔交易都是一颗种子，只有规则正确才会发芽。',
    knowledgeCards: [
      '执行层（EL）负责交易执行与状态更新。',
      'Nonce 防止交易重放并约束发送顺序。',
      'Gas 为计算资源计价，防止无限执行。',
      '交易执行后会产生日志、回执与状态变化。'
    ],
    bossChallenge: '用“输入→执行→产出”三步解释状态转移函数。',
    quiz: [
      { id: '1-1', type: 'single', prompt: 'EL 最核心职责是？', options: ['市场营销', '执行交易并更新状态', '节点发现', 'DApp UI 渲染'], answerIndex: 1, explanation: 'EL 是状态机执行层。' },
      { id: '1-2', type: 'single', prompt: 'Nonce 的主要作用是？', options: ['提高区块大小', '防止重放并保持顺序', '减少 gas', '提高 TPS'], answerIndex: 1, explanation: 'Nonce 是交易序号。' },
      { id: '1-3', type: 'single', prompt: 'Gas 的设计目标不包括？', options: ['资源计价', '防 DoS', '无限循环保护', '保证所有交易免费'], answerIndex: 3, explanation: 'Gas 不是免费机制。' },
      { id: '1-4', type: 'single', prompt: '交易执行后可用于查询状态的是？', options: ['Tx receipt', 'DNS records', 'RSS feed', 'HTTP cookie'], answerIndex: 0, explanation: '回执包含执行结果与日志。' }
    ]
  },
  {
    id: 2,
    slug: 'evm-orchard',
    title: 'EVM 果园：字节码与执行语义',
    topic: 'EVM',
    goal: '理解栈机模型、opcode、内存/存储区别。',
    story: '在果园里，每个 opcode 都像园艺工具，错误组合会让果树枯萎。',
    knowledgeCards: [
      'EVM 是确定性的栈机。',
      'Memory 是临时的，Storage 是持久的。',
      'Opcode 成本不同，影响总 gas。',
      'Revert 会回滚状态但消耗部分 gas。'
    ],
    bossChallenge: '解释为什么“确定性”是全网共识前提。',
    quiz: [
      { id: '2-1', type: 'single', prompt: 'EVM 属于哪种计算模型？', options: ['栈机', '寄存器机', '图灵机磁带', '数据湖'], answerIndex: 0, explanation: 'EVM 是栈机。' },
      { id: '2-2', type: 'single', prompt: '下列哪项是持久状态？', options: ['Memory', 'Stack', 'Storage', 'Calldata'], answerIndex: 2, explanation: 'Storage 会写入状态树。' },
      { id: '2-3', type: 'single', prompt: 'Revert 的效果是？', options: ['提交所有状态变化', '回滚状态并返回错误', '跳过 gas 结算', '自动重试'], answerIndex: 1, explanation: 'Revert 回滚状态，但已消耗资源不全退。' },
      { id: '2-4', type: 'single', prompt: '为何 opcode 定价重要？', options: ['决定头像颜色', '限制资源滥用', '决定区块哈希算法', '替代共识机制'], answerIndex: 1, explanation: 'opcode 成本是资源防滥用核心。' }
    ]
  },
  {
    id: 3,
    slug: 'tx-lifecycle-river',
    title: '交易河流：从签名到最终性',
    topic: 'TX',
    goal: '掌握交易生命周期全路径。',
    story: '你沿着交易河流追踪一叶小舟：签名、广播、打包、确认、最终性。',
    knowledgeCards: [
      '交易先被签名后广播到节点。',
      '节点将交易放入 txpool/mempool。',
      '被区块提议者选中后进入区块。',
      '最终性由共识层确认，不等于刚打包。'
    ],
    bossChallenge: '按顺序写出交易生命周期至少 5 个节点。',
    quiz: [
      { id: '3-1', type: 'single', prompt: '交易广播后通常先进入？', options: ['冷钱包', 'mempool', 'Etherscan 数据库', 'IPFS'], answerIndex: 1, explanation: '交易先进入内存池。' },
      { id: '3-2', type: 'single', prompt: '“已打包”与“已最终确认”关系是？', options: ['完全等价', '打包先于最终性', '最终性先于打包', '无任何关系'], answerIndex: 1, explanation: '最终性是更强保证。' },
      { id: '3-3', type: 'single', prompt: '替换交易通常依赖提升？', options: ['nonce', 'gas fee', 'chain id', 'block hash'], answerIndex: 1, explanation: '同 nonce 更高费率可替换。' },
      { id: '3-4', type: 'single', prompt: '回执中常见字段是？', options: ['status/logs', 'TLS cert', 'JWT', 'DNS A record'], answerIndex: 0, explanation: '回执记录执行结果与日志。' }
    ]
  },
  {
    id: 4,
    slug: 'cl-consensus-hill',
    title: 'CL 山丘：Fork Choice 与 Finality',
    topic: 'CL',
    goal: '理解 slot/epoch、投票、检查点最终性。',
    story: '你来到共识山丘，验证者像园丁投票，决定哪条枝干成长为主干。',
    knowledgeCards: [
      'CL 负责区块提议、证明与最终性。',
      'Fork choice 选择当前最优链头。',
      'Finality 通过检查点机制提供经济上强不可逆保障。',
      'Slashing 用于惩罚恶意验证者行为。'
    ],
    bossChallenge: '解释“链头正确”和“经济上最终不可逆”为什么是两个层次。',
    quiz: [
      { id: '4-1', type: 'single', prompt: 'Finality 的意义是？', options: ['更快 UI 刷新', '交易经济上极低回滚概率', '减少磁盘占用', '替代执行层'], answerIndex: 1, explanation: 'Finality 是强安全保证。' },
      { id: '4-2', type: 'single', prompt: 'Fork choice 主要解决什么？', options: ['价格预言机', '当前链头选择', '节点发现', '交易签名'], answerIndex: 1, explanation: '它决定当前应跟随的分支。' },
      { id: '4-3', type: 'single', prompt: 'Slashing 目的是什么？', options: ['奖励作弊', '惩罚有害行为', '提高 block gas limit', '替代提款'], answerIndex: 1, explanation: '通过经济惩罚维护诚实行为。' },
      { id: '4-4', type: 'single', prompt: 'Slot 与 Epoch 的关系更接近？', options: ['Epoch 由多个 Slot 构成', 'Slot 由多个 Epoch 构成', '二者无关', '都表示 gas'], answerIndex: 0, explanation: 'Epoch 是 slot 的集合。' }
    ]
  },
  {
    id: 5,
    slug: 'engine-bridge',
    title: '引擎桥：Engine API 协同',
    topic: 'ENGINE',
    goal: '掌握 EL/CL 的接口协同。',
    story: '引擎桥连接两岸：共识发指令，执行回结果，桥必须稳定且可验证。',
    knowledgeCards: [
      'Engine API 是 Merge 之后 EL/CL 核心接口。',
      'CL 提供 payload 请求，EL 返回执行结果。',
      '接口异常会影响提议与同步。',
      '版本兼容性在升级时非常关键。'
    ],
    bossChallenge: '用一句话说出“EL 与 CL 解耦但协同”的工程含义。',
    quiz: [
      { id: '5-1', type: 'single', prompt: 'Engine API 连接哪两层？', options: ['EL 与 CL', 'L1 与 L2', '钱包与浏览器', 'RPC 与 DNS'], answerIndex: 0, explanation: '后合并时代核心接口。' },
      { id: '5-2', type: 'single', prompt: '如果接口不兼容可能导致？', options: ['节点 UI 变色', '提议/同步异常', '私钥泄露必然发生', 'token 自动增发'], answerIndex: 1, explanation: '协议接口异常会影响共识执行协作。' },
      { id: '5-3', type: 'single', prompt: 'Engine API 的设计价值不包括？', options: ['层间边界清晰', '便于客户端分工', '代替所有 P2P 协议', '提升协作可测试性'], answerIndex: 2, explanation: '它不是 P2P 的替代。' },
      { id: '5-4', type: 'single', prompt: 'Merge 后 CL 要求 EL 做什么？', options: ['绘制前端页面', '执行 payload 并返回状态', '管理钱包助记词', '发布博客'], answerIndex: 1, explanation: 'CL-EL 协同核心。' }
    ]
  },
  {
    id: 6,
    slug: 'eip-council-garden',
    title: 'EIP 议会花园：从想法到标准',
    topic: 'EIP',
    goal: '掌握 EIP 提案流程与协作礼仪。',
    story: '你在议会花园提交提案，接受审阅、质询、迭代，直到成熟。',
    knowledgeCards: [
      'EIP 需要动机、规范、向后兼容等核心要素。',
      '流程强调公开讨论与迭代。',
      '并非所有想法都会进入主网。',
      '测试与参考实现提升提案可信度。'
    ],
    bossChallenge: '给一个你想写的 EIP 草案标题与问题定义。',
    quiz: [
      { id: '6-1', type: 'single', prompt: 'EIP 文档最重要的是？', options: ['营销口号', '规范清晰可验证', '社媒热度', '短视频时长'], answerIndex: 1, explanation: '标准化提案强调规范性。' },
      { id: '6-2', type: 'single', prompt: '谁能提交 EIP？', options: ['仅 EF 员工', '任何人都可按规范提交', '仅客户端维护者', '仅矿工'], answerIndex: 1, explanation: '开放提案流程。' },
      { id: '6-3', type: 'single', prompt: '提案推进最关键习惯是？', options: ['忽略反馈', '持续回应评审意见', '频繁改标题', '删除测试'], answerIndex: 1, explanation: '高质量协作依赖持续反馈。' },
      { id: '6-4', type: 'single', prompt: 'EIP 与实现关系更准确的是？', options: ['提案必然自动上线', '提案通常需实现与测试支撑', '提案等于共识客户端', '提案是钱包私钥'], answerIndex: 1, explanation: '规范与实现相辅相成。' }
    ]
  },
  {
    id: 7,
    slug: 'client-lab',
    title: '客户端实验室：实现与测试',
    topic: 'CLIENT',
    goal: '从阅读代码到提交第一份贡献。',
    story: '在实验室里，你要把理解变成 PR、测试与复盘。',
    knowledgeCards: [
      '贡献不只功能开发，也包括测试与文档。',
      '小而稳定的 PR 更容易被合并。',
      '复现步骤与最小变更范围非常关键。',
      'Review 沟通能力同样重要。'
    ],
    bossChallenge: '设计一个你本周可提交的最小贡献任务。',
    quiz: [
      { id: '7-1', type: 'single', prompt: '新手最稳的贡献路径？', options: ['一次性重构全仓库', '从小修复与测试补充开始', '直接强推主分支', '只看不做'], answerIndex: 1, explanation: '可验证的小步迭代更稳。' },
      { id: '7-2', type: 'single', prompt: '高质量 issue 应包含？', options: ['模糊抱怨', '复现步骤与期望行为', '仅截图', '只写“有bug”'], answerIndex: 1, explanation: '复现信息是协作基础。' },
      { id: '7-3', type: 'single', prompt: '测试价值主要是？', options: ['增加文件数量', '防回归与明确行为边界', '提升logo质量', '减少文档需求'], answerIndex: 1, explanation: '测试是工程稳定性的核心。' },
      { id: '7-4', type: 'single', prompt: 'PR 描述应优先说明？', options: ['心情感受', '改动目的与验证方式', '个人经历', '热门标签'], answerIndex: 1, explanation: 'review 关注可验证改动信息。' }
    ]
  },
  {
    id: 8,
    slug: 'p2p-forest',
    title: 'P2P 森林：节点发现与传播',
    topic: 'CLIENT',
    goal: '理解区块与交易如何在网络中传播。',
    story: '你在森林中点亮节点灯塔，让交易与区块高效传播。',
    knowledgeCards: [
      'P2P 负责节点发现与消息传播。',
      '传播延迟影响打包与同步效率。',
      '错误的网络策略可能导致分区与孤块。',
      '协议层与网络层优化相互影响。'
    ],
    bossChallenge: '解释传播延迟为什么会放大 MEV 与重组风险。',
    quiz: [
      { id: '8-1', type: 'single', prompt: 'P2P 层核心任务之一是？', options: ['签名私钥管理', '节点发现与消息传播', '渲染前端页面', '编译 Solidity'], answerIndex: 1, explanation: '网络层核心职责。' },
      { id: '8-2', type: 'single', prompt: '传播延迟高会带来？', options: ['网络更稳定', '链上分歧风险提高', 'gas 永远更低', '无需同步'], answerIndex: 1, explanation: '延迟会增加分叉与重组概率。' },
      { id: '8-3', type: 'single', prompt: '孤块常与什么相关？', options: ['传播速度不足', 'UI 主题', '钱包图标', 'ENS 名称长度'], answerIndex: 0, explanation: '传播慢会增加孤块。' },
      { id: '8-4', type: 'single', prompt: '网络优化目标应是？', options: ['仅增大日志量', '提高有效传播与一致性', '关闭验证', '减少节点数'], answerIndex: 1, explanation: '核心是可靠传播与一致。' }
    ]
  },
  {
    id: 9,
    slug: 'fee-market-lake',
    title: '费用湖：EIP-1559 与打包策略',
    topic: 'EL',
    goal: '理解 base fee、priority fee 与用户体验。',
    story: '你在费用湖掌舵，平衡拥堵、出价与打包成功率。',
    knowledgeCards: [
      'Base fee 随区块拥堵动态调整。',
      'Priority fee 激励打包者。',
      'maxFee 与 maxPriorityFee 共同决定有效出价。',
      '费用估算影响钱包 UX 与交易成功率。'
    ],
    bossChallenge: '解释为什么 1559 不等于“交易费一定下降”。',
    quiz: [
      { id: '9-1', type: 'single', prompt: 'Base fee 特点是？', options: ['固定不变', '随拥堵动态调整', '由钱包手动指定', '可直接退回'], answerIndex: 1, explanation: '基础费动态调节。' },
      { id: '9-2', type: 'single', prompt: 'Priority fee 作用是？', options: ['给提议者激励', '替代 nonce', '写入合约存储', '决定区块时间'], answerIndex: 0, explanation: '小费用于激励打包。' },
      { id: '9-3', type: 'single', prompt: 'maxFee 太低可能导致？', options: ['永远第一时间打包', '交易长期 pending', '自动提高 nonce', '自动切换链'], answerIndex: 1, explanation: '有效费用不足会无法打包。' },
      { id: '9-4', type: 'single', prompt: '1559 改进之一是？', options: ['费用机制更可预期', '彻底消灭拥堵', '移除 gas 概念', '取消 mempool'], answerIndex: 0, explanation: '提升费用估算可预期性。' }
    ]
  },
  {
    id: 10,
    slug: 'security-grove',
    title: '安全林地：重组、审查与鲁棒性',
    topic: 'CLIENT',
    goal: '建立协议安全思维。',
    story: '在林地深处你要识别风险：重组、审查、MEV、客户端多样性。',
    knowledgeCards: [
      '短重组是现实存在的网络现象。',
      '审查阻力与去中心化参与结构相关。',
      '客户端多样性可降低单点实现风险。',
      '监控与测试是安全运营的重要部分。'
    ],
    bossChallenge: '说明“客户端多样性”为什么是协议级安全措施。',
    quiz: [
      { id: '10-1', type: 'single', prompt: '重组（reorg）本质是？', options: ['钱包密码错误', '链头分支切换', '智能合约升级', '私钥泄露'], answerIndex: 1, explanation: 'reorg 是链分支重选。' },
      { id: '10-2', type: 'single', prompt: '客户端单一化风险在于？', options: ['logo不统一', '实现缺陷放大为系统性风险', '文档变少', 'gas波动更小'], answerIndex: 1, explanation: '同一实现漏洞会放大全网影响。' },
      { id: '10-3', type: 'single', prompt: '提升审查阻力更相关于？', options: ['权限集中', '参与者与实现多样化', '单点治理', '降低节点数'], answerIndex: 1, explanation: '多样化提升抗审查能力。' },
      { id: '10-4', type: 'single', prompt: '安全工程中监控的价值？', options: ['减少测试需求', '及早发现异常行为', '替代共识', '忽略回滚'], answerIndex: 1, explanation: '监控是异常早发现手段。' }
    ]
  },
  {
    id: 11,
    slug: 'rollup-garden',
    title: 'Rollup 花廊：L2 与结算关系',
    topic: 'CLIENT',
    goal: '理解 L2 如何依赖 L1 安全与数据可用性。',
    story: '你在花廊连接 L2 分支与 L1 主干，理解扩容与安全平衡。',
    knowledgeCards: [
      'Rollup 将执行移到 L2，结算依赖 L1。',
      '数据可用性是安全前提。',
      '欺诈证明/有效性证明是不同安全模型。',
      '跨域消息带来异步与最终性延迟。'
    ],
    bossChallenge: '解释“L2 快”与“L1 安全”如何同时成立。',
    quiz: [
      { id: '11-1', type: 'single', prompt: 'Rollup 的核心思想是？', options: ['弃用 L1', 'L2 执行 + L1 结算', '仅改钱包UI', '禁用智能合约'], answerIndex: 1, explanation: '主流 L2 模式。' },
      { id: '11-2', type: 'single', prompt: '数据可用性为何关键？', options: ['决定域名长度', '关系到状态可验证性', '替代签名', '提高屏幕亮度'], answerIndex: 1, explanation: '没有数据就无法验证状态。' },
      { id: '11-3', type: 'single', prompt: '跨域消息通常是？', options: ['同步即时', '异步并有延迟', '完全免费', '无需验证'], answerIndex: 1, explanation: '跨域一般异步处理。' },
      { id: '11-4', type: 'single', prompt: 'L2 安全下限通常锚定？', options: ['社媒关注量', 'L1 安全性', 'APP 下载量', 'DNS TTL'], answerIndex: 1, explanation: '结算层安全决定下限。' }
    ]
  },
  {
    id: 12,
    slug: 'protocol-mastery-boss',
    title: '终章 Boss：协议全景整合',
    topic: 'CLIENT',
    goal: '把 EL/CL/EVM/Engine/EIP/测试串成一体。',
    story: '你来到无限花园中心，完成协议总控台挑战，成为真正的协议学徒。',
    knowledgeCards: [
      '协议学习要闭环：概念→实现→测试→协作。',
      '跨层理解比单点记忆更重要。',
      '高质量输出应可验证、可复现、可维护。',
      '核心开发成长来自持续贡献。'
    ],
    bossChallenge: '写出你未来 4 周的协议贡献计划（学习+实践+输出）。',
    quiz: [
      { id: '12-1', type: 'single', prompt: '最完整的学习闭环是？', options: ['刷题即完成', '概念-实现-测试-贡献', '只看新闻', '只做短视频'], answerIndex: 1, explanation: '协议成长必须闭环。' },
      { id: '12-2', type: 'single', prompt: 'Engine API 最能体现？', options: ['层间协同边界', 'NFT 元数据', '钱包备份机制', 'DNS 解析'], answerIndex: 0, explanation: '它是 EL/CL 边界接口。' },
      { id: '12-3', type: 'single', prompt: '高质量协议内容最重要是？', options: ['情绪表达', '可验证与可复现', '长度越长越好', '图越多越好'], answerIndex: 1, explanation: '可验证是可信基础。' },
      { id: '12-4', type: 'single', prompt: '成为核心贡献者最关键习惯？', options: ['只做大项目', '稳定持续的小步贡献', '跳过测试', '只等别人分配任务'], answerIndex: 1, explanation: '持续小步可积累真实信誉。' }
    ]
  }
];
