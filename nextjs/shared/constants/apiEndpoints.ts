const ROOT = "/api";
const DATA = `${ROOT}/data`;
const AUTH = `${ROOT}/auth`;

export const API_ENDPOINTS = {
  ROOT,
  DATA: {
    ROOT: DATA,
    CREATE: `${DATA}/create`,
    READ: `${DATA}/read`,
    UPDATE: `${DATA}/update`,
    DELETE: `${DATA}/delete`,
  },
  AUTH: {
    ROOT: AUTH,
    LOGIN: `${DATA}/login`,
  },
};
