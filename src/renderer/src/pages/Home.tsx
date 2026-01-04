import { HomeHeader, UrlHistory } from './components/home';

const Home = () => {
  return (
    <div className="h-full overflow-y-auto">
      <HomeHeader />
      <div className="relative z-0 font-main">
        <UrlHistory />
      </div>
    </div>
  );
};

export default Home;
