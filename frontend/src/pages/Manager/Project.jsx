import Search_form from "../../components/Search_form";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useState, useMemo, useEffect } from "react";
import { Row, Col, Button, Container, Table, Form } from "react-bootstrap";
import AddNewProject from "../../components/AddNewProject";
import { getProjects, Add, update, del, subscribe } from "../../Data/Projects";
import DisplayProject from "../../components/DisplayProject";
import { useNavigate } from 'react-router-dom';
import SortDropdown from "../../components/SortDropdown";
import employees, { getEmployees } from "../../Data/Employee";
import { useUser } from "../../contexts/UserContext";
export default function Project() {
  const {user, token} = useUser();
  if(user)
  console.log("current user:", user);
else
  console.log("no user");
  let id = user?._id; // Use user ID from context, fallback to 101

  // Use projects as the source of truth, subscribe to changes
  const [projects, setProjects] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [sortedValue, setSortedValue] = useState("None");
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [show, setShow] = useState(false);
  // Keep projects in sync with global store
  useEffect(() => {
    const unsub = subscribe((allProjects) => {
      setProjects(allProjects); // Backend already filters by managerId
    });
    // Initial load in case subscribe is async
    const loadProjects = async () => {
    const allProjects = await getProjects(id, token); // wait for async fetch - already filtered by backend
    setProjects(allProjects);
  };

  if (id) loadProjects();

  return unsub;
  }, [id]);

  // Load employees
  useEffect(() => {
    const loadEmployees = async () => {
      const allEmployees = await getEmployees(token);
      setEmployeeList(allEmployees);
    };
    loadEmployees();
  }, []);

  // Project summary counts (always up-to-date)
  const activeCount = useMemo(() => projects.filter(p => p.Status === "Active").length, [projects]);
  const completedCount = useMemo(() => projects.filter(p => p.Status === "Completed").length, [projects]);
  const pendingCount = useMemo(() => projects.filter(p => p.Status === "Pending").length, [projects]);

  // Filtering and sorting logic
  const startOfDay = (d) => {
    const dt = new Date(d);
    dt.setHours(0, 0, 0, 0);
    return dt;
  };
  const today = startOfDay(new Date());
  const filteredProjects = useMemo(() => {
    let arr = [...projects];
    if (searchValue) {
      arr = arr.filter(p => p.Name.toLowerCase().includes(searchValue.toLowerCase()));
    }
    if (statusFilter !== "All") {
      if(statusFilter === "Overdue") {
        arr = arr.filter(p => startOfDay(p.EndDate) < today && p.Status !== "Completed");
      } else {
        arr = arr.filter(p => p.Status === statusFilter);
      }
    }
    // Sorting
    if (sortedValue === "name") {
      arr = arr.sort((a, b) => a.Name.localeCompare(b.Name));
    } else if (sortedValue === "employees") {
      arr = arr.sort((a, b) => a.team.length - b.team.length);
    } else if (sortedValue === "startDate") {
      arr = arr.sort((a, b) => new Date(a.StartDate) - new Date(b.StartDate));
    } else if (sortedValue === "endDate") {
      arr = arr.sort((a, b) => new Date(a.EndDate) - new Date(b.EndDate));
    }
    return arr;
  }, [projects, searchValue, statusFilter, sortedValue]);

  // Handlers
  function handlePick(value) {
    setSortedValue(value);
  }
  function handleStatusFilter(value) {
    setStatusFilter(value);
  }
  const handleAddProject = (newProjectData) => {
    newProjectData.managerId = id; // Assign current manager ID
    Add(newProjectData, token);
    // No need to update state here, subscribe will handle it
  };
  const onProjectUpdate = (updatedProject) => {
    updatedProject.managerId = id; // Ensure managerId is set
    update(updatedProject, token);
    // No need to update state here, subscribe will handle it
  };
  const navigate = useNavigate();

  const onViewProject = (id) => {
    navigate(`/manager/projects/${id}`, { state: { fromApp: true } });
  };
  const onProjectDelete = (projectId) => {
    del(projectId, id, token);
    // No need to update state here, subscribe will handle it
  };
  const searchForValue = (value) => {
    setSearchValue(value);
  };

  return (
    <div>
      <Navbar name="manager"/>
      <Row>
        <Col md={3}>
          <Sidebar user={"manager"} value="project"/>
        </Col>
        <Col md={8}>
          <div style={{
            background: '#4f46e5',
            color: 'white',
            padding: '30px',
            marginBottom: '30px'
          }}>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
              📋 Project Management
            </h2>
            <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '14px' }}>
              Manage and track all your projects in one place
            </p>
          </div>
          {/* Project summary cards */}
          <Container style={{ marginBottom: '20px' }}>
            <Row>
              <Col sm={4} style={{ padding: '0 8px', marginBottom: '16px' }}>
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{
                    background: '#10b981',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>
                    Active Projects
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#374151' }}>
                    {activeCount}
                  </div>
                </div>
              </Col>
              <Col sm={4} style={{ padding: '0 8px', marginBottom: '16px' }}>
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{
                    background: '#3b82f6',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>
                    Completed Projects
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#374151' }}>
                    {completedCount}
                  </div>
                </div>
              </Col>
              <Col sm={4} style={{ padding: '0 8px', marginBottom: '16px' }}>
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{
                    background: '#f59e0b',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>
                    Pending Projects
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#374151' }}>
                    {pendingCount}
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
          {/* Controls and table container */}
          <Container>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb'
            }}>
              {/* Filter/search/sort controls and Add button */}
              <Row className="align-items-center" style={{ marginBottom: '20px' }}>
                <Col md={3} style={{ marginBottom: '10px' }}>
                  <Search_form
                    searchValue={searchValue}
                    setSearchValue={searchForValue}
                    inputWidth="100%"
                  />
                </Col>
                <Col md={3} style={{ marginBottom: '10px' }}>
                  <Form.Select
                    value={statusFilter}
                    onChange={e => handleStatusFilter(e.target.value)}
                    style={{
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      padding: '8px 12px'
                    }}
                  >
                    <option value="All">All Status</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                  </Form.Select>
                </Col>
                <Col md={3} style={{ marginBottom: '10px' }}>
                  <SortDropdown
                    handlePick={handlePick}
                    sortedValue={sortedValue}
                  />
                </Col>
                <Col md={3} className="d-flex justify-content-end" style={{ marginBottom: '10px' }}>
                  <Button 
                    onClick={() => setShow(true)}
                    style={{
                      background: '#4f46e5',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontWeight: '500'
                    }}
                  >
                    + Add New Project
                  </Button>
                </Col>
              </Row>

              {/* Project table */}
              <div style={{
                maxHeight: "400px",
                overflowY: "auto",
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <Table striped bordered hover responsive className="mb-0">
                  <thead style={{ background: '#f8f9fa', position: 'sticky', top: 0, zIndex: 1 }}>
                    <tr>
                      <th style={{ borderBottom: '2px solid #dee2e6', padding: '12px' }}>Name</th>
                      <th style={{ borderBottom: '2px solid #dee2e6', padding: '12px' }}>Employees</th>
                      <th style={{ borderBottom: '2px solid #dee2e6', padding: '12px' }}>Start Date</th>
                      <th style={{ borderBottom: '2px solid #dee2e6', padding: '12px' }}>End Date</th>
                      <th style={{ borderBottom: '2px solid #dee2e6', padding: '12px' }}>Status</th>
                      <th style={{ borderBottom: '2px solid #dee2e6', padding: '12px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((element, idx) => (
                      <DisplayProject
                        key={element._id}
                        ele={element}
                        index={idx}
                        onProjectUpdate={onProjectUpdate}
                        onProjectDelete={onProjectDelete}
                        onViewProject={onViewProject}
                      />
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </Container>
        </Col>
      </Row>
      <AddNewProject
        show={show}
        onClose={() => setShow(false)}
        EmployeeList={employeeList}
        onProjectAdd={handleAddProject}
      />
    </div>
  );
}