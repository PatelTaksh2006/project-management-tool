let tasks = [];
const listeners = [];

function notify() {
  listeners.forEach((cb) => cb(tasks));
}


// Subscribe to changes (for React components)
function subscribe(cb) {
  listeners.push(cb);
  return () => {
    const idx = listeners.indexOf(cb);
    if (idx > -1) listeners.splice(idx, 1);
  };
}

// Get the latest tasks for a project (from backend)
async function getTasks(projectId) {
  try {
    const res = await fetch(`http://localhost:3001/api/task/getAll?projectId=${projectId}`);
    if (res.ok) {
      const data = await res.json();
      // normalize response to an array of tasks
        const raw = Array.isArray(data.tasks) ? data.tasks : Array.isArray(data) ? data : [];
        // Use server-populated task objects directly (assumed to include assigned user)
        tasks = raw;
      notify();
    } else {
      console.error("Failed to fetch tasks:", res.status, res.statusText);
      tasks = [];
    }
  } catch (err) {
    console.error("Error fetching tasks:", err);
    tasks = [];
  }
  return tasks;
}

// Get tasks assigned to a specific employee
async function getEmployeeTasks(employeeId) {
  try {
    console.log('Fetching tasks for employee:', employeeId);
    const res = await fetch(`http://localhost:3001/api/task/getByEmployee/${employeeId}`);
    if (res.ok) {
      const data = await res.json();
      const raw = Array.isArray(data.tasks) ? data.tasks : Array.isArray(data) ? data : [];
      tasks = raw;  
      notify();
      console.log('Fetched tasks for employee:', tasks);
      return tasks;
    } else {
      console.error('Failed to fetch employee tasks:', res.status, res.statusText);
      tasks = [];
    }
  } catch (err) {
    console.error('Error fetching employee tasks:', err);
    tasks = [];
  }
  return tasks;
}

async function Add(newTask) {
  try {
    const res = await fetch("http://localhost:3001/api/task/add", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    });
    // refresh tasks for the project
    await getTasks(newTask.projectId);
  } catch (err) {
    console.error("Failed to add task:", err);
  }
}

async function update(updatedTask) {
  try {
    await fetch("http://localhost:3001/api/task/update", {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask),
    });
    await getTasks(updatedTask.projectId);
  } catch (err) {
    console.error("Failed to update task:", err);
  }
}

async function del(taskId, projectId) {
  try {
    await fetch("http://localhost:3001/api/task/delete", {
      method: "DELETE",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: taskId }),
    });
    await getTasks(projectId);
  } catch (err) {
    console.error("Failed to delete task:", err);
  }
}

export default tasks;
export { getTasks, getEmployeeTasks, subscribe, Add, update, del };