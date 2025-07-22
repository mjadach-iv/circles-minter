import { Link } from "@heroui/react";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "../config/site";
import { title, subtitle } from "../components/primitives";
import { GithubIcon } from "../components/icons";
import DefaultLayout from "../layouts/default";
import Clock from "../components/clock";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <div>
        <Clock />
      </div>
    </DefaultLayout>
  );
}
