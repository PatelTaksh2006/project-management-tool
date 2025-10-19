import React, { useEffect, useState } from "react";
import { ProgressBar, ListGroup, Badge, Form } from "react-bootstrap";
import { getEmployees } from "../Data/Employee";

export default function DisplayProjectInformation({ project }) {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const emps = await getEmployees();
        if (mounted) setEmployees(Array.isArray(emps) ? emps : []);
      } catch (err) {
        console.error('Failed to load employees:', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (!project || Object.keys(project).length === 0) return <div>No project selected.</div>;

  const tasks = Array.isArray(project.task) ? project.task : [];
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const progress = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const budgetUsed = project.budgetUsed || 0;
  const budgetTotal = project.budget || 1;
  const budgetPercent = Math.round((budgetUsed / budgetTotal) * 100);

  // Resolve manager (could be id string, object, or populated user)
  const managerDisplay = (() => {
    const m = project.manager || project.managerId;
    if (!m) return 'N/A';
    if (typeof m === 'string') {
      const found = employees.find((e) => e._id === m || e.id === m);
      return found ? (found.Name || found.name) : m;
    }
    if (typeof m === 'object') return m.Name || m.name || 'N/A';
    return String(m);
  })();

  const resolveMember = (member) => {
    if (!member) return { id: null, name: null, role: null };
    if (typeof member === 'string') {
      const found = employees.find((e) => e._id === member || e.id === member);
      return found ? { id: found._id || found.id, name: found.Name || found.name || '', role: found.role || '' } : { id: member, name: member, role: '' };
    }
    if (typeof member === 'object') {
      return { id: member._id || member.id || null, name: member.Name || member.name || '', role: member.role || '' };
    }
    return { id: null, name: String(member), role: '' };
  };

  const teamArray = Array.isArray(project.team) ? project.team : [];

  return (
    <div className="container py-4">
      <h2>{project.Name}</h2>
      <p><strong>Project Manager:</strong> {managerDisplay}</p>
      <p><strong>Client:</strong> {project.client || "N/A"}</p>
      <p><strong>Description:</strong></p>
      <Form.Control as="textarea" value={project.description || ""} readOnly rows={3} className="mb-3" />
      <br />
      <div className="mb-3">
        <h4>Budget</h4> ${budgetUsed} / ${budgetTotal}
        <ProgressBar now={budgetPercent} label={`${budgetPercent}%`} className="mt-1" />
      </div>

      <h4>Progress</h4>
      <ProgressBar now={progress} label={`${progress}%`} className="mb-3" />

      <br />
      <h4>Team Members</h4>
      <ListGroup horizontal className="mb-3">
        {teamArray.length > 0 ? (
          teamArray.map((member) => {
            const m = resolveMember(member);
            return (
              <ListGroup.Item key={m.id || JSON.stringify(member)}>
                {m.name || "(Unnamed)"} {m.role ? <Badge bg="info">{m.role}</Badge> : null}
              </ListGroup.Item>
            );
          })
        ) : (
          <ListGroup.Item>No team members assigned.</ListGroup.Item>
        )}
      </ListGroup>
    </div>
  );
}