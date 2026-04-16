export type TrackSlug = 'protocol-101' | 'cryptography' | 'lean-zkevm';
export type SourceType = 'course' | 'wiki' | 'repo';

export type SourceRef = {
  id: string;
  sourceType: SourceType;
  sourceTitle: string;
  provider: string;
  url: string;
  authorityLevel: 1;
  noteZh: string;
  lastCheckedAt: string;
};

export type TrackRecord = {
  slug: TrackSlug;
  titleZh: string;
  titleEn: string;
  oneLinerZh: string;
  overviewZh: string;
  audienceZh: string;
  prerequisitesZh: string[];
  difficultyLabel: string;
  recommendedOrderZh: string[];
  outputRequirementsZh: string[];
  contributionExitZh: string;
  sourceRefIds: string[];
  moduleSlugs: string[];
};

export type ModuleRecord = {
  slug: string;
  track: TrackSlug;
  titleZh: string;
  titleEn: string;
  oneLinerZh: string;
  solvesZh: string;
  summaryZh: string[];
  prerequisites: string[];
  commonPitfallsZh: string[];
  checkpointZh: string;
  outputTaskZh: string;
  glossaryTerms: string[];
  sourceRefIds: string[];
  nodeSlugs: string[];
  nextSlugs: string[];
  legacyChapterId?: string;
};

export type KnowledgeNodeRecord = {
  slug: string;
  titleZh: string;
  titleEn: string;
  summaryZh: string;
  track: TrackSlug;
  moduleSlugs: string[];
  prerequisiteSlugs: string[];
  glossaryTerms: string[];
  relatedSpecZh: string[];
  relatedClientZh: string[];
  nextRecommended: string[];
  sourceRefIds: string[];
};

export type PersonaRoute = {
  id: string;
  label: string;
  description: string;
  to: string;
};

type ModuleSeed = {
  slug: string;
  titleZh: string;
  titleEn: string;
  oneLinerZh: string;
  solvesZh: string;
  checkpointZh: string;
  outputTaskZh: string;
  prerequisites?: string[];
  glossaryTerms?: string[];
  nodeSlugs?: string[];
  commonPitfallsZh?: string[];
  legacyChapterId?: string;
};

export const registryUpdatedAt = '2026-04-17';

export const sourceRefs: SourceRef[] = [
  {
    id: 'study-protocol-101',
    sourceType: 'course',
    sourceTitle: 'Ethereum Protocol 101',
    provider: 'study.epf.wiki',
    url: 'https://study.epf.wiki',
    authorityLevel: 1,
    noteZh: '上游课程结构入口。ETHCorePlay 只做中文编排与学习执行，不替代原课程。',
    lastCheckedAt: registryUpdatedAt
  },
  {
    id: 'study-cryptography',
    sourceType: 'course',
    sourceTitle: 'Cryptography of Ethereum',
    provider: 'study.epf.wiki',
    url: 'https://study.epf.wiki',
    authorityLevel: 1,
    noteZh: '密码学主线课程入口，覆盖群、域、配对、BLS 与证明系统。',
    lastCheckedAt: registryUpdatedAt
  },
  {
    id: 'study-lean-zkevm',
    sourceType: 'course',
    sourceTitle: 'Lean Ethereum/zkEVM',
    provider: 'study.epf.wiki',
    url: 'https://study.epf.wiki',
    authorityLevel: 1,
    noteZh: 'Lean 与 zkEVM 主线课程入口，用于结构映射与学习执行。',
    lastCheckedAt: registryUpdatedAt
  },
  {
    id: 'wiki-epf',
    sourceType: 'wiki',
    sourceTitle: 'EPF Wiki',
    provider: 'epf.wiki',
    url: 'https://epf.wiki',
    authorityLevel: 1,
    noteZh: '权威知识库入口，适合作为术语、节点关系与延伸阅读的回流点。',
    lastCheckedAt: registryUpdatedAt
  },
  {
    id: 'repo-protocol-studies',
    sourceType: 'repo',
    sourceTitle: 'eth-protocol-fellows / protocol-studies',
    provider: 'GitHub',
    url: 'https://github.com/eth-protocol-fellows/protocol-studies',
    authorityLevel: 1,
    noteZh: '开源内容源仓库与贡献入口，用于回流建议和协作指引。',
    lastCheckedAt: registryUpdatedAt
  }
];

const sourceRefMap = Object.fromEntries(sourceRefs.map((ref) => [ref.id, ref])) as Record<string, SourceRef>;

