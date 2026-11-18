// Barras animadas decorativas; valores determinísticos para não variarem entre servidor e browser
export function SoundWaves() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 flex h-40 items-end justify-center gap-[5px] opacity-40 [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]"
    >
      {Array.from({ length: 56 }, (_, i) => (
        <span
          key={i}
          className="bg-gradient-brand w-1 origin-bottom animate-wave rounded-full sm:w-1.5"
          style={{
            height: `${25 + ((i * 37) % 70)}%`,
            animationDelay: `${(i * 83) % 1400}ms`,
            animationDuration: `${1000 + ((i * 137) % 900)}ms`,
          }}
        />
      ))}
    </div>
  );
}
