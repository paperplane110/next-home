import OuterLink from "@/components/link";

export default function Typography() {
  const casts = [
    {
      name: "V+",
      role: "Photographer",
      roleChinese: "摄影",
    },
    {
      name: "Richo GR3x",
      role: "Camera",
      roleChinese: "相机",
    },
    {
      name: "26mm",
      role: "Focal Length",
      roleChinese: "焦距",
    },
    {
      name: "f/3.5",
      role: "Aperture",
      roleChinese: "光圈",
    },
  ]
  return (
    <div className="section page-top-margin">
      <header className="subsection">
        <h1 className="headline font-serif font-light soft-70">Typography</h1>
      </header>
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Grid/circle/info 布局</h2>
        <p className="mb-4">取自影视飓风的
          <OuterLink href="https://www.bilibili.com/video/BV1y3nizVEq3?spm_id_from=333.788.recommend_more_video.-1&trackid=web_related_0.router-related-2206419-zjg6v.1761708800298.667&vd_source=0f6b43e09abf3b0bbe74b006f5977c60">
            视频
          </OuterLink>
        </p>
        <div className=" lg:w-[768px] lg:h-[450px] xl:w-[1200px] xl:h-[715px] flex items-end"
          style={{
            backgroundImage: "url('/img/playground/hallstatt.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="text-white z-10 w-full px-24 py-18 grid grid-cols-4 gap-4">
            {casts.map((castInfo, index) => (
              <div key={index} className="flex gap-[0.3rem]">
                <svg className="w-6 h-6 flex-none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="8" fill="transparent" stroke="white" strokeWidth="0.8" />
                </svg>
                <div className="flex-1 flex flex-col gap-y-2 pt-[0.1rem]">
                  <div className="text-sm">{castInfo.roleChinese}/<br />{castInfo.role}</div>
                  <div className="text-2xl">{castInfo.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}