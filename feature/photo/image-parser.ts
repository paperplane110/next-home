import { encode } from "blurhash"
import SparkMD5 from "spark-md5"

const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file as ArrayBuffer"));
      }
    };
    reader.onerror = () => {
      reject(reader.error);
    };
    reader.readAsArrayBuffer(file)
  });


const loadImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });


export const parseImage = async (file: File) => {
  try {
    // calculate md5
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const spark = new SparkMD5.ArrayBuffer();
    spark.append(arrayBuffer);
    const md5 = spark.end();

    // shape info
    const imgUrl = URL.createObjectURL(file);
    const img = await loadImage(imgUrl);
    const width = img.width;
    const height = img.height;
    const aspectRatioRaw = width / height;
    const aspectRatio = aspectRatioRaw.toFixed(2);
    const isVertical = aspectRatioRaw < 1;

    // encode by BlurHash
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 32;
    canvas.height = 32;

    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
    const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
    const blurhash = imageData ? encode(imageData.data, canvas.width, canvas.height, 4, 4) : "";
    URL.revokeObjectURL(imgUrl);

    return {
      width,
      height,
      aspectRatio,
      isVertical,
      blurhash,
      md5
    }
  } catch (error) {
    throw error;
  }
}