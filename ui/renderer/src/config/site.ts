export type siteConfig = {
  name: string;
  description: string;
  navItems: {
    label: string;
    href: string;
  }[];
  navMenuItems: {
    label: string;
    href: string;
    color:
      | "primary"
      | "foreground"
      | "danger"
      | "secondary"
      | "success"
      | "warning"
      | undefined;
  }[];
  links: {
    github: string;
    twitter: string;
    docs: string;
    discord: string;
    sponsor: string;
  };
};

export const siteConfig: siteConfig = {
  name: "Vite + HeroUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Docs",
      href: "/docs",
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Dashboard",
      href: "/",
      color: "primary",
    },
    {
      label: "Accounts",
      href: "/accounts",
      color: "foreground",
    },
    {
      label: "Logout",
      href: "/logout",
      color: "danger",
    },
  ],
  links: {
    github: "https://github.com/frontio-ai/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
