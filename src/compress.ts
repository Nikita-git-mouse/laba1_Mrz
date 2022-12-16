import { createReadStream } from "fs";
import { resolve } from "path";
import { createInterface } from "readline";
import { writeFile } from "fs/promises";

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
    input: createReadStream(resolve(__dirname, "..", "config", "W.txt")),
  });

  for await (const line of input) {
    const bits = line.trim().split(" ");
    matrix.push(bits.map((value) => Number(value)));
  }

  const W: Matrix = { n: matrix.length, m: matrix[0]?.length, matrix };

  let n = 0,
    m = 0;

  const h = W.n / 3;
  for (let i = 2; i < h; i += 1) {
    if (h % i === 0) {
      n = i;
      m = h / i;
      break;
    }
  }

  for (let imageName of images) {
    const image = await readImage(
      resolve(__dirname, "..", "images", imageName)
    );

    const compresImage = await compress(image, W, n, m);

    let data = "";

    compresImage.forEach((array) => {
      data += array.join(" ") + "\n";
    });

    await writeFile(
      resolve(__dirname, "..", "compress", imageName.split(".")[0] + ".txt"),
      data
    );
  }

  process.exit(0);
}

start();
