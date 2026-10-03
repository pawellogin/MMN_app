const MAX_BYTES = 8 * 1024 * 1024
const MAX_IMAGE_SIZE = 900
const MAX_DATA_URL_BYTES = 700 * 1024

export type SquareArea = {
  x: number
  y: number
  size: number
}

export function readImageFile(file: File): string {
  const type = file.type || 'image/jpeg'
  if (!type.startsWith('image/')) {
    throw new Error('imageType')
  }
  if (file.size > MAX_BYTES) {
    throw new Error('imageTooLarge')
  }
  return URL.createObjectURL(file)
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('imageType'))
    image.src = src
  })
}

/** `area` is in natural image pixels and may extend past the image edges. */
export function renderSquareImage(image: HTMLImageElement, area: SquareArea): string {
  const size = Math.max(1, Math.min(MAX_IMAGE_SIZE, Math.round(area.size)))
  const scale = size / area.size

  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('imageType')
  }
  context.fillStyle = '#000'
  context.fillRect(0, 0, size, size)
  context.imageSmoothingQuality = 'high'
  context.drawImage(
    image,
    -area.x * scale,
    -area.y * scale,
    image.naturalWidth * scale,
    image.naturalHeight * scale,
  )

  const dataUrl = canvas.toDataURL('image/jpeg', 0.82)
  if (dataUrl.length > MAX_DATA_URL_BYTES) {
    throw new Error('imageTooLarge')
  }
  return dataUrl
}

export async function deleteCharacterImage(_path: string): Promise<void> {
  /* Images are stored on the character document, nothing to delete in Storage. */
}
