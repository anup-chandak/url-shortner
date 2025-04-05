import React, { useState } from 'react';
import './App.css';

function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShortenedUrl('');

    try {
      const res = await fetch('http://localhost:3000/api/url/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ longUrl : originalUrl }),
      });

      const data = await res.json();
      console.log(data);
      if (res.ok) {
        setShortenedUrl(data.shortUrl); // expects API to return { shortUrl: "..." }
      } else {
        setError(data.message || 'Failed to shorten URL');
      }
    } catch (err) {
      setError('Server error');
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1>URL Shortener</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="Enter a URL"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Shortening...' : 'Shorten'}
        </button>
      </form>

      {shortenedUrl && (
        <div className="result">
          Shortened URL: <a href={`http://localhost:3000/${shortenedUrl}`} target="_blank" rel="noopener noreferrer">{`Fieldgenie/${shortenedUrl}`}</a>
        </div>
      )}

      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default App;

