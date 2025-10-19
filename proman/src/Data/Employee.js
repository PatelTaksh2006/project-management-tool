let employees = [
];

const listeners = [];

function notify() {
  listeners.forEach((cb) => cb(employees));
}

async function Add(newEmployee) {
  employees.push(newEmployee);
    
  const res=await fetch("http://localhost:3001/api/emp/add",{
    method:"POST",
    headers: {
    'Content-Type': 'application/json'  // must be an object with string keys and string values
  },
    body:JSON.stringify(newEmployee)
  })
  notify();
}

function update(updatedEmployee) {
  employees = employees.map(e => (e._id === updatedEmployee._id ? updatedEmployee : e));
  notify();
}

function del(employeeId) {
  employees = employees.filter((e) => e._id !== employeeId);
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

// Get the latest employees (for React state initialization)
async function getEmployees() {
  const res = await fetch("http://localhost:3001/api/emp/getAll");
  if (res.ok) {
    const data = await res.json();
    employees = data.emps;
    notify();
  }
  return employees;
}

export default employees;
export { Add, update, del, subscribe, getEmployees };