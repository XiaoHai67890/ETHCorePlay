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
];
