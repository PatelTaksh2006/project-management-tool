const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

let projects = [
];

const listeners = [];

function notify() {
  listeners.forEach((cb) => cb(projects));
}

async function Add(newProject) {
  // Immediately update local store so UI reflects the new project without waiting for network
  // projects.push(newProject);
  

  // Persist to backend and then refresh local store from backend to obtain any server-assigned fields (e.g. _id)

    const res = await fetch(`${API_URL}/api/project/add`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newProject)
    });
  
getProjects(newProject.managerId);
  notify();
}

function update(updatedProject) {
  projects = projects.map(p => (p._id === updatedProject._id ? updatedProject : p));
  const res=fetch(`${API_URL}/api/project/update`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedProject)
  });
  getProjects(updatedProject.managerId);
  notify();
}

async function del(projectId, managerId) {
  // Optimistically remove locally so UI updates immediately
  projects = projects.filter((p) => p._id !== projectId);
  try {
    await fetch(`${API_URL}/api/project/delete`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ _id: projectId })
    });
  } catch (err) {
    console.error('Failed to delete project on server:', err);
  }
  // Re-fetch projects for the same manager (if provided) to keep local store consistent
  getProjects(managerId);
  notify();
}

// Subscribe to changes (for React components)
function subscribe(cb) {
  listeners.push(cb);
  return () => {
    const idx = listeners.indexOf(cb);
    if (idx > -1) listeners.splice(idx, 1);
  };
}

// Get the latest projects (for React state initialization)
async function getProjects(managerId) {
    try {
    const res = await fetch(`${API_URL}/api/project/getAll?managerId=${managerId}`);
    if (res.ok) {
      const data = await res.json();
      // Handle different response structures
      projects = data.projects || data || [];
      notify();
    } else {
      console.error('Failed to fetch projects:', res.status, res.statusText);
      projects = [];
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
    projects = [];
  }
  return projects;
}

export default projects;
export { Add, update, del, subscribe, getProjects };