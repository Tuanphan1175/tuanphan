
import React from 'react';

const Footer: React.FC<{ t: any }> = ({ t }) => {
  return (
    <div className="mt-auto border-t border-gray-200 dark:border-gray-800 bg-background-light dark:bg-background-dark p-8 pb-12 text-center">
      <div className="flex justify-center gap-6 text-gray-400 mb-6">
        <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">flutter_dash</span>
        <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">photo_camera</span>
        <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">alternate_email</span>
      </div>
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
        <a className="hover:text-primary" href="#">{t.privacy}</a>
        <a className="hover:text-primary" href="#">{t.terms}</a>
        <a className="hover:text-primary" href="#">{t.contact}</a>
      </div>
      <p className="mt-6 text-xs text-gray-400 dark:text-gray-600">© 2024 AI Budget Inc. All rights reserved.</p>
    </div>
  );
};

export default Footer;
