import { levels } from './levels';

export type ZoneKey = 'execution' | 'consensus' | 'tooling' | 'security' | 'scaling';

export type ZoneMeta = {
  key: ZoneKey;
  title: string;
  subtitle: string;
};

export type PlotItem = {
  id: string;
  levelId: number;
  title: string;
  summary: string;
  zone: ZoneKey;
  difficulty: 1 | 2 | 3 | 4 | 5;
  timeMins: number;
  tags: string[];
  featured?: boolean;
};

const TOPIC_TO_ZONE: Record<string, ZoneKey> = {
  EL: 'execution',
  EVM: 'execution',
  TX: 'execution',
  CL: 'consensus',
  ENGINE: 'tooling',
  EIP: 'tooling',
  CLIENT: 'security'
};

export const zones: ZoneMeta[] = [
  { key: 'execution', title: '执行花园', subtitle: '状态、Gas、交易执行语义' },
  { key: 'consensus', title: '共识山丘', subtitle: 'Fork Choice、Finality、验证者机制' },
  { key: 'tooling', title: '工程工坊', subtitle: 'Engine API、EIP 流程、客户端协同' },
  { key: 'security', title: '安全林地', subtitle: '重组、审查阻力、鲁棒性与演练' },
  { key: 'scaling', title: '扩容河谷', subtitle: 'L2、DA、结算与跨层交互' }
];

export const zoneMap: Record<ZoneKey, ZoneMeta> = zones.reduce((acc, z) => {
  acc[z.key] = z;
  return acc;
}, {} as Record<ZoneKey, ZoneMeta>);

const topicToTags: Record<string, string[]> = {
  EL: ['State', 'Gas'],
  EVM: ['Opcode', 'Runtime'],
  TX: ['Txpool', 'Lifecycle'],
  CL: ['ForkChoice', 'Finality'],
  ENGINE: ['EngineAPI', 'ClientSync'],
  EIP: ['Spec', 'Workflow'],
  CLIENT: ['Testing', 'Debugging']
};

const hardTopics = new Set(['CLIENT', 'ENGINE']);

export const plots: PlotItem[] = levels.map((level) => {
  const lowerTitle = level.title.toLowerCase();
  const lowerSlug = level.slug.toLowerCase();
  const zone =
    lowerTitle.includes('rollup') ||
    lowerTitle.includes('blob') ||
    lowerTitle.includes('l2') ||
    lowerTitle.includes('da') ||
    lowerSlug.includes('rollup') ||
    lowerSlug.includes('blob') ||
    lowerSlug.includes('l2')
      ? 'scaling'
      : TOPIC_TO_ZONE[level.topic] || 'tooling';
  const baseDifficulty = Math.min(5, Math.max(1, Math.ceil(level.id / 3))) as 1 | 2 | 3 | 4 | 5;
  const difficulty = (hardTopics.has(level.topic) ? Math.min(5, baseDifficulty + 1) : baseDifficulty) as 1 | 2 | 3 | 4 | 5;
  return {
    id: level.slug,
    levelId: level.id,
    title: level.title,
    summary: level.goal,
    zone,
    difficulty,
    timeMins: 20 + difficulty * 10,
    tags: [level.topic, ...(topicToTags[level.topic] || ['Protocol'])],
    featured: level.id <= 6
  };
});

export const searchAliases: Record<string, string[]> = {
  pbs: ['proposer builder separation', 'inclusion list'],
  blob: ['4844', 'data availability'],
  aa: ['account abstraction', '4337'],
  verkle: ['stateless', 'witness'],
  mev: ['mempool', 'builder relay']
};
