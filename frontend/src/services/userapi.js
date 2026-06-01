// services/userApi.js

import { apiFetch } from "./api";

export const getProfile = () => apiFetch("/user/getprofile");