import { useState, useEffect } from "react";
import "./styles.css";

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask(newTask) {
    if(newTask.text.trim() === "") return;
    setTasks((prevTasks) => [...prevTasks, newTask]);
  }

  function deleteTask(deletedTask) {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== deletedTask.id)
    );
  }

  function toggleTask(task) {
    setTasks((prevTasks) =>
      prevTasks.map((t) => {
        if (t.id !== task.id) return t;
        return { ...t, isCompleted: !t.isCompleted };
      })
    );
  }

  function editTask(taskId, newText) {
    if(newText.trim() === "") return;
    setTasks((prevTasks) =>
      prevTasks.map((t) => {
        if (t.id !== taskId) return t;
        return { ...t, text: newText };
      })
    );
  }

  function clearCompleted() {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.isCompleted));
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.isCompleted;
    if (filter === "completed") return task.isCompleted;
    return true;
  });

  return (
    <div className="todo-app">
      <Header />
      <div className="container">
        <ToDoForm onAddTask={addTask} />
        <FilterButtons filter={filter} onFilterChange={setFilter} />
        <ToDoList
          tasks={filteredTasks}
          onDeleteTask={deleteTask}
          onToggleTask={toggleTask}
          onEditTask={editTask}
        />
        {tasks.length > 0 && (
          <div className="clear-completed">
            <button onClick={clearCompleted} className="btn-clear">
              Clear completed
            </button>
          </div>
        )}
        <Footer tasks={tasks} />
      </div>
    </div>
  );
}

function ToDoForm({ onAddTask }) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onAddTask({ id: Date.now(), text: inputValue, isCompleted: false });
    setInputValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="What needs to be done?"
        className="todo-input"
      />
      <button type="submit" className="btn-add">Add</button>
    </form>
  );
}

function FilterButtons({ filter, onFilterChange }) {
  return (
    <div className="filter-buttons">
      <button
        className={filter === "all" ? "active" : ""}
        onClick={() => onFilterChange("all")}
      >
        All
      </button>
      <button
        className={filter === "active" ? "active" : ""}
        onClick={() => onFilterChange("active")}
      >
        Active
      </button>
      <button
        className={filter === "completed" ? "active" : ""}
        onClick={() => onFilterChange("completed")}
      >
        Completed
      </button>
    </div>
  );
}

function ToDoList({ tasks, onDeleteTask, onToggleTask, onEditTask }) {
  return (
    <ul className="todo-list">
      {tasks.length === 0 ? (
        <p className="empty-message">No tasks to display</p>
      ) : (
        tasks.map((task) => (
          <ToDoItem
            key={task.id}
            task={task}
            onDeleteTask={onDeleteTask}
            onToggleTask={onToggleTask}
            onEditTask={onEditTask}
          />
        ))
      )}
    </ul>
  );
}

function ToDoItem({ task, onDeleteTask, onToggleTask, onEditTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleEdit = () => {
    onEditTask(task.id, editText);
    setIsEditing(false);
  };

  return (
    <li className={`todo-item ${task.isCompleted ? "completed" : ""}`}>
      <div className="todo-item-content">
        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={() => onToggleTask(task)}
          className="todo-checkbox"
        />
        
        {isEditing ? (
          <div className="edit-form">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="edit-input"
              autoFocus
            />
            <button onClick={handleEdit} className="btn-save">
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="btn-cancel">
              Cancel
            </button>
          </div>
        ) : (
          <span 
            className="todo-text" 
            onDoubleClick={() => setIsEditing(true)}
          >
            {task.text}
          </span>
        )}
      </div>
      
      <div className="todo-item-actions">
        {!isEditing && (
          <>
            <button onClick={() => setIsEditing(true)} className="btn-edit">
              Edit
            </button>
            <button onClick={() => onDeleteTask(task)} className="btn-delete">
              Delete
            </button>
          </>
        )}
      </div>
    </li>
  );
}

function Header() {
  return (
    <header className="header">
      <h1>Todo App</h1>
    </header>
  );
}

function Footer({ tasks }) {
  const completedTasks = tasks.filter((task) => task.isCompleted).length;
  const totalTasks = tasks.length;
  
  return (
    <footer className="footer">
      <p>
        {completedTasks} of {totalTasks} tasks completed
      </p>
      {totalTasks > 0 && (
        <p className="progress">
          <span 
            className="progress-bar" 
            style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
          ></span>
        </p>
      )}
    </footer>
  );
}
