// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Yup',
  tagline: 'Schema builder for runtime value parsing and validation',
  url: 'https://yup_docs_web.vercel.app',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'jquense',
  projectName: 'yup',
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Yup',
        // logo: {
        //   alt: 'Yup logo',
        //   src: 'img/logo.svg',
        // },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Getting Started',
          },
          {
            type: 'doc',
            docId: 'schema',
            position: 'left',
            label: 'Schema basics',
          },
          {
            type: 'doc',
            docId: 'typescript',
            position: 'left',
            label: 'TypeScript',
          },
          {
            type: 'doc',
            docId: 'error',
            position: 'left',
            label: 'Error message',
          },
          {
            type: 'doc',
            docId: 'Api/yup',
            position: 'left',
            label: 'API',
          },
          {
            href: 'https://github.com/jquense/yup',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting Started',
                to: '/docs/intro',
              },

              {
                to: '/docs/schema',
                label: 'Schema basics',
              },
              {
                to: 'docs/typescript',
                label: 'TypeScript',
              },
              {
                to: 'docs/error',
                label: 'Error message',
              },
            ],
          },
          {
            title: 'Github',
            items: [
              {
                label: 'Issues',
                href: 'https://github.com/jquense/yup/issues',
              },
              {
                label: 'Pull Requests',
                href: 'https://github.com/jquense/yup/pulls',
              },
              {
                label: 'Repository',
                href: 'https://github.com/jquense/yup',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Yup. Website made by Fernando Belotto`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
