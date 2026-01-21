import Image from "next/image";

export default function Building() {
  return (
    <div className="flex flex-col justify-center items-center w-full py-8 border border-dashed bg-white rounded-md">
        <Image src="/img/empty.png" alt="empty" width={200} height={200} />
        <p className="mt-2 text-sm text-muted-foreground">Under Construction...</p>
    </div>
  )
}