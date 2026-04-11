import { IAutoFill, IParamsAutofill } from '@api/ApiAutofill';
import { MenuItem, OutlinedInput } from '@mui/material';
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

interface ISelectMultiple {
  placeholder?: string;
  selectProps?: SelectProps<string[]>;
  suggestionAPI: (data: IParamsAutofill) => Promise<IAutoFill[]>;
  onChange?: (selected: string[]) => void;
  name: string; // Make query key unique
  noValueStyle?: string; // Style text when nothing selected
}

export default function SelectMultipleAutofill(props: ISelectMultiple) {
  const [selected, setSelected] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [params, setParams] = useState({
    name: '',
    page: 0,
    pageSize: 10,
  });
  const [suggestions, setSuggestions] = useState<
    Array<{ name: string; id: string }>
  >([]);

  const getDataSuggestions = async (): Promise<IAutoFill[]> => {
    const data = await props.suggestionAPI(params);
    if (data.length < params.pageSize) {
      setHasMore(false);
    }
    return data;
  };

  const { data: newData } = useQuery({
    queryKey: ['listSuggestions', params, props.name],
    queryFn: getDataSuggestions,
    enabled: !!params.name || params.name === '',
    placeholderData: keepPreviousData,
  });

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelected(typeof value === 'string' ? value.split(',') : value);
    if (props.onChange) {
      props.onChange(typeof value === 'string' ? value.split(',') : value);
    }
  };

  const getNameById = (id: string) => {
    const item = suggestions.find((s) => s.id === id);
    return item?.name || id;
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const listboxNode = event.currentTarget;
    const scrollTop = listboxNode.scrollTop;
    const scrollHeight = listboxNode.scrollHeight;
    const clientHeight = listboxNode.clientHeight;

    if (scrollHeight - scrollTop === clientHeight && hasMore) {
      setParams((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  };

  useEffect(() => {
    if (newData) {
      setSuggestions((prevSuggestions) => {
        // When page = 0 (search or init value), reset suggestions
        if (params.page === 0) {
          return newData.map((item) => ({
            name: item?.name ?? '',
            id: item?.id ?? '',
          }));
        }

        // When load more page, append new data to previous data and remove duplicate
        const uniqueSuggestions = new Map(
          prevSuggestions.map((item) => [item.id, item])
        );

        newData.forEach((item) => {
          const suggestion = {
            name: item?.name ?? '',
            id: item?.id ?? '',
          };
          uniqueSuggestions.set(item?.id || '', suggestion); // Set will remove duplicate items based on id
        });

        return Array.from(uniqueSuggestions.values());
      });
    }
  }, [newData, params.page]);

  return (
    <Select
      {...props.selectProps}
      displayEmpty
      value={selected}
      onChange={handleChange}
      multiple
      input={<OutlinedInput />}
      renderValue={(selected) => (
        <div className="flex flex-wrap gap-1">
          {selected.length > 0 ? (
            selected.map((val: string, index: number) => (
              <span className="text-sm" key={index}>
                {getNameById(val)}
                {index < selected.length - 1 ? ', ' : ''}
              </span>
            ))
          ) : (
            <span
              className={clsx(
                'text-[#242728] font-semibold',
                props.noValueStyle
              )}
            >
              {props.placeholder || '-'}
            </span>
          )}
        </div>
      )}
      MenuProps={{
        PaperProps: {
          style: {
            maxHeight: 250,
          },
          onScroll: handleScroll,
        },
      }}
      inputProps={{ 'aria-label': 'Without label' }}
    >
      <MenuItem disabled value="">
        <span>{props.placeholder || '-'}</span>
      </MenuItem>
      {suggestions?.map((item) => (
        <MenuItem key={item?.id} value={item?.id}>
          {item?.name}
        </MenuItem>
      ))}
    </Select>
  );
}
