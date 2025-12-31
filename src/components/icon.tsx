import {
  faGlobe,
  faPaperPlane,
  faFilePdf,
  faVideo,
  faMicrochip,
  faMedal,
  faCalendar,
  faFileLines,
  faFaceSmile,
  faGraduationCap,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import {
  faLinkedin,
  faGithub,
  faXTwitter,
  faFacebook,
  faInstagram,
  faGoogleScholar,
  faOrcid,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { Icon } from "@/lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SelectedFontAwesomeIcon({
  icon,
}: Readonly<{ icon: Icon }>) {
  const icons = [
    faPaperPlane,
    faFilePdf,
    faVideo,
    faGithub,
    faGlobe,
    faGoogleScholar,
    faOrcid,
    faLinkedin,
    faXTwitter,
    faInstagram,
    faFacebook,
    faYoutube,
    faMicrochip,
    faMedal,
    faCalendar,
    faFileLines,
    faFaceSmile,
    faGraduationCap,
    faUserPlus,
  ] as const;
  const selectedIcon = icons[icon];
  if (!selectedIcon) {
    console.error(`[SelectedFontAwesomeIcon] Invalid icon index: ${icon}`);
    return null;
  }
  return <FontAwesomeIcon icon={selectedIcon} />;
}
