export const chapterDependencies: Record<string, string[]> = {
  'cl-core': ['el-core'],
  'evm-core': ['el-core'],
  'tx-lifecycle-core': ['el-core', 'cl-core'],
  'engine-api-core': ['el-core', 'cl-core'],
  'eip-workflow-core': ['el-core', 'cl-core'],
  'client-testing-core': ['engine-api-core', 'eip-workflow-core'],
  'testing-systems-core': ['client-testing-core'],
  'security-core': ['cl-core', 'testing-systems-core'],
  'l2-da-core': ['tx-lifecycle-core', 'security-core'],
  'el-deep-state-trie': ['el-core', 'evm-core'],
  'cl-deep-forkchoice-finality': ['cl-core', 'security-core']
};
