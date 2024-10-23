import { createFileRoute } from '@tanstack/react-router';
import { cn } from '~/utils/cn';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <section className='relative  h-[calc(100dvh-45px)] overflow-hidden'>
      <div className='flex flex-col items-center justify-center relative mx-auto mt-32 max-w-[80rem] px-6 text-center md:px-8 will-change-auto z-[1]'>
        <h1
          className={cn(
            'w-full  my-2 text-default-600 block max-w-full text-4xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-br from-black from-30% to-black/80',
            'py-6 text-5xl font-medium leading-none tracking-tighter text-transparent text-balance sm:text-6xl md:text-7xl lg:text-8xl'
          )}
        >
          Welcome to Only1, a new <br className='hidden md:block' />
          social service
        </h1>
        <p className='mb-12 text-lg tracking-tight text-black/70 md:text-xl text-balance'>
          Leading Web3 content subscription platform,we are bringing Solana
          <br className='hidden md:block' /> payments and $LIKE to the
          mainstream consumers
        </p>
      </div>
      <BackgroundCircles />
    </section>
  );
}

import React from 'react';

export function BackgroundCircles() {
  return (
    <div className='relative mt-[-400px] md:mt-[-300px] h-[50vh] w-screen'>
      <div className='absolute pt-[0px] h-screen w-screen overflow-hidden'>
        <div className='absolute top-[0px] left-1/2 -translate-x-1/2 w-[3000px] h-[3000px] rounded-full border-[10px] border-[rgba(0,0,0,0.01)]  bg-white overflow-hidden'>
          <div className='absolute top-[640px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] rounded-full bg-[hsl(220,33%,98%)] z-[5]' />
          <div className='absolute top-[640px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[481px] h-[481px] rounded-full bg-white border-[10px] border-[rgba(0,0,0,0.01)] z-[4]' />
          <div className='absolute top-[640px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[911px] h-[911px] rounded-full bg-white border-[10px] border-[rgba(0,0,0,0.01)] z-[3]' />
          <div className='absolute top-[640px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1262px] h-[1260px] rounded-full bg-white border-[10px] border-[rgba(0,0,0,0.01)] z-[2]' />

          <div className='absolute top-0 w-full'>
            <CircleLight
              size={96}
              zIndex={4}
              color='#c4a8ff'
              displacement={15}
              duration={5}
            />
            <CircleLight
              size={477}
              zIndex={3}
              color='#fbd692'
              displacement={65}
              duration={5}
              counterClockwise
            />
            <CircleLight
              size={907}
              zIndex={2}
              color='#c4a8ff'
              displacement={100}
              duration={6}
            />
            <CircleLight
              size={1256}
              zIndex={1}
              color='#fbd692'
              displacement={115}
              duration={7}
              counterClockwise
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface CircleLightProps {
  size: number;
  zIndex: number;
  color: string;
  displacement: number;
  duration: number;
  counterClockwise?: boolean;
}

function CircleLight({
  size,
  zIndex,
  color,
  displacement,
  duration,
  counterClockwise,
}: CircleLightProps) {
  const animationClass = counterClockwise
    ? `animate-[rotate-counterclockwise_var(--duration)_linear_infinite]`
    : `animate-[rotate_var(--duration)_linear_infinite]`;

  return (
    <div
      className={`absolute top-[620px] left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full`}
      style={
        {
          width: size,
          height: size,
          '--duration': `${duration}s`,
          zIndex: zIndex,
        } as React.CSSProperties
      }
    >
      <span
        className={`block w-full h-full  opacity-80 ${animationClass}`}
        style={
          {
            background: `radial-gradient(50% 50% at 50% 50%, ${color} 0%, ${color}7D 54.99%, rgba(217, 217, 217, 0) 100%)`,
            '--rotate-displacement': `${displacement}px`,
          } as React.CSSProperties
        }
      />
    </div>
  );
}
