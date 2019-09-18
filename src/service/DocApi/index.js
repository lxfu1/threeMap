import { convertQueryString } from 'utils';

const SERVER = '/povertymap-server';

const API = {
    lt: '/require/postType',
    lm: '/require/education',
    lb: '/require/workYear',
    mt: '/require/count2sub',
    map: '/require/allRequire',
    mb: '/require/age',
    rt: '/require/lackLevel',
    rm: '/require/gender',
    rb: '/require/cooperationType'
};

export const GetAPI = (key, code, params) => {
    let url = `${SERVER}${API[key]}/${code}${convertQueryString(params)}`;

    return url;
};
