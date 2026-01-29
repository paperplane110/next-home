export function vercelBlobLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // Vercel Blob 优化 URL 的格式通常是直接在原图后加参数
  // 也可以根据需要添加 format=avif 等参数
  const params = new URLSearchParams();
  params.set('w', width.toString());
  params.set('q', (quality || 75).toString());

  return `${src}?${params.toString()}`;
}