import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Main = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', due_date: '' });
  const [editingTask, setEditingTask] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [viewingTask, setViewingTask] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const token = localStorage.getItem('access_token');
  // const headers = { Authorization: `Bearer ${token}` };
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, [selectedDate]);

  // const fetchTasks =  async () => {
  //   try {
  //     let url = 'http://127.0.0.1:8000/api/task/';
  //     if (selectedDate) {
  //       url += `?due_date=${selectedDate}`;
  //     }
  //     const res = await axios.get(url, { headers });
  //     console.log('Fetched tasks:', res.data)
  //     setTasks(res.data.results || res.data);
  //   } catch (err) {
  //     console.error('Failed to load tasks', err);
  //   }
  // };
  const headers = useMemo(() => ({
    Authorization: `Bearer ${token}`
  }), [token]);


  const fetchTasks = useCallback(async () => {
    try {
      let url = 'http://127.0.0.1:8000/api/task/';
      if (selectedDate) {
        url += `?due_date=${selectedDate}`;
      }
      const res = await axios.get(url, { headers });
      setTasks(res.data.results || res.data);
    } catch (err) {
      console.error('Failed to load tasks', err);
    }
  }, [headers, selectedDate]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateOrUpdate = async () => {
    if (!newTask.title) return;

    try {
      if (editingTask) {
        await axios.put(`http://127.0.0.1:8000/api/task/${editingTask.id}/`, newTask, { headers });
      } else {
        await axios.post('http://127.0.0.1:8000/api/task/', newTask, { headers });
      }
      setNewTask({ title: '', description: '', due_date: '' });
      setEditingTask(null);
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      console.error('Failed to save task', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/task/${id}/`, { headers });
      fetchTasks();
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };


  const handleView = async (id) => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/task/${id}/`, { headers });
      setViewingTask(res.data);
    } catch (err) {
      console.error('falied to view task', err);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/task/${task.id}/`, { completed: !task.completed }, { headers });
      fetchTasks();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token'); // or any other tokens/user data
    navigate('/register'); // Redirect to register page
  };

  const filteredTasks = tasks
    .filter(task => task.title.toLowerCase().includes(search.toLowerCase()))
    .filter(task => {
      if (filter === 'completed') return task.completed;
      if (filter === 'incomplete') return !task.completed;
      return true;
    });

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">ToDo List</h2>

      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search by title"
          style={{ maxWidth: '300px' }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="date"
          className="form-control me-2"
          placeholder="Search by date"
          style={{ maxWidth: '300px' }}
          value={filter}
          onChange={(e) => setSelectedDate(e.target.value)}

        />
        {selectedDate && (
          <button
            className="btn btn-outline-secondary me-2"
            onClick={() => setSelectedDate('')}
          >
            Clear Date
          </button>
        )}

        <select
          className="form-select"
          style={{ maxWidth: '200px' }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>
        <button className="btn btn-success" onClick={() => {
          setShowForm(true);
          setEditingTask(null);
          setNewTask({ title: '', description: '', due_date: '' });
        }}>+ Add Task</button>
        <button className='btn btn-dark' onClick={handleLogout}>Log out</button>
      </div>

      <div className="row">
        {filteredTasks.length === 0 && <p>No tasks found.</p>}
        {filteredTasks.map(task => (
          <div className="col-md-6 mb-3" key={task.id}>
            <div className={`card ${task.completed ? 'border-success' : 'border-warning'}`}>
              <div className="card-body d-flex flex-row justify-content-between">
                <div className='div1'>
                  <h5 className="card-title">{task.title}</h5>
                  <p className="card-text">{task.description}</p>
                  <p className="card-text"><small className="text-muted">Due: {task.due_date || '—'}</small></p>
                </div>
                <div className="d-flex flex-column justify-content-around">
                  <button className={`btn btn-sm btn-${task.completed ? 'secondary' : 'primary'}`} onClick={() => handleToggleComplete(task)}>
                    {task.completed ? 'Completed' : 'Incomplete'}
                  </button>
                  <button className="btn btn-sm btn-warning" onClick={() => {
                    setEditingTask(task);
                    setNewTask({ title: task.title, description: task.description, due_date: task.due_date });
                    setShowForm(true);
                  }}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(task.id)}>Delete</button>
                  <button className='btn btn-sm btn-success' onClick={() => handleView(task.id)}>Veiw</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {viewingTask && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Task Details</h5>
                <button type="button" className="btn-close" onClick={() => setViewingTask(null)}></button>
              </div>
              <div className="modal-body">
                <h5>{viewingTask.title}</h5>
                <p><strong>Description:</strong> {viewingTask.description || '—'}</p>
                <p><strong>Due Date:</strong> {viewingTask.due_date || '—'}</p>
                <p><strong>Completed:</strong> {viewingTask.completed ? 'Yes' : 'No'}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setViewingTask(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}


      {showForm && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingTask ? 'Edit Task' : 'Add New Task'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Title"
                  value={newTask.title}
                  onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                />
                <textarea
                  className="form-control mb-2"
                  placeholder="Description"
                  value={newTask.description}
                  onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                />
                <input
                  type="date"
                  className="form-control"
                  value={newTask.due_date}
                  onChange={e => setNewTask({ ...newTask, due_date: e.target.value })}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleCreateOrUpdate}>
                  {editingTask ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
