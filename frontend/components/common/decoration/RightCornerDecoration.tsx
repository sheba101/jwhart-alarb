export default function RightCornerDecoration() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      <img
        src="/shapes/dr.svg"
        alt=""
        className="
          absolute
          bottom-14 right-0
          w-10 h-auto
          object-contain
          opacity-90
          sm:bottom-16 sm:w-16
          md:bottom-20 md:w-20
          lg:bottom-0
          lg:w-24
        "
      />
    </div>
  );
}