export default function FontsPage() {

  return (
    <div className="min-h-screen relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8">
      <div>
        <h1 className="text-7xl">Sans-serif</h1>
        <h2 className="text-6xl">Blog</h2>
      </div>
      <div>
        <h1 className="font-serif text-7xl">Serif</h1>
        <h2 className="font-serif text-6xl">Blog</h2>
      </div>
      <div className="font-pixel">
        <h1 className="text-7xl">Pixel</h1>
        <h2 className="text-6xl">Blog</h2>
        <p>
          &#x2550;&#x2550;&#x2550;&#x2550;&#x2550;&#x2550;&#x2550;&#x2550;&#x2550;&#x2550;<br />
          &#x2591;&nbsp;Welcome<br />
          &#x2591;&nbsp;欢迎<br />
        </p>
      </div>
      <div>
        <h1 className="text-7xl">黑体</h1>
        <h2 className="text-6xl">假作真时真亦假</h2>
        <p className="text-5xl">无为有处有还无</p>
        <p></p>
      </div>
      <div className="font-serif">
        <h1 className="text-7xl">font-serif 屏显臻宋体</h1>
        <h2 className="text-6xl">假作真时真亦假</h2>
        <p className="text-5xl">无为有处有还无</p>
        <p className="text-5xl">SBetter later than never</p>
      </div>
      <div className="font-pixel">
        <h1 className="text-7xl">zpix</h1>
        <h2 className="text-xl">假作真时真亦假</h2>
        <p className="text-xl">无为有处有还无</p>
      </div>
    </div>
  )
}