const protocolSeeds: ModuleSeed[] = [
  {
    slug: 'protocol-intro-overview',
    titleZh: 'Protocol 101 总览',
    titleEn: 'Ethereum Protocol Intro and Overview',
    oneLinerZh: '先建立执行层、共识层、规范与测试的整体地图。',
    solvesZh: '解决“知道名词，但不知道协议各部分如何拼起来”的问题。',
    checkpointZh: '用中文解释 EL、CL、Specs、Testing 之间的分工边界。',
    outputTaskZh: '写一张 200 字的协议总览卡片，说明你接下来为什么先学 Protocol 101。',
    glossaryTerms: ['execution layer', 'consensus layer', 'specs', 'testing'],
    legacyChapterId: 'el-core'
  },
  {
    slug: 'consensus-layer-overview',
    titleZh: 'Consensus Layer Overview',
    titleEn: 'Consensus Layer Overview',
    oneLinerZh: '理解 CL 的职责、节奏单位与最终性视角。',
    solvesZh: '解决“区块确认、最终性与验证者职责混在一起”的问题。',
    checkpointZh: '解释 slot、epoch、checkpoint 与 finality 的关系。',
    outputTaskZh: '画出一条 CL 时间线，标出 slot、epoch、checkpoint。',
    prerequisites: ['protocol-intro-overview'],
    glossaryTerms: ['slot', 'epoch', 'checkpoint', 'finality'],
    nodeSlugs: ['gasper', 'beacon-state'],
    legacyChapterId: 'cl-core'
  },
  {
    slug: 'execution-layer-overview',
    titleZh: 'Execution Layer Overview',
    titleEn: 'Execution Layer Overview',
    oneLinerZh: '把交易、状态转移、Gas 和回执放回同一张图上。',
    solvesZh: '解决“EVM、交易、Gas、状态变化无法串起来”的问题。',
    checkpointZh: '复述一笔交易如何在执行层里造成状态变化。',
    outputTaskZh: '写一段交易生命周期的 200 字复述，突出状态转移和 Gas。',
    prerequisites: ['protocol-intro-overview'],
    glossaryTerms: ['state transition', 'gas', 'receipt'],
    nodeSlugs: ['engine-api'],
    legacyChapterId: 'el-core'
  },
  {
    slug: 'specs-testing-overview',
    titleZh: 'Specs & Testing Overview',
    titleEn: 'Specs & Testing Overview',
    oneLinerZh: '知道协议规范、实现与测试为何必须同时看。',
    solvesZh: '解决“只看文章，不会回到规范和测试资产”的问题。',
    checkpointZh: '说明为什么学习协议不能只停留在二手解读。',
    outputTaskZh: '列出你接下来要追踪的 1 个规范入口和 1 个测试入口。',
    prerequisites: ['protocol-intro-overview'],
    glossaryTerms: ['spec', 'test vector', 'regression'],
    legacyChapterId: 'client-testing-core'
  },
  {
    slug: 'core-development-overview',
    titleZh: 'Core Development',
    titleEn: 'Core Development',
    oneLinerZh: '把协议学习和真实贡献路径接上。',
    solvesZh: '解决“学完内容后不知道如何进入 repo 和贡献流程”的问题。',
    checkpointZh: '说明从读课程到读 specs、看 client codebases 的过渡步骤。',
    outputTaskZh: '写一个 2 周学习-输出-贡献行动表。',
    prerequisites: ['specs-testing-overview'],
    glossaryTerms: ['spec', 'client', 'contribution'],
    legacyChapterId: 'client-contrib-deep'
  },
  {
    slug: 'gasper-consensus',
    titleZh: 'Consensus Protocol / Gasper',
    titleEn: 'Consensus Protocol / Gasper',
    oneLinerZh: '把 fork choice 与 finality 机制落到一个具体协议对象。',
    solvesZh: '解决“只知道 PoS，不理解具体共识协议如何运作”的问题。',
    checkpointZh: '用自己的话说明 Gasper 为什么同时涉及 fork choice 与 finality。',
    outputTaskZh: '写一段 Gasper 解释，要求能被协议新人看懂。',
    prerequisites: ['consensus-layer-overview'],
    glossaryTerms: ['gasper', 'fork choice', 'finality'],
    nodeSlugs: ['gasper'],
    legacyChapterId: 'cl-deep-forkchoice-finality'
  },
  {
    slug: 'cl-client-architecture',
    titleZh: 'CL Client Architecture',
    titleEn: 'CL Client Architecture',
    oneLinerZh: '开始从课程结构转入客户端结构。',
    solvesZh: '解决“理解概念后，不知道客户端内部如何分层”的问题。',
    checkpointZh: '概括一个 CL 客户端至少要处理哪些核心模块。',
    outputTaskZh: '画出你理解的 CL 客户端模块图。',
    prerequisites: ['consensus-layer-overview'],
    glossaryTerms: ['client architecture', 'validator', 'beacon'],
    legacyChapterId: 'client-testing-core'
  },
  {
    slug: 'validator-client',
    titleZh: 'Validator Client',
    titleEn: 'Validator Client',
    oneLinerZh: '聚焦验证者客户端的职责边界与风险面。',
    solvesZh: '解决“验证者运行、签名、惩罚机制理解不完整”的问题。',
    checkpointZh: '列出 validator client 的 3 个关键职责和 2 个风险点。',
    outputTaskZh: '写一份 validator client 风险检查清单。',
    prerequisites: ['cl-client-architecture'],
    glossaryTerms: ['validator', 'slashing', 'duty'],
    legacyChapterId: 'cl-core'
  },
  {
    slug: 'beacon-state',
    titleZh: 'Beacon State',
    titleEn: 'Beacon State',
    oneLinerZh: '把共识层状态对象作为独立学习节点。',
    solvesZh: '解决“知道有 beacon state，但不知道它承载什么”的问题。',
    checkpointZh: '解释 beacon state 为什么是理解 CL 的关键对象。',
    outputTaskZh: '列出 beacon state 中你最想继续深挖的 3 个字段方向。',
    prerequisites: ['consensus-layer-overview'],
    glossaryTerms: ['beacon state', 'validator set', 'checkpoint'],
    nodeSlugs: ['beacon-state'],
    legacyChapterId: 'cl-core'
  },
  {
    slug: 'cl-networking-libp2p',
    titleZh: 'CL Networking / libp2p',
    titleEn: 'CL Networking / libp2p',
    oneLinerZh: '理解共识层传播与客户端协作的网络基础。',
    solvesZh: '解决“只看状态机，不看网络传播路径”的问题。',
    checkpointZh: '说明 libp2p 在 CL 中承担什么角色。',
    outputTaskZh: '画出 CL 中消息传播和节点连接的简图。',
    prerequisites: ['cl-client-architecture'],
    glossaryTerms: ['libp2p', 'gossip', 'peer'],
    legacyChapterId: 'p2p-gossip-deep'
  },
  {
    slug: 'evm',
    titleZh: 'EVM',
    titleEn: 'EVM',
    oneLinerZh: '回到执行语义本身，理解代码如何变成状态。',
    solvesZh: '解决“Solidity 会写，但 EVM 模型不成体系”的问题。',
    checkpointZh: '说明 stack、memory、storage、calldata 的区别。',
    outputTaskZh: '写一段函数执行路径拆解，标出读写位置。',
    prerequisites: ['execution-layer-overview'],
    glossaryTerms: ['opcode', 'memory', 'storage', 'calldata'],
    legacyChapterId: 'evm-core'
  },
  {
    slug: 'execution-client-architecture',
    titleZh: 'Execution Client Architecture',
    titleEn: 'Execution Client Architecture',
    oneLinerZh: '开始从 EVM 概念走向执行客户端结构。',
    solvesZh: '解决“知道 EVM，但不知道执行客户端内部职责切分”的问题。',
    checkpointZh: '列出 execution client 中你认为最关键的 3 个模块。',
    outputTaskZh: '画一版 execution client architecture 草图。',
    prerequisites: ['execution-layer-overview', 'evm'],
    glossaryTerms: ['client architecture', 'state', 'execution'],
    legacyChapterId: 'client-testing-core'
  },
  {
    slug: 'el-data-structures',
    titleZh: 'EL Data Structures',
    titleEn: 'EL Data Structures',
    oneLinerZh: '把账户状态、树结构和证明路径纳入执行层学习。',
    solvesZh: '解决“状态树、存储树、证明结构不成体系”的问题。',
    checkpointZh: '说明 state trie 与 storage trie 的分工。',
    outputTaskZh: '画一张执行层数据结构关系图。',
    prerequisites: ['execution-layer-overview', 'evm'],
    glossaryTerms: ['state trie', 'storage trie', 'proof'],
    legacyChapterId: 'el-deep-state-trie'
  },
  {
    slug: 'el-networking-devp2p',
    titleZh: 'EL Networking / DevP2P',
    titleEn: 'EL Networking / DevP2P',
    oneLinerZh: '理解交易与区块在执行层网络里的传播路径。',
    solvesZh: '解决“交易上链只看 RPC，不看底层传播”的问题。',
    checkpointZh: '解释 DevP2P 与执行层消息传播的关系。',
    outputTaskZh: '写一段交易从发送到广播的网络路径摘要。',
    prerequisites: ['execution-layer-overview'],
    glossaryTerms: ['devp2p', 'txpool', 'propagation'],
    nodeSlugs: ['devp2p'],
    legacyChapterId: 'tx-lifecycle-core'
  },
  {
    slug: 'engine-api',
    titleZh: 'Engine API',
    titleEn: 'Engine API',
    oneLinerZh: '聚焦 EL/CL 协同接口，是协议分层学习的关键桥梁。',
    solvesZh: '解决“知道分层，但不知道两层如何协同”的问题。',
    checkpointZh: '说明 Engine API 为什么是 Merge 后理解客户端协同的核心接口。',
    outputTaskZh: '画一张 EL/CL 通过 Engine API 协作的序列图。',
    prerequisites: ['consensus-layer-overview', 'execution-layer-overview'],
    glossaryTerms: ['engine api', 'payload', 'forkchoice'],
    nodeSlugs: ['engine-api'],
    legacyChapterId: 'engine-api-core'
  },
  {
    slug: 'precompiles',
    titleZh: 'Precompiles',
    titleEn: 'Precompiles',
    oneLinerZh: '把执行层里的特殊能力接口纳入系统视角。',
    solvesZh: '解决“预编译合约是什么、为什么存在”的问题。',
    checkpointZh: '用一句话解释 precompiles 的设计动机。',
    outputTaskZh: '整理一个 precompiles 学习笔记模板，标出你准备继续查的资料入口。',
    prerequisites: ['evm'],
    glossaryTerms: ['precompile', 'opcode', 'cost model'],
    nodeSlugs: ['precompiles'],
    legacyChapterId: 'evm-core'
  }
];

