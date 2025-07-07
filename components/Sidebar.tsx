import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faPhotoFilm,
  faTicket,
  faInfo,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="bg-blue-600">
      <div className="flex items-center justify-center mt-4">
        <Image
          src="/aljabr-logo-white.webp"
          alt="Logo"
          width={200}
          height={200}
        />
      </div>
      <div className="mt-5 flex flex-col gap-2">
        <Item icon={faTicket} label="الاكواد" href="/codes" />
        <Item icon={faPhotoFilm} label="الوسائط" href="/media" />
        <Item icon={faInfo} label="المعلومات" href="/info" />
      </div>
    </aside>
  );
}

function Item({
  icon,
  label,
  href,
}: {
  icon: IconProp;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 text-white p-2 pr-6 text-xl hover:pr-8 duration-300 cursor-pointer hover:bg-white/10"
    >
      <FontAwesomeIcon icon={icon} />
      <span>{label}</span>
    </Link>
  );
}
