import { config } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TagType, Tag } from "@/lib/types";
import { getIcon } from "@/lib/icon-registry";
import React from "react";
config.autoAddCss = false;

export default function TagBadge({ tag }: Readonly<{ tag: Tag }>) {
  return (
    <div
      className={
        "badge " +
        (tag.type === TagType.award
          ? "badge-success "
          : tag.type === TagType.venue
            ? "bg-base-content text-base-100 font-semibold "
            : "badge-outline badge-secondary ") +
        (tag.type === TagType.venue ? "rounded-md " : " ")
      }
    >
      <a className="whitespace-nowrap">
        {tag.icon === undefined ? undefined : (
          <FontAwesomeIcon icon={getIcon(tag.icon)} />
        )}
        {` ${tag.label}`}
      </a>
    </div>
  );
}
