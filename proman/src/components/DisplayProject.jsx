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
      onProjectDelete(ele.Id);
    }
  }

  function handleViewClick() {
    onViewProject(ele.Id);
  }

  return (
    <>
      <tr>
        <td>{ele.Id}</td>
        <td>{ele.Name}</td>
        <td>{ele.Employees}</td>
        <td>{ele.Start_Date}</td>
        <td>{ele.End_date}</td>
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