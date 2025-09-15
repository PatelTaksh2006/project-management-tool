import React from "react";
import { ProgressBar, ListGroup, Badge, Form} from "react-bootstrap";

export default function DisplayProjectInformation({ project }) {
  if (!project) return <div>No project selected.</div>;

  // Calculate progress (e.g., % of completed tasks)
  const tasks = project.task || [];
  const completedTasks = tasks.filter(t => t.status === "Completed").length;
  const progress = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;

  // Budget
  const budgetUsed = project.budgetUsed || 0;
  const budgetTotal = project.budget || 1;
  const budgetPercent = Math.round((budgetUsed / budgetTotal) * 100);

  return (
    <div className="container py-4">
      {/* Project Overview & Context */}
      <h2>{project.Name}</h2>
      <p><strong>Project Manager:</strong> {project.manager || "N/A"}</p>
      <p><strong>Client:</strong> {project.client || "N/A"}</p>
      <p><strong>Description:</strong></p>
      <Form.Control
        as="textarea"
        value={project.description || ""}
        readOnly
        rows={3}
        className="mb-3"
      />
      <p><strong>Stakeholders:</strong> {project.stakeholders?.join(", ") || "N/A"}</p>
      <br></br>
      <div className="mb-3">
        <h4>Budget</h4> ${budgetUsed} / ${budgetTotal}
        <ProgressBar now={budgetPercent} label={`${budgetPercent}%`} className="mt-1" />
      </div>

      {/* Project Progress & Metrics */}
      <h4>Progress</h4>
      <ProgressBar now={progress} label={`${progress}%`} className="mb-3" />


      {/* Team Collaboration */}
      <br></br>
      <h4>Team Members</h4>
      <ListGroup horizontal className="mb-3">
        {project.team && project.team.length > 0 ? (
          project.team.map(member => (
            <ListGroup.Item key={member.id}>
              {member.name} <Badge bg="info">{member.role}</Badge>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item>No team members assigned.</ListGroup.Item>
        )}
      </ListGroup>

      {/* Task Summary */}
      
    </div>
  );
}