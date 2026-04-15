import { useState, useEffect } from 'react';
import './styles.css';

export default function App() {
  const [newItem, setNewItem] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState('');
  const [newPriorityName, setNewPriorityName] = useState('');
  const [newPriorityColor, setNewPriorityColor] = useState('#4a90e2');
  const [showPriorityForm, setShowPriorityForm] = useState(false);
  
  const [priorities, setPriorities] = useState(() => {
    const savedPriorities = localStorage.getItem('priorities');
    return savedPriorities ? JSON.parse(savedPriorities) : [];
  });

  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  useEffect(() => { localStorage.setItem('todos', JSON.stringify(todos)); }, [todos]);

  useEffect(() => { localStorage.setItem('priorities', JSON.stringify(priorities)); }, [priorities]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!newItem.trim()) return;

    setTodos((currentTodos) => {
      return [...currentTodos, { 
        id: crypto.randomUUID(), 
        title: newItem, 
        completed: false,
        dueDate: newDueDate || null,
        priorityId: newPriority || null
      }];
    });

    setNewItem('');
    setNewDueDate('');
    setNewPriority('');
  }

  function addPriority(e) {
    e.preventDefault();
    
    if (!newPriorityName.trim()) return;

    const newPriorityObj = {
      id: crypto.randomUUID(),
      name: newPriorityName,
      color: newPriorityColor
    };

    setPriorities([...priorities, newPriorityObj]);
    setNewPriorityName('');
    setNewPriorityColor('#4a90e2');
    setShowPriorityForm(false);
  }

  function deletePriority(priorityId) {
    setPriorities(priorities.filter(p => p.id !== priorityId));
    // Remove this priority from any tasks
    setTodos(currentTodos =>
      currentTodos.map(todo => 
        todo.priorityId === priorityId ? { ...todo, priorityId: null } : todo
      )
    );
  }

  function getPriorityById(priorityId) {
    return priorities.find(p => p.id === priorityId);
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
        <div className="form-row">
          <label htmlFor="priority">Priority</label>
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
            id="priority"
          >
            <option value="">No Priority</option>
            {priorities.map((priority) => (
              <option key={priority.id} value={priority.id}>
                {priority.name}
              </option>
            ))}
          </select>
        </div>
        <button className="btn">Add</button>
      </form>
      <ul>
        {todos.length === 0 && <p className="empty-list">Your list is empty</p>}
        {todos.map((todo) => {
          const taskPriority = getPriorityById(todo.priorityId);
          return (
          <li key={todo.id} className={`${todo.completed ? 'completed' : ''} ${getDueDateStatus(todo.dueDate, todo.completed)} ${taskPriority ? 'has-priority' : ''}`} style={taskPriority ? { borderTopColor: taskPriority.color } : {}}>
            <div className="todo-content">
              <div className="todo-header">
                <label>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={(e) => ToggleTodo(todo.id, e.target.checked)}
                  />
                  {todo.title}
                </label>
                {taskPriority && (
                  <span className="priority-badge" style={{ backgroundColor: taskPriority.color + '20', color: taskPriority.color, borderColor: taskPriority.color }}>
                    {taskPriority.name}
                  </span>
                )}
              </div>
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
        );
        })}
      </ul>

      {todos.length > 0 && (
        <button className="btn btn-danger" onClick={DeleteAll}>
          Delete All
        </button>
      )}

      <div className="priorities-section">
        <h2 className="section-title">Manage Priorities</h2>
        <button 
          className="btn btn-secondary"
          onClick={() => setShowPriorityForm(!showPriorityForm)}
        >
          {showPriorityForm ? 'Cancel' : '+ Add Priority'}
        </button>

        {showPriorityForm && (
          <form className="priority-form" onSubmit={addPriority}>
            <div className="form-row">
              <label htmlFor="priorityName">Priority Name</label>
              <input
                type="text"
                id="priorityName"
                value={newPriorityName}
                onChange={(e) => setNewPriorityName(e.target.value)}
                placeholder="e.g., Critical, Important, Soon"
              />
            </div>
            <div className="form-row">
              <label htmlFor="priorityColor">Color</label>
              <input
                type="color"
                id="priorityColor"
                value={newPriorityColor}
                onChange={(e) => setNewPriorityColor(e.target.value)}
              />
            </div>
            <button type="submit" className="btn">Create Priority</button>
          </form>
        )}

        {priorities.length > 0 && (
          <div className="priorities-list">
            <h3>Your Priorities:</h3>
            <div className="priority-items">
              {priorities.map((priority) => (
                <div key={priority.id} className="priority-item" style={{ borderLeftColor: priority.color }}>
                  <span className="priority-item-name">{priority.name}</span>
                  <div className="priority-item-color" style={{ backgroundColor: priority.color }}></div>
                  <button 
                    className="btn btn-small btn-danger"
                    onClick={() => deletePriority(priority.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>  
    </>
  );
}
