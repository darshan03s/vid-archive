import UserUrlInput from './user-url-input';

const Header = () => {
  return (
    <header className="bg-secondary text-secondary-foreground font-inter min-h-6 p-4">
      <UserUrlInput showRefetch={false} />
    </header>
  );
};

export default Header;
