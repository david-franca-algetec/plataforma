import React, { FC, useState } from "react";
import { HStack, IconButton, Input, Menu, MenuButton, MenuList, VStack } from "@chakra-ui/react";
import { IconCheck, IconFilter, IconX } from "@tabler/icons";
import type { Column } from "@tanstack/react-table";

export const ColumnFilter: FC<{ column: Column<any, any> }> = ({ column }) => {
  const [state, setState] = useState(null as null | { value: any });

  if (!column.getCanFilter()) {
    return null;
  }

  const open = () =>
    setState({
      value: column.getFilterValue(),
    });

  const close = () => setState(null);

  const change = (value: any) => setState({ value });

  const clear = () => {
    column.setFilterValue(undefined);
    close();
  };

  const save = () => {
    if (!state) return;
    column.setFilterValue(state.value);
    close();
  };

  const renderFilterElement = () => {
    const FilterComponent = (column.columnDef?.meta as any)?.filterElement;

    if (!FilterComponent && !!state) {
      return (
        <Input
          borderRadius="md"
          size="sm"
          autoComplete="off"
          value={state.value}
          onChange={(e) => change(e.target.value)}
        />
      );
    }

    return <FilterComponent value={state?.value} onChange={(e: any) => change(e.target.value)} />;
  };

  return (
    <Menu isOpen={!!state} onClose={close}>
      <MenuButton
        onClick={open}
        as={IconButton}
        aria-label="Options"
        icon={<IconFilter size="16" />}
        variant="ghost"
        size="xs"
      />
      <MenuList p="2">
        {!!state && (
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
