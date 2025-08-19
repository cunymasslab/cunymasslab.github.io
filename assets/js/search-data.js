// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-publications",
          title: "publications",
          description: "Selected Publications",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "List of Active and Recent Projects",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-teaching",
          title: "teaching",
          description: "Courses taught",
          section: "Navigation",
          handler: () => {
            window.location.href = "/teaching/";
          },
        },{id: "nav-people",
          title: "people",
          description: "members of the group",
          section: "Navigation",
          handler: () => {
            window.location.href = "/people/";
          },
        },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "news-a-simple-inline-announcement",
          title: 'A simple inline announcement.',
          description: "",
          section: "News",},{id: "news-a-long-announcement-with-details",
          title: 'A long announcement with details',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/announcement_2/";
            },},{id: "news-a-simple-inline-announcement-with-markdown-emoji-sparkles-smile",
          title: 'A simple inline announcement with Markdown emoji! :sparkles: :smile:',
          description: "",
          section: "News",},{id: "projects-accountable-and-secure-systems",
          title: 'Accountable and Secure Systems',
          description: "",
          section: "Projects",handler: () => {
              window.location.href = "/projects/accountability/";
            },},{id: "projects-internet-censorship-detection",
          title: 'Internet Censorship Detection',
          description: "",
          section: "Projects",handler: () => {
              window.location.href = "/projects/censorship/";
            },},{id: "projects-hierarchical-usage-context-for-software-exceptions",
          title: 'Hierarchical Usage Context for Software Exceptions',
          description: "",
          section: "Projects",handler: () => {
              window.location.href = "/projects/faults/";
            },},{id: "projects-interaction-aware-recommendation-systems-for-software-developers",
          title: 'Interaction-Aware Recommendation Systems for Software Developers',
          description: "",
          section: "Projects",handler: () => {
              window.location.href = "/projects/iarecsys/";
            },},{id: "projects-information-retrieval-for-software-code-and-documentation",
          title: 'Information Retrieval for Software Code and Documentation',
          description: "",
          section: "Projects",handler: () => {
              window.location.href = "/projects/irscd/";
            },},{id: "projects-just-in-time-software-defect-prediction-jit-sdp",
          title: 'Just-In-Time Software Defect Prediction (JIT-SDP)',
          description: "",
          section: "Projects",handler: () => {
              window.location.href = "/projects/jitsdp/";
            },},{id: "projects-computing-education-research-in-software-security",
          title: 'Computing Education Research in Software Security',
          description: "",
          section: "Projects",handler: () => {
              window.location.href = "/projects/secedu/";
            },},{id: "projects-networked-sensing-and-applications",
          title: 'Networked Sensing and Applications',
          description: "",
          section: "Projects",handler: () => {
              window.location.href = "/projects/sensing/";
            },},{id: "projects-software-vulnerability-prediction-svp",
          title: 'Software Vulnerability Prediction (SVP)',
          description: "",
          section: "Projects",handler: () => {
              window.location.href = "/projects/svp/";
            },},{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
