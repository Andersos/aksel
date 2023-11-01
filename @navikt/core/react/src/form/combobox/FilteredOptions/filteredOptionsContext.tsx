import React, {
  useState,
  useMemo,
  createContext,
  useContext,
  useCallback,
  SetStateAction,
} from "react";
import cl from "clsx";
import { useCustomOptionsContext } from "../customOptionsContext";
import { useInputContext } from "../Input/inputContext";
import usePrevious from "../../../util/usePrevious";
import { useClientLayoutEffect } from "../../../util";
import filteredOptionsUtils from "./filtered-options-util";
import useVirtualFocus, { VirtualFocusType } from "./useVirtualFocus";
import { ComboboxProps } from "../types";

type FilteredOptionsProps = {
  children: any;
  value: Pick<
    ComboboxProps,
    | "allowNewValues"
    | "filteredOptions"
    | "isListOpen"
    | "isLoading"
    | "options"
  >;
};

type FilteredOptionsContextType = {
  activeDecendantId?: string;
  allowNewValues?: boolean;
  ariaDescribedBy?: string;
  setFilteredOptionsRef: React.Dispatch<
    React.SetStateAction<HTMLUListElement | null>
  >;
  isListOpen: boolean;
  isLoading?: boolean;
  filteredOptions: string[];
  isMouseLastUsedInputDevice: boolean;
  setIsMouseLastUsedInputDevice: React.Dispatch<SetStateAction<boolean>>;
  isValueNew: boolean;
  toggleIsListOpen: (newState?: boolean) => void;
  currentOption?: string;
  shouldAutocomplete?: boolean;
  virtualFocus: VirtualFocusType;
};
const FilteredOptionsContext = createContext<FilteredOptionsContextType>(
  {} as FilteredOptionsContextType
);

export const FilteredOptionsProvider = ({
  children,
  value: props,
}: FilteredOptionsProps) => {
  const {
    allowNewValues,
    filteredOptions: externalFilteredOptions,
    isListOpen: isExternalListOpen,
    isLoading,
    options,
  } = props;
  const [filteredOptionsRef, setFilteredOptionsRef] =
    useState<HTMLUListElement | null>(null);
  const virtualFocus = useVirtualFocus(filteredOptionsRef);
  const {
    inputProps: { "aria-describedby": partialAriaDescribedBy, id },
    value,
    searchTerm,
    setValue,
    setSearchTerm,
    shouldAutocomplete,
  } = useInputContext();

  const [isInternalListOpen, setInternalListOpen] = useState(false);
  const { customOptions } = useCustomOptionsContext();

  const filteredOptions = useMemo(() => {
    if (externalFilteredOptions) {
      return externalFilteredOptions;
    }
    const opts = [...customOptions, ...options];
    return filteredOptionsUtils.getMatchingValuesFromList(searchTerm, opts);
  }, [customOptions, externalFilteredOptions, options, searchTerm]);

  const previousSearchTerm = usePrevious(searchTerm);

  const [isMouseLastUsedInputDevice, setIsMouseLastUsedInputDevice] =
    useState(false);

  const filteredOptionsMap = useMemo(
    () =>
      options.reduce(
        (map, _option) => ({
          ...map,
          [filteredOptionsUtils.getOptionId(id, _option)]: _option,
        }),
        {
          [filteredOptionsUtils.getAddNewOptionId(id)]: allowNewValues
            ? value
            : undefined,
        }
      ),
    [allowNewValues, id, options, value]
  );

  useClientLayoutEffect(() => {
    if (
      shouldAutocomplete &&
      filteredOptionsUtils.normalizeText(searchTerm) !== "" &&
      (previousSearchTerm?.length || 0) < searchTerm.length &&
      filteredOptions.length > 0
    ) {
      setValue(
        `${searchTerm}${filteredOptions[0].substring(searchTerm.length)}`
      );
      setSearchTerm(searchTerm);
    }
  }, [
    filteredOptions,
    previousSearchTerm,
    searchTerm,
    setSearchTerm,
    setValue,
    shouldAutocomplete,
  ]);

  const isListOpen = useMemo(() => {
    return isExternalListOpen ?? isInternalListOpen;
  }, [isExternalListOpen, isInternalListOpen]);

  const toggleIsListOpen = useCallback(
    (newState?: boolean) => {
      virtualFocus.moveFocusToTop();
      setInternalListOpen((oldState) => newState ?? !oldState);
    },
    [virtualFocus]
  );

  const isValueNew = useMemo(
    () =>
      Boolean(value) &&
      !filteredOptionsMap[filteredOptionsUtils.getOptionId(id, value)],
    [filteredOptionsMap, id, value]
  );

  const ariaDescribedBy = useMemo(() => {
    let activeOption;
    if (!isLoading && filteredOptions.length === 0) {
      activeOption = filteredOptionsUtils.getNoHitsId(id);
    } else if ((value && value !== "") || isLoading) {
      if (shouldAutocomplete && filteredOptions[0]) {
        activeOption = filteredOptionsUtils.getOptionId(id, filteredOptions[0]);
      } else if (isListOpen && isLoading) {
        activeOption = filteredOptionsUtils.getIsLoadingId(id);
      }
    }
    return cl(activeOption, partialAriaDescribedBy) || undefined;
  }, [
    isListOpen,
    isLoading,
    value,
    partialAriaDescribedBy,
    shouldAutocomplete,
    filteredOptions,
    id,
  ]);

  const currentOption = useMemo(
    () =>
      filteredOptionsMap[virtualFocus.activeElement?.getAttribute("id") || -1],
    [filteredOptionsMap, virtualFocus]
  );

  const activeDecendantId = useMemo(
    () => virtualFocus.activeElement?.getAttribute("id") || undefined,
    [virtualFocus.activeElement]
  );

  const filteredOptionsState = {
    activeDecendantId,
    allowNewValues,
    setFilteredOptionsRef,
    shouldAutocomplete,
    isListOpen,
    isLoading,
    filteredOptions,
    isMouseLastUsedInputDevice,
    setIsMouseLastUsedInputDevice,
    isValueNew,
    toggleIsListOpen,
    currentOption,
    virtualFocus,
    ariaDescribedBy,
  };

  return (
    <FilteredOptionsContext.Provider value={filteredOptionsState}>
      {children}
    </FilteredOptionsContext.Provider>
  );
};

export const useFilteredOptionsContext = () => {
  const context = useContext(FilteredOptionsContext);
  if (!context) {
    throw new Error(
      "useFilteredOptionsContext must be used within a FilteredOptionsProvider"
    );
  }
  return context;
};
