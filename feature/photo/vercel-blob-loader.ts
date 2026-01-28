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
  params.set('width', width.toString());
  params.set('quality', (quality || 75).toString());
  params.set('format', 'auto'); // 自动选择 webp 或 avif

  return `${src}?${params.toString()}`;
}