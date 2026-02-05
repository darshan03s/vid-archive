import { Button } from '@renderer/components/ui/button';
import { ButtonGroup } from '@renderer/components/ui/button-group';
import { Input } from '@renderer/components/ui/input';
import { useSearchStore } from '@renderer/stores/search-store';
import { IconSearch } from '@tabler/icons-react';

export const UrlHistorySearch = () => {
  const searchInput = useSearchStore((state) => state.urlSearchInput);

  function handleSearchInput(input: string) {
    useSearchStore.setState({ urlSearchInput: input });
    if (input.length === 0) {
      useSearchStore.setState({ urlSearchResults: [] });
    }
  }

  function handleSearch() {
    if (searchInput.length === 0) return;
    window.api.urlHistorySearch(searchInput).then((searchResults) => {
      useSearchStore.setState({ urlSearchResults: searchResults });
    });
  }

  return (
    <ButtonGroup>
      <Input
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
        onChange={(e) => handleSearchInput(e.target.value)}
        className="h-7 text-[10px] w-[260px] lg:w-[400px] font-main placeholder:font-main"
        type="search"
        placeholder="Search in url history"
      />
      <Button variant={'outline'} className="h-7" onClick={handleSearch}>
        <IconSearch />
      </Button>
    </ButtonGroup>
  );
};
