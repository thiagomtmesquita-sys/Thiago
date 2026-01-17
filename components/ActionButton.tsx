
import React from 'react';

interface ActionButtonProps {
  label: string;
  href: string;
  icon?: React.ReactNode;
  variant?: 'outline' | 'solid';
}

const ActionButton: React.FC<ActionButtonProps> = ({ label, href, icon, variant = 'outline' }) => {
  const baseStyles = "w-full py-4 px-6 rounded-full font-semibold flex items-center justify-center gap-3 transition-all duration-300 transform active:scale-95";
  const variants = {
    outline: "border border-gold text-gold hover:bg-gold hover:text-black",
    solid: "bg-gold-gradient text-black shadow-lg shadow-gold/20"
  };

  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`${baseStyles} ${variants[variant]}`}
    >
      {icon}
      <span>{label}</span>
    </a>
  );
};

export default ActionButton;
