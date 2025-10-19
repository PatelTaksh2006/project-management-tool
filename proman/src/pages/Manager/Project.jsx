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
  const {user} = useUser();
  if(user)
  console.log(user);
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
    const allProjects = await getProjects(id); // wait for async fetch - already filtered by backend
    setProjects(allProjects);
  };

  if (id) loadProjects();

  return unsub;
  }, [id]);

  // Load employees
  useEffect(() => {
    const loadEmployees = async () => {
      const allEmployees = await getEmployees();
      setEmployeeList(allEmployees);
    };
    loadEmployees();
  }, []);

  // Project summary counts (always up-to-date)
  const activeCount = useMemo(() => projects.filter(p => p.Status === "Active").length, [projects]);
  const completedCount = useMemo(() => projects.filter(p => p.Status === "Completed").length, [projects]);
  const pendingCount = useMemo(() => projects.filter(p => p.Status === "Pending").length, [projects]);

  // Filtering and sorting logic
  const filteredProjects = useMemo(() => {
    let arr = [...projects];
    if (searchValue) {
      arr = arr.filter(p => p.Name.toLowerCase().includes(searchValue.toLowerCase()));
    }
    if (statusFilter !== "All") {
      arr = arr.filter(p => p.Status === statusFilter);
    }
    // Sorting
    if (sortedValue === "name") {
      arr = arr.sort((a, b) => a.Name.localeCompare(b.Name));
    } else if (sortedValue === "employees") {
      arr = arr.sort((a, b) => a.Employees - b.Employees);
    } else if (sortedValue === "startDate") {
      arr = arr.sort((a, b) => new Date(a.Start_Date) - new Date(b.Start_Date));
    } else if (sortedValue === "endDate") {
      arr = arr.sort((a, b) => new Date(a.End_date) - new Date(b.End_date));
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
    Add(newProjectData);
    // No need to update state here, subscribe will handle it
  };
  const onProjectUpdate = (updatedProject) => {
    updatedProject.managerId = id; // Ensure managerId is set
    update(updatedProject);
    // No need to update state here, subscribe will handle it
  };
  const navigate = useNavigate();

  const onViewProject = (id) => {
    navigate(`/manager/projects/${id}`);
  };
  const onProjectDelete = (projectId) => {
    del(projectId, id);
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
          <Container className="fluid" style={{ paddingTop: 60, margin: 20 }}>
            <Row>
              <Col xs={12} md={6}>
                <h3 className="mb-0">Projects</h3>
                <div className="text-muted small">
                  Manage and track all projects in one place
                </div>
              </Col>
            </Row>
          </Container>
          {/* Project summary bar */}
          <Container>
            <Row className="mb-2">
              <Col sm={4}>
                <div className="p-2 bg-success text-white rounded text-center">
                  Active: {activeCount}
                </div>
              </Col>
              <Col sm={4}>
                <div className="p-2 bg-primary text-white rounded text-center">
                  Completed: {completedCount}
                </div>
              </Col>
              <Col sm={4}>
                <div className="p-2 bg-warning text-dark rounded text-center">
                  Pending: {pendingCount}
                </div>
              </Col>
            </Row>
          </Container>
          {/* Filter/search/sort controls and Add button */}
          <Container>
            <Row className="align-items-center mb-1">
              <Col md={3} style={{ paddingTop: "10px" }}>
                <Search_form
                  searchValue={searchValue}
                  setSearchValue={searchForValue}
                  inputWidth="200px"
                />
              </Col>
              <Col md={3} style={{ paddingTop: "10px" }}>
                <Form.Select
                  value={statusFilter}
                  onChange={e => handleStatusFilter(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                </Form.Select>
              </Col>
              <Col md={3} style={{ paddingTop: "10px" }}>
                <SortDropdown
                  handlePick={handlePick}
                  sortedValue={sortedValue}
                />
              </Col>
              <Col md={3} className="d-flex justify-content-end" style={{ paddingTop: "10px" }}>
                <Button variant="primary" onClick={() => setShow(true)}>
                  Add new Project
                </Button>
              </Col>
            </Row>
          </Container>
          {/* Project table */}
          <Container style={{ paddingTop: "20px" }}>
            <Row
              className="table-scroll-container"
              style={{
                maxHeight: "300px",
                overflowY: "scroll",
              }}
            >
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    {/* <th>#</th> */}
                    <th>Name</th>
                    <th>Employees</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th>Actions</th>
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
            </Row>
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