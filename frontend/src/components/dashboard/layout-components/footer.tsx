import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-800 text-white py-2 px-6 relative z-50">
      <div className="text-center text-xs">
        <p className="text-gray-300">
          Copyright © 2025, ASSA. All rights reserved. Designed, Developed &
          Maintained by{" "}
          <span className="text-white font-medium">
            Gratia Technology Pvt. Ltd.
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
