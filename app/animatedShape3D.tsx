import React from 'react';

const AnimatedShape3D = () => {
  return (
    <div className="relative w-40 h-40">
      <div className="absolute inset-0 bg-black transform origin-center animate-rotate3d"></div>
    </div>
  );
};

export default AnimatedShape3D;
