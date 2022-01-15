import sharp from "sharp";

function rasterizeVector(svg, format) {
  const buffer = sharp(Buffer.from(svg), {
    density: 144, // render at @2x for retina displays
    sequentialRead: true,
  })
    .toFormat(format, {
      quality: 80,
    })
    .toBuffer();

  return buffer;
}

export { rasterizeVector };
