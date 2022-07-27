import {
  readFileSync,
  writeFileSync,
  readdirSync,
  rmSync,
  existsSync,
  mkdirSync,
} from 'node:fs'
import sharp from 'sharp'

const template = `
    <svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- bg -->
        <!-- head -->
        <!-- hair -->
        <!-- eyes -->
        <!-- nose -->
        <!-- mouth -->
        <!-- beard -->
    </svg>
`

const cachedTakenNames: Record<string, string> = {}
const takenFaces: Record<string, string> = {}
let idx = 10

function randomInt(max: number) {
  return Math.floor(Math.random() * (max + 1))
}

function randomFromArray<T>(arrary: Array<T>): T {
  return arrary[Math.floor(Math.random() * arrary.length)]
}

function getRandomName() {
  const adjectives =
    'fired trashy tubular nasty jacked swol buff ferocious firey flamin agnostic artificial bloody crazy cringey crusty dirty eccentric glutinous harry juicy simple stylish awesome creepy corny freaky shady sketchy lame sloppy hot intrepid juxtaposed killer ludicrous mangy pastey ragin rusty rockin sinful shameful stupid sterile ugly vascular wild young old zealous flamboyant super sly shifty trippy fried injured depressed anxious clinical'.split(
      ' ',
    )
  const names =
    'aaron bart chad dale earl fred grady harry ivan jeff joe kyle lester steve tanner lucifer todd mitch hunter mike arnold norbert olaf plop quinten randy saul balzac tevin jack ulysses vince will xavier yusuf zack roger raheem rex dustin seth bronson dennis'.split(
      ' ',
    )

  const randomAdjective = randomFromArray(adjectives)
  const randomName = randomFromArray(names)
  const name = `${randomAdjective}-${randomName}`

  if (cachedTakenNames[name] || !name) {
    return getRandomName()
  } else {
    cachedTakenNames[name] = name
    return name
  }
}

function getLayer(name: string, skip = 0.0) {
  const svg = readFileSync(`./layers/${name}.svg`, 'utf-8')
  const regexp = /(?<=\<svg\s*[^>]*>)([\s\S]*?)(?=\<\/svg\>)/g
  const layer = svg.match(regexp)![0]
  return Math.random() > skip ? layer : ''
}

async function svgToPng(name: number) {
  const src = `./dist/${name}.svg`
  const dest = `./dist/${name}.png`

  const img = sharp(src)
  const resized = img.resize(1024)
  await resized.toFile(dest)
}

function createImage(idx: number) {
  const bg = randomInt(5)
  const hair = randomInt(7)
  const eyes = randomInt(9)
  const nose = randomInt(4)
  const mouth = randomInt(5)
  const beard = randomInt(3)
  // `5 * 7 * 9 * 4 * 5 * 3` => 18,900 combinations

  const face = [hair, eyes, mouth, nose, beard].join('')

  if (takenFaces[face]) {
    createImage(idx)
  } else {
    const name = getRandomName()
    console.log(name)
    takenFaces[face] = face

    const final = template
      .replace('<!-- bg -->', getLayer(`bg${bg}`))
      .replace('<!-- head -->', getLayer('head0'))
      .replace('<!-- hair -->', getLayer(`hair${hair}`))
      .replace('<!-- eyes -->', getLayer(`eyes${eyes}`))
      .replace('<!-- nose -->', getLayer(`nose${nose}`))
      .replace('<!-- mouth -->', getLayer(`mouth${mouth}`))
      .replace('<!-- beard -->', getLayer(`beard${beard}`, 0.5))

    const meta = {
      name,
      description: `A drawing of ${name.split('-').join(' ')}`,
      image: `${idx}.png`,
      attributes: [
        {
          beard: '',
          rarity: 0.5,
        },
      ],
    }
    writeFileSync(`./dist/${idx}.json`, JSON.stringify(meta))
    writeFileSync(`./dist/${idx}.svg`, final)
    svgToPng(idx)
  }
}

// Create dir if not exists
if (!existsSync('./dist')) {
  mkdirSync('./dist')
}

// Cleanup dir before each run
readdirSync('./dist').forEach(f => rmSync(`./dist/${f}`))

do {
  createImage(idx)
  idx--
} while (idx >= 0)
