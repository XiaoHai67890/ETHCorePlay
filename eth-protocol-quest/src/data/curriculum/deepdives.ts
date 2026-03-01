import { Chapter } from '../../game/curriculumTypes';

export const deepDiveChapters: Chapter[] = [
  {
    id: 'el-deep-state-trie',
    title: 'EL 深层：状态树、存储树与 Merkle Patricia Trie',
    level: 'advanced',
    objective: '理解状态承诺结构、证明可验证性与读写成本来源。',
    sections: [
      {
        heading: '状态承诺结构',
        points: [
          '账户状态通过 trie 根承诺到区块头。',
          '合约存储也有独立存储树。',
          '状态证明依赖路径节点可验证性。'
        ]
      },
      {
        heading: '读写路径与成本',
        points: [
          '写 storage 的成本高于读 memory。',
          '路径深度与热点键分布影响访问性能。',
          '状态膨胀会影响节点运行成本。'
        ]
      },
      {
        heading: '细粒度小节：状态证明与验证路径',
        points: [
          '账户证明与存储证明路径长度不同。',
          '证明验证开销与节点结构有关。',
          '应用层可利用证明做轻验证与索引优化。'
        ]
      },
      {
        heading: '工程实践',
        points: [
          '设计合约时应减少不必要持久写入。',
          '事件日志用于索引，不替代状态一致性。',
          '调优时优先识别高频 SSTORE 路径。'
        ]
      }
    ],
    pitfalls: [
      '把日志当作可替代状态。',
      '忽视存储写放大带来的长期成本。',
      '只看单次交易 gas，不看长期状态负担。'
    ],
    glossary: ['State Trie', 'Storage Trie', 'State Root', 'Merkle Proof', 'SSTORE'],
    practice: [
      {
        title: '状态访问热点分析',
        steps: [
          '选一个合约函数统计 storage 读写次数。',
          '识别最贵写路径并提出优化方案。',
          '比较优化前后 gas 成本差异。'
        ]
      }
    ]
  },
  {
    id: 'cl-deep-forkchoice-finality',
    title: 'CL 深层：Fork Choice 细节与最终性故障模式',
    level: 'advanced',
    objective: '理解链头选择、最终性延迟与异常条件下的恢复策略。',
    sections: [
      {
        heading: 'Fork choice 关键机制',
        points: [
          '链头选择基于最新投票权重。',
          '延迟消息可能影响短时链头判断。',
          '节点实现需处理乱序与网络抖动。'
        ]
      },
      {
        heading: '最终性延迟场景',
        points: [
          '验证者离线比例上升可导致最终性延迟。',
          '网络分区会放大短重组概率。',
          '运维层需及时观察并告警。'
        ]
      },
      {
        heading: '细粒度小节：最终性异常的可观测信号',
        points: [
          'epoch 级最终性延迟可作为一级告警。',
          '链头切换频率上升可作为二级告警。',
          '验证者在线率下降是关键先行指标。'
        ]
      },
      {
        heading: '恢复与风险控制',
        points: [
          '确认策略应区分打包确认与最终性确认。',
          '关键业务可采用更保守确认阈值。',
          '事件复盘应覆盖网络、客户端、配置三层。'
        ]
      }
    ],
    pitfalls: [
      '把链头瞬时变化误判为协议故障。',
      '忽视验证者在线率对最终性的影响。',
      '没有分级确认策略。'
    ],
    glossary: ['Fork Choice', 'Finality Delay', 'Reorg Window', 'Checkpoint', 'Validator Liveness'],
    practice: [
      {
        title: '最终性延迟演练',
        steps: [
          '构造“最终性延迟”演练场景。',
          '记录监控指标变化与告警触发。',
          '输出恢复操作手册。'
        ]
      }
    ]
  }
  ,{
    id: 'client-contrib-deep',
    title: '客户端贡献深度实操：从 Issue 到合并',
    level: 'advanced',
    objective: '将协议学习转化为真实开源贡献能力。',
    sections: [
      {
        heading: '细粒度小节：Issue 选择与范围控制',
        points: [
          '优先选择可复现、边界清晰的小任务。',
          '避免首次贡献就跨多个模块。',
          '先确认预期行为再写代码。'
        ]
      },
      {
        heading: '细粒度小节：测试先行与证据链',
        points: [
          '先写失败测试，后写修复。',
          'PR 描述必须包含验证命令和结果。',
          '保留日志、截图、对比输出作为证据。'
        ]
      },
      {
        heading: '细粒度小节：Review 协作策略',
        points: [
          '针对每条 review 给出明确响应。',
          '必要时补基准测试/边界案例。',
          '迭代后更新 PR 摘要便于二次审阅。'
        ]
      }
    ],
    pitfalls: [
      '提交过大 PR 导致审阅阻塞。',
      '没有测试证据导致反复回退。',
      '忽视 review 背后的协议约束。'
    ],
    glossary: ['Issue Triage', 'Repro Steps', 'Regression Proof', 'PR Review Loop'],
    practice: [
      {
        title: '实战：最小贡献闭环模板',
        steps: [
          '选择一个 issue 并确认范围。',
          '编写失败测试并记录预期输出。',
          '提交修复 + 证据链 + review 响应记录。'
        ]
      }
    ]
  },
  {
    id: 'testing-deep-harness',
    title: '测试深度实操：测试夹具与一致性回归流水线',
    level: 'advanced',
    objective: '建立可持续的测试工程实践（不是一次性脚本）。',
    sections: [
      {
        heading: '细粒度小节：测试夹具（Harness）设计',
        points: [
          '将重复 setup 抽象为可复用夹具。',
          '输入向量与期望输出应版本化。',
          '失败信息必须可定位模块边界。'
        ]
      },
      {
        heading: '细粒度小节：一致性回归流水线',
        points: [
          '同向量在多实现上定期执行。',
          '差异自动归档并生成告警。',
          '把高频问题沉淀为固定回归集。'
        ]
      },
      {
        heading: '细粒度小节：CI 质量门禁',
        points: [
          '关键测试失败应阻止合并。',
          '区分 flaky 与 deterministic failure。',
          '建立“修复+补测”强约束流程。'
        ]
      }
    ],
    pitfalls: [
      '测试无法复现导致“玄学通过”。',
      '只测 happy path，边界无覆盖。',
      '缺少多实现对比，隐藏一致性风险。'
    ],
    glossary: ['Test Harness', 'Flaky Test', 'CI Gate', 'Cross-client Consistency'],
    practice: [
      {
        title: '实战：搭建最小一致性流水线',
        steps: [
          '定义 3 组测试向量（正常/边界/异常）。',
          '在两种实现中执行并记录结果。',
          '把差异收敛成回归测试用例。'
        ]
      }
    ]
  }
  ,{
    id: 'p2p-gossip-deep',
    title: '网络深潜：Gossip 传播、Peer Score 与消息风暴抑制',
    level: 'advanced',
    objective: '理解以太坊节点网络层如何在真实性能与抗攻击之间平衡。',
    sections: [
      {
        heading: '细粒度小节：Gossip 传播路径与延迟来源',
        points: [
          '消息通常通过多跳传播，不是单次广播即全网可见。',
          '拓扑结构、节点质量与带宽会直接影响传播延迟。',
          '同一消息在不同节点到达时间差可能触发短时分歧。'
        ]
      },
      {
        heading: '细粒度小节：Peer Score 与抗垃圾策略',
        points: [
          '节点会基于行为质量给 peer 打分并动态调整连接权重。',
          '持续发送低质量/重复消息的 peer 会被降权或断连。',
          '评分策略需要平衡误伤率与抗攻击强度。'
        ]
      },
      {
        heading: '细粒度小节：消息风暴与限流治理',
        points: [
          '突发热点事件会导致消息放大，触发带宽与 CPU 压力。',
          '合理的 topic 限流、缓存与背压可降低雪崩风险。',
          '观测指标应覆盖入站速率、丢包率、重传比、处理时延。'
        ]
      }
    ],
    pitfalls: [
      '误把传播延迟当作共识故障。',
      '盲目提高限流阈值导致节点过载。',
      '忽视 peer score 规则与业务流量特征不匹配。'
    ],
    glossary: ['GossipSub', 'Peer Score', 'Backpressure', 'Message Storm', 'Propagation Delay'],
    practice: [
      {
        title: '实战：网络传播观测面板设计',
        steps: [
          '定义核心指标：传播时延、重传率、失效率、活跃 peer 数。',
          '构建阈值告警与分级响应策略。',
          '通过一次压力演练验证告警与限流策略。'
        ]
      }
    ]
  },
  {
    id: 'mev-builder-relay-deep',
    title: 'MEV 与区块构建链路：Builder / Relay / Proposer 协作实务',
    level: 'advanced',
    objective: '理解现代区块构建链路中的角色边界、信任假设与风险控制。',
    sections: [
      {
        heading: '细粒度小节：角色分工与价值流',
        points: [
          'Builder 负责构建收益优化区块候选。',
          'Relay 在信息隔离与传递中承担中介角色。',
          'Proposer 在时限内选择候选并出块。'
        ]
      },
      {
        heading: '细粒度小节：可信执行与信息泄露风险',
        points: [
          '链路中的可见性差异会影响公平性与审查风险。',
          '错误的 relay 信任假设可能放大单点故障。',
          '需要从可用性、透明度、故障转移角度设计 fallback。'
        ]
      },
      {
        heading: '细粒度小节：工程治理与监控指标',
        points: [
          '关注提案成功率、超时率、候选多样性与回退路径命中率。',
          '建立 relay 异常时的自动降级策略。',
          '对高价值业务增加更保守确认策略与审计日志。'
        ]
      }
    ],
    pitfalls: [
      '只追求收益最大化，忽略可用性和安全性。',
      '单 relay 依赖导致系统性中断风险。',
      '无 fallback 方案导致提议时隙浪费。'
    ],
    glossary: ['MEV', 'Builder', 'Relay', 'Proposer', 'PBS', 'Fallback Path'],
    practice: [
      {
        title: '实战：构建链路故障演练手册',
        steps: [
          '定义 relay 异常场景与分级故障类型。',
          '设计自动降级策略与手动应急流程。',
          '输出“故障→恢复→复盘”的闭环模板。'
        ]
      }
    ]
  }
  ,{
    id: 'verkle-stateless-deep',
    title: 'Verkle / Stateless Ethereum：状态承诺升级与无状态执行路径',
    level: 'advanced',
    objective: '理解 Verkle 树与 Stateless Ethereum 的设计动机、工程收益与落地挑战。',
    sections: [
      {
        heading: '细粒度小节：为什么需要从 MPT 走向 Verkle',
        points: [
          '状态规模增长导致证明体积与验证开销持续上升。',
          'Verkle 通过向量承诺压缩证明大小并提升验证效率。',
          '目标是降低节点同步与状态访问负担。'
        ]
      },
      {
        heading: '细粒度小节：Stateless Ethereum 核心思路',
        points: [
          '把执行所需 witness 随区块/交易携带，减少节点对完整状态的依赖。',
          '节点可在更低存储负担下验证执行正确性。',
          '关键挑战在 witness 生成、传播与验证成本平衡。'
        ]
      },
      {
        heading: '细粒度小节：落地风险与迁移策略',
        points: [
          '状态承诺切换需要兼容过渡窗口与双轨验证策略。',
          '客户端实现需处理 witness 缺失/异常路径。',
          '需要测试向量覆盖“证明正确但性能退化”场景。'
        ]
      }
    ],
    pitfalls: [
      '把 Verkle 当作纯性能优化，忽略协议与运维复杂度。',
      '低估 witness 传播对网络层的压力。',
      '只关注理论证明，不做客户端工程验证。'
    ],
    glossary: ['Verkle Tree', 'Vector Commitment', 'Stateless Ethereum', 'Witness', 'State Access'],
    practice: [
      {
        title: '实战：Stateless 迁移评估清单',
        steps: [
          '列出当前依赖完整状态的关键流程。',
          '为每条流程定义 witness 需求与失败回退。',
          '输出迁移优先级与测试覆盖计划。'
        ]
      }
    ]
  },
  {
    id: 'eip4844-da-economics-deep',
    title: 'EIP-4844（Blob）与 DA 成本模型：吞吐、费用与可用性平衡',
    level: 'advanced',
    objective: '掌握 Blob 引入后的数据可用性成本结构及其对 L2 经济性的影响。',
    sections: [
      {
        heading: '细粒度小节：Blob 与 Calldata 的角色差异',
        points: [
          'Blob 为 DA 场景提供更高性价比的数据承载路径。',
          'Calldata 与 Blob 在可访问性、保留周期、费用模型上不同。',
          '工程上需要明确“长期可读数据”与“短期 DA 数据”边界。'
        ]
      },
      {
        heading: '细粒度小节：双费用市场与成本波动',
        points: [
          'Blob gas 与 execution gas 分离，形成双市场动态。',
          'L2 批次策略需对 blob 费用波动有弹性。',
          '成本控制需结合批量大小、延迟容忍与确认策略。'
        ]
      },
      {
        heading: '细粒度小节：运营层指标与策略',
        points: [
          '监控每批次 DA 成本、失败重试率与确认延迟。',
          '建立“高波动时降频/扩批”的自适应策略。',
          '通过历史窗口回测优化批处理参数。'
        ]
      }
    ],
    pitfalls: [
      '把 blob 成本当作恒定值，不做波动建模。',
      '忽略批次失败重试对总成本的放大。',
      '没有成本上限策略导致高峰期失控。'
    ],
    glossary: ['EIP-4844', 'Blob', 'Blob Gas', 'Data Availability', 'Batching Economics'],
    practice: [
      {
        title: '实战：L2 批处理成本模拟',
        steps: [
          '设定 3 种负载场景（低/中/高）。',
          '模拟不同批次大小下的 blob 成本与延迟。',
          '输出成本-时延帕累托最优策略。'
        ]
      }
    ]
  },
  {
    id: 'pbs-inclusion-censorship-deep',
    title: 'PBS / Inclusion List / Censorship Resistance：抗审查实战案例包',
    level: 'advanced',
    objective: '系统理解提议-构建分离与 inclusion list 机制在抗审查中的作用与局限。',
    sections: [
      {
        heading: '细粒度小节：PBS 的目标与现实约束',
        points: [
          'PBS 通过角色分离提升构建效率并降低部分中心化压力。',
          '现实中仍需关注 relay 集中与信息不对称风险。',
          '需要把可用性与公平性一起纳入评估。'
        ]
      },
      {
        heading: '细粒度小节：Inclusion List 的治理价值',
        points: [
          'Inclusion list 提升“最低交易可包含性”保障。',
          '机制设计需平衡强制性、复杂度与滥用防护。',
          '与 mempool 策略、提议时隙约束存在耦合。'
        ]
      },
      {
        heading: '细粒度小节：抗审查演练框架',
        points: [
          '定义审查事件等级与观测指标（遗漏率、延迟、恢复时长）。',
          '建立多 relay + fallback + 审计日志闭环。',
          '复盘应覆盖协议层、客户端层、运营层改进项。'
        ]
      }
    ],
    pitfalls: [
      '只讨论理论公平性，不做运行时指标治理。',
      '单一路径依赖导致抗审查能力脆弱。',
      '缺少演练，导致策略在真实事件中失效。'
    ],
    glossary: ['PBS', 'Inclusion List', 'Censorship Resistance', 'Relay Diversity', 'Fallback'],
    practice: [
      {
        title: '实战：抗审查事件复盘模板',
        steps: [
          '记录事件窗口内交易包含率与延迟分布。',
          '定位失败路径（构建/中继/提议/网络）。',
          '输出下一轮治理与工程改进 backlog。'
        ]
      }
    ]
  }
  ,{
    id: 'account-abstraction-deep',
    title: '账户抽象（AA）深度：ERC-4337、Bundler 与 Paymaster 机制',
    level: 'advanced',
    objective: '掌握账户抽象交易链路与安全边界，能够设计可落地的 AA 钱包策略。',
    sections: [
      {
        heading: '细粒度小节：UserOperation 与 Bundler 流程',
        points: [
          'AA 通过 UserOperation 替代传统交易入口。',
          'Bundler 聚合并提交到链上入口合约。',
          '模拟执行失败会直接影响打包可用性。'
        ]
      },
      {
        heading: '细粒度小节：Paymaster 赞助与风控',
        points: [
          'Paymaster 可为用户代付 gas，但需防止滥用。',
          '常见策略：额度、白名单、行为评分。',
          '需要对失败率与恶意调用建立监控。'
        ]
      },
      {
        heading: '细粒度小节：安全边界与回退方案',
        points: [
          '签名验证、nonce 管理与重放防护是核心。',
          '聚合签名与批处理需防批量失败放大。',
          '业务必须准备 EOA 回退与紧急开关。'
        ]
      }
    ],
    pitfalls: [
      '只看 UX 提升，忽略攻击面扩大。',
      'Paymaster 无风控导致成本失控。',
      '缺少回退方案导致服务中断。'
    ],
    glossary: ['Account Abstraction', 'ERC-4337', 'UserOperation', 'Bundler', 'Paymaster'],
    practice: [
      {
        title: '实战：AA 钱包风控策略设计',
        steps: [
          '定义 3 类用户（新手/活跃/高风险）与额度策略。',
          '设计 paymaster 拒绝规则与告警阈值。',
          '输出异常时 EOA 回退流程。'
        ]
      }
    ]
  }
  ,{
    id: 'eof-pectra-deep',
    title: 'EOF / Pectra 专题：执行格式演进与协议升级准备',
    level: 'advanced',
    objective: '理解 EOF 对执行层开发与审计的影响，并掌握 Pectra 升级准备要点。',
    sections: [
      {
        heading: '细粒度小节：EOF 设计动机与约束',
        points: [
          'EOF 旨在提升字节码可验证性、可分析性与执行安全边界。',
          '通过结构化格式降低历史 EVM 字节码歧义。',
          '对工具链（编译器/分析器/审计）提出新兼容要求。'
        ]
      },
      {
        heading: '细粒度小节：Pectra 升级的工程准备',
        points: [
          '提前识别客户端版本矩阵与配置差异。',
          '在测试网验证关键路径：交易、合约调用、监控告警。',
          '建立升级窗口、回滚策略与灰度发布计划。'
        ]
      },
      {
        heading: '细粒度小节：应用侧兼容性检查',
        points: [
          '检查合约部署与工具链对 EOF 的支持状态。',
          '对关键业务流程执行升级前后对照测试。',
          '补充异常监控项，覆盖执行错误与费用异常。'
        ]
      }
    ],
    pitfalls: [
      '把升级当作“只换版本”而不做全链路演练。',
      '忽视工具链兼容性导致发布后故障。',
      '无回滚预案导致故障恢复困难。'
    ],
    glossary: ['EOF', 'Pectra', 'Bytecode Format', 'Upgrade Playbook', 'Rollback Plan'],
    practice: [
      {
        title: '实战：Pectra 升级演练清单',
        steps: [
          '列出客户端/节点/工具链版本矩阵。',
          '执行关键交易与合约交互回归用例。',
          '输出上线/回滚双路径 runbook。'
        ]
      }
    ]
  },
  {
    id: 'lst-lrt-risk-deep',
    title: 'LST/LRT 与质押衍生品风险：收益结构、再质押与系统性风险',
    level: 'advanced',
    objective: '掌握 LST/LRT 风险分层方法，能为产品与风控提供可执行策略。',
    sections: [
      {
        heading: '细粒度小节：LST/LRT 收益来源拆解',
        points: [
          '收益不仅来自基础质押，还可能叠加额外协议激励。',
          '应分离“可持续收益”与“短期补贴收益”。',
          '收益结构越复杂，风险传导路径越长。'
        ]
      },
      {
        heading: '细粒度小节：再质押与相关性风险',
        points: [
          '再质押扩大资本效率，也放大相关性和连锁清算风险。',
          '单一协议/预言机/节点依赖会形成系统脆弱点。',
          '需要对极端场景做压力测试与敞口限额。'
        ]
      },
      {
        heading: '细粒度小节：风控框架与用户披露',
        points: [
          '建立分层风险标签：协议风险、流动性风险、治理风险。',
          '设置敞口上限、赎回缓冲与异常熔断机制。',
          '面向用户明确披露“收益/风险/流动性”三维信息。'
        ]
      }
    ],
    pitfalls: [
      '把再质押收益当作低风险无差别收益。',
      '忽略流动性折价与赎回拥堵风险。',
      '缺少透明披露导致风险认知偏差。'
    ],
    glossary: ['LST', 'LRT', 'Restaking', 'Correlation Risk', 'Liquidity Discount'],
    practice: [
      {
        title: '实战：LST/LRT 风险分层卡片',
        steps: [
          '为 2 个标的分别建立收益与风险来源表。',
          '设计异常场景（赎回拥堵/价格脱锚）演练。',
          '输出产品侧风险提示模板。'
        ]
      }
    ]
  }
  ,{
    id: 'client-labs-minimal-runs',
    title: '客户端实操实验课：Geth/Nethermind/Lighthouse/Prysm 最小可跑实验',
    level: 'advanced',
    objective: '用最小环境跑通 EL/CL 客户端组合，建立“可观测 + 可复现 + 可恢复”的工程实践。',
    sections: [
      {
        heading: '实验一：最小单机 EL/CL 组合启动',
        points: [
          '准备两组组合：Geth+Lighthouse、Nethermind+Prysm。',
          '验证基本同步、RPC 可用、日志健康。',
          '记录启动参数与版本矩阵。'
        ]
      },
      {
        heading: '实验二：链路可观测性基线',
        points: [
          '采集关键指标：同步高度、peer 数、最终性状态。',
          '建立最小告警阈值：同步停滞、peer 急降、最终性延迟。',
          '对比两组客户端组合的稳定性表现。'
        ]
      },
      {
        heading: '实验三：故障恢复演练',
        points: [
          '模拟异常重启与配置错误。',
          '验证 runbook：定位→修复→校验。',
          '形成可复用故障清单与恢复手册。'
        ]
      }
    ],
    pitfalls: [
      '只会“启动成功”，不会验证运行健康。',
      '不记录参数导致实验无法复现。',
      '无恢复手册导致故障处理依赖记忆。'
    ],
    glossary: ['Geth', 'Nethermind', 'Lighthouse', 'Prysm', 'Client Matrix', 'Runbook'],
    practice: [
      {
        title: '实战：最小可跑实验报告模板',
        steps: [
          '记录环境、命令、关键日志片段。',
          '列出健康指标与告警结果。',
          '输出“问题-修复-验证”闭环。'
        ]
      }
    ]
  },
  {
    id: 'chaos-lite-ops-lab',
    title: 'Chaos-lite 运维实验：最终性延迟、Peer 抖动、Relay 不可用',
    level: 'advanced',
    objective: '通过轻量故障注入培养协议运维思维：先观测、再定位、后恢复。',
    sections: [
      {
        heading: '场景一：最终性延迟模拟',
        points: [
          '观测 checkpoint 与最终性推进节奏变化。',
          '识别“短时波动”与“持续异常”边界。',
          '制定分级响应策略。'
        ]
      },
      {
        heading: '场景二：Peer 抖动与网络不稳定',
        points: [
          '观察 peer 数、传播延迟、重连频率。',
          '评估对同步和链头判断的影响。',
          '验证限流与重连参数是否合理。'
        ]
      },
      {
        heading: '场景三：Relay 不可用与降级路径',
        points: [
          '模拟 relay 中断并触发 fallback。',
          '验证自动降级是否生效。',
          '复盘提议成功率与恢复时长。'
        ]
      }
    ],
    pitfalls: [
      '故障注入后不做指标对照，无法形成结论。',
      '把演练环境异常直接外推到生产。',
      '无回滚开关导致演练扩大影响。'
    ],
    glossary: ['Chaos Engineering', 'Finality Delay', 'Peer Flap', 'Relay Outage', 'Fallback'],
    practice: [
      {
        title: '实战：Chaos-lite 演练记录卡',
        steps: [
          '定义注入动作、观测指标、退出条件。',
          '记录告警触发与处理时间线。',
          '输出改进项并回写 runbook。'
        ]
      }
    ]
  },
  {
    id: 'eip-reading-workbench',
    title: 'EIP 阅读工作台：动机/规范/兼容/安全/实现影响结构化拆解',
    level: 'advanced',
    objective: '把 EIP 阅读从“看懂”升级为“可复用分析方法”，支持评审与实现。',
    sections: [
      {
        heading: '阅读框架一：问题动机与边界',
        points: [
          '明确要解决的问题、受影响对象和边界条件。',
          '识别与现有机制的冲突与重叠。',
          '拆解关键假设是否成立。'
        ]
      },
      {
        heading: '阅读框架二：规范与兼容性',
        points: [
          '提取 MUST/SHOULD 条款形成检查清单。',
          '分析向后兼容与迁移成本。',
          '标注客户端实现中的高风险区域。'
        ]
      },
      {
        heading: '阅读框架三：安全与实现影响',
        points: [
          '梳理新增攻击面与缓解机制。',
          '映射到测试向量与回归策略。',
          '沉淀为 PR/评审可复用模板。'
        ]
      }
    ],
    pitfalls: [
      '只看摘要，不拆解规范细节。',
      '忽略兼容性导致落地成本失真。',
      '无测试映射导致实现偏差难发现。'
    ],
    glossary: ['MUST/SHOULD', 'Backward Compatibility', 'Security Considerations', 'Reference Tests'],
    practice: [
      {
        title: '实战：一页式 EIP 分析卡',
        steps: [
          '按五栏输出：动机/规范/兼容/安全/实现影响。',
          '列出 3 个测试向量与 1 个回归策略。',
          '形成可直接用于评审的摘要。'
        ]
      }
    ]
  }
  ,{
    id: 'zk-proving-verification-deep',
    title: 'ZK 证明与验证深度：证明系统、验证成本与工程权衡',
    level: 'advanced',
    objective: '建立 ZK 证明系统的工程化理解，能分析验证成本、延迟与安全边界。',
    sections: [
      {
        heading: '细粒度小节：证明生成与验证分工',
        points: [
          '证明生成通常计算密集，验证通常更轻量。',
          '系统设计需平衡 prover 成本、验证延迟与可扩展性。',
          '工程中应区分离线证明链路与在线验证链路。'
        ]
      },
      {
        heading: '细粒度小节：电路复杂度与费用模型',
        points: [
          '约束规模增长会显著影响证明时间与硬件成本。',
          '验证端 gas/计算成本影响上链可行性。',
          '应通过基准测试确定系统容量与峰值策略。'
        ]
      },
      {
        heading: '细粒度小节：安全边界与可信设置风险',
        points: [
          '不同证明系统在信任假设上存在差异。',
          '可信设置流程与参数管理是关键风险点。',
          '需建立参数更新、审计与回滚策略。'
        ]
      }
    ],
    pitfalls: [
      '只看验证快，不评估证明生成瓶颈。',
      '忽略可信设置与参数管理风险。',
      '缺少基准数据就制定容量目标。'
    ],
    glossary: ['Prover', 'Verifier', 'Constraint System', 'Trusted Setup', 'Proof Latency'],
    practice: [
      {
        title: '实战：ZK 系统容量评估卡',
        steps: [
          '定义输入规模与目标延迟。',
          '记录证明时间/验证时间/资源占用。',
          '输出容量上限与降级策略建议。'
        ]
      }
    ]
  },
  {
    id: 'cross-rollup-interoperability-deep',
    title: '跨 Rollup 互操作深度：消息、状态同步与失败补偿',
    level: 'advanced',
    objective: '理解跨 Rollup 交互中的一致性、延迟与失败恢复问题，形成稳健架构认知。',
    sections: [
      {
        heading: '细粒度小节：跨域消息生命周期',
        points: [
          '消息经历发送、证明、验证、执行多个阶段。',
          '每个阶段都有不同失败模式与时延特征。',
          '业务应显式暴露“处理中/可确认/最终完成”状态。'
        ]
      },
      {
        heading: '细粒度小节：状态同步与一致性保障',
        points: [
          '跨域状态读取常受延迟与证明窗口约束。',
          '需要设计幂等执行与重试机制防止双花/重复执行。',
          '关键路径应引入审计日志与可追踪事件 ID。'
        ]
      },
      {
        heading: '细粒度小节：失败补偿与用户体验',
        points: [
          '失败补偿策略决定系统在异常时的可恢复性。',
          '应为超时、失败、重放分别设计处理分支。',
          '产品文案必须明确“到账时间与失败回退规则”。'
        ]
      }
    ],
    pitfalls: [
      '把跨域流程当作同步 RPC 调用。',
      '无幂等设计导致重复执行风险。',
      '失败补偿缺失导致资产状态悬空。'
    ],
    glossary: ['Cross-rollup Messaging', 'Idempotency', 'Retry Policy', 'Compensation Logic', 'Proof Window'],
    practice: [
      {
        title: '实战：跨域失败补偿流程图',
        steps: [
          '列出发送→验证→执行全路径状态机。',
          '为每个失败点设计补偿动作与告警。',
          '输出对用户可见的状态与文案模板。'
        ]
      }
    ]
  },
  {
    id: 'validator-economics-governance-deep',
    title: '验证者经济学与治理深度：激励、惩罚与提案协同',
    level: 'advanced',
    objective: '理解验证者行为的经济驱动与治理反馈，建立协议长期稳定性的系统视角。',
    sections: [
      {
        heading: '细粒度小节：激励与惩罚结构',
        points: [
          '收益与风险共同塑造验证者行为。',
          '惩罚机制用于抑制恶意行为与高风险操作。',
          '参数变化会影响节点运营成本与参与意愿。'
        ]
      },
      {
        heading: '细粒度小节：治理提案与经济影响评估',
        points: [
          '提案需评估对不同参与者的收益/风险分布影响。',
          '短期优化可能带来长期去中心化退化风险。',
          '应引入情景分析与敏感性测试。'
        ]
      },
      {
        heading: '细粒度小节：运营侧执行与反馈闭环',
        points: [
          '将治理变更映射到监控指标与运行策略。',
          '异常指标应触发参数复审与治理反馈。',
          '形成“提案→执行→观测→调整”的闭环。'
        ]
      }
    ],
    pitfalls: [
      '只看理论最优，不看运营现实成本。',
      '忽略治理变更对小节点的压力。',
      '没有建立治理后评估机制。'
    ],
    glossary: ['Validator Incentives', 'Slashing Economics', 'Governance Proposal', 'Sensitivity Analysis', 'Policy Feedback'],
    practice: [
      {
        title: '实战：治理提案经济影响评估表',
        steps: [
          '列出受影响角色与收益/风险变化。',
          '定义 2-3 个极端场景做敏感性分析。',
          '给出可执行监控指标与回调阈值。'
        ]
      }
    ]
  }
];
