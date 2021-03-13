import { FC, useEffect, useState } from "react";
import RepositoryItem from "../RepositoryItem"

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
    function getRepository() {
      fetch('https://api.github.com/orgs/rocketseat/repos')
        .then(response => response.json())
        .then(data => setRepositories(data.map((repos: IRepositoryFetch) => {
          return { name: repos.name, description: repos.description, link: repos.html_url }
        })))
        .catch(error => console.log(error.message));
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