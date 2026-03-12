export type SourceKind = 'Official' | 'EIP' | 'Client Impl' | 'Research';

export const chapterSources: Record<string, { label: string; url: string; kind: SourceKind }[]> = {
  'el-core': [
    { label: 'Ethereum Execution Layer Docs', url: 'https://ethereum.org/developers/docs/evm/', kind: 'Official' },
    { label: 'EIP-1559', url: 'https://eips.ethereum.org/EIPS/eip-1559', kind: 'EIP' }
  ],
  'cl-core': [
    { label: 'Consensus Specs', url: 'https://github.com/ethereum/consensus-specs', kind: 'Official' }
  ],
  'engine-api-core': [
    { label: 'Engine API spec', url: 'https://github.com/ethereum/execution-apis/tree/main/src/engine', kind: 'Client Impl' }
  ],
  'eip-workflow-core': [
    { label: 'EIPs portal', url: 'https://eips.ethereum.org/', kind: 'EIP' }
  ],
  'eip4844-da-economics-deep': [
    { label: 'EIP-4844', url: 'https://eips.ethereum.org/EIPS/eip-4844', kind: 'EIP' }
  ],
  'account-abstraction-deep': [
    { label: 'ERC-4337', url: 'https://eips.ethereum.org/EIPS/eip-4337', kind: 'EIP' }
  ]
};
