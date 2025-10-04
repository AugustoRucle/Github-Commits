'use client';

import React from 'react';

interface InfoSvgProps {
  className?: string;
  width?: number;
  height?: number;
  color?: string;
}

/**
 * @description A reusable Info SVG component with dynamic width, height, and color props.
 *
 * @param {number} width - The width of the SVG (default: 512)
 * @param {number} height - The height of the SVG (default: 512)
 * @param {string} color - The fill color of the SVG (default: '#000000')
 * @param {string} className - The class of the SVG
 */
export const InfoSvg: React.FC<InfoSvgProps> = ({
  className = '',
  width = 512,
  height = 512,
  color = '#000000',
}) => {
  return (
    <svg
      className={className}
      id="info_icon"
      height={height}
      viewBox="0 0 48 48"
      width={width}
      xmlns="http://www.w3.org/2000/svg"
      data-name="Layer 1"
    >
      <path
        fill={color}
        d="m24 2c-12.15 0-22 9.85-22 22s9.85 22 22 22 22-9.85 22-22-9.85-22-22-22zm3 33c0 1.105-.895 2-2 2h-2c-1.105 0-2-.895-2-2v-12c0-1.105.895-2 2-2h2c1.105 0 2 .895 2 2zm-3-17c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z"
      />
    </svg>
  );
};

export default InfoSvg;
