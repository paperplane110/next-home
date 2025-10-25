export const Disk = () => {
  return (
    <div id="disk"
      className="relative h-[64px] w-[64px] border rounded-full bg-[#f4f4f4] overflow-hidden animate-spin animation-duration-[10s]"
    >
      {/* 彩虹扇形反光叠层 */}
      <div
        id="disk-reflection"
        className="absolute inset-0 pointer-events-none rounded-full mix-blend-screen blur-[1px]"
        style={{
          background:
            'conic-gradient(from 220deg at 50% 50%, #efefef 0deg, #ff0040 3deg, #ff7a00 10deg, #ffe600 20deg, #00e676 30deg, #00cfff 40deg, #7a00ff 50deg, #ff00cc 60deg, #ff0040 65deg, #efefef 70deg, transparent 100deg 150deg,' +
            '#efefef 180deg, #ff0040 183deg, #ff7a00 190deg, #ffe600 200deg, #00e676 210deg, #00cfff 220deg, #7a00ff 230deg, #ff00cc 240deg, #ff0040 250deg, #efefef 260deg, transparent 280deg 340deg, #efefef 360deg)',
        }}
      />
      <div id="disk-hole-ring" className="absolute z-10 h-[18px] w-[18px] rounded-full bg-gray-200 top-[50%] left-[50%] transform -translate-[50%]">
        <div id="disk-hole" className="absolute z-10 h-[8px] w-[8px] rounded-full bg-black top-[50%] left-[50%] transform -translate-[50%]" />
      </div>
    </div>
  )
}

export const BlackVinyl = () => {
  return (
    <div id="disk"
      className="relative h-[60px] w-[60px] border rounded-full bg-[#1a1a1a] overflow-hidden animate-spin animation-duration-[10s]"
    >
      {/* 彩虹扇形反光叠层 */}
      <div
        id="disk-reflection"
        className="absolute inset-0 pointer-events-none opacity-50 rounded-full mix-blend-screen blur-[1px]"
        style={{
          background:
            'conic-gradient(from 220deg at 50% 50%, ' +
            'transparent 0deg 10deg, #efefef 40deg, #efefef 50deg, transparent 90deg 180deg,' +
            '#efefef 220deg, #efefef 230deg, transparent 260deg 360deg)',
        }}
      />
      <div id="disk-hole-ring" className="absolute z-10 h-[18px] w-[18px] rounded-full bg-red-700 top-[50%] left-[50%] transform -translate-[50%]">
        <div id="disk-hole" className="absolute z-10 h-[3px] w-[3px] rounded-full bg-black top-[50%] left-[50%] transform -translate-[50%]" />
      </div>
    </div>
  )
}