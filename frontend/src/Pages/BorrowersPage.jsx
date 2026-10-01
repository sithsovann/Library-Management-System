import { useEffect, useState } from 'react';
import { apiFetch } from '../api';

const AVATAR_COLORS = ['#DBEAFE', '#DCFCE7', '#FEF3C7', '#FCE7F3', '#EDE9FE', '#FFE4E6'];

function colorFor(id) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

function initials(name) {
  return name
    ? name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join('')
    : '?';
}

function BorrowersPage() {
  const [borrowers, setBorrowers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchBorrowers = () => {
    apiFetch('/borrowers').then(setBorrowers).catch(console.error);
  };

  useEffect(() => {
    fetchBorrowers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ name: '', email: '', phone: '' });
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const request = editingId
      ? apiFetch(`/borrowers/${editingId}`, { method: 'PUT', body: JSON.stringify(form) })
      : apiFetch('/borrowers', { method: 'POST', body: JSON.stringify(form) });

    request
      .then(() => {
        resetForm();
        fetchBorrowers();
      })
      .catch((err) => alert(err.message || 'Failed to save borrower.'));
  };

  const handleEdit = (borrower) => {
    setEditingId(borrower.id);
    setForm({
      name: borrower.name,
      email: borrower.email,
      phone: borrower.phone || '',
    });
  };

  const handleDelete = (id) => {
    if (!confirm('Delete this borrower?')) return;
    apiFetch(`/borrowers/${id}`, { method: 'DELETE' })
      .then(() => fetchBorrowers())
      .catch((err) => alert(err.message || 'Failed to delete borrower.'));
  };

  const totalBorrowers = borrowers.length;
  const withPhone = borrowers.filter(b => b.phone).length;

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Operations / Directory</div>
          <h1>Borrowers</h1>
          <p className="page-subtitle">Manage registered library members.</p>
        </div>
      </div>

      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-label">Registered Borrowers</div>
          <div className="stat-value">{totalBorrowers}</div>
          <div className="stat-sub">Total in directory</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">With Phone Number</div>
          <div className="stat-value">{withPhone}</div>
          <div className="stat-sub">Reachable by phone</div>
        </div>
      </div>

      <div className="card">
        <h2>{editingId ? 'Edit Borrower' : 'Add a Borrower'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} />
            </div>
          </div>
          <button type="submit" className="btn-primary">
            {editingId ? 'Save Changes' : 'Add Borrower'}
          </button>
          {editingId && (
            <button type="button" className="btn-secondary" onClick={resetForm} style={{ marginLeft: '0.5rem' }}>
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="card">
        <div className="section-header">
          <h2>All Borrowers</h2>
        </div>
        <table>
          <thead>
            <tr>
              <th>Member</th>
              <th>Email</th>
              <th>Phone</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {borrowers.length === 0 ? (
              <tr><td colSpan="4">No borrowers yet.</td></tr>
            ) : (
              borrowers.map(b => (
                <tr key={b.id}>
                  <td>
                    <div className="cell-with-avatar">
                      <div className="avatar-chip" style={{ background: colorFor(b.id) }}>
                        {initials(b.name)}
                      </div>
                      <span className="cell-title">{b.name}</span>
                    </div>
                  </td>
                  <td>{b.email}</td>
                  <td>{b.phone || '—'}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(b)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(b.id)}>Delete</button>
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

export default BorrowersPage;