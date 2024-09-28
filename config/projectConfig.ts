export const PROJECT_CONFIG = {
  github: {
    display: true,
    header: 'Github Projects',
    mode: 'automatic',
    automatic: {
      sortBy: 'stars',
      limit: 8,
      exclude: {
        forks: false,
        projects: [],
      },
    },
    manual: {
      // Manually specify projects here if needed
    },
  },
  external: {
    header: 'My Projects',
    projects: [
      {
        title: 'Project Name',
        description: 'Lorem ipsum dolor sit amet.',
        imageUrl:
          'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg',
        link: 'https://example.com',
      },
    ],
  },
};
