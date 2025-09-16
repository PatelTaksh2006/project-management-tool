let projects = [
  // Manager 101: One Active, One Completed
  {
    Id: 1,
    managerId: 101,
    Name: "management tool",
    Start_Date: "2025-09-21",
    End_date: "2025-01-29",
    Status: "Active",
    client: "Acme Corp",
    description: "A tool to manage projects, tasks, and teams efficiently.",
    stakeholders: ["IT", "HR", "CEO"],
    budget: 10000,
    budgetUsed: 4500,
    
    team: [
      { id: 1, name: "Alice", role: "Designer" },
      { id: 2, name: "Bob", role: "Developer" },
      { id: 3, name: "Charlie", role: "QA" },
    ],
    task: [
      {
        id: 1,
        name: "Design UI",
        assignedTo: "Alice",
        status: "In Progress",
        priority: "High",
        dueDate: "2025-09-15",
        files: [
          { name: "UI_Mockup.png", url: "#" },
          { name: "DesignSpecs.pdf", url: "#" },
        ],
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
      },
      {
        id: 3,
        name: "Write Documentation",
        assignedTo: "Charlie",
        status: "To Do",
        priority: "Low",
        dueDate: "2025-09-20",
        files: [],
      },
    ],
  },
  {
    Id: 2,
    managerId: 101,
    Name: "website redesign",
    Employees: 5,
    Start_Date: "2025-08-01",
    End_date: "2025-09-15",
    Status: "Completed",
    client: "WebWorks",
    description: "Redesigning the company website for a modern look.",
    stakeholders: ["Marketing"],
    budget: 7000,
    budgetUsed: 7000,
    milestones: [],
    team: [],
    task: [],
  },

  // Manager 102: One Active, One Pending
  {
    Id: 3,
    managerId: 102,
    Name: "analytics platform",
    Employees: 8,
    Start_Date: "2025-07-10",
    End_date: "2025-12-01",
    Status: "Pending",
    client: "DataCorp",
    description: "A platform for advanced analytics and reporting.",
    stakeholders: ["Analytics", "CTO"],
    budget: 20000,
    budgetUsed: 5000,
    milestones: [],
    team: [],
    task: [],
  },
  {
    Id: 4,
    managerId: 102,
    Name: "ai assistant",
    Employees: 18,
    Start_Date: "2025-06-18",
    End_date: "2025-12-31",
    Status: "Active",
    client: "AI Solutions",
    description: "Developing an AI-powered assistant.",
    stakeholders: ["AI", "Support"],
    budget: 30000,
    budgetUsed: 15000,
    milestones: [],
    team: [],
    task: [],
  },

  // Manager 103: One Active, One Completed
  {
    Id: 5,
    managerId: 103,
    Name: "crm revamp",
    Employees: 14,
    Start_Date: "2025-05-15",
    End_date: "2025-10-30",
    Status: "Active",
    client: "CRM Inc.",
    description: "Revamping the CRM for better customer engagement.",
    stakeholders: ["Sales", "Support"],
    budget: 15000,
    budgetUsed: 9000,
    milestones: [],
    team: [],
    task: [],
  },
  {
    Id: 6,
    managerId: 103,
    Name: "internal wiki",
    Employees: 3,
    Start_Date: "2025-02-10",
    End_date: "2025-04-22",
    Status: "Completed",
    client: "Internal",
    description: "Building an internal knowledge base.",
    stakeholders: ["All Departments"],
    budget: 2000,
    budgetUsed: 2000,
    milestones: [],
    team: [],
    task: [],
  },
];

const listeners = [];

function notify() {
  listeners.forEach((cb) => cb(projects));
}

function Add(newProject) {
  newProject.Id = projects.length ? Math.max(...projects.map(p => p.Id)) + 1 : 1;
  projects.push(newProject);
  notify();
}

function update(updatedProject) {
  projects = projects.map(p => (p.Id === updatedProject.Id ? updatedProject : p));
  notify();
}

function del(projectId) {
  projects = projects.filter((p) => p.Id !== projectId);
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
function getProjects() {
  return projects;
}

export default projects;
export { Add, update, del, subscribe, getProjects };