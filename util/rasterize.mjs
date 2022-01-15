import sharp from "sharp";

function rasterizeVector(svg) {
  const buffer = sharp(Buffer.from(svg), {
    density: 288, // let's render at 288dpi
    sequentialRead: true,
  })
    // render 500 x 300 but at @2x resolution
    .resize({
      width: 1000,
      height: 600,
      kernel: "lanczos3", // default scaling algorithm
    })
    .png()
    .toBuffer();

  return buffer;
}

export { rasterizeVector };
