import { MainNavbar } from "../components/MainNavbar";
import { Footer } from "../components/Footer";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <MainNavbar />
      <main className="main-layout-content">{children}</main>
      <Footer />
    </>
  );
};

export default MainLayout;
