
export default function YearProgress() {
  // calculate the how much progress we have made this year
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  const currentWeek = Math.floor(diff / oneWeek);
  const leftOffset = (currentWeek * 6.38 + 1 + 6.4).toFixed(0);

  const progressLeftOffset = (currentWeek * 6.38 + 6.34 + 10).toFixed(0);
  const progress = (diff / (1000 * 60 * 60 * 24 * 365) * 100).toFixed(1)

  const nowDate = new Date().toDateString().split(" ").slice(1, 3).join(",")
  const dateLeftOffset = (currentWeek * 6.38 - 10).toFixed(0);

  return (
    <span className="relative">
      <span className="font-pixel text-[10px]">
        [
        {
          [...Array(52)].map((_, i) => (
            <span key={i} className="h-full">
              {i <= currentWeek ? '#' : '='}
            </span>
          ))
        }]
      </span>
      <span id="cursor"
        className="absolute -top-1 text-[10px] font-pixel text-primary leading-tight"
        style={{ left: `${leftOffset}px` }}
      >
        &#x250C;<br />&#x2502;
      </span>
      <span
        className="absolute -top-2 font-sans text-[10px] text-black"
        style={{ left: `${progressLeftOffset}px` }}
      >{progress}%</span>
      <span
        id="date"
        className="absolute -top-5.5 font-sans text-[10px] text-black"
        style={{ left: `${progressLeftOffset}px` }}
      >
        {nowDate}
      </span>
    </span>
  )
}