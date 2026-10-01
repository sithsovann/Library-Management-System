import { useEffect, useState } from 'react';
import { apiFetch } from '../api';

function LoansPage() {
  const [loans, setLoans] = useState([]);
  const [overdue, setOverdue] = useState([]);
  const [showOverdue, setShowOverdue] = useState(false);
  const [books, setBooks] = useState([]);
  const [borrowers, setBorrowers] = useState([]);
  const [form, setForm] = useState({ book_id: '', borrower_id: '', due_at: '' });

  const fetchLoans = () => {
    apiFetch('/loans').then(setLoans).catch(console.error);
  };
  const fetchOverdue = () => {
    apiFetch('/loans/overdue').then(setOverdue).catch(console.error);
  };
  const fetchBooks = () => {
    apiFetch('/books').then(setBooks).catch(console.error);
  };
  const fetchBorrowers = () => {
    apiFetch('/borrowers').then(setBorrowers).catch(console.error);
  };

  useEffect(() => {
    fetchLoans();
    fetchOverdue();
    fetchBooks();
    fetchBorrowers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    apiFetch('/loans', { method: 'POST', body: JSON.stringify(form) })
      .then(() => {
        setForm({ book_id: '', borrower_id: '', due_at: '' });
        fetchLoans();
        fetchOverdue();
        fetchBooks();
      })
      .catch((err) => alert(err.message || JSON.stringify(err.errors) || 'Checkout failed.'));
  };

  const handleReturn = (id) => {
    apiFetch(`/loans/${id}/return`, { method: 'PUT' })
      .then(() => {
        fetchLoans();
        fetchOverdue();
        fetchBooks();
      })
      .catch((err) => alert(err.message || 'Return failed.'));
  };

  const activeCount = loans.filter(l => l.status === 'borrowed').length;
  const returnedCount = loans.filter(l => l.status === 'returned').length;

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Operations / Circulation</div>
          <h1>Loans &amp; Checkouts</h1>
          <p className="page-subtitle">Track active borrowings and process returns.</p>
        </div>
      </div>

      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-label">Total Loans</div>
          <div className="stat-value">{loans.length}</div>
          <div className="stat-sub">All-time records</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Loans</div>
          <div className="stat-value">{activeCount}</div>
          <div className="stat-sub">Currently checked out</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Returned</div>
          <div className="stat-value">{returnedCount}</div>
          <div className="stat-sub">Completed loans</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Overdue</div>
          <div className="stat-value stat-value-warn">{overdue.length}</div>
          <div className="stat-sub">Past due date</div>
        </div>
      </div>

      <div className="card">
        <h2>Checkout a Book</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Book</label>
              <select name="book_id" value={form.book_id} onChange={handleChange} required>
                <option value="">Select a book</option>
                {books.map(book => (
                  <option key={book.id} value={book.id} disabled={book.available_copies === 0}>
                    {book.title} ({book.available_copies} available)
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Borrower</label>
              <select name="borrower_id" value={form.borrower_id} onChange={handleChange} required>
                <option value="">Select a borrower</option>
                {borrowers.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Due Date</label>
              <input type="date" name="due_at" value={form.due_at} onChange={handleChange} required />
            </div>
          </div>
          <button type="submit" className="btn-primary">Checkout</button>
        </form>
      </div>

      <div className="card">
        <div className="section-header">
          <h2>{showOverdue ? 'Overdue Loans' : 'All Loans'}</h2>
          <button className="btn-secondary" onClick={() => setShowOverdue(!showOverdue)}>
            {showOverdue ? 'Show All Loans' : `Show Overdue (${overdue.length})`}
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Book</th>
              <th>Borrower</th>
              <th>Checked Out</th>
              <th>Due</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(showOverdue ? overdue : loans).length === 0 ? (
              <tr><td colSpan="6">No {showOverdue ? 'overdue' : ''} loans.</td></tr>
            ) : (
              (showOverdue ? overdue : loans).map(loan => (
                <tr key={loan.id}>
                  <td className="cell-title">{loan.book?.title}</td>
                  <td>{loan.borrower?.name}</td>
                  <td className="cell-mono">{loan.borrowed_at?.slice(0, 10)}</td>
                  <td className="cell-mono">{loan.due_at?.slice(0, 10)}</td>
                  <td>
                    <span className={
                      loan.status === 'returned' ? 'badge badge-success' :
                      overdue.some(o => o.id === loan.id) ? 'badge badge-danger' :
                      'badge badge-neutral'
                    }>
                      {loan.status}
                    </span>
                  </td>
                  <td>
                    {loan.status === 'borrowed' && (
                      <button className="btn-secondary" onClick={() => handleReturn(loan.id)}>Return</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LoansPage;