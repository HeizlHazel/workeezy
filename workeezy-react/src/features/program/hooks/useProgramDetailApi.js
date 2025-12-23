import api from "../../../api/axios.js";

export async function fetchProgramDetail(id) {
    const res = await api.get(`/api/programs/${id}`);
    return res.data;
}
