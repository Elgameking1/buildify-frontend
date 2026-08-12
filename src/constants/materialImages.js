/**
 * Photography for material listings.
 *
 * A vendor's own uploads always win: `adaptProduct` fills `gallery` from the
 * API, and nothing here overrides it. But uploads go to R2, and until a bucket
 * is configured the API returns no image URLs at all - so every card, every
 * detail page and every cart row fell back to a drawn stripe, and the catalogue
 * read as a spreadsheet rather than a shop.
 *
 * These files sit in `public/images/materials/`. They are freely licensed
 * photographs of the real materials (Wikimedia Commons - see ATTRIBUTION.md in
 * that folder for author and licence per file), matched to a listing by
 * keyword rather than by id, so a vendor adding "18mm Marine Plywood" tomorrow
 * gets a plywood photo without anyone editing this file.
 *
 * They are stand-ins, not the vendor's stock. Nothing here claims otherwise:
 * the detail page labels a matched photo as a library image, and the moment a
 * real upload exists it is the one shown.
 */

const BASE = '/images/materials'

/**
 * Author and licence per file - required by CC BY / CC BY-SA, and the source
 * of the credit line under the detail-page image.
 */
export const MATERIAL_IMAGE_CREDITS = {
  'cement-bags.jpg': {
    title: 'Portland Cement Bags',
    author: 'KVDP',
    license: 'Public domain',
    licenseUrl: '',
    source: 'https://commons.wikimedia.org/wiki/File:Portland_Cement_Bags.jpg',
  },
  'cement-bags-retail.jpg': {
    title: 'Nigerian Cement sellers in Ilorin',
    author: 'Jamie Tubers',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    source:
      'https://commons.wikimedia.org/wiki/File:Nigerian_Cement_sellers_in_Ilorin.jpg',
  },
  'concrete-blocks.jpg': {
    title: 'Close-Up of Stacked Concrete Blocks in Sunlight',
    author: 'Pecid2180',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    source:
      'https://commons.wikimedia.org/wiki/File:Close-Up_of_Stacked_Concrete_Blocks_in_Sunlight.jpg',
  },
  'iron-rod-12mm.jpg': {
    title: 'A bunch of rebar up close',
    author: 'W.carter',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:A_bunch_of_rebar_up_close.jpg',
  },
  'iron-rod-16mm.jpg': {
    title: 'Buger Brücke Neubau Armierungseisen',
    author: 'Reinhold Möller (Ermell)',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    source:
      'https://commons.wikimedia.org/wiki/File:Buger_Br%C3%BCcke_Neubau_Armierungseisen_HRS-20240310-RM-151311.jpg',
  },
  'roofing-sheets.jpg': {
    title: '5-inch Zinc Roofing Sheets in Awka',
    author: 'Johnnybam',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    source:
      'https://commons.wikimedia.org/wiki/File:5-inch_Zinc_Roofing_Sheets_in_Awka.jpg',
  },
  'timber-planks.jpg': {
    title: 'Stack of wooden planks - close-up',
    author: 'David R Jenkins',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    source:
      'https://commons.wikimedia.org/wiki/File:Stack_of_wooden_planks_-_close-up_02.jpg',
  },
  'plywood.jpg': {
    title: 'Plywood',
    author: 'Rotor DB',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Plywood.jpg',
  },
  'plywood-panels.jpg': {
    title: 'Plywood panels for new construction',
    author: 'Downtowngal',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    source:
      'https://commons.wikimedia.org/wiki/File:Plywood_panels_for_new_construction.jpg',
  },
  'pvc-pipes.jpg': {
    title: 'Bundled PVC pipes for drainage in Awka',
    author: 'Johnnybam',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    source:
      'https://commons.wikimedia.org/wiki/File:Bundled_PVC_pipes_for_drainage_in_Awka.jpg',
  },
  'water-tank.jpg': {
    title: 'Polytank',
    author: 'Mohammed Ahmed 123',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Polytank.jpg',
  },
  'electrical-cable.jpg': {
    title: 'Electric guide 3×2.5 mm',
    author: 'Petar Milošević',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    source:
      'https://commons.wikimedia.org/wiki/File:Electric_guide_3%C3%972.5_mm.jpg',
  },
  'paint.jpg': {
    title: 'Paint bucket and brush',
    author: 'Ionenlaser',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Paint_bucket_and_brush.jpg',
  },
  'floor-tiles.jpg': {
    title: 'Ceramic tile floor texture',
    author: 'Sisters.seamless',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    source:
      'https://commons.wikimedia.org/wiki/File:Cream_speckled_ceramic_cemented_clean_tile_pattern_floor_ground_texture.jpg',
  },
  'floor-tiles-stack.jpg': {
    title: 'Stack of floor tiles',
    author: 'N509FZ',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    source:
      'https://commons.wikimedia.org/wiki/File:Stack_of_floor_tiles_for_Mudanyuan_Station,_Exit_G_(20211112151834).jpg',
  },
  'hardware-store.jpg': {
    title: 'Bolsas de cemento Plasticor',
    author: 'Just a Man',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Bolsas_de_cemento_Plasticor.jpg',
  },
}

