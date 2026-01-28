import { getPhotos } from "@/app/actions/photo-actions";
import { HelperCommand } from "@/components/helper-command";
import { PhotoGallery } from "@/components/photo-gallery";

export default async function GalleryPage() {
  // 首屏 10 张数据，由服务器直接生成 HTML，SEO 友好
  const { success, data: initialPhotos } = await getPhotos(0, 5);

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">我的徒步足迹
        <HelperCommand />
      </h1>
      {
        success ? (
          <PhotoGallery initialPhotos={initialPhotos} />
        ) : <p className="text-red-500">获取照片失败，请稍后重试。</p>
      }
      
    </main>
  );
}