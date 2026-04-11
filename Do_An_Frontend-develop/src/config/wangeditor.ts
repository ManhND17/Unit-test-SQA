export function customCheckImageFn(
  src: string,
  alt: string,
  url: string
): boolean | undefined | string {
  if (!src) {
    return;
  }
  if (src.indexOf('http') !== 0) {
    return 'Image src must start width http/https';
  }
  return true;
}

export function customParseImageSrc(src: string): string {
  if (src.indexOf('http') !== 0) {
    return `http://${src}`;
  }
  return src;
}
