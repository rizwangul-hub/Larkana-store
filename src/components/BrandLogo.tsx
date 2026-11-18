import React from 'react';

interface BrandLogoProps {
  variant?: 'dark' | 'light';
  storeName?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'dark',
  storeName = 'Larkana Store',
}) => {
  const titleColor = variant === 'light' ? 'text-white' : 'text-slate-900';

  return (
    <span className="inline-flex items-center gap-2 sm:gap-2.5 whitespace-nowrap shrink-0">
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="w-7 h-7 sm:w-[34px] sm:h-[34px] shrink-0"
      >
        {/* Shopping bag body in signature Larkana Store orange */}
        <rect x="4" y="10" width="28" height="22" rx="5" fill="#EA580C" />
        {/* Bag handle */}
        <path
          d="M12 10V8.5C12 5.46243 14.4624 3 17.5 3H18.5C21.5376 3 24 5.46243 24 8.5V10"
          stroke={variant === 'light' ? '#F8FAFC' : '#0F172A'}
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        {/* Architectural arch motif + subtle L accent */}
        <path
          d="M13 26V19.5C13 16.7386 15.2386 14.5 18 14.5C20.7614 14.5 23 16.7386 23 19.5V26"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M16 26H20.5"
          stroke="#FED7AA"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
      <span
        className={`font-display text-base sm:text-lg font-bold tracking-tight ${titleColor}`}
      >
        {storeName}
      </span>
    </span>
  );
};
