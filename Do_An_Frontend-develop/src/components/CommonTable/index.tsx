import {
  Box,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import clsx from 'clsx';
import { Database } from 'lucide-react';
import { useEffect, useMemo } from 'react';

/**
 * Column definition for CommonTable
 */
export interface CommonTableColumn<T = any> {
  field: string;
  headerName: string;
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  align?: 'left' | 'center' | 'right';
  headerAlign?: 'left' | 'center' | 'right';
  sortable?: boolean;
  renderCell?: (params: {
    row: T;
    value: any;
    index: number;
  }) => React.ReactNode;
  valueGetter?: (row: T) => any;
  cellClassName?: string;
  headerClassName?: string;
  sticky?: boolean;
}

/**
 * Props for CommonTable component
 */
export interface CommonTableProps<T = any> {
  columns: CommonTableColumn<T>[];
  rows: T[];
  className?: string;
  currentPage: number;
  totalItems?: number;
  rowsPerPage: number;
  ordinalColumn?: boolean;
  onPageChange: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  filterValues?: Record<string, any>;
  sortModel?: { field: string; sort: 'asc' | 'desc' } | null;
  onSortChange?: (field: string, sort: 'asc' | 'desc' | null) => void;
  onRowClick?: (row: T, index: number) => void;
  onRowDoubleClick?: (row: T, index: number) => void;
  loading?: boolean;
  getRowId?: (row: T) => string | number;
  emptyText?: string;
  rowsPerPageOptions?: number[];
  stickyHeader?: boolean;
  maxHeight?: number | string;
  disablePagination?: boolean;
}

/**
 * CommonTable - Reusable table component using MUI Table
 *
 * @example
 * ```tsx
 * <CommonTable
 *   columns={[
 *     { field: 'name', headerName: 'Tên', width: 200 },
 *     { field: 'age', headerName: 'Tuổi', width: 100, align: 'center' }
 *   ]}
 *   rows={data}
 *   currentPage={page}
 *   totalItems={total}
 *   rowsPerPage={10}
 *   onPageChange={setPage}
 * />
 * ```
 */
export default function CommonTable<T = any>({
  columns,
  rows,
  className,
  totalItems,
  currentPage,
  ordinalColumn = false,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  filterValues,
  sortModel,
  onSortChange,
  onRowClick,
  onRowDoubleClick,
  loading = false,
  getRowId,
  emptyText = 'Dữ liệu trống',
  rowsPerPageOptions = [5, 10, 25, 50, 100],
  stickyHeader = true,
  maxHeight = 'calc(100vh - 300px)',
  disablePagination = false,
}: CommonTableProps<T>) {
  const dataColumns: CommonTableColumn<T>[] = useMemo(() => {
    if (ordinalColumn) {
      return [
        {
          field: '__ordinal_number__',
          headerName: 'STT',
          width: 60,
          sortable: false,
          align: 'center',
          headerAlign: 'center',
          renderCell: ({ index }) => (
            <div>{(currentPage - 1) * rowsPerPage + index + 1}</div>
          ),
        },
        ...columns,
      ];
    }
    return columns;
  }, [columns, ordinalColumn, currentPage, rowsPerPage]);

  useEffect(() => {
    // Only reset to page 0 if filterValues actually exists and changes
    // Skip on initial mount when filterValues is undefined
    if (filterValues !== undefined) {
      onPageChange(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValues]);

  const handleSort = (field: string, sortable?: boolean) => {
    if (!sortable || !onSortChange) return;

    let newSort: 'asc' | 'desc' | null = 'asc';

    if (sortModel?.field === field) {
      if (sortModel.sort === 'asc') {
        newSort = 'desc';
      } else if (sortModel.sort === 'desc') {
        newSort = null;
      }
    }

    onSortChange(field, newSort);
  };

  const getCellValue = (row: T, column: CommonTableColumn<T>) => {
    // Skip getting value for ordinal column as it uses renderCell
    if (column.field === '__ordinal_number__') {
      return null;
    }
    if (column.valueGetter) {
      return column.valueGetter(row);
    }
    return (row as any)[column.field];
  };

  const getRowIdValue = (row: T, index: number): string | number => {
    if (getRowId) {
      return getRowId(row);
    }
    return (row as any).id || index;
  };

  return (
    <div className={clsx('flex flex-col w-full', className)}>
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: maxHeight,
          border: '1px solid #DCDEE0',
          borderRadius: '8px',
          overflowX: 'auto',
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#e6e6e6',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#b3b3b3',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#999',
          },
        }}
      >
        <Table
          stickyHeader={stickyHeader}
          sx={{ tableLayout: 'fixed', minWidth: '100%' }}
        >
          <TableHead>
            <TableRow>
              {dataColumns.map((column, colIndex) => (
                <TableCell
                  key={`${column.field}-${colIndex}`}
                  align={column.headerAlign || column.align || 'left'}
                  className={clsx(column.headerClassName)}
                  sx={{
                    width: column.width,
                    minWidth: column.minWidth || column.width,
                    maxWidth: column.maxWidth,
                    backgroundColor: '#F2F2F3',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    color: '#242728',
                    whiteSpace: 'nowrap',
                    lineHeight: 'normal',
                    wordWrap: 'break-word',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    flexShrink: 0,
                    ...(column.sticky && {
                      position: 'sticky',
                      right: 0,
                      zIndex: 3,
                    }),
                  }}
                >
                  {column.sortable && onSortChange ? (
                    <TableSortLabel
                      active={sortModel?.field === column.field}
                      direction={
                        sortModel?.field === column.field
                          ? sortModel.sort
                          : 'asc'
                      }
                      onClick={() => handleSort(column.field, column.sortable)}
                    >
                      {column.headerName}
                    </TableSortLabel>
                  ) : (
                    column.headerName
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={dataColumns.length}
                  align="center"
                  sx={{ py: 3 }}
                >
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={dataColumns.length}
                  align="center"
                  sx={{ py: 3 }}
                >
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <Database />
                    <p>{emptyText}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, rowIndex) => (
                <TableRow
                  key={getRowIdValue(row, rowIndex)}
                  hover
                  onClick={() => onRowClick?.(row, rowIndex)}
                  onDoubleClick={() => onRowDoubleClick?.(row, rowIndex)}
                  sx={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    '&:hover td': {
                      backgroundColor: '#F5F5F5',
                    },
                    '&:hover .sticky-cell': {
                      backgroundColor: '#F5F5F5',
                    },
                  }}
                >
                  {dataColumns.map((column, colIndex) => {
                    const value = getCellValue(row, column);
                    return (
                      <TableCell
                        key={`${column.field}-${colIndex}`}
                        align={column.align || 'left'}
                        className={clsx(
                          column.cellClassName,
                          column.sticky && 'sticky-cell'
                        )}
                        sx={{
                          width: column.width,
                          minWidth: column.minWidth || column.width,
                          maxWidth: column.maxWidth,
                          py: '15px',
                          whiteSpace: 'nowrap',
                          lineHeight: '1.3rem',
                          wordWrap: 'break-word',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          flexShrink: 0,
                          ...(column.sticky && {
                            position: 'sticky',
                            right: 0,
                            backgroundColor: '#fff',
                            zIndex: 2,
                          }),
                        }}
                      >
                        {column.renderCell
                          ? column.renderCell({ row, value, index: rowIndex })
                          : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!disablePagination && (
        <div className="flex items-center justify-between mt-2">
          <TablePagination
            count={totalItems || -1}
            page={Number(currentPage) - 1}
            onPageChange={(_, page) => onPageChange(page)}
            rowsPerPage={rowsPerPage || 10}
            onRowsPerPageChange={(e) => {
              onRowsPerPageChange?.(Number(e.target.value));
            }}
            rowsPerPageOptions={rowsPerPageOptions}
            labelRowsPerPage={'Số bản ghi trên trang'}
            labelDisplayedRows={({ from, to, count }) =>
              `${from} - ${to} trong ${count !== -1 ? count : `hơn ${to}`} bản ghi`
            }
            component={Box}
            ActionsComponent={() => null}
            sx={{
              '& .MuiTablePagination-select': {
                backgroundColor: '#F2F2F3',
                border: '1px solid #DCDEE0',
                borderRadius: '6px',
              },
            }}
          />
          <Pagination
            count={Math.ceil((totalItems || 0) / (rowsPerPage || 1))}
            page={currentPage}
            onChange={(_, page) => onPageChange(page)}
            color="primary"
          />
        </div>
      )}
    </div>
  );
}
