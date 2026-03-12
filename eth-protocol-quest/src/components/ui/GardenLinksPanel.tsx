export function GardenLinksPanel() {
  const links = [
    ['Ethereum Docs', 'https://ethereum.org/developers/docs/'],
    ['EIPs', 'https://eips.ethereum.org/'],
    ['Execution clients', 'https://ethereum.org/developers/docs/nodes-and-clients/#execution-clients'],
    ['Consensus clients', 'https://ethereum.org/developers/docs/nodes-and-clients/#consensus-clients']
  ] as const;
  return (
    <aside className="card card-hover">
      <h3>Garden Links</h3>
      <ul>
        {links.map(([n,u]) => <li key={u}><a href={u} target="_blank" rel="noreferrer">{n}</a></li>)}
      </ul>
    </aside>
  );
}
