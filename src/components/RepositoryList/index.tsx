import { FC, useEffect, useState } from "react";
import { FiArrowDownCircle } from 'react-icons/fi';

import RepositoryItem from "../RepositoryItem";
import { IRepositoryFetch } from "../RepositorySearch";

import api from '../../services/api';

import './styles.scss';

export interface IRepository {
  name: string;
  description: string;
  link: string;
}

interface IRepositoryListProps {
  loading: boolean;
  repositories: IRepository[];
  hasValue: boolean;
  hasNext: boolean;
  type: string;
  search: string;
}

const RepositoryList: FC<IRepositoryListProps> = ({ 
  loading = false, 
  repositories = [], 
  hasValue = false, 
  hasNext = true,
  type,
  search
}) => {
  const [nextLoading, setNextLoading] = useState(false);
  const [page, setPage] = useState(2);
  const [repos, setRepos] = useState<IRepository[]>([]);
  const [newType, setType] = useState<String>('');
  const [newSearch, setSearch] = useState<String>('');
  const [next, setNext] = useState<boolean>(true);

  const handleMoreRepositories = async () => {
    try {
      setNextLoading(true);

      const response = await api.get<IRepositoryFetch[]>(`https://api.github.com/${newType}/${newSearch}/repos`, {
        params: { page, per_page: 10 }
      })

      const next = response.headers.link.search('next');
      if (next !== -1) {
        const findedNext = response.headers.link.substring(next, next +'next'.length);
        if (findedNext === 'next') {
          const newRepos = response.data.map((repos: IRepositoryFetch): IRepository => {
            return { name: repos.name, description: repos.description, link: repos.html_url }
          });
          setRepos(oldRepos => [...oldRepos, ...newRepos]);
          setPage(page + 1);
        }
      } else {
        const prev = response.headers.link.search('prev');
        const findedPrev = response.headers.link.substring(prev, prev +'prev'.length);
        if (findedPrev === 'prev') {
          setNext(false);
          setPage(2);
        }
      }

      setNextLoading(false);
    } catch (error) {
      setNextLoading(false);
    }
  }

  useEffect(() => {
    if (repositories.length > 0) {
      setRepos(repositories);
      setType(type);
      setSearch(search);
      setPage(2);
      setNext(hasNext);
    }
  }, [repositories, type, search, hasNext]);

  return (
    <>
      <aside>
        <h1>Lista de repositórios</h1>

        <div className="repository-list">
          {loading ? (
            <h2>Carregando...</h2>
          ) : (
            <ul>
              {repos.length > 0 ? repos.map((repository, index) => (
                <>
                  {(repos.length - 1) === index && next ? (
                    <>
                      {nextLoading ? (
                        <div className="repository-list-next">
                          <h4>Carregando...</h4>
                        </div>
                      ) : (
                        <div className="repository-list-next">
                          <FiArrowDownCircle onClick={handleMoreRepositories} />
                        </div>
                      )}
                    </>
                  ) : (
                    <RepositoryItem key={index} repository={repository} />
                  )}
                </>
              )) : (
                <>
                  {hasValue && <h2>Não existe repositórios com esse nome</h2>}
                </>
              )}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}

export default RepositoryList;