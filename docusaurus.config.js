// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Learn how to interact with OpenAI models",
  tagline: "A 75-minute workshop on OpenAI GPT Models for Microsoft AI Tour",
  url: "https://GitHub-Insight-ANZ-Lab.io/",
  baseUrl: "/aiapp1day/",

  onBrokenLinks: "ignore",
  onBrokenMarkdownLinks: "ignore",
  trailingSlash: true,

  organizationName: "GitHub-Insight-ANZ-Lab",
  projectName: "aiapp1day",
  deploymentBranch: "main",
  favicon: "img/favicon.ico",

  i18n: {
    defaultLocale: "en",
    locales: ["en", "ko"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      docs: {
        sidebar: {
          hideable: false,
          autoCollapseCategories: false,
        },
      },

      navbar: {
        title: "Learn how to interact with OpenAI models",
        logo: {
          alt: "Workshop: Learn how to interact with OpenAI models",
          src: "img/logo-ws3.png",
        },
        items: [
          {
            type: "localeDropdown",
            position: "right",
          },
        ],
      },

      footer: {
        style: "dark",
        links: [],
        copyright: `Copyright © ${new Date().getFullYear()} Learn how to interact with OpenAI models.`,
      },

      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),

  plugins: [
    [
      "@docusaurus/plugin-ideal-image",
      {
        quality: 96,
        max: 1000, // max resized image's size.
        min: 420, // min resized image's size.
        steps: 4, // #images b/w min and max (inclusive)
        disableInDev: false,
      },
    ],
  ],
};

module.exports = config;
