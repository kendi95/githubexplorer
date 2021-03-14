import { FC, FormEvent, useEffect, useState } from "react";
import { FiSearch, FiX } from 'react-icons/fi';
import api from "../../services/api";

import './styles.scss';

interface RepositorySearchProps {
  onChange: (repositories: IRepositoryFetch[]) => void;
  onLoading: (loading: boolean) => void;
  onValueSearch: (hasValue: boolean) => void;
  onNextLoadingdata: (hasNext: boolean) => void;
  onType: (type: string) => void;
  onSearch: (type: string) => void;
}

interface Owner {
  avatar_url: string;
  login: string;
}

export interface IRepositoryFetch {
  name: string;
  description: string;
  html_url: string;
  owner: Owner;
}

const RepositorySearch: FC<RepositorySearchProps> = ({ 
  onChange, 
  onLoading, 
  onValueSearch, 
  onNextLoadingdata,
  onType,
  onSearch
}) => {
  const [radio, setRadio] = useState('users');
  const [value, setValue] = useState('');
  const [owner, setOwner] = useState<Owner>({ avatar_url: '', login: '' } as Owner);

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    if (event.currentTarget.value === 'users' || event.currentTarget.value === 'orgs') {
      setRadio(event.currentTarget.value);
      return;
    }
    setValue(event.currentTarget.value);
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      if (value === '') {
        return;
      }
      onChange([]);
      onLoading(true);
      const response = await api.get<IRepositoryFetch[]>(`/${radio}/${value}/repos`, {
        params: { page: 1, per_page: 10 }
      });
      setOwner(response.data[0].owner);
      onChange(response.data);
      onLoading(false);
      onValueSearch(false);

      const next = response.headers.link.search('next');
      const findedNext = response.headers.link.substring(next, next +'next'.length);
      if (findedNext === 'next') {
        onNextLoadingdata(true);
      }
    } catch (error) {
      onValueSearch(true);
      onChange([]);
      onLoading(false);
    }
  }

  useEffect(() => {
    onType(radio);
    onSearch(value);
  }, [onType, radio, value])

  return (
    <section className="repository-search">
      <div className="repository-radio">
        <h3>Tipo de repositório:</h3>
        <div className="input-radio">
          <input 
            type="radio" 
            onChange={handleChange} 
            value="users" 
            checked={radio === 'users'} 
          />
          <span>Usuários</span>
        </div>
        <div className="input-radio">
          <input 
            type="radio" 
            onChange={handleChange} 
            value="orgs" 
            checked={radio === 'orgs'} 
          />
          <span>Organizações</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="repository-input-container">
          <input
            value={value}
            type="text" 
            placeholder="Pesquisar usuários / organizações..." 
            onChange={handleChange} 
          />
          {value !== '' && <FiX onClick={() => setValue('')} />}
        </div>
        <button type="submit">
          <FiSearch />
        </button>
      </form>

      <div className="repository-owner">
        {owner.avatar_url !== '' && (
          <>
            <img src={owner.avatar_url} alt={owner.login} />
            <strong>{owner.login}</strong>
          </>
        )}
      </div>
    </section>
  );
}

export default RepositorySearch;