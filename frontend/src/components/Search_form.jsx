// import React, { useState } from "react";
// import { Button } from "react-bootstrap";
// import Form from "react-bootstrap/Form";
//
// export default function SearchForm({ searchValue,searchInParent }) {
  // const [searchValue, setSearchValue] = useState("");

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   searchInParent(searchValue);
  // };
//
//   return (
//     <div className="d-flex flex-row">
//       <Form className="d-flex" >
//         <Form.Group className="mb-0 me-2" controlId="formBasicSearch">
//           <Form.Control
//             type="text"
//             placeholder="search by name"
//             style={{ width: "600px" }}
//             value={searchValue}
//             onChange={(e) => searchInParent(e.target.value)}
//           />
//         </Form.Group>
//         <Button type="submit">Search</Button>
//       </Form>
//     </div>
//   );
// }

import React from "react";
import Form from "react-bootstrap/Form";

export default function SearchForm({ searchValue, setSearchValue, inputWidth = "300px" }) {
  return (
    <div className="d-flex flex-row">
      <Form className="d-flex">
        <Form.Group className="mb-0 me-2" controlId="formBasicSearch">
          <Form.Control
            type="text"
            placeholder="search by name"
            style={{ width: inputWidth , border: '1px solid black', borderRadius: '4px', padding: '6px 12px'}}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </Form.Group>
      </Form>
    </div>
  );
}