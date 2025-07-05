import { NavLink } from 'react-router';
import logo from '../assets/images/logo/todos-logo.webp';
import { FaGithubSquare, FaLinkedin } from "react-icons/fa";
import { useEffect, useRef } from 'react';
import useAuth from '../hooks/useAuth';
function Footer() {
  const { setFooterHeight } = useAuth();
  const footerRef = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    const calcAndSetFooterH = () => {
      if (footerRef.current) setFooterHeight(footerRef.current.offsetHeight);
    }

    calcAndSetFooterH();

    window.addEventListener("resize", calcAndSetFooterH);

    return () => {
      window.removeEventListener("resize", calcAndSetFooterH);
    };
  }, [setFooterHeight]);
  return (
    <footer ref={footerRef} className='px-5 py-12 xl:w-2/3 md:mx-auto flex flex-col gap-7 md:gap-0 items-center md:items-start md:flex-row md:justify-between' role="contentinfo">
      <figure>
        <img className='w-48' src={logo} alt="Footer logo" />
      </figure>

      <div className='-ml-32 md:-ml-0'>
        <h3 className='font-semibold text-lg'>About</h3>
        <NavLink className="cursor-pointer underline hover:text-violet-700 active:text-violet-900" to="/about">Click Here</NavLink>
      </div>
      <div className='-ml-12 md:-ml-0'>
        <h3 className='font-semibold text-lg'>Developer&apos; profiles</h3>
        <ul className='flex text-3xl items-center gap-2.5 mt-1.5'>
          <li>
            <NavLink to="https://github.com/ashfaque9426?tab=repositories" target='_blank'><FaGithubSquare /></NavLink>
          </li>
          <li>
            <NavLink to="https://www.linkedin.com/in/ashfaq-ul-alim-sylvi-52a4a9278/" target='_blank'><FaLinkedin /></NavLink>
          </li>
        </ul>
      </div>
    </footer>
  )
}

export default Footer