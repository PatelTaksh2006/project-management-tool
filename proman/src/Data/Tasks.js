let tasks = [
  {
    id: 1,
    name: "Design UI",
    assignedTo: 101,
    status: "In Progress",
    priority: "High",
    dueDate: "2025-09-15",
    files: [
      { name: "UI_Mockup.png", url: "#" },
      { name: "DesignSpecs.pdf", url: "#" },
    ],
    // Project details
    projectId: 1,
    
  },
  {
    id: 2,
    name: "Setup Database",
    assignedTo: "Bob",
    status: "Completed",
    priority: "Medium",
    dueDate: "2025-09-10",
    files: [
      { name: "DBSchema.sql", url: "#" },
    ],
    projectId: 1,
    projectName: "management tool",
    projectManager: "John Doe",
    projectStatus: "Active",
  },
  {
    id: 3,
    name: "Write Documentation",
    assignedTo: "Charlie",
    status: "To Do",
    priority: "Low",
    dueDate: "2025-09-20",
    files: [],
    projectId: 1,
    projectName: "management tool",
    projectManager: "John Doe",
    projectStatus: "Active",
  },
  {
    id: 4,
    name: "Analytics Dashboard",
    assignedTo: "David",
    status: "To Do",
    priority: "High",
    dueDate: "2025-10-05",
    files: [],
    projectId: 2,
    projectName: "analytics platform",
    projectManager: "Jane Smith",
    projectStatus: "Pending",
  },
  {
    id: 5,
    name: "API Integration",
    assignedTo: "Eva",
    status: "In Progress",
    priority: "Medium",
    dueDate: "2025-10-15",
    files: [],
    projectId: 2,
    projectName: "analytics platform",
    projectManager: "Jane Smith",
    projectStatus: "Pending",
  },
  {
    id: 6,
    name: "CRM Data Import",
    assignedTo: "Frank",
    status: "To Do",
    priority: "High",
    dueDate: "2025-09-25",
    files: [],
    projectId: 3,
    projectName: "crm revamp",
    projectManager: "Emily Clark",
    projectStatus: "Active",
  },
  {
    id: 7,
    name: "UI Testing",
    assignedTo: "frank",
    status: "Completed",
    priority: "Low",
    dueDate: "2025-08-20",
    files: [],
    projectId: 4,
    projectName: "website redesign",
    projectManager: "Mark Lee",
    projectStatus: "Completed",
  },
  {
    id: 8,
    name: "Mobile App Prototype",
    assignedTo: "Henry",
    status: "In Progress",
    priority: "High",
    dueDate: "2025-10-30",
    files: [],
    projectId: 5,
    projectName: "mobile app",
    projectManager: "Sara Kim",
    projectStatus: "Active",
  },
  {
    id: 9,
    name: "Billing Logic",
    assignedTo: "Ivy",
    status: "Completed",
    priority: "Medium",
    dueDate: "2025-03-10",
    files: [],
    projectId: 6,
    projectName: "billing automation",
    projectManager: "Tom Brown",
    projectStatus: "Completed",
  },
  {
    id: 10,
    name: "Data Migration Script",
    assignedTo: "Jack",
    status: "Completed",
    priority: "High",
    dueDate: "2025-06-15",
    files: [],
    projectId: 7,
    projectName: "data migration",
    projectManager: "Linda Green",
    projectStatus: "Completed",
  },
];
const listeners = [];

function notify() {
  listeners.forEach(cb => cb([...tasks]));
}

function getTasks() {
  return [...tasks];
}

function subscribe(cb) {
  listeners.push(cb);
  return () => {
    const idx = listeners.indexOf(cb);
    if (idx > -1) listeners.splice(idx, 1);
  };
}

function Add(newTask) {
  newTask.id = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  tasks = [...tasks, newTask];
  notify();
}

function update(updatedTask) {
  tasks = tasks.map(t => (t.id === updatedTask.id ? updatedTask : t));
  notify();
}

function del(taskId) {
  tasks = tasks.filter(t => t.id !== taskId);
  notify();
}

export { getTasks, subscribe, Add, update, del };