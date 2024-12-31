import React from 'react';
import Container from './container';
import Link from 'next/link';
import { buttonVariants } from '@platter/ui/components/button';


async function Header() {

  
  return (
    <nav className='sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all'>
      <Container>
        <div className='flex h-14 items-center justify-between border-zinc-200'>
          <Link href='/' className='flex z-40 font-semibold text-primary'>
            Platter
          </Link>

          <ul className='h-full flex items-center gap-6'>
            <li>
              <Link
                href='/menu'
                className={buttonVariants({
                  size: 'sm',
                  variant: 'ghost',
                })}
                >
                Menu
              </Link>
            </li>
            <li>
              <Link
                href='/contact'
                className={buttonVariants({
                  size: 'sm',
                  variant: 'ghost',
                })}
                >
                Contact
              </Link>
            </li>
          </ul>
                  
        </div>
      </Container>
    </nav>
  );
}

export default Header;