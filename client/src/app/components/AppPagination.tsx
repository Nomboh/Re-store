import { Box, Typography, Pagination } from "@mui/material";
import { Metadata } from "../models/pagination";

type Props = {
  metaData: Metadata;
  onPageChange: (page: number) => void;
};

function AppPagination({ metaData, onPageChange }: Props) {
  const { totalCount, totalPages, pageSize, currentPage } = metaData;
  return (
    <Box display={"flex"} justifyContent="space-between" alignItems={"center"}>
      <Typography>
        Displaying {(currentPage - 1) * pageSize + 1} -{" "}
        {currentPage * pageSize > totalCount
          ? totalCount
          : currentPage * pageSize}{" "}
        of {totalCount} items
      </Typography>
      <Pagination
        color="secondary"
        size="large"
        count={totalPages}
        page={currentPage}
        onChange={(e, page) => onPageChange(page)}
      />
    </Box>
  );
}

export default AppPagination;
