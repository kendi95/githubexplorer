import { useState } from 'react';
import RepositoryList, { IRepository } from './components/RepositoryList';
import RepositorySearch, { IRepositoryFetch } from './components/RepositorySearch';

import './styles/global.scss';

export default function App() {
  const [repositories, setRepositories] = useState<IRepository[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [type, setType] = useState('');
  const [search, setSearch] = useState('');

  return (
    <>
      <RepositorySearch
        onSearch={setSearch}
        onType={setType}
        onNextLoadingdata={setHasNext}
        onValueSearch={setHasValue}
        onLoading={setLoading}
        onChange={repositories => {
          setRepositories(repositories.map((repos: IRepositoryFetch): IRepository => { 
            return { name: repos.name, description: repos.description, link: repos.html_url }
          }));
        }} 
      />
      <RepositoryList 
        type={type} 
        search={search} 
        hasNext={hasNext} 
        hasValue={hasValue} 
        loading={loading} 
        repositories={repositories} 
      />
    </>
  );
}