import { IAutoFill } from '@api/ApiAutofill';
import { Autocomplete, TextField } from '@mui/material';
import { QueryParam } from '@src/api/Fetcher';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import useDebounce from 'src/hooks/useDebounce';

export interface IValue {
  id: string;
  label: string;
  avatar?: string;
}

interface IExtraParams {
  artistIds?: string[];
}

interface IAutoCompleteProps<T extends IAutoFill> {
  placeHolder?: string;
  suggestionAPI: (data: QueryParam) => Promise<T[] | { data: T[] } | any>;
  extraParams?: IExtraParams;
  onChange?: (selected: IValue[] | IValue | string[] | string | null) => void;
  name: string;
  pageSize?: number | undefined;
  multiple?: boolean;
  freeSolo?: boolean;
  value?: IValue[] | IValue | string[] | string | null;
  className?: string;
  renderOption?: (props: any, option: IValue) => React.ReactNode;
  fallbackThumbnail?: string;
  color?: string;
  disabled?: boolean;
}

export default function AutoCompleteAutofill<T extends IAutoFill>({
  placeHolder,
  suggestionAPI,
  onChange,
  name,
  pageSize = 10,
  multiple,
  freeSolo,
  value,
  className,
  extraParams = {},
  renderOption,
  color,
  disabled = false,
}: IAutoCompleteProps<T>) {
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebounce(searchText);

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['autoCompleteSuggestions', debouncedSearch, name, extraParams],
    queryFn: async ({ pageParam = 1 }) => {
      const params: QueryParam = {
        page: pageParam,
        limit: pageSize,
        ...extraParams,
      };

      if (debouncedSearch) {
        params.search = debouncedSearch;
      }

      const result = await suggestionAPI(params);
      // result can be an array or an object with `data` property (IDataWithMeta)
      const items = Array.isArray(result)
        ? result
        : ((result as any)?.data ?? []);
      return {
        data: items,
        nextPage: items.length === pageSize ? pageParam + 1 : undefined,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    gcTime: 0,
  });

  // Convert id - name to id - label
  const suggestions = useMemo<IValue[]>(() => {
    if (!data) return [];

    const allSuggestions = data.pages.flatMap((page) => {
      return page.data.map((item: T) => ({
        label: item?.name ?? '',
        id: item?.id ?? '',
        avatar: item?.avatar,
        ...item,
      }));
    });

    // Remove duplicate by id
    const uniqueMap = new Map<string, IValue>();
    allSuggestions.forEach((item) => {
      uniqueMap.set(item.id, item);
    });

    return Array.from(uniqueMap.values());
  }, [data]);

  const handleScroll = (event: React.UIEvent<HTMLUListElement>) => {
    const listboxNode = event.currentTarget;
    const isAtBottom =
      Math.abs(
        listboxNode.scrollHeight -
          listboxNode.scrollTop -
          listboxNode.clientHeight
      ) < 1;

    if (isAtBottom && hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <Autocomplete
      className={`autocomplete ${className} max-h-[250px] overflow-y-auto pt-0.5`}
      multiple={multiple}
      freeSolo={freeSolo}
      options={suggestions}
      disabled={disabled}
      isOptionEqualToValue={(option: any, value: any) => {
        if (!option || !value) return false;
        if (typeof option === 'string' && typeof value === 'string')
          return option === value;
        if (typeof option === 'string') return option === (value as any)?.id;
        if (typeof value === 'string') return (option as any)?.id === value;
        return (option as IValue).id === (value as IValue).id;
      }}
      getOptionLabel={(option: any) => {
        if (!option) return '';
        return typeof option === 'string'
          ? option
          : option.label || option.id || '';
      }}
      value={value as any}
      filterOptions={(options) => options}
      onInputChange={(_event, value, reason) => {
        if (reason === 'input' || reason === 'clear') {
          setSearchText(value);
        }
      }}
      sx={{
        '& .MuiAutocomplete-endAdornment .MuiSvgIcon-root': {
          color: color || 'inherit',
        },
      }}
      slotProps={{
        listbox: {
          onScroll: handleScroll,
          style: { maxHeight: 200, overflowY: 'auto' },
        } as any,
      }}
      onChange={(_event, value) => {
        if (onChange) {
          if (multiple) {
            onChange(value as IValue[]);
          } else {
            onChange(value as IValue);
          }
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          sx={{
            '& .MuiInputBase-input': {
              color: color || 'inherit',
            },
          }}
          placeholder={placeHolder || 'Tìm kiếm...'}
        />
      )}
      {...(renderOption && { renderOption })}
    />
  );
}
