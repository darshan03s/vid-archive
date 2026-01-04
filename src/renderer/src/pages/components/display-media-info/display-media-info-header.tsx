import UserUrlInput from '@renderer/components/user-url-input';

export const DisplayMediaInfoHeader = () => {
  return (
    <div className="sticky left-0 top-0 z-50">
      <header className="p-3 sticky top-0 left-0 z-50 bg-background/60 backdrop-blur-md">
        <UserUrlInput showRefetch={true} />
      </header>
    </div>
  );
};
