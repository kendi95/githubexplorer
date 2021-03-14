import { FC, useEffect, useState } from "react";
import RepositoryItem from "../RepositoryItem";
import api from '../../services/api';

import './styles.scss';

interface IRepository {
  name: string;
  description: string;
  link: string;
}

interface IRepositoryFetch {
  name: string;
  description: string;
  html_url: string;
}

const RepositoryList: FC = () => {
  const [repositories, setRepositories] = useState<IRepository[]>([]);

  useEffect(() => {
    async function getRepository() {
      try {
        const response = await api.get<IRepositoryFetch[]>('/orgs/rocketseat/repos');
        setRepositories(response.data.map(repos => {
          return { name: repos.name, description: repos.description, link: repos.html_url }
        }));
      } catch (error) {
        console.log(error.message);
      }
    }

    getRepository()
  }, []);

  return (
    <section className="repository-list">
      <h1>Lista de repositórios</h1>

      <ul>
        {repositories.map((repository, index) => (
          <RepositoryItem key={index} repository={repository} />
        ))}
      </ul>
    </section>
  )
}

export default RepositoryList;