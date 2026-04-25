import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

export default function Layout() {
  return (
      <>
        <NavBar />
        <main className="app-shell">
          <Outlet />
        </main>
      </>
  );
}