const cryptographySeeds: ModuleSeed[] = [
  {
    slug: 'cryptography-intro',
    titleZh: '密码学总览',
    titleEn: 'Intro to Cryptography',
    oneLinerZh: '建立以太坊密码学主线的学习坐标。',
    solvesZh: '解决“知道若干密码学名词，但不知道为什么它们在协议里重要”的问题。',
    checkpointZh: '列出密码学主线中你最需要补齐的两块基础。',
    outputTaskZh: '写一张密码学路线图卡片，说明学习优先级。',
    glossaryTerms: ['cryptography', 'proof', 'signature']
  },
  {
    slug: 'finite-groups-fields',
    titleZh: 'Finite Groups & Fields',
    titleEn: 'Finite Groups & Fields',
    oneLinerZh: '把群与域作为后续椭圆曲线和证明系统的基础。',
    solvesZh: '解决“后续公式很多，但基础代数对象不扎实”的问题。',
    checkpointZh: '用自己的话解释有限群和有限域为什么是后续课程前置。',
    outputTaskZh: '整理一份“群 / 域 / 运算规则”中文术语卡。',
    prerequisites: ['cryptography-intro'],
    glossaryTerms: ['group', 'field', 'finite field']
  },
  {
    slug: 'discrete-fourier-transform',
    titleZh: 'Discrete Fourier Transform',
    titleEn: 'Discrete Fourier Transform',
    oneLinerZh: '为后续多项式承诺和证明系统打基础。',
    solvesZh: '解决“DFT 知道名字，但不知道它为什么出现在密码学课程里”的问题。',
    checkpointZh: '解释 DFT 为什么会和证明系统学习产生关联。',
    outputTaskZh: '写一段“DFT 在密码学课程中的角色”摘要。',
    prerequisites: ['finite-groups-fields'],
    glossaryTerms: ['dft', 'polynomial', 'evaluation']
  },
  {
    slug: 'elliptic-curves-pairings',
    titleZh: 'Elliptic Curves & Pairings',
    titleEn: 'Elliptic Curves & Pairings',
    oneLinerZh: '进入以太坊密码学里最常见的结构化对象。',
    solvesZh: '解决“椭圆曲线与配对名字常见，但没有可解释框架”的问题。',
    checkpointZh: '分别说明 elliptic curves 和 pairings 在学习中的定位。',
    outputTaskZh: '做一份椭圆曲线与配对的中英术语表。',
    prerequisites: ['finite-groups-fields'],
    glossaryTerms: ['elliptic curve', 'pairing'],
    nodeSlugs: ['pairings']
  },
  {
    slug: 'bls-signatures',
    titleZh: 'BLS Signatures',
    titleEn: 'BLS Signatures',
    oneLinerZh: '把密码学基础落到协议里常见的签名场景。',
    solvesZh: '解决“知道 BLS 用于共识，但不理解它在课程中的位置”的问题。',
    checkpointZh: '解释为什么 BLS 对以太坊协议学习重要。',
    outputTaskZh: '写一张 BLS 签名的学习卡片，说明你还要补哪一层基础。',
    prerequisites: ['elliptic-curves-pairings'],
    glossaryTerms: ['bls', 'signature', 'aggregation'],
    nodeSlugs: ['bls-signatures']
  },
  {
    slug: 'proof-systems',
    titleZh: 'Proof Systems',
    titleEn: 'Proof Systems',
    oneLinerZh: '把密码学主线引向可验证计算和 zk 方向。',
    solvesZh: '解决“proof system 很大，但不知道从哪进入”的问题。',
    checkpointZh: '用中文说明你目前对 proof system 的最小理解框架。',
    outputTaskZh: '写一个 proof systems 学习笔记模板，标出后续想追的 zk 方向。',
    prerequisites: ['discrete-fourier-transform', 'elliptic-curves-pairings'],
    glossaryTerms: ['proof system', 'zk', 'prover', 'verifier'],
    nodeSlugs: ['proof-systems']
  }
];

