export const PATHS = {
  ROOT: `/`,
  INTRO: `/intro`,
  LOGIN: `/login`,
  BLOG: {
    ROOT: `/blog`,
    DETAIL: (id: string) => `/blog/${id}`,
    CREATE: `/blog/create`,
    UPDATE: (id: string) => `/blog/${id}/update`,
  },
  PROJECT: {
    ROOT: `/project`,
    DETAIL: (id: string) => `/project/${id}`,
    CREATE: `/project/create`,
    UPDATE: (id: string) => `/project/${id}/update`,
  },
};
