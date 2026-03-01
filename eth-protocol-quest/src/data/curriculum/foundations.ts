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
];
