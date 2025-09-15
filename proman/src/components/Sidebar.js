import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar({ user, value, id_name }) {
  const base_path = user === "manager" ? "/manager" : "/employee";

  const isActive = (key) => (value || "").toLowerCase() === key;

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-light" style={{ width: 240, minHeight: "100vh" }}>
      <h3 className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-decoration-none">
        <span className="fs-5 fw-semibold">Navigation</span>
      </h3>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link
            to={base_path}
            className={`nav-link ${isActive("dashboard") ? "active text-white" : "link-dark"}`}
            aria-current={isActive("dashboard") ? "page" : undefined}
          >
            Dashboard
          </Link>
        </li>

        {user === "manager" && (
          <li>
            <Link
              to={`${base_path}/project`}
              className={`nav-link ${isActive("project") ? "active text-white" : "link-dark"}`}
              aria-current={isActive("project") ? "page" : undefined}
            >
              Projects
            </Link>
          </li>
        )}

        {user === "employee" && (
          <li>
            <Link
              to={`${base_path}/task/${id_name}`}
              className={`nav-link ${isActive("task") ? "active text-white" : "link-dark"}`}
              aria-current={isActive("task") ? "page" : undefined}
            >
              Tasks
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}
