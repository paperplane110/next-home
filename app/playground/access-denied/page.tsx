import AccessDenied from "@/components/access-denied";
import Link from "next/link";

export default function AccessDeniedPage() {
  return (
    <div className="section page-top-margin">
      <div className="subsection">
        <AccessDenied />
      </div>
      <div className="subsection mt-12">
        <hr />
        <p className="mt-4 text-sm font-medium text-muted-foreground">
          An &quot;Access Denied&quot; card, using Departure Mono font,
          inspired by the landing page of <Link className="underline" href="https://departuremono.com/">Departure Mono</Link>
        </p>
      </div>
      <div className="subsection mt-16">
        <h2 className="font-bold">中文卡片</h2>
        <p className="mt-4 text-sm font-medium text-muted-foreground">
          中文像素字体采用的是 <Link className="underline" href="https://github.com/SolidZORO/zpix-pixel-font">zpix 最像素</Link>字体。
        </p>
        <div className="mt-8 w-full flex justify-center">
          <div id="idCard" className="w-[250px] h-[350px] bg-cyan-800 rounded-2xl flex flex-col font-pixel">
            {/* card slot */}
            <div className="w-full h-8 flex justify-center items-center">
              <div className="h-1 w-12 bg-white rounded-full"></div>
            </div>
            <div className="px-4 text-white">
              权限等级：一级
            </div>
            <div className="w-full mt-4 flex justify-between items-center">
              <div className="text-white text-xl leading-[25px]">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i}>
                    &#x2592;&#x2591;&#x2591;&#x2591;&#x2591;&#x2591;&#x2591;&#x2591;&#x2591;&#x2591;&#x2591;&#x2591;<br />
                  </span>
                ))}
              </div>
              <div className="flex flex-col items-center px-4 text-white text-2xl leading-[25px]">
                <div>&#x2599;&#x259A;</div>
                <br />
                <div>1</div>
                <div>2</div>
                <div>8</div>
              </div>
            </div>
            <div className="mt-6 px-4 text-2xl text-white">
              外部访客
              <br />
              罗辑
            </div>
            <div className="p-4 text-gray-200">
              国家量子计算中心
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}