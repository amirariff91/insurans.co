// One source for a car photo's srcset and the model page's sizes, so the head preload in Base.astro
// matches the <img> in CarPhoto.astro exactly (a mismatch downloads the image twice).
import carPhotos from '../../data/car-photos.json';

export const MODEL_PHOTO_SIZES = '(min-width: 48rem) 26rem, calc(100vw - 2rem)';

export const photoSrcset = (p: { src400: string; src800: string }) => `${p.src400} 400w, ${p.src800} 800w`;

/** The preload for a model page's photo, or undefined when the model has no photo (name card). */
export const modelPhotoPreload = (slug: string) => {
  const p = carPhotos.find((x) => x.slug === slug) as any;
  if (!p || !p.hasPhoto) return undefined;
  return { href: p.src400 as string, srcset: photoSrcset(p), sizes: MODEL_PHOTO_SIZES };
};
