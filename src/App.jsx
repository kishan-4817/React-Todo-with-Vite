import { useState } from 'react';
import './styles.css';

export default function App() {
  const [newItem, setNewItem] = useState('');
  const [todos, setTodos] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!newItem.trim()) return; // Prevent empty todos

    setTodos((currentTodos) => {
      return [...currentTodos, { id: crypto.randomUUID(), title: newItem, completed: false }];
    });

    setNewItem('');
  }

  function ToggleTodo(id, completed) {
    setTodos((currentTodos) => {
      return currentTodos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed };
        }
        return todo;
      });
    });
  }

  function DeleteAll() {
    setTodos([]);
  }

  function DeleteTodo(id) {
    setTodos((currentTodos) => {
      return currentTodos.filter((todo) => todo.id !== id);
    });
  }

  return (
    <>
      <form className="new-item-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="item">Item</label>
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            id="item"
            placeholder="Add a new task"
          />
        </div>
        <button className="btn">Add</button>
      </form>

      <h1 className="header">Todo List</h1>

      <ul>
        {todos.length === 0 && <p className="empty-list">Your list is empty</p>}
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <label>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={(e) => ToggleTodo(todo.id, e.target.checked)}
              />
              {todo.title}
            </label>
            <button className="btn btn-danger" onClick={() => DeleteTodo(todo.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      {todos.length > 0 && (
        <button className="btn btn-danger" onClick={DeleteAll}>
          Delete All
        </button>
      )}
    </>
  );
}
