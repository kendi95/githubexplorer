import { useEffect, useState } from "react";
import RepositoryItem from "../RepositoryItem"

import './styles.scss';

export default function RepositoryList() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    function getRepository() {
      fetch('https://api.github.com/orgs/rocketseat/repos')
        .then(response => response.json())
        .then(data => setRepositories(data.map(repos => {
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