const leanSeeds: ModuleSeed[] = [
  {
    slug: 'lean-zkevm-intro',
    titleZh: 'Lean / zkEVM 总览',
    titleEn: 'Intro and Overview',
    oneLinerZh: '建立 Lean Ethereum / zkEVM 主线的全局视图。',
    solvesZh: '解决“Lean 与 zkEVM 看起来很分散，不知道课程主轴”的问题。',
    checkpointZh: '说明你理解的 Lean / zkEVM 主线目标是什么。',
    outputTaskZh: '写一张 Lean / zkEVM 学习计划卡片。',
    glossaryTerms: ['lean', 'zkevm', 'formalization']
  },
  {
    slug: 'lean-consensus-overview',
    titleZh: 'Lean Consensus Overview',
    titleEn: 'Lean Consensus Overview',
    oneLinerZh: '从形式化角度重新看共识对象。',
    solvesZh: '解决“知道共识概念，但不知道 Lean 环境里如何表达”的问题。',
    checkpointZh: '用中文说明 Lean 共识总览和普通课程总览的差异。',
    outputTaskZh: '写一段 Lean 共识学习摘要，强调形式化视角。',
    prerequisites: ['lean-zkevm-intro'],
    glossaryTerms: ['lean consensus', 'state transition']
  },
  {
    slug: 'lean-client-architecture',
    titleZh: 'Lean Client Architecture',
    titleEn: 'Lean Client Architecture',
    oneLinerZh: '把 Lean 主线延伸到客户端结构表达。',
    solvesZh: '解决“形式化内容和客户端结构之间断开”的问题。',
    checkpointZh: '解释 Lean client architecture 关注的对象是什么。',
    outputTaskZh: '画一张 Lean client architecture 的学习草图。',
    prerequisites: ['lean-consensus-overview'],
    glossaryTerms: ['client architecture', 'formal model']
  },
  {
    slug: 'zkevm-fundamentals',
    titleZh: 'zkEVM Fundamentals',
    titleEn: 'zkEVM Fundamentals',
    oneLinerZh: '把 zkEVM 作为独立对象纳入学习路径。',
    solvesZh: '解决“zkEVM 概念散落，看不到与课程主线关系”的问题。',
    checkpointZh: '说明 zkEVM 为什么属于这条 Track 的核心模块。',
    outputTaskZh: '写一段 zkEVM 基础导学，说明你准备追哪些节点。',
    prerequisites: ['lean-zkevm-intro'],
    glossaryTerms: ['zkevm', 'proof', 'execution'],
    nodeSlugs: ['zk-evm-intro']
  },
  {
    slug: 'leanspec-tooling',
    titleZh: 'leanSpec and Tooling',
    titleEn: 'leanSpec and tooling',
    oneLinerZh: '把工具链和规范表达连起来。',
    solvesZh: '解决“知道 Lean 名字，但不清楚 tooling 和规范如何配合”的问题。',
    checkpointZh: '说明 leanSpec / tooling 在学习和贡献中的作用。',
    outputTaskZh: '列出你准备进一步调研的 leanSpec / tooling 入口。',
    prerequisites: ['lean-client-architecture'],
    glossaryTerms: ['leanspec', 'tooling', 'formal spec'],
    nodeSlugs: ['leanspec']
  },
  {
    slug: 'post-quantum-cryptography',
    titleZh: 'Post-Quantum Cryptography',
    titleEn: 'Post-Quantum Cryptography',
    oneLinerZh: '把未来安全方向接回课程主线。',
    solvesZh: '解决“后量子密码学与协议学习的关系不明确”的问题。',
    checkpointZh: '用自己的话说明为什么这条主线会关心 post-quantum cryptography。',
    outputTaskZh: '写一张后量子方向的后续阅读卡片。',
    prerequisites: ['zkevm-fundamentals'],
    glossaryTerms: ['post-quantum', 'cryptography', 'future proofing']
  }
];

