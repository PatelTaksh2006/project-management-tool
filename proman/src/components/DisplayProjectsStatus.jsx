import { Badge } from "react-bootstrap";
const DisplayProjectStatus = ({ name, count }) => {
  return (
    <>
      {/* 🔥 Scoped Styles */}
      <style>
        {`
          .project-box {
            background: #ffffff;
            border: 1px solid #ddd;
            border-radius: 16px;
            padding: 25px;
            text-align: center;
            margin: 15px 0;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            cursor: pointer;
          }

          .project-box:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
          }

          .project-title {
            font-size: 18px;
            font-weight: 600;
            color: #444;
            margin-bottom: 10px;
          }

          .project-count {
            font-size: 28px;
            font-weight: bold;
            color: #0d6efd;
          }
        `}
      </style>

      {/* 🔥 UI */}
      <div className="project-box">
        <div className="project-title">{name}</div>
        <div className="project-count">
          {count}
          <Badge bg="primary" pill className="ms-2">
            {name}
          </Badge>
        </div>
      </div>
    </>
  );
};

export default DisplayProjectStatus;
