import sharp from "sharp";
import { readdir, readFile, writeFile } from "fs/promises";
import { parse, stringify } from "yaml";

const filenames = (
  await readdir(`${process.cwd()}/public/photos`, { withFileTypes: true })
)
  .filter((file) => file.isFile())
  .map((file) => file.name);
const old_specs = parse(
  await readFile(`${process.cwd()}/src/app/gallery/photos.yaml`, "utf-8"),
);
let specs_by_relpath = new Map(old_specs.map((spec) => [spec.image, spec]));

for (const filename of filenames) {
  const relpath = `/photos/${filename}`;
  const thumbnail = `/photos/thumbnails/${filename}`;
  const fullpath = `${process.cwd()}/public${relpath}`;

  console.log(relpath);

  const metadata = await sharp(fullpath).metadata();

  // generate thumbnail
  await sharp(fullpath)
    .resize(384)
    .toFile(`${process.cwd()}/public${thumbnail}`);

  if (!specs_by_relpath.has(relpath)) {
    specs_by_relpath.set(relpath, {
      image: relpath,
      width: metadata.width,
      height: metadata.height,
      title: "__no_name__",
      time: new Date().toISOString(),
      thumbnail: thumbnail,
    });
  } else {
    const spec = specs_by_relpath.get(relpath);
    spec.width = metadata.width;
    spec.height = metadata.height;
    spec.thumbnail = thumbnail;
  }
}

const specs = Array.from(specs_by_relpath.values());
await writeFile(
  `${process.cwd()}/src/app/gallery/photos.yaml`,
  stringify(specs, { lineWidth: -1 }),
);
