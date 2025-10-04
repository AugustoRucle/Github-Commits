'use client';

import React from 'react';
import EyeSvg from './EyeSvg';
import HiddenEyeSvg from './HiddenEyeSvg';

interface ToggleVisibilityProps {
  isVisible: boolean;
  onToggle: (isVisible: boolean) => void;
  size?: number;
  color?: string;
}

/**
 * @description A toggle button component that switches between Eye and Hidden Eye icons.
 * Used to show/hide sensitive information like passwords or tokens.
 *
 * @param {boolean} isVisible - Current visibility state
 * @param {function} onToggle - Callback function called when visibility changes
 * @param {number} size - Size of the icon (default: 20)
 * @param {string} color - Color of the icon (default: '#3B82F6')
 */
export const ToggleVisibility: React.FC<ToggleVisibilityProps> = ({
  isVisible,
  onToggle,
  size = 20,
  color = '#3B82F6',
}) => {
  const handleClick = () => {
    onToggle(!isVisible);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="transition-opacity hover:opacity-80 cursor-pointer"
      aria-label={isVisible ? 'Ocultar' : 'Mostrar'}
    >
      {isVisible ? (
        <EyeSvg width={size} height={size} color={color} />
      ) : (
        <HiddenEyeSvg width={size} height={size} color={color} />
      )}
    </button>
  );
};

export default ToggleVisibility;
