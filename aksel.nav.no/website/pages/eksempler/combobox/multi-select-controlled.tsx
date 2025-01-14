import { UNSAFE_Combobox } from "@navikt/ds-react";
import { withDsExample } from "components/website-modules/examples/withDsExample";
import { useMemo, useState } from "react";

const initialOptions = [
  "Norge",
  "Sverige",
  "Danmark",
  "Finland",
  "Island",
  "Storbritannia",
  "Tyskland",
  "Frankrike",
  "Spania",
  "Portugal",
  "Italia",
  "Hellas",
  "Kroatia",
  "Tyrkia",
];

const initialSelectedOptions = ["Norge"];

export const Example = () => {
  const [value, setValue] = useState("");
  const mockPersistUserAddedValues = (option, isSelected) => {
    console.log("custom option", { option, isSelected });
  };

  const [selectedOptions, setSelectedOptions] = useState(
    initialSelectedOptions
  );
  const filteredOptions = useMemo(
    () => initialOptions.filter((option) => option.includes(value)),
    [value]
  );

  const onToggleSelected = (
    option: string,
    isSelected: boolean,
    isCustomOption: boolean
  ) => {
    if (isSelected) {
      setSelectedOptions([...selectedOptions, option]);
    } else {
      setSelectedOptions(selectedOptions.filter((o) => o !== option));
    }
    if (isCustomOption) {
      mockPersistUserAddedValues(option, isSelected);
    }
  };

  return (
    <div>
      <UNSAFE_Combobox
        allowNewValues
        label="Hvilke land har du besøkt de siste 6 ukene? Velg opptil flere."
        filteredOptions={filteredOptions}
        isMultiSelect
        onChange={(event) => setValue(event?.target.value || "")}
        onToggleSelected={onToggleSelected}
        selectedOptions={selectedOptions}
        options={initialOptions}
        value={value}
      />
    </div>
  );
};

export default withDsExample(Example, { variant: "static" });

export const args = {
  index: 1,
  desc: "Du kan overstyre blant annet value, selectedOptions, filteredOptions.",
};
