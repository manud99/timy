import { graphConfig } from "./auth";
import axios from "axios";

type QueryOptions = {[key: string]: string};

export async function queryMsGraph(endpoint: string, config: QueryOptions, accessToken: string) {
    let url = endpoint == '' ? graphConfig.graphMeEndpoint : `${graphConfig.graphMeEndpoint}/${endpoint}`;
    const keys = Object.keys(config);
    if (keys.length > 0) {
        url += '?' + keys.map(key => `${key}=${config[key]}`).join('')
    }
    const response = await axios.get(url, {headers: {"Authorization": `Bearer ${accessToken}`}});
    return response.data;
}
