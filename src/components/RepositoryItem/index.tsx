import { FC } from 'react';
import './styles.scss';

interface IRepositoryItemProps {
  repository: {
    name: string;
    description: string;
    link: string;
  }
}

const RepositoryItem: FC<IRepositoryItemProps> = ({ repository }) => {
  return (
    <li className="repository-item">
      <strong>{repository.name}</strong>
      <p>{repository.description}</p>

      <a href={repository.link}>Acessar repopsitório</a>
    </li>
  )
}

export default RepositoryItem;