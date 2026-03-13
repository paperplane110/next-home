import { HelperCommand } from "@/components/helper-command";
import { PhotoGallery } from "@/feature/photo/components/photo-gallery";
import { PhotoQuery } from "@/drizzle/schema";
import { getPhotosService } from "@/feature/photo/services";

export default async function GalleryPage() {
  // 首屏 6 张数据，由服务器直接生成 HTML，SEO 友好
  let initialPhotos: PhotoQuery[] = [];
  let error = null;
  try {
    initialPhotos = await getPhotosService(0, 6);
    console.log(JSON.stringify(initialPhotos));
  } catch (e) {
    error = e;
  }

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Gallery
        <HelperCommand />
      </h1>
      {
        error ? (
          <p className="text-red-500">获取照片失败，请稍后重试。</p>
        ) : initialPhotos.length > 0 ? (
          <PhotoGallery initialPhotos={initialPhotos} />
        ) : (
          <p className="text-center py-20">暂无照片，快去上传一张吧！</p>
        )
      }
      
    </main>
  );
}