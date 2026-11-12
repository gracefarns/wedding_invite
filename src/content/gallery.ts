/**
 * The gallery. To add a photograph:
 *   1. save it in public/images/gallery/
 *   2. add an entry below
 *
 * `mat` chooses the paper mat it sits in: 'rect', 'arch' or 'oval'.
 * `ratio` is width : height of the crop you would like (the photo is cropped to fill it).
 */

export interface GalleryItem {
  file: string
  alt: string
  caption?: string
  mat: 'rect' | 'arch' | 'oval'
  ratio: [number, number]
}

// PLACEHOLDER — captions and alt text are invented; replace alongside the photos.
export const gallery: GalleryItem[] = [
  { file: 'gallery/01.jpg', alt: 'Clara and Clark walking in a garden', caption: 'The walled garden, May', mat: 'arch', ratio: [4, 5] },
  { file: 'gallery/02.jpg', alt: 'Clara laughing', caption: 'Mid-sentence, as usual', mat: 'rect', ratio: [5, 4] },
  { file: 'gallery/03.jpg', alt: 'Clark with the dog', caption: 'Clark and Biscuit', mat: 'oval', ratio: [4, 5] },
  { file: 'gallery/04.jpg', alt: 'A table laid for dinner', caption: 'Supper for twelve', mat: 'rect', ratio: [4, 5] },
  { file: 'gallery/05.jpg', alt: 'The couple at the coast', caption: 'Cornwall, the long way home', mat: 'rect', ratio: [3, 2] },
  { file: 'gallery/06.jpg', alt: 'Hands holding a cup of tea', caption: 'The morning after the question', mat: 'arch', ratio: [3, 4] },
  { file: 'gallery/07.jpg', alt: 'Clara among the roses', caption: 'Too many roses', mat: 'oval', ratio: [4, 5] },
  { file: 'gallery/08.jpg', alt: 'The couple dancing in a kitchen', caption: 'Kitchen, late', mat: 'rect', ratio: [1, 1] },
  { file: 'gallery/09.jpg', alt: 'A portrait of the couple', caption: 'April 2026', mat: 'arch', ratio: [4, 5] },
]
