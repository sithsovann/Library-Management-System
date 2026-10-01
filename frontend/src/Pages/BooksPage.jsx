import { useEffect, useState } from 'react';
import { apiFetch } from '../api';

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '', author: '', category_id: '', isbn: '', total_copies: ''
  });
  const [editingId, setEditingId] = useState(null);

  const fetchBooks = () => {
    apiFetch('/books').then(setBooks).catch(console.error);
  };

  const fetchCategories = () => {
    apiFetch('/categories').then(setCategories).catch(console.error);
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ title: '', author: '', category_id: '', isbn: '', total_copies: '' });
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const request = editingId
      ? apiFetch(`/books/${editingId}`, { method: 'PUT', body: JSON.stringify(form) })
      : apiFetch('/books', { method: 'POST', body: JSON.stringify(form) });

    request
      .then(() => {
        resetForm();
        fetchBooks();
      })
      .catch((err) => alert(err.message || 'Failed to save book.'));
  };

  const handleEdit = (book) => {
    setEditingId(book.id);
    setForm({
      title: book.title,
      author: book.author,
      category_id: book.category_id,
      isbn: book.isbn,
      total_copies: book.total_copies,
    });
  };

  const handleDelete = (id) => {
    if (!confirm('Delete this book?')) return;
    apiFetch(`/books/${id}`, { method: 'DELETE' })
      .then(() => fetchBooks())
      .catch((err) => alert(err.message || 'Failed to delete book.'));
  };

  // Real stats, computed from actual fetched data — no fake numbers
  const totalTitles = books.length;
  const totalAvailable = books.reduce((sum, b) => sum + b.available_copies, 0);
  const totalCopies = books.reduce((sum, b) => sum + b.total_copies, 0);
  const outOfStock = books.filter(b => b.available_copies === 0).length;

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Operations / Catalog</div>
          <h1>Books &amp; Catalog</h1>
          <p className="page-subtitle">Manage your book inventory and category assignments.</p>
        </div>
      </div>

      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-label">Total Titles</div>
          <div className="stat-value">{totalTitles}</div>
          <div className="stat-sub">Across {categories.length} categories</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Copies</div>
          <div className="stat-value">{totalCopies}</div>
          <div className="stat-sub">Combined across all titles</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Available Now</div>
          <div className="stat-value">{totalAvailable}</div>
          <div className="stat-sub">Ready to be checked out</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Out of Stock</div>
          <div className="stat-value stat-value-warn">{outOfStock}</div>
          <div className="stat-sub">Titles with 0 available</div>
        </div>
      </div>

      <div className="card">
        <h2>{editingId ? 'Edit Book' : 'Add a Book'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Title</label>
              <input name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Author</label>
              <input name="author" value={form.author} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select name="category_id" value={form.category_id} onChange={handleChange} required>
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>ISBN</label>
              <input name="isbn" value={form.isbn} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Total Copies</label>
              <input type="number" min="1" name="total_copies" value={form.total_copies} onChange={handleChange} required />
            </div>
          </div>
          <button type="submit" className="btn-primary">
            {editingId ? 'Save Changes' : 'Add Book'}
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
          <h2>All Titles</h2>
        </div>
        <table>
          <thead>
            <tr>
              <th>Title &amp; Author</th>
              <th>Category</th>
              <th>ISBN</th>
              <th>Available</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 ? (
              <tr><td colSpan="5">No books yet.</td></tr>
            ) : (
              books.map(book => (
                <tr key={book.id}>
                  <td>
                    <div className="cell-title">{book.title}</div>
                    <div className="cell-subtitle">{book.author}</div>
                  </td>
                  <td><span className="badge badge-neutral">{book.category?.name}</span></td>
                  <td className="cell-mono">{book.isbn}</td>
                  <td>
                    <span className={book.available_copies === 0 ? 'badge badge-danger' : 'badge badge-success'}>
                      {book.available_copies} / {book.total_copies}
                    </span>
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(book)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(book.id)}>Delete</button>
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

export default BooksPage;