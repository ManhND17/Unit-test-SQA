import {
  Autocomplete,
  TextField,
  AutocompleteProps,
  FilterOptionsState,
} from '@mui/material';
import clsx from 'clsx';
import { useMemo } from 'react';

export interface IOption {
  name: string;
  id: string;
}

interface ICommonAutoCompleteProps extends Omit<
  AutocompleteProps<IOption, false, false, false>,
  'renderInput' | 'options' | 'onChange'
> {
  options: IOption[];
  value?: IOption | null;
  onChange?: (value: IOption | null) => void;
  placeholder?: string;
  label?: string;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  disabled?: boolean;
  className?: string;
  emptyMessage?: string;
  isLoading?: boolean;
  noOptionsText?: string;
}

const CommonAutoComplete = ({
  options,
  value,
  onChange,
  placeholder = 'Tìm kiếm...',
  label,
  error,
  helperText,
  fullWidth = true,
  size = 'medium',
  disabled = false,
  className,
  emptyMessage = 'Không có dữ liệu',
  isLoading = false,
  noOptionsText,
  ...props
}: ICommonAutoCompleteProps) => {
  const memoizedOptions = useMemo(() => options, [options]);
  const filterOptions = useMemo(
    () => (options: IOption[], state: FilterOptionsState<IOption>) => {
      const filtered = options.filter((option) =>
        option.name.toLowerCase().includes(state.inputValue.toLowerCase())
      );
      return filtered;
    },
    []
  );

  return (
    <Autocomplete<IOption, false, false, false>
      {...props}
      options={memoizedOptions}
      getOptionLabel={(option) => option.name}
      value={value ?? null}
      onChange={(_, newValue) => {
        onChange?.(newValue);
      }}
      loading={isLoading}
      disabled={disabled}
      noOptionsText={
        noOptionsText || (isLoading ? 'Đang tải...' : emptyMessage)
      }
      filterOptions={filterOptions}
      isOptionEqualToValue={(option, val) => option.id === val?.id}
      clearOnEscape
      slotProps={{
        paper: {
          sx: {
            marginTop: '4px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
            '& .MuiAutocomplete-option': {
              fontSize: '14px',
              padding: '10px 12px',
              transition: 'all 0.2s ease',
              position: 'relative',
              '&[aria-selected="true"]': {
                backgroundColor: '#E3F2FD !important',
                color: '#1976D2',
                fontWeight: 600,
                borderLeft: '3px solid #1976D2',
                paddingLeft: '9px',
                '&::after': {
                  content: '"✓"',
                  position: 'absolute',
                  right: '12px',
                  color: '#1976D2',
                  fontWeight: 'bold',
                  fontSize: '16px',
                },
              },
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
              '&[aria-selected="true"]:hover': {
                backgroundColor: '#BBDEFB !important',
              },
            },
            '& .MuiAutocomplete-loading': {
              fontSize: '14px',
              color: '#999',
            },
            '& .MuiAutocomplete-noOptions': {
              fontSize: '14px',
              color: '#999',
              padding: '10px 12px',
            },
            maxHeight: '250px',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#c0c0c0',
              borderRadius: '3px',
              '&:hover': {
                background: '#a0a0a0',
              },
            },
          },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          size={size}
          fullWidth={fullWidth}
          className={clsx('common-autocomplete', className)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '&:hover': {
                borderColor: 'rgba(0, 0, 0, 0.23)',
              },
              '&.Mui-focused': {
                boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.1)',
              },
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(0, 0, 0, 0.12)',
            },
          }}
        />
      )}
    />
  );
};

export default CommonAutoComplete;
