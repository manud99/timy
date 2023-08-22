import { graphConfig } from "./auth";
import axios from "axios";

export async function queryMsGraph(accessToken: string, endpoint: string) {
    const url = endpoint == '' ? graphConfig.graphMeEndpoint : `${graphConfig.graphMeEndpoint}/${endpoint}`;
    const response = await axios.get(url, {headers: {"Authorization": `Bearer ${accessToken}`}});
    return response.data;
}
