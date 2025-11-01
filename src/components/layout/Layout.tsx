import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  variant?: 'default' | 'admin';
  showNavbar?: boolean;
  showFooter?: boolean;
  navbarProps?: any;
  footerProps?: any;
}

export default function Layout({
  children,
  variant = 'default',
  showNavbar = true,
  showFooter = true,
  navbarProps = {},
  footerProps = {},
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && (
        <Navbar variant={variant} {...navbarProps} />
      )}
      <main className="flex-1">
        {children}
      </main>
      {showFooter && (
        <Footer variant={variant} {...footerProps} />
      )}
    </div>
  );
}
