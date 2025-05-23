import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const links = [
  { label: 'Home', href: '/' },
  { label: '| About', href: '/about' },
  { label: '| Projects', href: '/projects' },
  { label: '| Contact', href: '/contact' },
];

const TerminalNav = styled.nav`
  background-color: #1a1a1a;
  color: #00ff00;
  font-family: 'Courier New', Courier, monospace;
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 99%;
  z-index: 50;
`;

const CommandLine = styled.div`
  display: flex;
  gap: 15px;

  a {
    color: #00ff00;
    text-decoration: none;
    position: relative;

    &:hover {
      text-decoration: underline;
    }

    &.active::after {
      content: ' [active]';
      color: #ff0000;
    }
  }
`;

export default function Navbar() {
  const router = useRouter();

  return (
    <TerminalNav>
      <img
        src="/avatar.png"
        alt="Avatar"
        style={{
          height: 50,
          width: 50,
          borderRadius: '50%',
          objectFit: 'cover',
          marginRight: 12,
          border: '2px solid #00ff00',
          background: '#fff',
        }}
      />
      <CommandLine>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={router.pathname === link.href ? 'active' : ''}
          >
            {link.label}
          </Link>
        ))}
      </CommandLine>
    </TerminalNav>
  );
}