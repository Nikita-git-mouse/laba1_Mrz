import { createReadStream } from "fs";
import { resolve } from "path";
import {
  readImage,
  writeImage,
  read,
  Matrix,
  compress,
  decompress,
  readYis,
} from "./libs";

import { createInterface } from "readline";

if (process.env.NODE_ENV === "production") {
  console.debug = () => {};
  console.log = () => {};
  console.info = () => {};
  console.dir = () => {};
}

async function start() {
  const images: Array<string> = process.argv.slice(2);

  let matrix = [];

  const input = createInterface({
    input: createReadStream(resolve(__dirname, "..", "config", "Wt.txt")),
  });

  for await (const line of input) {
    const bits = line.trim().split(" ");
    matrix.push(bits.map((value) => Number(value)));
  }

  const Wt: Matrix = { n: matrix.length, m: matrix[0]?.length, matrix };

  let n = 0,
    m = 0;

  const h = Wt.m / 3;
  for (let i = 2; i < h; i += 1) {
    if (h % i === 0) {
      n = i;
      m = h / i;
      break;
    }
  }

  for (let imageName of images) {
    const Yis = await readYis(
      resolve(__dirname, "..", "compress", imageName.split(".")[0] + ".txt")
    );

    const { decompresImage } = await decompress(
      { h: 256, w: 256, pixels: [] as any },
      Wt,
      n,
      m,
      Yis
    );

    await writeImage(
      resolve(__dirname, "..", "decompress", imageName),
      decompresImage
    );
  }

  process.exit(0);
}

start();
