import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import EditProject from './EditProject';
export default function DisplayProject({ ele, onProjectUpdate, onProjectDelete , onViewProject}) {
  const [showEdit, setShowEdit] = useState(false);

  function handleEditClick() {
    setShowEdit(true);
  }

  function handleProjectUpdate(updatedProject) {
    if (onProjectUpdate) {
      onProjectUpdate(updatedProject);
    }
    setShowEdit(false);
  }

  function handleDeleteClick() {
    if (window.confirm(`Are you sure you want to delete project "${ele.Name}"?`)) {
      onProjectDelete(ele._id);
    }
  }

  function handleViewClick() {
    onViewProject(ele._id);
  }

  return (
    <>
      <tr>
        {/* <td>{ele._id}</td> */}
        <td>{ele.Name}</td>
        <td>{ele.team?.length}</td>
        <td>{formatDateOnly(ele.StartDate)}</td>
        <td>{formatDateOnly(ele.EndDate)}</td>
        <td>{ele.Status}</td>
        <td style={{ textAlign: "center" }}>
          <Button className="me-2" variant="primary" onClick={handleViewClick}>
            View
          </Button>
          <Button className="me-2" variant="secondary" onClick={handleEditClick}>
            Edit
          </Button>
          <Button className="me-2" variant="danger" onClick={handleDeleteClick}>
            Delete
          </Button>
        </td>
      </tr>
      {/* Edit Project Modal */}
      <EditProject
        project={ele}
        show={showEdit}
        onClose={() => setShowEdit(false)}
        onProjectUpdate={handleProjectUpdate}
        SelectedEmployeeList={ele.team}
      />
      {/* View Project Information Modal */}
      
    </>
  );
}

function formatDateOnly(value) {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d)) return String(value).split('T')[0] || "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}