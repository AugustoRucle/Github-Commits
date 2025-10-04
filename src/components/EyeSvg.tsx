'use client';

import React from 'react';

interface EyeSvgProps {
  width?: number;
  height?: number;
  color?: string;
}

/**
 * @description A reusable Eye SVG component with dynamic width, height, and color props.
 *
 * @param {number} width - The width of the SVG (default: 512)
 * @param {number} height - The height of the SVG (default: 512)
 * @param {string} color - The fill color of the SVG (default: '#000000')
 */
export const EyeSvg: React.FC<EyeSvgProps> = ({
  width = 512,
  height = 512,
  color = '#000000',
}) => {
  return (
    <svg
      version="1.1"
      id="eye_icon"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 488.85 488.85"
      style={{ enableBackground: 'new 0 0 488.85 488.85' } as React.CSSProperties}
      xmlSpace="preserve"
      width={width}
      height={height}
    >
      <g>
        <path
          fill={color}
          d="M244.425,98.725c-93.4,0-178.1,51.1-240.6,134.1c-5.1,6.8-5.1,16.3,0,23.1c62.5,83.1,147.2,134.2,240.6,134.2
		s178.1-51.1,240.6-134.1c5.1-6.8,5.1-16.3,0-23.1C422.525,149.825,337.825,98.725,244.425,98.725z M251.125,347.025
		c-62,3.9-113.2-47.2-109.3-109.3c3.2-51.2,44.7-92.7,95.9-95.9c62-3.9,113.2,47.2,109.3,109.3
		C343.725,302.225,302.225,343.725,251.125,347.025z M248.025,299.625c-33.4,2.1-61-25.4-58.8-58.8c1.7-27.6,24.1-49.9,51.7-51.7
		c33.4-2.1,61,25.4,58.8,58.8C297.925,275.625,275.525,297.925,248.025,299.625z"
        />
      </g>
    </svg>
  );
};

export default EyeSvg;
