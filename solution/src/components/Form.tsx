// This is the form component implementing mock.png.
// The easiest way to implement appropriate styling (per the assessment requirements) is to leverage an already implemented
// library or design system. Because this assessment is for a position at Microsoft, I chose to use FluentUI components.
// I haven't used FluentUI before, but I have used Material-UI, which similarly provides a set of pre-styled components to
// ensure consistency, accessibility, and responsiveness.

import {
  Button,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  Dropdown,
  Field,
  Input,
  Option,
  OptionOnSelectData,
  SelectionEvents,
  TableColumnDefinition,
  createTableColumn,
} from "@fluentui/react-components";
import React, { useEffect, useMemo, useState } from "react";
import {
  ValidationResult,
  useAsyncStringValidation,
} from "../hooks/useAsyncValidation";
import { getLocations, isNameValid } from "../mock-api/apis";

interface Props {
  // It is likely in a real world scenario that this component would take props, perhaps to set initial values, but I kept things simple for this assessment.
}

const isNameValidWrapper = async (name: string): Promise<ValidationResult> => {
  // Wrapping the mock-api function to add the message since changing the mock-api is not allowed.
  // In a real world scenario, there may be several different functions that are used together to validate a single field and they would need different messages.
  // Alternatively, the message could be added to the API, and all validation functions could use a common interface to return both a boolean and a message.

  const isValid = await isNameValid(name);
  return {
    isValid,
    message: isValid ? "" : "this name has already been taken",
  };
  // Note: This message doesn't really follow best practices for UX writing. It should be more specific and actionable.
  // Without knowing what is in the style guide for validation messages, it is hard to know exactly what the message should be.
  // For example, is there a character limit? Should messages be sentences or fragments? How should they be capitalized?
  // Should they be in the active or passive voice? Should they be positive or negative? What should the tone and voice be?
  // However, I have used this exact text because that is what is required by mock.png.
};

type DataItem = {
  name: string;
  location: string;
};

const columns: TableColumnDefinition<DataItem>[] = [
  createTableColumn<DataItem>({
    columnId: "name",
    compare: (a, b) => {
      return a.name.localeCompare(b.name);
    },
    renderHeaderCell: () => {
      return "Name";
    },
    renderCell: (item) => {
      return item.name;
    },
  }),
  createTableColumn<DataItem>({
    columnId: "location",
    compare: (a, b) => {
      return a.location.localeCompare(b.location);
    },
    renderHeaderCell: () => {
      return "Location";
    },
    renderCell: (item) => {
      return item.location;
    },
  }),
];

const Form: React.FC<Props> = () => {
  const nameValidation = useAsyncStringValidation("", isNameValidWrapper);

  const [location, setLocation] = useState<string>("");
  const [locationError, setLocationError] = useState<string>("");
  const [locationOptions, setLocationOptions] = useState<string[]>([]);

  const [items, setItems] = useState<DataItem[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locations = await getLocations();
        setLocationOptions(locations);
      } catch (error) {
        // From a UX writing perspective, this error message is not user-friendly and should not be shown to the user.
        // It is a technical error message that the user cannot do anything about.
        // Instead, the error should be logged and a generic error message should be shown to the user.
        console.error("Error fetching locations:", error);
        // Its not a great solution to reload the page in a real world scenario, but it is a simple solution for this assessment.
        // Other options might include offering an indicator and reload button as part of the label. Whatever the solution, it
        //should be user-friendly, clear, actionable and consistent across the application.
        setLocationError(
          "An error occurred while fetching locations. Try reloading the page."
        );
        setLocation("");
      }
    };

    fetchLocations();
  }, []);

  const handleLocationSelect = (
    event: SelectionEvents,
    data: OptionOnSelectData
  ) => {
    setLocation(data.optionValue ?? "");
  };

  const handleClearClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // mock.png and the assessment requirements do not specify what should happen when the clear button is clicked.
    // It could be used to clear the name and location inputs, or it could be used to clear the table, or both.

    // For now, I'll just clear the name and location inputs.
    nameValidation.initValue("");
    setLocation("");
  };

  const canAdd = useMemo(
    () =>
      nameValidation.isValid &&
      nameValidation.value.length > 0 &&
      location.length > 0,
    [nameValidation.isValid, nameValidation.value.length, location.length]
  );

  const handleAddClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // mock.png and the assessment requirements do not specify what should happen when the add button is clicked.
    // However, it is reasonable to assume that the name and location should be added to the table.

    // In a real world scenario, the name and location should be validated before being added to the table.
    // For now, I'll just ensure both values are set.
    if (canAdd) {
      setItems([...items, { name: nameValidation.value, location }]);
      //Clear the form inputs
      handleClearClick(event);
    }
  };

  return (
    <div>
      <Field label="Name" validationMessage={nameValidation.message}>
        <Input
          value={nameValidation.value}
          onChange={nameValidation.handleChange}
        />
      </Field>

      {/**
       * In a real world scenario, a Combobox might be a better option as it allows for typing and filtering from a large list.
       * Additionally, a Combobox allows for using a virtualizer which will be more efficient and preformant when/if the list of options is long.
       */}
      <Field label="Location" validationMessage={locationError}>
        <Dropdown
          placeholder="Select a location"
          value={location}
          clearable
          onOptionSelect={handleLocationSelect}
        >
          {locationOptions &&
            locationOptions.map((loc) => <Option key={loc}>{loc}</Option>)}
        </Dropdown>
      </Field>

      <div>
        <Button onClick={handleClearClick} appearance="secondary">
          Clear
        </Button>
        <Button
          onClick={handleAddClick}
          appearance="secondary"
          disabled={!canAdd}
        >
          Add
        </Button>
      </div>

      {/**
       * Using DataGrid here because it is likely this data will need to be sorted, filtered, etc. in the future.
       * This will make it easier to add that functionality later.
       */}
      <DataGrid items={items} columns={columns} getRowId={(item) => item.name}>
        <DataGridHeader>
          <DataGridRow>
            {({ renderHeaderCell }) => (
              <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
            )}
          </DataGridRow>
        </DataGridHeader>
        <DataGridBody<DataItem>>
          {({ item, rowId }) => (
            <DataGridRow<DataItem> key={rowId}>
              {({ renderCell }) => (
                <DataGridCell>{renderCell(item)}</DataGridCell>
              )}
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>
    </div>
  );
};

export default Form;

// In a real world scenario, we should probably break this component up into smaller components, add better error handling and logging, and add tests.
