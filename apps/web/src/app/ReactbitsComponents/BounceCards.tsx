'use client';
import { useEffect } from 'react';
import { gsap } from 'gsap';
interface BounceCardsProps {
  className?: string;
  content?: React.ReactNode[]; // <-- content instead of images
  containerWidth?: number;
  containerHeight?: number;
  animationDelay?: number;
  animationStagger?: number;
  easeType?: string;
  transformStyles?: string[];
  enableHover?: boolean;
}

export default function BounceCards({
  className = '',
  content = [],
  containerWidth = 1200,
  containerHeight = 500,
  animationDelay = 0.5,
  animationStagger = 0.06,
  easeType = 'elastic.out(1, 0.8)',
  transformStyles = [],
  enableHover = true,
}: BounceCardsProps) {
  useEffect(() => {
    gsap.fromTo(
      '.card',
      { scale: 0 },
      {
        scale: 1,
        stagger: animationStagger,
        ease: easeType,
        delay: animationDelay,
      }
    );
  }, [animationDelay, animationStagger, easeType]);

  const pushSiblings = (hoveredIdx: number) => {
    if (!enableHover) return;
    content.forEach((_, i) => {
      const selector = `.card-${i}`;
      gsap.killTweensOf(selector);
      const baseTransform = transformStyles[i] || 'none';
      if (i === hoveredIdx) {
        gsap.to(selector, {
          transform: baseTransform.replace(
            /rotate\([\s\S]*?\)/,
            'rotate(0deg)'
          ),
          duration: 0.4,
          ease: 'back.out(1.4)',
          overwrite: 'auto',
        });
      } else {
        const offsetX = i < hoveredIdx ? -160 : 160;
        gsap.to(selector, {
          transform: `${baseTransform} translate(${offsetX}px)`,
          duration: 0.4,
          ease: 'back.out(1.4)',
          overwrite: 'auto',
        });
      }
    });
  };

  const resetSiblings = () => {
    if (!enableHover) return;
    content.forEach((_, i) => {
      const selector = `.card-${i}`;
      gsap.killTweensOf(selector);
      const baseTransform = transformStyles[i] || 'none';
      gsap.to(selector, {
        transform: baseTransform,
        duration: 0.4,
        ease: 'back.out(1.4)',
        overwrite: 'auto',
      });
    });
  };

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: containerWidth, height: containerHeight }}
    >
      {content.map((item, idx) => (
        <div
          key={idx}
          className={`card card-${idx} absolute w-[350px] p-6 backdrop-blur-md bg-transparent border border-white rounded-3xl shadow-xl`}
          style={{ transform: transformStyles[idx] || 'none' }}
          onMouseEnter={() => pushSiblings(idx)}
          onMouseLeave={resetSiblings}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