function buildModules(track: TrackSlug, sourceRefIds: string[], seeds: ModuleSeed[]): ModuleRecord[] {
  return seeds.map((seed, index) => ({
    slug: seed.slug,
    track,
    titleZh: seed.titleZh,
    titleEn: seed.titleEn,
    oneLinerZh: seed.oneLinerZh,
    solvesZh: seed.solvesZh,
    summaryZh: [
      seed.oneLinerZh,
      'ETHCorePlay 在这里提供中文导学、依赖关系、术语整理与输出任务，不替代上游原始内容。'
    ],
    prerequisites: seed.prerequisites || [],
    commonPitfallsZh: seed.commonPitfallsZh || [
      '把二手解释当成上游权威内容。',
      '只看单页摘要，不回到课程、wiki 或 repo 原入口。',
      '学完概念后没有形成可验证的公开输出。'
    ],
    checkpointZh: seed.checkpointZh,
    outputTaskZh: seed.outputTaskZh,
    glossaryTerms: seed.glossaryTerms || [],
    sourceRefIds,
    nodeSlugs: seed.nodeSlugs || [],
    nextSlugs: index < seeds.length - 1 ? [seeds[index + 1].slug] : [],
    legacyChapterId: seed.legacyChapterId
  }));
}

export const modules: ModuleRecord[] = [
  ...buildModules('protocol-101', ['study-protocol-101', 'wiki-epf', 'repo-protocol-studies'], protocolSeeds),
  ...buildModules('cryptography', ['study-cryptography', 'wiki-epf', 'repo-protocol-studies'], cryptographySeeds),
  ...buildModules('lean-zkevm', ['study-lean-zkevm', 'wiki-epf', 'repo-protocol-studies'], leanSeeds)
];

const moduleMap = Object.fromEntries(modules.map((module) => [module.slug, module])) as Record<string, ModuleRecord>;

