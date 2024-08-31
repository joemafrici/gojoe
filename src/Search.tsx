import { useState } from 'react'
const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://localhost:7878/search?query=${searchQuery}`);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      console.log(json);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <form method='POST' onSubmit={handleSubmit}>
        <label htmlFor='searchQueryInput'>Enter search query</label>
        <input id='searchQueryInput' name='searchQueryInput' type='text' value={searchQuery} onChange={e => setSearchQuery(e.target.value)}></input>
        <button type='submit' >Submit</button>
      </form>
    </>
  );
};
export default Search;
