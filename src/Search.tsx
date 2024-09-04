import { useState } from 'react'
interface SearchResult {
  filename: string;
  similarity: number;
  snippets: string[];
}
const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://gojoe.dev:7878/search?query=${searchQuery}`);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      console.log(json);
      setSearchResults([]);
      setSearchResults(json);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <form method='GET' onSubmit={handleSubmit}>
        <label htmlFor='searchQueryInput'>Enter search query</label>
        <input id='searchQueryInput' name='searchQueryInput' type='text' value={searchQuery} onChange={e => setSearchQuery(e.target.value)}></input>
        <button type='submit' >Submit</button>
      </form>
      <ul>{searchResults.map((result, idx) => (
        <li key={idx}>
          <h3>{result.filename}</h3>
          <p>Similarity: {result.similarity.toFixed(4)} </p>
          <ul>
            {result.snippets.map((snippet, snippetIdx) => (
              <li key={snippetIdx}>{snippet}
              </li>
            ))}
          </ul>
        </li>
      ))}
      </ul>
    </>
  );
};
export default Search;
