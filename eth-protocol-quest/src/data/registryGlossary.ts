import type { TrackSlug } from './registry';

export type RegistryGlossaryTerm = {
  slug: string;
  termEn: string;
  termZh: string;
  aliases: string[];
  discouragedZh: string[];
  definitionZh: string;
  firstRecommendedReadingModuleSlug: string;
  trackSlug: TrackSlug;
  relatedNodeSlugs: string[];
  relatedModuleSlugs: string[];
  relatedTermSlugs: string[];
  sourceRefIds: string[];
};

export const registryGlossary: RegistryGlossaryTerm[] = [
  {
    slug: 'fork-choice',
    termEn: 'Fork Choice',
    termZh: '分叉选择',
    aliases: ['fork choice', 'chain head selection', 'lmd-ghost'],
    discouragedZh: ['链头随便选'],
    definitionZh: '共识层用于判断当前应该跟随哪条链头的规则集合，是理解 Gasper 的关键入口。',
    firstRecommendedReadingModuleSlug: 'consensus-layer-overview',
    trackSlug: 'protocol-101',
    relatedNodeSlugs: ['gasper'],
    relatedModuleSlugs: ['consensus-layer-overview', 'gasper-consensus'],
    relatedTermSlugs: ['finality', 'gasper'],
    sourceRefIds: ['study-protocol-101', 'wiki-epf']
  },
  {
    slug: 'finality',
    termEn: 'Finality',
    termZh: '最终性',
    aliases: ['finality', 'economic finality'],
    discouragedZh: ['打包即最终'],
    definitionZh: '区块达到经济上强不可逆的状态，不能和“已被打包”混为一谈。',
    firstRecommendedReadingModuleSlug: 'consensus-layer-overview',
    trackSlug: 'protocol-101',
    relatedNodeSlugs: ['gasper', 'beacon-state'],
    relatedModuleSlugs: ['consensus-layer-overview', 'gasper-consensus', 'beacon-state'],
    relatedTermSlugs: ['fork-choice', 'beacon-state'],
    sourceRefIds: ['study-protocol-101', 'wiki-epf']
  },
  {
    slug: 'proposer-builder-separation',
    termEn: 'Proposer-Builder Separation',
    termZh: '提议者-构建者分离',
    aliases: ['pbs', 'builder separation'],
    discouragedZh: ['打包外包'],
    definitionZh: '围绕 MEV、包含性和区块构建流程展开的重要方向，属于研究与生态实践交叉点。',
    firstRecommendedReadingModuleSlug: 'core-development-overview',
    trackSlug: 'protocol-101',
    relatedNodeSlugs: [],
    relatedModuleSlugs: ['core-development-overview'],
    relatedTermSlugs: ['finality', 'engine-api'],
    sourceRefIds: ['study-protocol-101', 'wiki-epf', 'repo-protocol-studies']
  },
  {
    slug: 'precompile',
    termEn: 'Precompile',
    termZh: '预编译合约',
    aliases: ['precompile', 'precompiles'],
    discouragedZh: ['特殊 opcode'],
    definitionZh: '执行层通过固定地址暴露的特殊能力接口，用于在成本和功能之间做工程折中。',
    firstRecommendedReadingModuleSlug: 'precompiles',
    trackSlug: 'protocol-101',
    relatedNodeSlugs: ['precompiles'],
    relatedModuleSlugs: ['precompiles', 'evm'],
    relatedTermSlugs: ['engine-api'],
    sourceRefIds: ['study-protocol-101', 'wiki-epf']
  },
  {
    slug: 'pairing',
    termEn: 'Pairing',
    termZh: '配对',
    aliases: ['pairing', 'elliptic curve pairing'],
    discouragedZh: ['普通映射'],
    definitionZh: '密码学主线中的核心对象，用于连接椭圆曲线、BLS 与部分证明系统。',
    firstRecommendedReadingModuleSlug: 'elliptic-curves-pairings',
    trackSlug: 'cryptography',
    relatedNodeSlugs: ['pairings', 'bls-signatures'],
    relatedModuleSlugs: ['elliptic-curves-pairings', 'bls-signatures'],
    relatedTermSlugs: ['bls-signature', 'proof-system'],
    sourceRefIds: ['study-cryptography', 'wiki-epf']
  },
  {
    slug: 'beacon-state',
    termEn: 'Beacon State',
    termZh: '信标链状态',
    aliases: ['beacon state'],
    discouragedZh: ['共识缓存'],
    definitionZh: '共识层核心状态对象，用来承载验证者集合、检查点和状态演进。',
    firstRecommendedReadingModuleSlug: 'beacon-state',
    trackSlug: 'protocol-101',
    relatedNodeSlugs: ['beacon-state'],
    relatedModuleSlugs: ['beacon-state', 'cl-client-architecture'],
    relatedTermSlugs: ['finality', 'fork-choice', 'gasper'],
    sourceRefIds: ['study-protocol-101', 'wiki-epf']
  },
  {
    slug: 'witness',
    termEn: 'Witness',
    termZh: '见证数据',
    aliases: ['witness', 'stateless witness'],
    discouragedZh: ['旁路证明'],
    definitionZh: '无状态执行场景中用于证明状态访问正确性的辅助数据，是 Verkle / Stateless 方向的关键词。',
    firstRecommendedReadingModuleSlug: 'el-data-structures',
    trackSlug: 'protocol-101',
    relatedNodeSlugs: [],
    relatedModuleSlugs: ['el-data-structures'],
    relatedTermSlugs: ['kzg-commitment', 'proof-system'],
    sourceRefIds: ['study-protocol-101', 'wiki-epf']
  },
  {
    slug: 'kzg-commitment',
    termEn: 'KZG Commitment',
    termZh: 'KZG 承诺',
    aliases: ['kzg', 'kzg commitment'],
    discouragedZh: ['blob 签名'],
    definitionZh: '以太坊路线图里常见的承诺结构关键词，理解它需要先有群、域、配对和多项式背景。',
    firstRecommendedReadingModuleSlug: 'proof-systems',
    trackSlug: 'cryptography',
    relatedNodeSlugs: ['proof-systems'],
    relatedModuleSlugs: ['discrete-fourier-transform', 'proof-systems'],
    relatedTermSlugs: ['pairing', 'proof-system', 'witness'],
    sourceRefIds: ['study-cryptography', 'wiki-epf']
  },
  {
    slug: 'proof-system',
    termEn: 'Proof System',
    termZh: '证明系统',
    aliases: ['proof system', 'proof systems', 'zk proof'],
    discouragedZh: ['证明工具包'],
    definitionZh: '连接密码学主线与 zkEVM 主线的关键对象，用来理解 prover / verifier 与可验证计算。',
    firstRecommendedReadingModuleSlug: 'proof-systems',
    trackSlug: 'cryptography',
    relatedNodeSlugs: ['proof-systems', 'zk-evm-intro'],
    relatedModuleSlugs: ['proof-systems', 'zkevm-fundamentals'],
    relatedTermSlugs: ['pairing', 'kzg-commitment', 'zkevm', 'leanspec'],
    sourceRefIds: ['study-cryptography', 'study-lean-zkevm', 'wiki-epf']
  },
  {
    slug: 'leanspec',
    termEn: 'leanSpec',
    termZh: 'leanSpec',
    aliases: ['leanspec', 'lean spec'],
    discouragedZh: ['lean 文档'],
    definitionZh: 'Lean Ethereum / zkEVM 主线中的工具链与形式化规范入口，服务于理解和贡献。',
    firstRecommendedReadingModuleSlug: 'leanspec-tooling',
    trackSlug: 'lean-zkevm',
    relatedNodeSlugs: ['leanspec'],
    relatedModuleSlugs: ['leanspec-tooling', 'lean-client-architecture'],
    relatedTermSlugs: ['proof-system', 'zkevm'],
    sourceRefIds: ['study-lean-zkevm', 'repo-protocol-studies']
  },
  {
    slug: 'engine-api',
    termEn: 'Engine API',
    termZh: '执行-共识引擎接口',
    aliases: ['engine api', 'forkchoiceUpdated', 'execution payload'],
    discouragedZh: ['合并接口层'],
    definitionZh: '连接执行层与共识层的核心接口，是 Merge 后理解客户端协同的关键节点。',
    firstRecommendedReadingModuleSlug: 'engine-api',
    trackSlug: 'protocol-101',
    relatedNodeSlugs: ['engine-api'],
    relatedModuleSlugs: ['engine-api', 'execution-client-architecture', 'cl-client-architecture'],
    relatedTermSlugs: ['finality', 'precompile', 'proposer-builder-separation'],
    sourceRefIds: ['study-protocol-101', 'wiki-epf', 'repo-protocol-studies']
  },
  {
    slug: 'gasper',
    termEn: 'Gasper',
    termZh: 'Gasper 共识协议',
    aliases: ['gasper'],
    discouragedZh: ['PoS 算法总称'],
    definitionZh: '把 fork choice 与 finality 组织在一起的共识协议对象，是 CL 深入学习的关键节点。',
    firstRecommendedReadingModuleSlug: 'gasper-consensus',
    trackSlug: 'protocol-101',
    relatedNodeSlugs: ['gasper'],
    relatedModuleSlugs: ['gasper-consensus', 'consensus-layer-overview'],
    relatedTermSlugs: ['fork-choice', 'finality', 'beacon-state'],
    sourceRefIds: ['study-protocol-101', 'wiki-epf']
  },
  {
    slug: 'bls-signature',
    termEn: 'BLS Signature',
    termZh: 'BLS 签名',
    aliases: ['bls', 'bls signature', 'bls signatures'],
    discouragedZh: ['聚合签名算法'],
    definitionZh: '以太坊密码学和共识学习中反复出现的签名对象，需要配对和曲线基础支撑。',
    firstRecommendedReadingModuleSlug: 'bls-signatures',
    trackSlug: 'cryptography',
    relatedNodeSlugs: ['bls-signatures'],
    relatedModuleSlugs: ['bls-signatures', 'elliptic-curves-pairings'],
    relatedTermSlugs: ['pairing', 'proof-system'],
    sourceRefIds: ['study-cryptography', 'wiki-epf']
  },
  {
    slug: 'zkevm',
    termEn: 'zkEVM',
    termZh: '零知识 EVM',
    aliases: ['zkevm', 'zk evm'],
    discouragedZh: ['加速版 EVM'],
    definitionZh: '把执行模型和证明系统连接起来的对象，是 Lean / zkEVM 主线的核心模块。',
    firstRecommendedReadingModuleSlug: 'zkevm-fundamentals',
    trackSlug: 'lean-zkevm',
    relatedNodeSlugs: ['zk-evm-intro'],
    relatedModuleSlugs: ['zkevm-fundamentals', 'leanspec-tooling'],
    relatedTermSlugs: ['proof-system', 'leanspec'],
    sourceRefIds: ['study-lean-zkevm', 'wiki-epf']
  }
];
