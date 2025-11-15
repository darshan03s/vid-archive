import UserUrlInput from './user-url-input';

const Header = () => {
  return (
    <header className="bg-secondary text-secondary-foreground font-inter p-3">
      <UserUrlInput showRefetch={false} />
    </header>
  );
};

export default Header;
