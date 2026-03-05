export const chapterSources: Record<string, { label: string; url: string }[]> = {
  'el-core': [
    { label: 'Ethereum Execution Layer Docs', url: 'https://ethereum.org/developers/docs/evm/' },
    { label: 'EIP-1559', url: 'https://eips.ethereum.org/EIPS/eip-1559' }
  ],
  'cl-core': [
    { label: 'Consensus Specs', url: 'https://github.com/ethereum/consensus-specs' }
  ],
  'engine-api-core': [
    { label: 'Engine API spec', url: 'https://github.com/ethereum/execution-apis/tree/main/src/engine' }
  ],
  'eip-workflow-core': [
    { label: 'EIPs portal', url: 'https://eips.ethereum.org/' }
  ],
  'eip4844-da-economics-deep': [
    { label: 'EIP-4844', url: 'https://eips.ethereum.org/EIPS/eip-4844' }
  ],
  'account-abstraction-deep': [
    { label: 'ERC-4337', url: 'https://eips.ethereum.org/EIPS/eip-4337' }
  ]
};
