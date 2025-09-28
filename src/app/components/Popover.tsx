'use client';

import { useState, useRef, ReactNode } from 'react';

/**
 * @summary A popover component that shows content on hover.
 * @param {object} props - The properties for the component.
 * @param {ReactNode} props.content - The content to show in the popover.
 * @param {ReactNode} props.children - The trigger element for the popover.
 * @returns {JSX.Element} A popover component.
 */
const Popover = ({ content, children }: { content: ReactNode, children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  /**
   * @summary Handles the mouse enter event to show the popover.
   */
  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  /**
   * @summary Handles the mouse leave event to hide the popover.
   */
  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div
      className="relative flex justify-center"
      ref={popoverRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="cursor-pointer">
        {children}
      </div>

      {isOpen && (
        <div
          className="absolute z-10 w-64 p-3 text-xs text-justify bg-white text-black border border-gray-200 rounded-lg shadow-lg left-1/2 -translate-x-1/2 bottom-full mb-2 animate-fade-in-scale-up shadow-xl/30"
        >
          {content}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white"
            style={{
              content: ''
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Popover;
