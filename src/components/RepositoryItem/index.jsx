import './styles.scss';

export default function RepositoryItem({ repository }) {
  return (
    <li className="repository-item">
      <strong>{repository?.name ?? 'Default'}</strong>
      <p>{repository?.description ?? ''}</p>

      <a href={repository?.link ?? ''}>Acessar repopsitório</a>
    </li>
  )
}