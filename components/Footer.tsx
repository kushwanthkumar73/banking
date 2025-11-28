import { logoutAccount } from '@/lib/actions/user.actions'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const Footer = ({ user, type = 'desktop' }: FooterProps) => {
  const router = useRouter();

  const handleLogOut = async () => {
    const loggedOut = await logoutAccount();
    if (loggedOut !== null) router.push('/sign-in');
  };

  const fullName = user?.name || "Guest";
  const firstLetter = fullName.charAt(0).toUpperCase();
  const email = user?.email || "No email";

  return (
    <footer className="footer">
      <div className={type === 'mobile' ? 'footer_name-mobile' : 'footer_name'}>
        <p className="text-xl font-bold text-gray-700">
          {firstLetter}
        </p>
      </div>

      <div className={type === 'mobile' ? 'footer_email-mobile' : 'footer_email'}>
        <h1 className="text-14 truncate text-gray-700 font-semibold">
          {fullName}
        </h1>
        <p className="text-14 truncate font-normal text-gray-600">
          {email}
        </p>
      </div>

      <div className="footer_image" onClick={handleLogOut}>
        <Image src="/icons/logout.svg" fill alt="logout" />
      </div>
    </footer>
  );
};

export default Footer;

