export default function LeftCornerDecoration() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      <img
        src="/shapes/dl.svg"
        alt=""
        className="
          absolute
          lg:top-0 top-14 left-0
          w-10 h-auto
          object-contain
          opacity-90
          sm:top-16 sm:w-16
          md:top-20 md:w-20
          lg:w-24
        "
      />
    </div>
  );
}