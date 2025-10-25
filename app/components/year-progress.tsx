
export default function YearProgress() {
  // calculate the how much progress we have made this year
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  const currentWeek = Math.floor(diff / oneWeek);
  const leftOffset = (currentWeek * 6.38 + 1).toFixed(0);

  const progressLeftOffset = (currentWeek * 6.38 + 12).toFixed(0);
  const progress = (diff / (1000 * 60 * 60 * 24 * 365) * 100).toFixed(1)

  const nowDate = new Date().toDateString().split(" ").slice(1, 3).join(",")
  const dateLeftOffset = (currentWeek * 6.38 - 10).toFixed(0);

  return (
    <span className="relative">
      <span>
        {
          [...Array(52)].map((_, i) => (
            <span key={i} className="h-full font-pixel text-[10px]">
              {i <= currentWeek ? '\u2593' : '\u2591'}
            </span>
          ))
        }
      </span>
      <div id="cursor"
        className="absolute -top-2 text-sm font-pixel text-pink-600 leading-tight"
        style={{ left: `${leftOffset}px` }}
      >
        &#x250C;<br />&#x2502;
      </div>
      <div
        className="absolute -top-2 font-pixel text-[11px] text-black"
        style={{ left: `${progressLeftOffset}px` }}
      >{progress}%</div>
      <div
        className="absolute font-pixel text-[10px]"
        style={{ left: `${dateLeftOffset}px` }}
      >
        {nowDate}
      </div>
    </span>
  )
}