export const tracks: TrackRecord[] = [
  {
    slug: 'protocol-101',
    titleZh: 'Ethereum Protocol 101',
    titleEn: 'Ethereum Protocol 101',
    oneLinerZh: '面向协议学习者的主入口，从 EL/CL 到 specs、testing 与客户端结构。',
    overviewZh: '优先映射公开的 Protocol 101 主线，把执行层、共识层、规范、测试和客户端结构组织成中文学习执行入口。',
    audienceZh: '适合 L0 新人、L1 协议学习者，以及需要建立协议全景认知的 EPF 申请者。',
    prerequisitesZh: ['无需协议开发经验', '建议具备基础以太坊概念', '愿意回到上游原始来源阅读'],
    difficultyLabel: 'Foundation -> Intermediate -> Deep Dive',
    recommendedOrderZh: protocolSeeds.map((seed) => seed.titleZh),
    outputRequirementsZh: ['完成至少 1 张协议总览卡', '至少 1 次结构图绘制', '至少 1 次 client / spec 入口定位'],
    contributionExitZh: '读 specs、定位 client 模块、进入 protocol-studies 与上游协作入口。',
    sourceRefIds: ['study-protocol-101', 'wiki-epf', 'repo-protocol-studies'],
    moduleSlugs: protocolSeeds.map((seed) => seed.slug)
  },
  {
    slug: 'cryptography',
    titleZh: 'Cryptography of Ethereum',
    titleEn: 'Cryptography of Ethereum',
    oneLinerZh: '把以太坊密码学主线组织成从基础对象到证明系统的中文入口。',
    overviewZh: '围绕有限群与域、DFT、椭圆曲线与配对、BLS、证明系统建立可追踪的密码学学习路径。',
    audienceZh: '适合 L1 协议学习者和准备进入 zk / 证明系统方向的 EPF 申请者。',
    prerequisitesZh: ['建议完成 Protocol 101 总览', '愿意做术语整理与基础复述', '接受先补数学基础再进入应用层'],
    difficultyLabel: 'Math Foundation -> Applied Protocol Crypto',
    recommendedOrderZh: cryptographySeeds.map((seed) => seed.titleZh),
    outputRequirementsZh: ['完成一套密码学术语卡', '完成 1 份概念复述', '形成 1 个后续阅读计划'],
    contributionExitZh: '把密码学节点回流到公开笔记、课程笔记与 protocol-studies 相关入口。',
    sourceRefIds: ['study-cryptography', 'wiki-epf', 'repo-protocol-studies'],
    moduleSlugs: cryptographySeeds.map((seed) => seed.slug)
  },
  {
    slug: 'lean-zkevm',
    titleZh: 'Lean Ethereum / zkEVM',
    titleEn: 'Lean Ethereum / zkEVM',
    oneLinerZh: '把 Lean、zkEVM、leanSpec 与未来安全方向串成一条独立主线。',
    overviewZh: '按公开课程结构组织 Lean 共识、Lean 客户端结构、zkEVM、leanSpec tooling 与后量子密码学内容。',
    audienceZh: '适合 L2 EPF 申请者、zk / formalization 方向学习者，以及已具协议基础的贡献者。',
    prerequisitesZh: ['建议先有 Protocol 101 全景理解', '建议具备基础密码学背景', '愿意把学习结果沉淀成结构化输出'],
    difficultyLabel: 'Advanced Frontier Track',
    recommendedOrderZh: leanSeeds.map((seed) => seed.titleZh),
    outputRequirementsZh: ['至少 1 张形式化 / zkEVM 结构图', '至少 1 份 tooling 入口清单', '至少 1 次研究方向笔记'],
    contributionExitZh: '回流到 leanSpec / protocol-studies 入口，准备进入更真实的规范和工具协作。',
    sourceRefIds: ['study-lean-zkevm', 'wiki-epf', 'repo-protocol-studies'],
    moduleSlugs: leanSeeds.map((seed) => seed.slug)
  }
];

