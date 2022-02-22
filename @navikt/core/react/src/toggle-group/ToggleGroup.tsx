import cl from "classnames";
import React, {
  createContext,
  forwardRef,
  HTMLAttributes,
  useState,
} from "react";
import ToggleItem, { ToggleItemType } from "./ToggleItem";
import * as RadixToggleGroup from "@radix-ui/react-toggle-group";
import { Label, useId } from "..";

export interface ToggleGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "dir"> {
  /**
   * Toggles.Item elements
   */
  children: React.ReactNode;
  /**
   * Changes padding and font-size
   * @default "medium"
   */
  size?: "medium" | "small";
  /**
   * Controlled selected value
   */
  value?: string;
  /**
   * If not controlled, a default-value needs to be set
   */
  defaultValue?: string;
  /**
   * Returns elements that wants to be active
   */
  onChange: (value: string) => void;
  /**
   * Label describing ToggleGroup
   */
  label?: React.ReactNode;
}

interface ToggleGroupComponent
  extends React.ForwardRefExoticComponent<
    ToggleGroupProps & React.RefAttributes<HTMLDivElement>
  > {
  Item: ToggleItemType;
}

interface ToggleContextProps {
  size: "medium" | "small";
}

export const ToggleGroupContext = createContext<ToggleContextProps | null>(
  null
);

const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(
  (
    {
      className,
      children,
      onChange,
      size = "medium",
      label,
      value,
      defaultValue,
      id,
      "aria-describedby": desc,
      ...rest
    },
    ref
  ) => {
    const [groupValue, setGroupValue] = useState(defaultValue);
    const labelId = `toggle-group-label-${useId()}`;

    const handleValueChange = (v: string) => {
      if (v !== "") {
        setGroupValue(v);
        onChange?.(v);
      }
    };

    if (!value && !defaultValue) {
      console.error("ToggleGroup without value/defaultvalue is not allowed");
    }

    const describeBy = cl({
      [desc ?? ""]: !!desc,
      [labelId]: !!label,
    });

    if (!value && !defaultValue) {
      console.error("ToggleGroup needs either a value or defaultValue");
    }

    return (
      <ToggleGroupContext.Provider
        value={{
          size,
        }}
      >
        <div>
          {label && (
            <Label
              size={size}
              className="navds-toggle-group__label"
              id={labelId}
            >
              {label}
            </Label>
          )}
          <RadixToggleGroup.Root
            {...rest}
            onValueChange={handleValueChange}
            value={value ?? groupValue}
            defaultValue={defaultValue}
            ref={ref}
            className={cl(
              "navds-toggle-group",
              className,
              `navds-toggle-group--${size}`
            )}
            {...(describeBy && { "aria-describedby": describeBy })}
            role="toolbar"
            type="single"
          >
            {children}
          </RadixToggleGroup.Root>
        </div>
      </ToggleGroupContext.Provider>
    );
  }
) as ToggleGroupComponent;

ToggleGroup.Item = ToggleItem;

export default ToggleGroup;