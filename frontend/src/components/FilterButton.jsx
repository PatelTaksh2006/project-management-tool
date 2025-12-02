import { Dropdown, ButtonGroup, Button } from "react-bootstrap";
const FilterButton = (props) => {
    const filter_options = [
        { label: "All", value: "All" },
        { label: "Active", value: "Active" },
        { label: "Completed", value: "Completed" },
        { label: "Pending", value: "Pending" },
      ];
    return (
      <>
        <Dropdown as={ButtonGroup}>
          <Button variant="secondary">Filter</Button>

          <Dropdown.Toggle
            split
            variant="secondary"
            id="dropdown-split-basic"
          />

          <Dropdown.Menu>
            {filter_options.map((option) => (
              <Dropdown.Item
                onClick={() => {
                  props.handleFilter(option.value);
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

  export default FilterButton;