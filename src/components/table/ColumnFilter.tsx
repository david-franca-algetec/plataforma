import React, { ChangeEvent, FC, useState } from "react";
import { HStack, IconButton, Input, Menu, MenuButton, MenuList, VStack } from "@chakra-ui/react";
import { IconCheck, IconFilter, IconX } from "@tabler/icons";
import type { Column } from "@tanstack/react-table";

export const ColumnFilter: FC<{ column: Column<any, any> }> = ({ column }) => {
  const [state, setState] = useState(null as null | { value: any });

  if (!column.getCanFilter()) {
    return null;
  }

  /**
   * Opens the column filter and sets the initial value to the current filter value.
   */
  const open = () =>
    setState({
      value: column.getFilterValue(),
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
    const FilterComponent = (column.columnDef?.meta as any)?.filterElement;

    if (!FilterComponent && state) {
      return <Input borderRadius="md" size="sm" autoComplete="off" value={state.value} onChange={change} />;
    }

    return <FilterComponent value={state?.value} onChange={change} />;
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
