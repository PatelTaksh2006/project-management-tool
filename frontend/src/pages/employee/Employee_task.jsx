import React, { useMemo, useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { Row, Col } from "react-bootstrap";
import { update as UpdateTask } from "../../Data/Tasks";
import { useUser } from "../../contexts/UserContext";
import EmployeeTaskHeader from "../../components/EmployeeTaskHeader";
import EmployeeTaskSummaryCards from "../../components/EmployeeTaskSummaryCards";
import EmployeeTaskFilters from "../../components/EmployeeTaskFilters";
import EmployeeTaskTableHeader from "../../components/EmployeeTaskTableHeader";
import EmployeeTasksTable from "../../components/EmployeeTasksTable";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export default function Employee_task() {
  const { user, token, loginUser, refreshUser } = useUser();
  const employeeId = user?._id || user?.id || user?.Id;
  const employeeName = user?.name || user?.Name || user?.Email || "Employee";
  const [searchValue, setSearchValue] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("None");
  const [tasks, setTasks] = useState(user?.tasks || []);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Date helpers: compare by day so 'due today' is not considered overdue
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const startOfDay = (d) => {
    const dt = new Date(d);
    dt.setHours(0, 0, 0, 0);
    return dt;
  };
  const today = startOfDay(new Date());
  // Format date for display (strip ISO time if present)
  const formatDate = (d) => {
    if (!d) return '';
    try {
      const dt = new Date(d);
      if (!isNaN(dt)) return dt.toLocaleDateString();
    } catch (e) {}
    if (typeof d === 'string' && d.indexOf('T') !== -1) return d.split('T')[0];
    return String(d);
  };
  // For file upload modal
  const [showFileInput, setShowFileInput] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  // Refresh user data from backend when component mounts or page is navigated to
  useEffect(() => {
    const fetchFreshData = async () => {
      setIsRefreshing(true);
      console.log('=== Employee_task: Starting data refresh ===');
      console.log('Current user before refresh:', user?._id, 'Tasks:', user?.tasks?.length);
      
      const success = await refreshUser();
      
      console.log('Refresh result:', success);
      if (!success) {
        console.warn('Failed to refresh user data, using cached data');
      }
      setIsRefreshing(false);
    };

    fetchFreshData();
  }, []); // Empty dependency array = run only on mount

  // Keep local tasks state always sourced from user.tasks
  useEffect(() => {
    console.log('Employee_task: User object changed, syncing tasks');
    console.log('User tasks:', user?.tasks?.length, 'tasks');
    setTasks(Array.isArray(user?.tasks) ? user.tasks : []);
  }, [user]);

  // Helper to check if a task is assigned to this employee (tolerant to shapes)
  function isAssignedToEmployee(t) {
    try {
      if (!t) return false;
      // direct id fields
      if (t.assignedToId && employeeId && String(t.assignedToId) === String(employeeId)) return true;
      if (t.assignedTo && typeof t.assignedTo === 'string') {
        if (t.assignedTo === String(employeeId)) return true;
        if ((t.assignedTo || '').toLowerCase() === (employeeName || '').toLowerCase()) return true;
      }
      if (t.assignedTo && typeof t.assignedTo === 'object') {
        if (t.assignedTo._id && String(t.assignedTo._id) === String(employeeId)) return true;
        if (t.assignedTo.Name && String(t.assignedTo.Name).toLowerCase() === (employeeName || '').toLowerCase()) return true;
        if (t.assignedTo.name && String(t.assignedTo.name).toLowerCase() === (employeeName || '').toLowerCase()) return true;
      }
      return false;
    } catch (err) {
      console.error('isAssignedToEmployee error', err, t);
      return false;
    }
  }
console.log(user);
console.log("user project",user?.project);
  // Only show projects for this employee
  const projectOptions = useMemo(() => {
    console.log("user project options", user?.project);
    return Array.isArray(user?.project) ? user.project : [];
  }, [user]);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    // helper to match different shapes of assignedTo
    let filtered = tasks.filter(isAssignedToEmployee);
    if (searchValue) {
      filtered = filtered.filter(t =>
        (t.name?.toLowerCase() || '').includes(searchValue.toLowerCase())
      );
    }
    if (priorityFilter !== "All") {
      filtered = filtered.filter(t => t.priority === priorityFilter);
    }
    if (projectFilter !== "All") {
      filtered = filtered.filter(t => t.projectId._id === projectFilter);
    }
    if (statusFilter !== "All") {
      if(statusFilter!="Due") {
      filtered = filtered.filter(t => t.status === statusFilter);
      }      else {
        filtered = filtered.filter(t => {
          const dueDate = new Date(t.dueDate);
          return dueDate < today;
        });
      }
    }
    // Sorting
    if (sortBy === "NameAsc") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "NameDesc") {
      filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === "DueAsc") {
      filtered = [...filtered].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sortBy === "DueDesc") {
      filtered = [...filtered].sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
    }
    return filtered;
  }, [employeeId, employeeName, searchValue, priorityFilter, projectFilter, statusFilter, sortBy, tasks]);

  // Task summary counts
  const completedCount = useMemo(() => tasks.filter(
    t => isAssignedToEmployee(t) && t.status === "Completed"
  ).length, [tasks, employeeId, employeeName]);
  const inProgressCount = useMemo(() => tasks.filter(
    t => isAssignedToEmployee(t) && t.status === "In Progress"
  ).length, [tasks, employeeId, employeeName]);
  const todoCount = useMemo(() => tasks.filter(
    t => isAssignedToEmployee(t) && t.status === "To Do"
  ).length, [tasks, employeeId, employeeName]);

  // Mark task as completed (update global store)
  const handleMarkCompleted = (taskId) => {
    const task = tasks.find(t => t._id === taskId);
    let updated = null;
    if (task) {
      if (task.status != "Completed") {
        updated = { ...task, status: "Completed" };
      }
      else if (task.status === "Completed") {
        updated = { ...task, status: "In Progress" };
      }
      if (updated) {
        console.log('Marking task as completed:', updated);
        UpdateTask(updated, token)
          .then(() => {
            // Ensure UI reflects the updated task immediately (defensive merge)
            setTasks(prev => prev.map(t => t._id === updated._id ? updated : t));
            // Also update user context/tasks so other pages read the latest tasks
            try {
              if (user && Array.isArray(user.tasks)) {
                const newUser = { ...user, tasks: user.tasks.map(t => t._id === updated._id ? updated : t) };
                // update context and localStorage via loginUser helper (preserve token)
                loginUser(newUser, token);
              }
            } catch (err) {
              console.warn('Failed to sync updated task into user context:', err);
            }
          })
          .catch((e) => console.error('UpdateTask failed:', e));
        // optimistic update while backend call is in-flight
        setTasks((prev) => prev.map(t => t._id === taskId ? updated : t));
      }
    }
    // persist via Tasks store and refresh tasks for this employee

  };

  // Handle file upload (update global store)
  const handleFileButtonClick = (taskId) => {
    setCurrentTaskId(taskId);
    setShowFileInput(true);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const task = tasks.find(t => t._id === currentTaskId);
    
    // Process files asynchronously to get URLs from backend
    const uploadPromises = selectedFiles.map(async (file) => {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const safe = (s) => String(s || '').replace(/[^a-z0-9._-]/gi, '_');

      // preserve extension exactly once, keep it lowercase for consistency
      const extMatch = /(\.[^/.]+)$/.exec(file.name);
      const ext = extMatch ? extMatch[1].toLowerCase() : '';
      const baseName = ext ? file.name.slice(0, -ext.length) : file.name;

      const originalBaseSafe = safe(baseName);
      const taskNameSafe = safe((task && task.name) || 'task');
      const projectNameSafe = safe((task && (task.projectName || (task.project && (task.project.Name || task.project.name)))) || 'project');

      const storedName = `${originalBaseSafe}_${taskNameSafe}_${projectNameSafe}_${timestamp}${ext}`;

      try {
        const form = new FormData();
        form.append('file', file, storedName);
        form.append('targetPath', 'upload_Documents');
        const res = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          body: form,
        });
        
        if (res.ok) {
          const data = await res.json();
          // Use the URL returned from backend
          return { name: storedName, url: data.url };
        } else {
          console.error('Upload failed for', storedName, await res.text());
          return null;
        }
      } catch (err) {
        console.error('Upload request failed:', err);
        return null;
      }
    });

    // Wait for all uploads to complete
    Promise.all(uploadPromises).then((uploadedFiles) => {
      const validFiles = uploadedFiles.filter(f => f !== null);
      
      if (task && validFiles.length > 0) {
        const updated = { ...task, files: [...(task.files || []), ...validFiles] };
        UpdateTask({ ...updated, projectId: task.projectId }, token)
          .then(() => {
            setTasks(prev => prev.map(t => t._id === currentTaskId ? updated : t));
            try {
              if (user && Array.isArray(user.tasks)) {
                const newUser = { ...user, tasks: user.tasks.map(t => t._id === updated._id ? updated : t) };
                loginUser(newUser, token);
              }
            } catch (err) {
              console.warn('Failed to sync updated files into user context:', err);
            }
          })
          .catch((e) => console.error('UpdateTask failed:', e));
        setTasks((prev) => prev.map(t => t._id === currentTaskId ? updated : t));
      }
      
      setShowFileInput(false);
      setCurrentTaskId(null);
    }).catch((err) => {
      console.error('File upload processing failed:', err);
      setShowFileInput(false);
      setCurrentTaskId(null);
    });
  };

