import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import Search_form from './Search_form';

export default function EmployeeTaskFilters({
  searchValue,
  setSearchValue,
  priorityFilter,
  setPriorityFilter,
  projectFilter,
  setProjectFilter,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  projectOptions
}) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb'
    }}>
      <h5 style={{ 
        marginBottom: '16px', 
        color: '#374151', 
        fontWeight: '600',
        fontSize: '1.1rem'
      }}>
        Filter & Search
      </h5>
      <Row className="align-items-center">
        <Col md={3} style={{ marginBottom: "16px" }}>
          <div style={{ position: 'relative' }}>
            <Search_form
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              inputWidth="100%"
            />
          </div>
        </Col>
        <Col md={2} style={{ marginBottom: "16px" }}>
          <Form.Select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            style={{
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              padding: '8px 12px',
              fontSize: '14px'
            }}
          >
            <option value="All">🎯 All Priorities</option>
            <option value="High">🔴 High</option>
            <option value="Medium">🟡 Medium</option>
            <option value="Low">🟢 Low</option>
          </Form.Select>
        </Col>
        <Col md={2} style={{ marginBottom: "16px" }}>
          <Form.Select
            value={projectFilter}
            onChange={e => setProjectFilter(e.target.value)}
            style={{
              borderRadius: '12px',
              border: '2px solid #e2e8f0',
              padding: '12px 16px',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              backgroundColor: '#fff'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          >
            <option value="All">📁 All Projects</option>
            {projectOptions.map((proj) => (
              <option key={proj._id} value={proj._id}>{proj.Name}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={2} style={{ marginBottom: "16px" }}>
          <Form.Select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{
              borderRadius: '12px',
              border: '2px solid #e2e8f0',
              padding: '12px 16px',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              backgroundColor: '#fff'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          >
            <option value="All">📊 All Status</option>
            <option value="To Do">📝 To Do</option>
            <option value="In Progress">⏳ In Progress</option>
            <option value="Completed">✅ Completed</option>
            <option value="Due">🕒 Overdue</option>
          </Form.Select>
        </Col>
        <Col md={3} style={{ marginBottom: "16px" }}>
          <Form.Select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              borderRadius: '12px',
              border: '2px solid #e2e8f0',
              padding: '12px 16px',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              backgroundColor: '#fff'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          >
            <option value="None">🔄 Sort By</option>
            <option value="NameAsc">📝 Name (A-Z)</option>
            <option value="NameDesc">📝 Name (Z-A)</option>
            <option value="DueAsc">📅 Due Date (Earliest)</option>
            <option value="DueDesc">📅 Due Date (Latest)</option>
          </Form.Select>
        </Col>
      </Row>
    </div>
  );
}
