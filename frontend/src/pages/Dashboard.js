// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const fetchNotes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notes', {
        headers: { Authorization: token },
      });
      setNotes(res.data);
    } catch (err) {
      alert('Unauthorized. Please login again.');
      navigate('/');
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/notes/${editId}`, { title, description: desc }, {
          headers: { Authorization: token },
        });
        setEditId(null);
      } else {
        await axios.post('http://localhost:5000/api/notes', { title, description: desc }, {
          headers: { Authorization: token },
        });
      }
      setTitle('');
      setDesc('');
      fetchNotes();
    } catch (err) {
      alert('Error saving note');
    }
  };

  const handleEdit = (note) => {
    setEditId(note._id);
    setTitle(note.title);
    setDesc(note.description);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: { Authorization: token },
      });
      fetchNotes();
    } catch (err) {
      alert('Error deleting note');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

 return (
  <div className="container">
    <h2>Notes Dashboard</h2>
    <button className="logout-btn" onClick={handleLogout}>Logout</button>

    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        required
      />
      <button type="submit">{editId ? 'Update Note' : 'Add Note'}</button>
    </form>

    <div>
      {notes.map((note) => (
        <div className="note" key={note._id}>
          <h3>{note.title}</h3>
          <p>{note.description}</p>
          <button onClick={() => handleEdit(note)}>Edit</button>
          <button className="delete-btn" onClick={() => handleDelete(note._id)}>Delete</button>
        </div>
      ))}
    </div>
  </div>
);
};

export default Dashboard;