console.log(tasks);
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <Navbar name="employee" />
      <Row style={{ margin: 0 }}>
        <Col md={3} style={{ padding: 0 }}>
          <Sidebar user={"employee"} value="task" id_name={employeeName} />
        </Col>
        <Col md={9} style={{ padding: '20px 30px' }}>
          {/* Header Section */}
          <EmployeeTaskHeader />

          {/* Task Summary Cards */}
          <EmployeeTaskSummaryCards
            completedCount={completedCount}
            inProgressCount={inProgressCount}
            todoCount={todoCount}
          />

          {/* Filter Controls */}
          <EmployeeTaskFilters
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            projectFilter={projectFilter}
            setProjectFilter={setProjectFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            projectOptions={projectOptions}
          />

          {/* Tasks Table */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <EmployeeTaskTableHeader filteredTasksCount={filteredTasks.length} />
            <EmployeeTasksTable
              filteredTasks={filteredTasks}
              startOfDay={startOfDay}
              today={today}
              formatDate={formatDate}
              handleMarkCompleted={handleMarkCompleted}
              handleFileButtonClick={handleFileButtonClick}
              handleFileChange={handleFileChange}
              showFileInput={showFileInput}
              currentTaskId={currentTaskId}
              setShowFileInput={setShowFileInput}
              setCurrentTaskId={setCurrentTaskId}
              setTasks={setTasks}
              user={user}
              token={token}
              loginUser={loginUser}
              UpdateTask={UpdateTask}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}