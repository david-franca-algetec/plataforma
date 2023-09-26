import { FC, useCallback } from "react";
import { usePagination } from "@refinedev/chakra-ui";
import { Box, Button, HStack, IconButton } from "@chakra-ui/react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons";

type PaginationProps = {
  current: number;
  pageCount: number;
  setCurrent: (page: number) => void;
};

export const Pagination: FC<PaginationProps> = ({ current, pageCount, setCurrent }) => {
  const pagination = usePagination({
    current,
    pageCount,
  });

  /**
   * Increases the current page number by 1 and updates the state.
   */
  const addPage = useCallback(() => {
    setCurrent(current + 1);
  }, [current, setCurrent]);

  /**
   * Subtracts 1 from the current page and updates the state.
   */
  const subtractPage = useCallback(() => {
    setCurrent(current - 1);
  }, [current, setCurrent]);

  /**
   * Callback function that updates the current page number.
   * @param page - The new page number to set as current.
   */
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrent(page);
    },
    [setCurrent]
  );

  return (
    <Box display="flex" justifyContent="flex-end">
      <HStack my="3" spacing="1">
        {pagination?.prev && (
          <IconButton aria-label="previous page" onClick={subtractPage} disabled={!pagination?.prev} variant="outline">
            <IconChevronLeft size="18" />
          </IconButton>
        )}

        {pagination?.items.map((page) => {
          if (typeof page === "string") return <span key={page}>...</span>;

          return (
            <Button key={page} onClick={() => handlePageChange(page)} variant={page === current ? "solid" : "outline"}>
              {page}
            </Button>
          );
        })}
        {pagination?.next && (
          <IconButton aria-label="next page" onClick={addPage} variant="outline">
            <IconChevronRight size="18" />
          </IconButton>
        )}
      </HStack>
    </Box>
  );
};