export const knowledgeNodes: KnowledgeNodeRecord[] = [
  {
    slug: 'engine-api',
    titleZh: 'Engine API',
    titleEn: 'Engine API',
    summaryZh: '连接执行层与共识层的核心接口，是理解 Merge 后客户端协同的关键节点。',
    track: 'protocol-101',
    moduleSlugs: ['engine-api'],
    prerequisiteSlugs: ['consensus-layer-overview', 'execution-layer-overview'],
    glossaryTerms: ['engine api', 'payload', 'forkchoice'],
    relatedSpecZh: ['EL/CL 协同接口', 'Payload 生命周期', 'Forkchoice 更新'],
    relatedClientZh: ['Execution Client', 'Consensus Client'],
    nextRecommended: ['execution-client-architecture', 'cl-client-architecture'],
    sourceRefIds: ['study-protocol-101', 'wiki-epf', 'repo-protocol-studies']
  },
  {
    slug: 'gasper',
    titleZh: 'Gasper',
    titleEn: 'Gasper',
    summaryZh: '把 fork choice 与 finality 放在同一协议对象里理解，是 CL 深入学习的关键节点。',
    track: 'protocol-101',
    moduleSlugs: ['gasper-consensus'],
    prerequisiteSlugs: ['consensus-layer-overview'],
    glossaryTerms: ['gasper', 'fork choice', 'finality'],
    relatedSpecZh: ['Consensus Protocol', 'Finality Rule'],
    relatedClientZh: ['Consensus Client'],
    nextRecommended: ['validator-client', 'beacon-state'],
    sourceRefIds: ['study-protocol-101', 'wiki-epf']
  },
  {
    slug: 'beacon-state',
    titleZh: 'Beacon State',
    titleEn: 'Beacon State',
    summaryZh: '共识层核心状态对象，连接验证者集合、检查点与状态演进。',
    track: 'protocol-101',
    moduleSlugs: ['beacon-state'],
    prerequisiteSlugs: ['consensus-layer-overview'],
    glossaryTerms: ['beacon state', 'validator set', 'checkpoint'],
    relatedSpecZh: ['State Transition', 'Validator Registry'],
    relatedClientZh: ['Consensus Client'],
    nextRecommended: ['cl-client-architecture'],
    sourceRefIds: ['study-protocol-101', 'wiki-epf']
  },
  {
    slug: 'devp2p',
    titleZh: 'DevP2P',
    titleEn: 'DevP2P',
    summaryZh: '执行层网络传播与节点发现的重要入口，用来理解交易和区块如何流动。',
    track: 'protocol-101',
    moduleSlugs: ['el-networking-devp2p'],
    prerequisiteSlugs: ['execution-layer-overview'],
    glossaryTerms: ['devp2p', 'txpool', 'propagation'],
    relatedSpecZh: ['Execution Networking', 'Peer Discovery'],
    relatedClientZh: ['Execution Client'],
    nextRecommended: ['tx-lifecycle-core'],
    sourceRefIds: ['study-protocol-101', 'wiki-epf']
  },
  {
    slug: 'precompiles',
    titleZh: 'Precompiles',
    titleEn: 'Precompiles',
    summaryZh: '执行层里以特殊接口暴露的重要能力，是理解成本模型与功能边界的典型节点。',
    track: 'protocol-101',
    moduleSlugs: ['precompiles'],
    prerequisiteSlugs: ['evm'],
    glossaryTerms: ['precompile', 'cost model'],
    relatedSpecZh: ['Execution Semantics', 'Precompile Set'],
    relatedClientZh: ['Execution Client'],
    nextRecommended: ['el-data-structures'],
    sourceRefIds: ['study-protocol-101', 'wiki-epf']
  },
  {
    slug: 'bls-signatures',
    titleZh: 'BLS Signatures',
    titleEn: 'BLS Signatures',
    summaryZh: '以太坊密码学主线里的代表性签名对象，用来连接配对与协议应用。',
    track: 'cryptography',
    moduleSlugs: ['bls-signatures'],
    prerequisiteSlugs: ['elliptic-curves-pairings'],
    glossaryTerms: ['bls', 'signature', 'aggregation'],
    relatedSpecZh: ['Signature Scheme', 'Aggregation'],
    relatedClientZh: ['Consensus Client'],
    nextRecommended: ['proof-systems'],
    sourceRefIds: ['study-cryptography', 'wiki-epf']
  },
  {
    slug: 'pairings',
    titleZh: 'Pairings',
    titleEn: 'Pairings',
    summaryZh: '连接椭圆曲线与后续证明/签名系统的重要概念节点。',
    track: 'cryptography',
    moduleSlugs: ['elliptic-curves-pairings'],
    prerequisiteSlugs: ['finite-groups-fields'],
    glossaryTerms: ['pairing', 'curve'],
    relatedSpecZh: ['Pairing-friendly Curves'],
    relatedClientZh: ['Cryptography Libraries'],
    nextRecommended: ['bls-signatures', 'proof-systems'],
    sourceRefIds: ['study-cryptography', 'wiki-epf']
  },
  {
    slug: 'proof-systems',
    titleZh: 'Proof Systems',
    titleEn: 'Proof Systems',
    summaryZh: '连接密码学主线与 zkEVM 主线的关键节点，用于理解可验证计算。',
    track: 'cryptography',
    moduleSlugs: ['proof-systems'],
    prerequisiteSlugs: ['discrete-fourier-transform', 'elliptic-curves-pairings'],
    glossaryTerms: ['proof system', 'prover', 'verifier'],
    relatedSpecZh: ['Polynomial Commitments', 'Zero Knowledge'],
    relatedClientZh: ['Proof Tooling'],
    nextRecommended: ['zkevm-fundamentals'],
    sourceRefIds: ['study-cryptography', 'wiki-epf']
  },
  {
    slug: 'zk-evm-intro',
    titleZh: 'zkEVM Intro',
    titleEn: 'zkEVM Intro',
    summaryZh: 'Lean / zkEVM 主线的核心入口，把证明系统与执行模型连接起来。',
    track: 'lean-zkevm',
    moduleSlugs: ['zkevm-fundamentals'],
    prerequisiteSlugs: ['proof-systems'],
    glossaryTerms: ['zkevm', 'execution', 'proof'],
    relatedSpecZh: ['zkEVM Fundamentals', 'Execution Semantics'],
    relatedClientZh: ['zk Tooling'],
    nextRecommended: ['leanspec-tooling'],
    sourceRefIds: ['study-lean-zkevm', 'wiki-epf']
  },
  {
    slug: 'leanspec',
    titleZh: 'leanSpec',
    titleEn: 'leanSpec',
    summaryZh: '形式化规范与工具链入口，用于把课程学习推向工具和贡献实践。',
    track: 'lean-zkevm',
    moduleSlugs: ['leanspec-tooling'],
    prerequisiteSlugs: ['lean-client-architecture'],
    glossaryTerms: ['leanspec', 'tooling', 'formal spec'],
    relatedSpecZh: ['Formal Spec', 'Tooling Workflow'],
    relatedClientZh: ['leanSpec Toolchain'],
    nextRecommended: ['post-quantum-cryptography'],
    sourceRefIds: ['study-lean-zkevm', 'repo-protocol-studies']
  }
];

