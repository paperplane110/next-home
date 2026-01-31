import * as thumbhash from "thumbhash"
import SparkMD5 from "spark-md5"
import { binaryToBase64 } from "@/lib/utils";

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

    // encode by ThumbHash
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get canvas context");
    }

    const maxSize = 100;

    let regulatedWidth = width;
    let regulatedHeight = height;
    if (width > height) {
      regulatedHeight = Math.round(height * (maxSize / width));
      regulatedWidth = maxSize;
    } else {
      regulatedWidth = Math.round(width * (maxSize / height));
      regulatedHeight = maxSize;
    }
    canvas.width = regulatedWidth;
    canvas.height = regulatedHeight;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const hashBuffer = thumbhash.rgbaToThumbHash(canvas.width, canvas.height, imageData.data);
    const thumbhashBase64 = binaryToBase64(hashBuffer);
    URL.revokeObjectURL(imgUrl);

    return {
      width,
      height,
      aspectRatio,
      isVertical,
      blurbase64: thumbhashBase64,
      md5
    }
  } catch (error) {
    throw error;
  }
}