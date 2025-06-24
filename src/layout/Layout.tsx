import { LayoutContainer } from './Layout.styled';

import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <LayoutContainer>
      <Outlet />
    </LayoutContainer>
  );
}
