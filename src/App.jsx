import { useState, useEffect } from 'react';
import './styles.css';

export default function App() {
  const [newItem, setNewItem] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  useEffect(() => { localStorage.setItem('todos', JSON.stringify(todos)); }, [todos]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!newItem.trim()) return;

    setTodos((currentTodos) => {
      return [...currentTodos, { 
        id: crypto.randomUUID(), 
        title: newItem, 
        completed: false,
        dueDate: newDueDate || null
      }];
    });

    setNewItem('');
    setNewDueDate('');
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

  function EditTodo(id) {
    const todoToEdit = todos.find((todo) => todo.id === id);
    if (todoToEdit) {
      const newTitle = prompt('Edit Todo', todoToEdit.title);
      console.log(newTitle);
      if (newTitle !== null && newTitle.trim() !== '') {
        setTodos((currentTodos) => {
          return currentTodos.map((todo) => {
            if (todo.id === id) {
              return { ...todo, title: newTitle };
            }
            return todo;
          });
        });
      }
    }
  }

  function getDueDateStatus(dueDate, completed) {
    if (!dueDate || completed) return '';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    
    const timeDiff = due - today;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) return 'overdue';
    if (daysDiff === 0) return 'due-today';
    if (daysDiff <= 3) return 'due-soon';
    return '';
  }

  function formatDueDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const due = new Date(date);
    due.setHours(0, 0, 0, 0);
    
    const timeDiff = due - today;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) return `Overdue by ${Math.abs(daysDiff)} day${Math.abs(daysDiff) > 1 ? 's' : ''}`;
    if (daysDiff === 0) return 'Due Today';
    if (daysDiff === 1) return 'Due Tomorrow';
    if (daysDiff <= 7) return `Due in ${daysDiff} days`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  return (
    <>
    <h1 className="header">Todo List</h1>
    <div className="todo-wrapper">
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
        <div className="form-row">
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            id="dueDate"
          />
        </div>
        <button className="btn">Add</button>
      </form>
      <ul>
        {todos.length === 0 && <p className="empty-list">Your list is empty</p>}
        {todos.map((todo) => (
          <li key={todo.id} className={`${todo.completed ? 'completed' : ''} ${getDueDateStatus(todo.dueDate, todo.completed)}`}>
            <div className="todo-content">
              <label>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={(e) => ToggleTodo(todo.id, e.target.checked)}
                />
                {todo.title}
              </label>
              {todo.dueDate && (
                <div className="due-date">
                  📅 {formatDueDate(todo.dueDate)}
                </div>
              )}
            </div>
            <div className="todo-actions">
              <button className="btn btn-edit" onClick={() => EditTodo(todo.id)}>
                Edit
              </button>
              <button className="btn btn-danger" onClick={() => DeleteTodo(todo.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {todos.length > 0 && (
        <button className="btn btn-danger" onClick={DeleteAll}>
          Delete All
        </button>
      )}
    </div>  
    </>
  );
}
