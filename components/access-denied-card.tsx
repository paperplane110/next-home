export default function AccessDeniedCard() {
  return (
    <div id="idCard" className="w-[250px] h-[350px] bg-stone-700 rounded-2xl flex flex-col font-pixel">
      {/* card slot */}
      <div className="w-full h-8 flex justify-center items-center">
        <div className="h-1 w-12 bg-white rounded-full"></div>
      </div>
      <div className="px-4 text-stone-300">
        TIER 1 ACCESS
      </div>
      <div className="w-full mt-4 flex justify-between items-center">
        <div className="text-stone-200 text-xl leading-[25px]">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i}>
              &#x2592;&#x2591;&#x2591;&#x2591;&#x2591;&#x2591;&#x2591;&#x2591;&#x2591;&#x2591;&#x2591;&#x2591;<br />
            </span>
          ))}
        </div>
        <div className="flex flex-col items-center px-4 text-stone-200 text-2xl leading-[25px]">
          <div>&#x2599;&#x259C;</div>
          <br />
          <div>1</div>
          <div>0</div>
          <div>5</div>
        </div>
      </div>
      <div className="mt-6 px-4 text-2xl text-stone-200">
        Visitor
        <br />
        Mr./Mrs. Anon
      </div>
      <div className="p-4 text-stone-400">
        Secret Base
      </div>
    </div>
  )
}