/**
 * First match wins, so the order is the specification.
 *
 * Read against "<name> <category>", which is why a listing called "Wawa Plank"
 * and a category called "Planks" both land on timber: the seeded catalogue
 * names the material, a vendor's own listing might only get it right in one of
 * the two fields.
 *
 * The narrow rules come first for a reason. "Marine Plywood 18mm" contains
 * "wood", and "6-inch Solid Block" sits under "Concrete Blocks" - matched in
 * the other order, plywood would be shown as loose planks and a block as a bag
 * of cement.
 */
const RULES = [
  { pattern: /plywood|veneer|marine board/i, files: ['plywood.jpg', 'plywood-panels.jpg'] },
  { pattern: /block|brick/i, files: ['concrete-blocks.jpg'] },
  { pattern: /roof|zinc|aluzinc|corrugat/i, files: ['roofing-sheets.jpg'] },
  // Anything from 14mm up is a heavy structural bar; the thinner rods get the
  // other photo so two rod listings side by side do not look identical.
  {
    pattern: /(1[4-9]|[2-9]\d)\s*mm[^a-z]*(iron|steel)?\s*(rod|bar|rebar)/i,
    files: ['iron-rod-16mm.jpg'],
  },
  { pattern: /rod|rebar|reinforc|iron bar|steel bar/i, files: ['iron-rod-12mm.jpg'] },
  { pattern: /tile|ceramic|porcelain/i, files: ['floor-tiles.jpg', 'floor-tiles-stack.jpg'] },
  { pattern: /tank|polytank|reservoir/i, files: ['water-tank.jpg'] },
  { pattern: /pipe|pvc|fitting|plumb|conduit|gutter/i, files: ['pvc-pipes.jpg'] },
  {
    pattern: /cable|wire|electric|socket|switch|lighting|bulb|lamp/i,
    files: ['electrical-cable.jpg'],
  },
  { pattern: /paint|emulsion|primer|varnish|thinner|coating/i, files: ['paint.jpg'] },
  {
    pattern: /cement|concrete|mortar|plaster|screed|\bpop\b/i,
    files: ['cement-bags.jpg', 'cement-bags-retail.jpg'],
  },
  { pattern: /plank|timber|wood|lumber|board|door|frame|ply/i, files: ['timber-planks.jpg'] },
]

// Shown when nothing matches - a building-materials yard, which is true of any
// listing in this catalogue whatever it turns out to be.
const FALLBACK = ['hardware-store.jpg']

function localFiles(product) {
  const haystack = `${product?.name ?? ''} ${product?.category ?? ''}`
  const rule = RULES.find((entry) => entry.pattern.test(haystack))
  return rule ? rule.files : FALLBACK
}

/** The vendor's own uploads, if there are any. */
function uploadedImages(product) {
  const gallery = product?.gallery ?? []
  if (gallery.length > 0) return gallery
  // Cart lines carry a single `image` rather than a gallery.
  return product?.image ? [product.image] : []
}

/**
 * Every image to show for a product, uploads first.
 *
 * Never empty: a listing with no uploads still gets a matched library photo, so
 * callers can render an <img> unconditionally.
 */
export function materialImages(product) {
  const uploaded = uploadedImages(product)
  if (uploaded.length > 0) return uploaded
  return localFiles(product).map((file) => `${BASE}/${file}`)
}

/** The single image to put on a card, a thumbnail, or a cart row. */
export function materialImage(product) {
  return materialImages(product)[0]
}

/** True when this URL is one of ours rather than a vendor upload. */
export function isLibraryImage(url) {
  return typeof url === 'string' && url.startsWith(`${BASE}/`)
}

/** Credit for a library image; null for a vendor's own upload. */
export function materialImageCredit(url) {
  if (!isLibraryImage(url)) return null
  return MATERIAL_IMAGE_CREDITS[url.slice(BASE.length + 1)] ?? null
}
