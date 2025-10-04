'use client';

import React from 'react';

interface LockSvgProps {
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
}

/**
 * @description A reusable Lock SVG component with dynamic width, height, and color props.
 *
 * @param {number} width - The width of the SVG (default: 20)
 * @param {number} height - The height of the SVG (default: 20)
 * @param {string} color - The stroke color of the SVG (default: '#10B981')
 * @param {number} strokeWidth - The stroke width of the SVG (default: 2)
 */
export const LockSvg: React.FC<LockSvgProps> = ({
  width = 20,
  height = 20,
  color = '#10B981',
  strokeWidth = 2,
}) => {
  return (
    <svg
      className="lock-icon"
      width={width}
      height={height}
      fill="none"
      stroke={color}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );
};

export default LockSvg;
