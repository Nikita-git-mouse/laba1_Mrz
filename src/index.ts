import { writeFileSync } from "fs";
import { resolve } from "path";

if (process.env.NODE_ENV === "production") {
  console.debug = () => {};
  console.log = () => {};
  console.info = () => {};
  console.dir = () => {};
}

async function startCompresing() {
  const images: Array<string> = process.argv.slice(2);

  if (images.length) {
    const n = await read<Number>("n: ", "number");
    const m = await read<Number>("m: ", "number");
    const p = await read<Number>("p: ", "number");
    const e = await read<Number>("e: ", "number");
    const a = await read<Number>("alpha: ", "number");
    //const a_ = await read<Number>("alpha*: ", "number");
    read.close();

    let W_, Wt_;

    for (let imageName of images) {
      const image = await readImage(
        resolve(__dirname, "..", "images", imageName)
      );

      const { N, L, E, countSteps, W, Wt } = await learn(
        image,
        n,
        m,
        p,
        e,
        W_,
        Wt_,
          a,
          a
      );

      W_ = W;
      Wt_ = Wt;

      console.table({
        Изображение: imageName,
        "Коэффициент сжатия:": ((N * L) / (N + L)) * p + 2,
        "Достигнутая ошибка при обучении": E,
        "Количество пройденных обучаемых шагов": countSteps,
      });
    }

    let wLine = "";
    let wtLine = "";

    W_.matrix.forEach((line) => {
      line.forEach((value) => {
        wLine += value + " ";
      });
      wLine += "\n";
    });

    Wt_.matrix.forEach((line) => {
      line.forEach((value) => {
        wtLine += value + " ";
      });
      wtLine += "\n";
    });

    writeFileSync(resolve(__dirname, "..", "config", "W.txt"), wLine);
    writeFileSync(resolve(__dirname, "..", "config", "Wt.txt"), wtLine);
  } else {
    read.close();
  }
}

startCompresing();