export const personaRoutes: PersonaRoute[] = [
  {
    id: 'newcomer',
    label: '我是新人',
    description: '先建立 EL / CL / specs / testing 的整体地图。',
    to: '/tracks/protocol-101'
  },
  {
    id: 'epf-applicant',
    label: '我要申请 EPF',
    description: '优先走结构化 Track，再形成公开输出与贡献入口。',
    to: '/tracks/protocol-101'
  },
  {
    id: 'deep-el-cl',
    label: '我想深挖 EL / CL',
    description: '直接进入 Protocol 101，再进入 Engine API、Beacon State、DevP2P 等节点。',
    to: '/tracks/protocol-101'
  },
  {
    id: 'crypto',
    label: '我要补密码学',
    description: '先补群、域、配对、BLS 和 proof systems 的结构链路。',
    to: '/tracks/cryptography'
  },
  {
    id: 'lean-zk',
    label: '我想跟 Lean / zkEVM',
    description: '把 Lean consensus、zkEVM、leanSpec 和 future crypto 串成一条线。',
    to: '/tracks/lean-zkevm'
  }
];

export const contributionActions = [
  {
    title: '回到上游原文',
    description: '所有模块都要求从 ETHCorePlay 回流到上游课程、wiki 或 protocol-studies 仓库。',
    href: 'https://study.epf.wiki'
  },
  {
    title: '公开输出',
    description: '把每个模块至少沉淀成 1 个可验证的摘要、图解或分享记录。',
    href: '/progress'
  },
  {
    title: '定位 client / spec 入口',
    description: '从模块页继续进入规范、代码库、协议对象与 tooling 入口。',
    href: '/tracks/protocol-101'
  },
  {
    title: '进入协作入口',
    description: '把学习结果回流到 protocol-studies 或公开协作场景，而不是只停留在站内。',
    href: 'https://github.com/eth-protocol-fellows/protocol-studies'
  }
];

export function getTrackBySlug(slug?: string) {
  return tracks.find((track) => track.slug === slug) || null;
}

export function getModulesForTrack(trackSlug: TrackSlug) {
  return modules.filter((module) => module.track === trackSlug);
}

export function getModuleBySlug(slug?: string) {
  return modules.find((module) => module.slug === slug) || null;
}

export function getKnowledgeNodeBySlug(slug?: string) {
  return knowledgeNodes.find((node) => node.slug === slug) || null;
}

export function getTrackSources(track: TrackRecord) {
  return track.sourceRefIds
    .map((id) => sourceRefMap[id])
    .filter((source): source is SourceRef => Boolean(source));
}

export function getModuleSources(module: ModuleRecord) {
  return module.sourceRefIds
    .map((id) => sourceRefMap[id])
    .filter((source): source is SourceRef => Boolean(source));
}

export function getNodeSources(node: KnowledgeNodeRecord) {
  return node.sourceRefIds
    .map((id) => sourceRefMap[id])
    .filter((source): source is SourceRef => Boolean(source));
}

export function getModuleDependencies(module: ModuleRecord) {
  return module.prerequisites
    .map((slug) => moduleMap[slug])
    .filter((dependency): dependency is ModuleRecord => Boolean(dependency));
}

export function getNextModules(module: ModuleRecord) {
  return module.nextSlugs
    .map((slug) => moduleMap[slug])
    .filter((nextModule): nextModule is ModuleRecord => Boolean(nextModule));
}

export function getTrackCompletion(moduleSlugs: string[], moduleProgress: Record<string, { sourceRead: boolean; checkpointDone: boolean; outputSubmitted: boolean }>) {
  const completed = moduleSlugs.filter((slug) => {
    const progress = moduleProgress[slug];
    return Boolean(progress?.sourceRead && progress?.checkpointDone && progress?.outputSubmitted);
  }).length;

  return {
    completed,
    total: moduleSlugs.length,
    percent: moduleSlugs.length ? Math.round((completed / moduleSlugs.length) * 100) : 0
  };
}
