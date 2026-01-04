import { Button } from '@renderer/components/ui/button';
import { ButtonGroup } from '@renderer/components/ui/button-group';
import { Input } from '@renderer/components/ui/input';
import { useSearchStore } from '@renderer/stores/search-store';
import { IconSearch } from '@tabler/icons-react';

export const DownloadHistorySearch = () => {
  const searchInput = useSearchStore((state) => state.downloadSearchInput);

  function handleSearchInput(input: string) {
    useSearchStore.setState({ downloadSearchInput: input });
    if (input.length === 0) {
      useSearchStore.setState({ downloadHistorySearchResults: [] });
    }
  }

  function handleSearch() {
    if (searchInput.length === 0) return;
    window.api.downloadHistorySearch(searchInput).then((searchResults) => {
      useSearchStore.setState({ downloadHistorySearchResults: searchResults });
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
        className="h-7 text-[10px] w-[260px] font-main placeholder:font-main"
        type="search"
        placeholder="Search in download history"
      />
      <Button variant={'outline'} className="h-7" onClick={handleSearch}>
        <IconSearch />
      </Button>
    </ButtonGroup>
  );
};
