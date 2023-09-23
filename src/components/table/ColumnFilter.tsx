import React, { ChangeEvent, ComponentType, useState } from "react";
import { HStack, IconButton, Input, Menu, MenuButton, MenuList, VStack } from "@chakra-ui/react";
import { IconCheck, IconFilter, IconX } from "@tabler/icons";
import type { Column } from "@tanstack/react-table";

interface ColumnDefMeta {
  filterElement?: ComponentType<{
    value?: string | number;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }>;
}

interface ColumnDef {
  meta?: ColumnDefMeta;
}

type Props<D extends object> = {
  column: Column<D>;
};

export const ColumnFilter = <D extends object>({ column }: Props<D>) => {
  const [state, setState] = useState(null as null | { value: string | number });

  /**
   * If the column is not filterable, return null.
   * This will prevent the filter button from being rendered.
   * @returns null if the column is not filterable.
   */
  if (!column.getCanFilter()) {
    return null;
  }

  /**
   * Opens the column filter and sets the initial value to the current filter value.
   */
  const open = () =>
    setState({
      value: column.getFilterValue() as string | number,
    });

  /**
   * Closes the column filter.
   */
  const close = () => setState(null);

  /**
   * Updates the state with the new value from the input element.
   * @param e - The change event from the input element.
   */
  const change = (e: ChangeEvent<HTMLInputElement>) => setState({ value: e.target.value });

  /**
   * Clears the filter value of the column and closes the filter dropdown.
   */
  const clear = () => {
    column.setFilterValue(undefined);
    close();
  };

  /**
   * Saves the current filter value to the column and closes the filter modal.
   */
  const save = () => {
    if (!state) return;
    column.setFilterValue(state.value);
    close();
  };

  /**
   * Renders the filter element for the column.
   * If a custom filter element is provided, it will be used.
   * Otherwise, it will render a default input element.
   * @returns The filter element to be rendered.
   */
  const renderFilterElement = () => {
    const FilterComponent = (column.columnDef?.meta as ColumnDef["meta"])?.filterElement;

    if (!FilterComponent && state) {
      return <Input borderRadius="md" size="sm" autoComplete="off" value={state.value} onChange={change} />;
    }
    if (FilterComponent) {
      return <FilterComponent value={state?.value} onChange={change} />;
    }
  };

  return (
    <Menu isOpen={Boolean(state)} onClose={close}>
      <MenuButton
        onClick={open}
        as={IconButton}
        aria-label="Options"
        icon={<IconFilter size="16" />}
        variant="ghost"
        size="xs"
      />
      <MenuList p="2">
        {Boolean(state) && (
          <VStack align="flex-start">
            {renderFilterElement()}
            <HStack spacing="1">
              <IconButton aria-label="Clear" size="sm" colorScheme="red" onClick={clear} icon={<IconX size={18} />} />
              <IconButton
                aria-label="Save"
                size="sm"
                onClick={save}
                colorScheme="green"
                icon={<IconCheck size={18} />}
              />
            </HStack>
          </VStack>
        )}
      </MenuList>
    </Menu>
  );
};
