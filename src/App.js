import React, { useEffect, useState } from "react";
import { getNotes, createNote, updateNote, deleteNote, checkAuth, logout } from "./api";
import "./App.css";
import Login from "./Login";
import Register from "./Register";

const NOTE_COLORS = [
  { name: "yellow", class: "note-yellow" },
  { name: "red", class: "note-red" },
  { name: "pink", class: "note-pink" },
  { name: "purple", class: "note-purple" },
  { name: "blue", class: "note-blue" },
  { name: "cyan", class: "note-cyan" },
  { name: "green", class: "note-green" },
  { name: "orange", class: "note-orange" },
  { name: "grey", class: "note-grey" },
];

function NoteCard({ note, onEdit, onDelete }) {
  return (
    <div className={`note-card ${NOTE_COLORS.find(c => c.name === note.color)?.class || "note-yellow"} p-4 rounded-lg shadow-md mb-4`}> 
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{note.title}</h3>
        <button className="text-red-500" onClick={() => onDelete(note.id)}>🗑️</button>
      </div>
      <div className="mt-2 text-sm">{note.content}</div>
      {note.items && note.items.length > 0 && (
        <ul className="mt-2 pl-4 list-disc text-xs">
          {note.items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      )}
      <div className="flex justify-end mt-2">
        <button className="text-blue-500" onClick={() => onEdit(note)}>✏️ تعديل</button>
      </div>
    </div>
  );
}

function NoteForm({ onSave, onClose, initial }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [content, setContent] = useState(initial?.content || "");
  const [color, setColor] = useState(initial?.color || "yellow");
  const [items, setItems] = useState(initial?.items || []);
  const [newItem, setNewItem] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title,
      content,
      color,
      items,
    });
  };

  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-10">
      <form className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg" onSubmit={handleSubmit}>
        <h2 className="font-bold mb-4">{initial ? "تعديل الملاحظة" : "ملاحظة جديدة"}</h2>
        <input className="w-full mb-2 p-2 rounded border search-input" placeholder="العنوان" value={title} onChange={e => setTitle(e.target.value)} required />
        <textarea className="w-full mb-2 p-2 rounded border search-input" placeholder="المحتوى" value={content} onChange={e => setContent(e.target.value)} />
        <div className="mb-2 flex space-x-2">
          {NOTE_COLORS.map(c => (
            <button
              type="button"
              key={c.name}
              className={`color-picker-button ${color === c.name ? "selected" : ""} w-6 h-6 rounded ${c.class}`}
              onClick={() => setColor(c.name)}
            ></button>
          ))}
        </div>
        <div>
          <label className="font-bold text-sm">عناصر قائمة (اختياري):</label>
          <div className="flex mb-2">
            <input className="flex-1 p-2 border rounded" placeholder="عنصر جديد" value={newItem} onChange={e => setNewItem(e.target.value)} />
            <button type="button" className="ml-2 px-2 py-1 bg-blue-500 text-white rounded" onClick={() => {
              if (newItem.trim()) {
                setItems([...items, newItem]); setNewItem("");
              }
            }}>إضافة</button>
          </div>
          <ul className="list-disc pl-4">
            {items.map((item, idx) => (
              <li key={idx} className="flex justify-between items-center">
                {item}
                <button type="button" className="ml-2 text-red-500" onClick={() => setItems(items.filter((_, i) => i !== idx))}>✖️</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex mt-4 justify-end space-x-2">
          <button type="button" className="px-4 py-2 bg-gray-400 text-white rounded" onClick={onClose}>إلغاء</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded fab-shadow">{initial ? "حفظ" : "إنشاء"}</button>
        </div>
      </form>
    </div>
  );
}

function App() {
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  async function fetchNotes() {
    setLoading(true);
    const res = await getNotes();
    setNotes(res.notes || []);
    setLoading(false);
  }

  useEffect(() => {
    checkAuth().then(isAuth => {
      setLoggedIn(isAuth);
      if (isAuth) fetchNotes();
    });
  }, [loggedIn]);

  const handleSaveNote = async (noteData) => {
    setLoading(true);
    if (editingNote) {
      await updateNote(editingNote.id, noteData);
    } else {
      await createNote(noteData);
    }
    setShowForm(false);
    setEditingNote(null);
    fetchNotes();
  };

  const handleDeleteNote = async (noteId) => {
    setLoading(true);
    await deleteNote(noteId);
    fetchNotes();
  };

  const handleLogout = async () => {
    await logout();
    setLoggedIn(false);
    setNotes([]);
  };

  if (!loggedIn) {
    if (showRegister) {
      return <Register 
        onRegister={() => setShowRegister(false)} 
        onSwitchToLogin={() => setShowRegister(false)} 
      />;
    } else {
      return <Login 
        onLogin={() => setLoggedIn(true)} 
        onSwitchToRegister={() => setShowRegister(true)} 
      />;
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-2 py-4 custom-scrollbar" dir="rtl">
      <div className="max-w-xl mx-auto">
        <header className="flex justify-between items-center mb-3">
          <h1 className="text-2xl font-bold">Sebair Note Pro</h1>
          <div className="flex space-x-2">
            <button className="fab-shadow px-3 py-2 rounded bg-cyan-500 text-white" onClick={() => setShowForm(true)}>➕ ملاحظة جديدة</button>
            <button className="px-3 py-2 rounded bg-red-500 text-white" onClick={handleLogout}>تسجيل الخروج</button>
          </div>
        </header>
        <div className="notes-grid">
          {loading ? <div>جار التحميل...</div> :
            notes.length === 0 ? <div>لا توجد ملاحظات بعد.</div> :
              notes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={n => { setEditingNote(n); setShowForm(true); }}
                  onDelete={handleDeleteNote}
                />
              ))
          }
        </div>
      </div>
      {showForm && (
        <NoteForm
          onSave={handleSaveNote}
          onClose={() => { setShowForm(false); setEditingNote(null); }}
          initial={editingNote}
        />
      )}
    </div>
  );
}

export default App;