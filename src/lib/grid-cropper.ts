/**
 * Crops a grid image into individual cells using Canvas API.
 * Assumes a perfectly uniform grid (equal-sized cells).
 */
export async function cropGrid(
  imageUrl: string,
  rows: number = 3,
  cols: number = 3
): Promise<Blob[]> {
  const img = await loadImage(imageUrl);
  const cellW = Math.floor(img.width / cols);
  const cellH = Math.floor(img.height / rows);

  const blobs: Blob[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const canvas = document.createElement("canvas");
      canvas.width = cellW;
      canvas.height = cellH;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Failed to get canvas context");

      ctx.drawImage(
        img,
        c * cellW,
        r * cellH,
        cellW,
        cellH,
        0,
        0,
        cellW,
        cellH
      );

      const blob = await canvasToBlob(canvas);
      blobs.push(blob);
    }
  }

  return blobs;
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to convert canvas to blob"));
      },
      "image/png",
      1.0
    );
  });
}
