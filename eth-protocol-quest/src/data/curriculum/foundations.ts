import { Chapter } from '../../game/curriculumTypes';

export const foundationChapters: Chapter[] = [
  {
    id: 'el-core',
    title: 'EL 执行层核心：状态转移与 Gas 机制',
    level: 'basic',
    objective: '理解执行层如何把交易输入转化为链上状态变化，并掌握 gas 的资源约束逻辑。',
    sections: [
      {
        heading: '概念讲解：EL 的职责边界',
        points: [
          'EL（Execution Layer）负责交易执行、状态更新、回执生成。',
          '状态由账户余额、nonce、合约存储等组成。',
          'EL 不负责最终性投票，最终性由 CL 提供。'
        ]
      },
      {
        heading: '概念讲解：状态转移函数（State Transition Function）',
        points: [
          '输入：当前状态 + 交易（签名、nonce、gas 参数、data）。',
          '执行：EVM 按规则逐步执行 opcode。',
          '输出：新状态 + 回执（status、logs、gasUsed）。'
        ]
      },
      {
        heading: '概念讲解：Gas 与费用市场（EIP-1559）',
        points: [
          'Gas 计量“计算与存储”资源消耗。',
          'baseFee 随区块拥堵动态调整。',
          'priorityFee 用于激励打包。',
          'maxFee 过低会导致交易长时间 pending。'
        ]
      }
    ],
    pitfalls: [
      '误区1：交易被打包就等于最终不可逆（错误，仍需 CL 最终性）。',
      '误区2：Gas 越高越好（错误，关键是合理估算与出价策略）。',
      '误区3：EL 可以独立保障共识（错误，EL 与 CL 必须协同）。'
    ],
    glossary: ['State Transition', 'Nonce', 'Gas', 'Base Fee', 'Priority Fee', 'Receipt'],
    practice: [
      {
        title: '实战1：手动追踪一笔交易状态变化',
        steps: [
          '准备一笔测试交易（测试网）。',
          '记录发送前账户 nonce 与余额。',
          '交易上链后读取回执并核对 gasUsed。',
          '对比发送前后状态，写出状态转移摘要。'
        ]
      },
      {
        title: '实战2：费用参数调优',
        steps: [
          '分别使用保守/激进两组费用参数发送测试交易。',
          '比较确认时间与实际费用。',
          '总结“成功率与成本”的平衡策略。'
        ]
      }
    ]
  },
  {
    id: 'cl-core',
    title: 'CL 共识层核心：Fork Choice 与 Finality',
    level: 'basic',
    objective: '掌握 slot/epoch、链头选择与最终性机制，理解 CL 与 EL 的分工。',
    sections: [
      {
        heading: '概念讲解：CL 的工作内容',
        points: [
          'CL 负责验证者集合、区块提议、证明与最终性。',
          '通过 fork choice 选择当前应跟随的链头。',
          '通过 checkpoint 机制提供最终性。'
        ]
      },
      {
        heading: '概念讲解：slot、epoch、checkpoint',
        points: [
          'slot 是最小时间片。',
          'epoch 是多个 slot 的集合。',
          'checkpoint 是最终性判断的关键锚点。'
        ]
      },
      {
        heading: '概念讲解：安全性与惩罚',
        points: [
          'slashing 惩罚双重签名等恶意行为。',
          '经济激励与惩罚共同维持协议安全。',
          '客户端多样性可以降低系统性风险。'
        ]
      }
    ],
    pitfalls: [
      '误区1：链头选择=最终性（错误，这是两个层次）。',
      '误区2：只看出块，不看证明与检查点。',
      '误区3：忽视验证者行为约束与惩罚机制。'
    ],
    glossary: ['Fork Choice', 'Finality', 'Slot', 'Epoch', 'Checkpoint', 'Slashing'],
    practice: [
      {
        title: '实战1：构建 CL 事件时间线',
        steps: [
          '选择一段链上区间（若干 epoch）。',
          '记录区块提议、证明与最终性节点。',
          '画出“链头变化与最终性确认”流程图。'
        ]
      },
      {
        title: '实战2：分析短重组案例',
        steps: [
          '收集一次短重组公开资料。',
          '解释重组发生条件与恢复机制。',
          '总结对应用确认策略的影响。'
        ]
      }
    ]
  },
  {
    id: 'evm-core',
    title: 'EVM 执行模型：Opcode、Memory、Storage',
    level: 'intermediate',
    objective: '理解 EVM 的确定性执行模型与成本结构，建立“代码→状态”映射能力。',
    sections: [
      {
        heading: '概念讲解：EVM 是什么',
        points: [
          'EVM 是面向全网一致性设计的确定性栈机。',
          '同样输入在所有节点应得到同样输出。',
          '执行结果通过状态根变更反映。'
        ]
      },
      {
        heading: '概念讲解：内存模型与数据位置',
        points: [
          'Stack：短时操作栈。',
          'Memory：函数执行期临时内存。',
          'Storage：持久化状态，写入成本高。',
          'Calldata：外部输入只读区。'
        ]
      },
      {
        heading: '概念讲解：错误与回滚',
        points: [
          'revert 会撤销状态变更但不会返还所有 gas。',
          'assert/panic 与 require/revert 的语义不同。',
          '日志（events）用于链下索引，不直接改变状态。'
        ]
      }
    ],
    pitfalls: [
      '误区1：Memory 与 Storage 混淆，导致成本判断错误。',
      '误区2：认为 revert 完全“免费”。',
      '误区3：忽略 opcode 成本差异与复杂度。'
    ],
    glossary: ['Opcode', 'Stack', 'Memory', 'Storage', 'Calldata', 'Revert'],
    practice: [
      {
        title: '实战1：函数执行成本拆解',
        steps: [
          '选一个合约函数，估算其关键 opcode 成本。',
          '比较读写 storage 与 memory 的 gas 差异。',
          '输出“优化前后”方案。'
        ]
      },
      {
        title: '实战2：错误路径分析',
        steps: [
          '构造一个会 revert 的输入。',
          '记录回执与错误信息。',
          '说明状态为何回滚、gas 为何消耗。'
        ]
      }
    ]
  },
  {
    id: 'tx-lifecycle-core',
    title: '交易生命周期全链路：签名→传播→打包→最终性',
    level: 'intermediate',
    objective: '建立完整链路视角，能解释交易在不同层的状态变化与失败原因。',
    sections: [
      {
        heading: '概念讲解：发送前准备',
        points: [
          '钱包构建交易参数（nonce、fee、to、data）。',
          '本地签名后广播到节点网络。',
          '链 ID 防止跨链重放。'
        ]
      },
      {
        heading: '概念讲解：传播与打包',
        points: [
          '交易进入 txpool，等待提议者挑选。',
          '费率策略会影响被打包优先级。',
          '同 nonce 的替换交易可能覆盖旧交易。'
        ]
      },
      {
        heading: '概念讲解：确认与最终性',
        points: [
          '“已打包”表示进入区块，不代表最终不可逆。',
          'CL 最终性确认后，回滚概率极低。',
          '应用侧应采用分层确认策略。'
        ]
      }
    ],
    pitfalls: [
      '误区1：只看交易哈希显示成功，不看最终性层级。',
      '误区2：忽略替换交易和 nonce 冲突。',
      '误区3：把节点传播延迟当作链故障。'
    ],
    glossary: ['Signed Tx', 'Txpool', 'Inclusion', 'Confirmation', 'Finality', 'Replacement Tx'],
    practice: [
      {
        title: '实战1：交易全链路观测日志',
        steps: [
          '对一笔交易记录时间戳：发送、广播、打包、最终性。',
          '标注每个阶段可观测信号（RPC/浏览器/客户端日志）。',
          '总结瓶颈在“费用、传播、还是共识确认”。'
        ]
      },
      {
        title: '实战2：失败案例复盘模板',
        steps: [
          '选一笔失败或长时间 pending 交易。',
          '按链路定位失败点（签名/费用/传播/执行/确认）。',
          '提出可复用的修复 SOP。'
        ]
      }
    ]
  }
  ,{
    id: 'engine-api-core',
    title: 'Engine API 协同：EL/CL 的协议桥梁',
    level: 'intermediate',
    objective: '掌握 Engine API 在 Merge 后的职责、常见调用与排错思路。',
    sections: [
      {
        heading: '概念讲解：为什么需要 Engine API',
        points: [
          'Merge 后共识与执行分层，二者需要标准接口协作。',
          'CL 负责共识流程，EL 负责交易执行与状态结果。',
          'Engine API 提供 payload 提议、验证、回执等关键交互。'
        ]
      },
      {
        heading: '概念讲解：核心交互路径',
        points: [
          'CL 请求候选 payload，EL 返回可执行候选。',
          'CL 推进链头时调用 EL 验证执行结果。',
          'EL 返回状态与错误，帮助 CL 做后续决策。',
          '异常时应区分接口错误、执行错误、版本不兼容错误。'
        ]
      },
      {
        heading: '概念讲解：兼容性与升级风险',
        points: [
          '客户端版本不匹配会导致提议/同步异常。',
          '升级窗口需要 EL/CL 组合兼容验证。',
          '日志与健康检查是排障关键证据。'
        ]
      }
    ],
    pitfalls: [
      '误区1：只升级 EL 或只升级 CL。',
      '误区2：把接口异常误判为网络抖动。',
      '误区3：忽略执行端返回的错误码含义。'
    ],
    glossary: ['Engine API', 'Payload', 'Forkchoice Updated', 'Execution Payload', 'Client Compatibility'],
    practice: [
      {
        title: '实战1：版本兼容检查',
        steps: [
          '列出你当前 EL/CL 客户端版本组合。',
          '查阅对应版本兼容说明。',
          '输出升级前的风险清单与回滚方案。'
        ]
      },
      {
        title: '实战2：接口故障排障演练',
        steps: [
          '模拟一次 EL/CL 连接异常场景。',
          '收集双方日志并定位交互失败节点。',
          '写出最小修复步骤与验证方法。'
        ]
      }
    ]
  },
  {
    id: 'eip-workflow-core',
    title: 'EIP 流程实践：从提案到规范落地',
    level: 'advanced',
    objective: '理解 EIP 文档结构、审阅流程与落地实现关系。',
    sections: [
      {
        heading: '概念讲解：EIP 的结构化要求',
        points: [
          '高质量提案需要动机、规范、向后兼容、安全考虑。',
          '文档可读性决定评审效率。',
          '提案不是观点帖，而是可执行规范草案。'
        ]
      },
      {
        heading: '概念讲解：讨论与迭代机制',
        points: [
          '公开讨论中，反对意见是提案质量提升来源。',
          '状态流转（Draft/Review/Final）体现成熟度。',
          '参考实现与测试会显著提升可信度。',
          '提案推进需要在规范、实现、测试三线同步迭代。'
        ]
      },
      {
        heading: '概念讲解：提案与客户端实现',
        points: [
          'EIP 通过不等于自动上线。',
          '需要客户端实现、测试向量与主网协调。',
          '实现差异需要通过测试统一行为。'
        ]
      }
    ],
    pitfalls: [
      '误区1：只写愿景，不写可验证规范。',
      '误区2：忽视 backward compatibility。',
      '误区3：无测试与实现支持就推动上线。'
    ],
    glossary: ['EIP Lifecycle', 'Draft', 'Review', 'Final', 'Backwards Compatibility', 'Reference Implementation'],
    practice: [
      {
        title: '实战1：拆解一个经典 EIP',
        steps: [
          '选择一篇已 Final 的 EIP。',
          '按“问题-方案-影响-风险”写结构化总结。',
          '指出其实现依赖与测试要点。'
        ]
      },
      {
        title: '实战2：写一个微型提案草稿',
        steps: [
          '定义一个真实痛点。',
          '写出最小规范（字段/行为/边界）。',
          '补充兼容性与安全考虑。'
        ]
      }
    ]
  },
  {
    id: 'client-testing-core',
    title: '客户端实现与测试：从代码到可合并贡献',
    level: 'advanced',
    objective: '建立客户端贡献路径：阅读、修改、测试、PR 协作。',
    sections: [
      {
        heading: '概念讲解：贡献类型与优先级',
        points: [
          '新手最稳路径：文档修复 → 测试补充 → 小 bug 修复。',
          '可复现问题比“感觉有问题”更有价值。',
          '小步提交比大而全改动更易合并。'
        ]
      },
      {
        heading: '概念讲解：测试体系与质量门槛',
        points: [
          '单元测试验证局部逻辑。',
          '集成测试验证模块协同。',
          '跨客户端测试用于一致性保障。'
        ]
      },
      {
        heading: '概念讲解：PR 沟通与迭代',
        points: [
          'PR 描述应包括动机、改动、验证方式。',
          'review 反馈要快速响应并补证据。',
          '合并后应留复盘，沉淀知识。'
        ]
      }
    ],
    pitfalls: [
      '误区1：跳过测试直接提 PR。',
      '误区2：改动范围过大导致 review 困难。',
      '误区3：没有复现步骤与验证截图。'
    ],
    glossary: ['Unit Test', 'Integration Test', 'Client Diversity', 'PR Review', 'Regression', 'Reproducibility'],
    practice: [
      {
        title: '实战1：最小贡献任务设计',
        steps: [
          '选择一个 good first issue。',
          '拆分为 3 个可验证子任务。',
          '定义完成标准与测试方法。'
        ]
      },
      {
        title: '实战2：PR 交付包',
        steps: [
          '准备复现步骤、变更说明、测试结果。',
          '提交 PR 并回答首轮 review。',
          '根据反馈完成二次迭代并复盘。'
        ]
      }
    ]
  }

  ,{
    id: 'testing-systems-core',
    title: '测试体系专题：单测、集成、跨客户端一致性',
    level: 'advanced',
    objective: '建立协议开发测试观：从局部正确到全局一致。',
    sections: [
      {
        heading: '概念讲解：测试金字塔在协议开发中的映射',
        points: [
          '单元测试验证函数/模块行为边界。',
          '集成测试验证子系统协同与接口契约。',
          '跨客户端一致性测试保障不同实现同结果。'
        ]
      },
      {
        heading: '概念讲解：回归与可复现',
        points: [
          'Bug 修复必须配套回归测试。',
          '高质量测试需可复现输入与确定输出。',
          '测试失败信息应帮助快速定位根因。'
        ]
      },
      {
        heading: '概念讲解：测试数据与向量',
        points: [
          '边界值和异常值优先覆盖。',
          '统一测试向量可降低实现分歧。',
          '测试是规范落地的一部分，不是附属品。'
        ]
      }
    ],
    pitfalls: [
      '误区1：只跑 happy path。',
      '误区2：修 bug 不补回归测试。',
      '误区3：测试依赖随机输入导致偶发失败。'
    ],
    glossary: ['Unit Test', 'Integration Test', 'Regression', 'Test Vector', 'Determinism'],
    practice: [
      {
        title: '实战1：为一个历史 bug 写回归测试',
        steps: [
          '选一个已知 bug 案例。',
          '先写失败测试，再修复代码。',
          '验证修复后测试稳定通过。'
        ]
      },
      {
        title: '实战2：设计最小一致性测试向量',
        steps: [
          '定义输入、期望输出、边界条件。',
          '在两种实现中执行并比对结果。',
          '记录差异并分析原因。'
        ]
      }
    ]
  },
  {
    id: 'security-core',
    title: '安全专题：重组、审查阻力、客户端多样性',
    level: 'advanced',
    objective: '理解协议安全风险与工程缓解策略。',
    sections: [
      {
        heading: '概念讲解：重组（Reorg）与确认策略',
        points: [
          '短重组是网络现实，不代表系统崩溃。',
          '应用应采用分层确认（打包确认/最终性确认）。',
          '高价值操作需等待更强确认层级。'
        ]
      },
      {
        heading: '概念讲解：审查阻力与去中心化',
        points: [
          '审查风险与参与者结构、实现多样性相关。',
          '单点依赖会放大系统性故障风险。',
          '治理与技术共同决定抗审查能力。'
        ]
      },
      {
        heading: '概念讲解：监控、告警、演练',
        points: [
          '安全不是一次配置，而是持续运营。',
          '观测指标应覆盖共识、执行、网络三层。',
          '演练可验证预案有效性。'
        ]
      }
    ],
    pitfalls: [
      '误区1：把“已打包”当最终安全确认。',
      '误区2：忽视客户端多样性与版本策略。',
      '误区3：无监控、无告警、无演练。'
    ],
    glossary: ['Reorg', 'Censorship Resistance', 'Client Diversity', 'Observability', 'Incident Response'],
    practice: [
      {
        title: '实战1：确认策略分级设计',
        steps: [
          '按业务价值划分确认等级。',
          '定义每级别需要的链上确认条件。',
          '输出面向产品的确认策略文档。'
        ]
      },
      {
        title: '实战2：安全事件复盘模板',
        steps: [
          '选择一个公开事件（重组/中断）。',
          '复盘触发条件、影响范围、缓解动作。',
          '写出本地可执行改进项。'
        ]
      }
    ]
  },
  {
    id: 'l2-da-core',
    title: 'L2/DA 专题：Rollup 结算与数据可用性',
    level: 'advanced',
    objective: '理解 L2 扩容性能与 L1 安全锚定之间的关系。',
    sections: [
      {
        heading: '概念讲解：L2 执行与 L1 结算',
        points: [
          'Rollup 主要把执行移到 L2，状态结算依赖 L1。',
          'L2 的安全下限通常锚定于 L1。',
          '跨域消息引入异步确认与延迟。'
        ]
      },
      {
        heading: '概念讲解：DA（数据可用性）意义',
        points: [
          '没有可用数据，就无法独立验证状态转移。',
          'DA 设计影响成本、吞吐与安全边界。',
          '不同 DA 策略对应不同信任假设。'
        ]
      },
      {
        heading: '概念讲解：用户体验与协议边界',
        points: [
          '快确认不等于最终安全确认。',
          '桥接与提现路径需要明确风险提示。',
          '产品层应暴露确认层级给用户。'
        ]
      }
    ],
    pitfalls: [
      '误区1：把 L2 快速确认当作最终不可逆。',
      '误区2：忽视 DA 方案的信任假设差异。',
      '误区3：跨域流程无失败补偿与超时策略。'
    ],
    glossary: ['Rollup', 'Settlement', 'Data Availability', 'Fraud Proof', 'Validity Proof', 'Bridge'],
    practice: [
      {
        title: '实战1：绘制 L2→L1 结算路径图',
        steps: [
          '标出执行、提交、验证、最终确认节点。',
          '标注每个节点可能失败点。',
          '给出用户提示文案建议。'
        ]
      },
      {
        title: '实战2：DA 假设对比表',
        steps: [
          '选 2 种 DA 方案做对比。',
          '比较成本、吞吐、信任假设。',
          '给出你的场景化选择理由。'
        ]
      }
    ]
  }

];
