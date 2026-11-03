import { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

interface Book {
  id: number;
  title: string;
  author: string;
  totalPages: number;
  coverImageUrl?: string;
}

export default function Catalog() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [status, setStatus] = useState<number>(0);
  const [actionError, setActionError] = useState('');
  
  // New Book Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newPages, setNewPages] = useState<number | ''>('');
  const [newCover, setNewCover] = useState('');
  const [createError, setCreateError] = useState('');

  const navigate = useNavigate();

  const fetchBooks = async (searchTerm = '') => {
    setLoading(true);
    try {
      const endpoint = searchTerm 
        ? `/api/Books?search=${encodeURIComponent(searchTerm)}` 
        : '/api/Books';
      const response = await api.get<Book[]>(endpoint);
      setBooks(response.data);
      setError('');
    } catch (err) {
      setError('Could not load the catalog. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBooks(search);
  };

  const handleAddLog = async (bookId: number) => {
    setActionError('');
    try {
      await api.post('/api/ReadingLogs', {
        bookId,
        status,
        currentPage: 0,
        startDate: status === 1 ? new Date().toISOString() : null
      });
      navigate('/');
    } catch (err: any) {
      setActionError(err.response?.data || 'Failed to add book to your tracker.');
    }
  };

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    try {
      await api.post('/api/Books', {
        title: newTitle,
        author: newAuthor,
        totalPages: Number(newPages),
        coverImageUrl: newCover || null
      });
      
      // Reset form and refresh catalog
      setShowAddForm(false);
      setNewTitle('');
      setNewAuthor('');
      setNewPages('');
      setNewCover('');
      fetchBooks(search);
    } catch (err: any) {
      setCreateError(err.response?.data || 'Failed to create the book.');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'sans-serif', color: '#e0e0e0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0 }}>Book Catalog</h1>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ padding: '0.75rem 1.5rem', backgroundColor: showAddForm ? '#6c757d' : '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {showAddForm ? 'Cancel' : '+ Add New Book'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreateBook} style={{ backgroundColor: '#2d2d2d', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #404040' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>Add a Book to the Database</h3>
          {createError && <div style={{ color: '#ff6b6b', marginBottom: '1rem' }}>{createError}</div>}
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <input type="text" placeholder="Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required style={{ padding: '0.75rem', borderRadius: '4px', border: 'none', backgroundColor: '#404040', color: 'white' }} />
            <input type="text" placeholder="Author" value={newAuthor} onChange={(e) => setNewAuthor(e.target.value)} required style={{ padding: '0.75rem', borderRadius: '4px', border: 'none', backgroundColor: '#404040', color: 'white' }} />
            <input type="number" placeholder="Total Pages" value={newPages} onChange={(e) => setNewPages(e.target.value ? Number(e.target.value) : '')} required min="1" style={{ padding: '0.75rem', borderRadius: '4px', border: 'none', backgroundColor: '#404040', color: 'white' }} />
            <input type="url" placeholder="Cover Image URL (Optional)" value={newCover} onChange={(e) => setNewCover(e.target.value)} style={{ padding: '0.75rem', borderRadius: '4px', border: 'none', backgroundColor: '#404040', color: 'white' }} />
          </div>
          <button type="submit" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>Submit Book</button>
        </form>
      )}

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        <input 
          type="text" 
          placeholder="Search by title or author..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flexGrow: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid #404040', backgroundColor: '#2d2d2d', color: 'white' }}
        />
        <button type="submit" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Search</button>
      </form>

      {loading && <p>Loading books...</p>}
      {error && <div style={{ padding: '1rem', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px' }}>{error}</div>}
      {actionError && <div style={{ padding: '1rem', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '1rem' }}>{actionError}</div>}

      {!loading && books.length === 0 && <p>No books found. Try a different search term or add one above!</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {books.map((book) => (
          <div key={book.id} style={{ backgroundColor: '#2d2d2d', border: '1px solid #404040', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#ffffff' }}>{book.title}</h3>
            <p style={{ margin: '0 0 1rem 0', color: '#b0b0b0' }}>By {book.author}</p>
            <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem', color: '#888' }}>{book.totalPages} Pages</p>
            
            {selectedBookId === book.id ? (
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <select value={status} onChange={(e) => setStatus(Number(e.target.value))} style={{ padding: '0.5rem', borderRadius: '4px', backgroundColor: '#404040', color: 'white', border: 'none' }}>
                  <option value={0}>Want to Read</option>
                  <option value={1}>Currently Reading</option>
                  <option value={2}>Finished</option>
                </select>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleAddLog(book.id)} style={{ flex: 1, padding: '0.5rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                  <button onClick={() => setSelectedBookId(null)} style={{ flex: 1, padding: '0.5rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setSelectedBookId(book.id)} style={{ marginTop: 'auto', padding: '0.5rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add to Tracker</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}