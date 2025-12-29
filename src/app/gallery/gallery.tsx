"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

import { Photo } from "@/data/types";
import GalleryItem from "@/app/gallery/item";

export default function Gallery({
  specs,
}: Readonly<{
  specs: Photo[];
}>) {
  const [highlight, setHighlight] = useState<Photo | undefined>(undefined);
  const [cols, setCols] = useState<number>(1);

  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w >= 1280) setCols(3);
      else if (w >= 480) setCols(2);
      else setCols(1);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <>
      <div className={`mt-8 columns-${cols} gap-4`}>
        {Array.from({ length: cols }, (_, idx) =>
          Array.from(
            { length: Math.ceil((specs.length - idx) / cols) },
            (_, k) => specs[idx + k * cols],
          ),
        )
          .flat()
          .filter((photo): photo is Photo => photo !== undefined)
          .map((photo, i) => (
            <GalleryItem spec={photo} setHighlight={setHighlight} key={i} />
          ))}
      </div>
      <dialog id="gallery-highlight" className="modal">
        <div className="modal-box max-w-full">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          {highlight && (
            <>
              <h3 className="font-bold text-xl pb-2">{highlight.title}</h3>
              {highlight.subtitle && (
                <p className="text-md pb-2">{highlight.subtitle}</p>
              )}
              <p className="text-md pb-2">
                {highlight.time.toLocaleDateString()}
              </p>
              <Image
                src={highlight.image}
                alt={highlight.title}
                width={highlight.width}
                height={highlight.height}
              />
            </>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
