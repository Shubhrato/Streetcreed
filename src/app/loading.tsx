export default function Loading() {
  return (
    <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-12" aria-busy="true" aria-label="Loading">
      <div className="h-10 w-64 animate-shimmer bg-[linear-gradient(90deg,#F1ECE3_25%,#E5DED1_50%,#F1ECE3_75%)] bg-[length:800px_100%]" />
      <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[3/4] animate-shimmer bg-[linear-gradient(90deg,#F1ECE3_25%,#E5DED1_50%,#F1ECE3_75%)] bg-[length:800px_100%]" />
            <div className="mt-4 h-4 w-3/4 animate-shimmer bg-[linear-gradient(90deg,#F1ECE3_25%,#E5DED1_50%,#F1ECE3_75%)] bg-[length:800px_100%]" />
            <div className="mt-2 h-4 w-1/3 animate-shimmer bg-[linear-gradient(90deg,#F1ECE3_25%,#E5DED1_50%,#F1ECE3_75%)] bg-[length:800px_100%]" />
          </div>
        ))}
      </div>
    </div>
  );
}
