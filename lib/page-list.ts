import {
  HomeIcon,
  PencilLineIcon,
  LibraryIcon,
  FileUserIcon,
  PuzzleIcon,
  CameraIcon,
  BookOpenIcon,
} from "lucide-react";

export const pageList = [
  {
    href: "/",
    label: "Home",
    icon: HomeIcon,
  },
  {
    href: "/posts",
    label: "Writing",
    icon: PencilLineIcon,
  },
  {
    href: "/reading",
    label: "Reading",
    icon: LibraryIcon,
  },
  {
    href: "/the-odyssey",
    label: "Odyssey",
    icon: BookOpenIcon,
  },
  {
    href: "/gallery",
    label: "Gallery",
    icon: CameraIcon,
    hidden: true,
  },
  {
    href: "/about",
    label: "About",
    icon: FileUserIcon,
  },
  {
    href: "/playground",
    label: "Playground",
    icon: PuzzleIcon,
    hidden: false,
  }
]