import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

interface ReadingLog {
  id: number;
  bookId: number;
  bookTitle: string;
  status: number; 
  currentPage: number;
  rating?: number;
  keyTakeaways?: string;
  personalNotes?: string;
  startDate?: string;
  finishDate?: string;
  lastUpdated: string;
}

export default function Dashboard() {
  const { logout } = useAuth();
  const [logs, setLogs] = useState<ReadingLog[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Edit State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState(0);
  const [editPage, setEditPage] = useState(0);
  const [editRating, setEditRating] = useState(0);
  const [editNotes, setEditNotes] = useState('');

  const fetchLogs = async () => {
    try {
      const response = await api.get<ReadingLog[]>('/api/ReadingLogs'); 
      setLogs(response.data);
    } catch (err) {
      setError('Failed to load your reading logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const startEdit = (log: ReadingLog) => {
    setEditingId(log.id);
    setEditStatus(log.status);
    setEditPage(log.currentPage);
    setEditRating(log.rating || 0);
    setEditNotes(log.personalNotes || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdate = async (id: number) => {
    try {
      const isFinished = editStatus === 2;
      await api.put(`/api/ReadingLogs/${id}`, {
        status: editStatus,
        currentPage: editPage,
        rating: editRating,
        personalNotes: editNotes,
        // Optional: you can pull existing dates from the log if needed, 
        // but passing null or a new date works based on your backend
        finishDate: isFinished ? new Date().toISOString() : null
      });
      setEditingId(null);
      fetchLogs(); // Refresh the data
    } catch (err) {
      alert('Failed to update the reading log.');
    }
  };

  const getStatusText = (status: number) => {
    switch(status) {
      case 0: return 'Want to Read';
      case 1: return 'Currently Reading';
      case 2: return 'Finished';
      default: return 'Unknown';
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'sans-serif', color: '#e0e0e0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>My Dashboard</h1>
        <button 
          onClick={logout}
          style={{ padding: '0.5rem 1rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Sign Out
        </button>
      </div>
      
      {loading && <p>Loading your reading logs...</p>}
      {error && <div style={{ padding: '1rem', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px' }}>{error}</div>}

      {!loading && logs.length === 0 && (
        <p>You don't have any reading logs yet. Head to the catalog to add a book!</p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {logs.map((log) => (
          <div key={log.id} style={{ backgroundColor: '#2d2d2d', border: '1px solid #404040', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#ffffff' }}>{log.bookTitle}</h3>
            
            {editingId === log.id ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.2rem' }}>Status</label>
                  <select value={editStatus} onChange={e => setEditStatus(Number(e.target.value))} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', backgroundColor: '#404040', color: 'white', border: 'none' }}>
                    <option value={0}>Want to Read</option>
                    <option value={1}>Currently Reading</option>
                    <option value={2}>Finished</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.2rem' }}>Current Page</label>
                  <input type="number" value={editPage} onChange={e => setEditPage(Number(e.target.value))} min="0" style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box', borderRadius: '4px', backgroundColor: '#404040', color: 'white', border: 'none' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.2rem' }}>Rating (1-5)</label>
                  <input type="number" value={editRating} onChange={e => setEditRating(Number(e.target.value))} min="0" max="5" style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box', borderRadius: '4px', backgroundColor: '#404040', color: 'white', border: 'none' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.2rem' }}>Notes</label>
                  <textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} rows={3} style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box', borderRadius: '4px', backgroundColor: '#404040', color: 'white', border: 'none' }} />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button onClick={() => handleUpdate(log.id)} style={{ flex: 1, padding: '0.5rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                  <button onClick={cancelEdit} style={{ flex: 1, padding: '0.5rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span style={{ backgroundColor: '#007bff', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '12px', fontSize: '0.8rem' }}>
                    {getStatusText(log.status)}
                  </span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: '#b0b0b0', flexGrow: 1 }}>
                  <p style={{ margin: 0 }}><strong>Current Page:</strong> {log.currentPage}</p>
                  {log.rating !== undefined && log.rating > 0 && (
                    <p style={{ margin: 0 }}><strong>Rating:</strong> {log.rating} / 5</p>
                  )}
                  {log.personalNotes && (
                    <p style={{ margin: 0, fontStyle: 'italic' }}>"{log.personalNotes}"</p>
                  )}
                </div>

                <button 
                  onClick={() => startEdit(log)}
                  style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Update Progress
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}