import { Dropdown, ButtonGroup, Button } from "react-bootstrap";
const SortDropdown = (props) => {
  const sortOptions = [
    { label: "Name", value: "name" },
    { label: "Employees", value: "employees" },
    { label: "Start Date", value: "startDate" },
    { label: "End Date", value: "endDate" },
  ];
  return (
    <>
      <Dropdown as={ButtonGroup}>
        <Button variant="secondary">{props.sortedValue}</Button>

        <Dropdown.Toggle split variant="secondary" id="dropdown-split-basic" />

        <Dropdown.Menu>
          {sortOptions.map((option) => (
            <Dropdown.Item
              onClick={() => {
                props.handlePick(option.value);
              }}
            >
              {option.value}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default SortDropdown;
