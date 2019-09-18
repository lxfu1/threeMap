export const random = (from, to) => {
    if (!to) {
        to = from;
        from = 0;
    }
    return parseInt(Math.random() * (to - from) + from);
};

export const convertTime = time => {
    const str = String(time);
    let date;

    if (str.length !== String(parseInt(str)).length) {
        return new Date(str).getTime();
    }
    return parseInt(str);
};

export const mergyApi = (api = {}, ...prefix) => {
    for (let key in api) {
        if (typeof api[key] === 'object') {
            mergyApi(api[key], prefix);
        } else {
            prefix.forEach(item => api[key] = `${item}${api[key]}`);
        }
    }

    return api;
};

export const convertQueryString = params => {
    if (!params) {
        return '';
    }
    var query = '';

    for (let key in params) {
        if (params[key] || params[key] === 0) {
            if (query.indexOf('?') === -1) {
                query = query + `?${key}=${params[key]}`;
            } else {
                query = query + `&${key}=${params[key]}`;
            }
        }
    }
    return query;
};

export const deepCopy = obj => {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    let result = Array.isArray(obj.slice && obj.slice()) ? [] : {};

    if (result instanceof Array) {
        for (let i = 0; i < obj.length; i++) {
            result[i] = deepCopy(obj[i]);
        }
    } else {
        for (let key in obj) {
            result[key] = deepCopy(obj[key]);
        }
    }

    return result;
};

export const formatOracleDate = date => {
    return date;
};

export const translateNumber = (data, places, symbol, thousand, decimal) => {
    if (!data) {
        return 0;
    }
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    symbol = symbol !== undefined ? symbol : ' ';
    thousand = thousand || ', ';
    decimal = decimal || '.';
    var number = data,
        negative = number < 0 ? '-' : '',
        i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(places), 10)),
        j = (j = i.length) > 3 ? j % 3 : 0;

    return (
        symbol +
        negative +
        (j ? i.substr(0, j) + thousand : '') +
        i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousand) +
        (places ?
            decimal +
              Math.abs(number - i)
                  .toFixed(places)
                  .slice(2) :
            '')
    );
};

export function isDeepEmpty(obj) {
    let result = true;

    if (typeof obj !== 'object' && (obj || obj === 0)) {
        return false;
    }
    for (let key in obj) {
        if (typeof obj[key] === 'object') {
            result = isDeepEmpty(obj[key]);
            if (!result) {
                return result;
            }
        } else if (obj[key] || obj[key] === 0) {
            return false;
        }
    }
    return result;
}

export function formatDate(d, type = 'second', split = ['-', ':']) {
    if (!d) {
        return;
    }

    const str = String(d);
    let date;

    if (str.length !== String(parseInt(str)).length) {
        date = new Date(str);
    } else {
        date = new Date(parseInt(str));
    }

    const year = date.getFullYear();
    const month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    const minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    const second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

    let splitStr;

    switch (type) {
    case 'day':
        splitStr = String(split[0]);
        return year + splitStr + month + splitStr + day;
    case 'month':
        splitStr = String(split[0]);
        return year + splitStr + month;
    default:
        return year + split[0] + month + split[0] + day + ' ' + hour + split[1] + minute + split[1] + second;
    }
}

export const deepMerge = (...objects) => {
    const result = {};

    objects.forEach(item => {
        if (!item) {
            return;
        }
        Object.keys(item).forEach(d => {
            if (
                result[d] &&
                typeof result[d] === 'object' &&
                typeof item[d] === 'object' &&
                !(result[d] instanceof Array) &&
                !(item[d] instanceof Array)
            ) {
                result[d] = deepMerge(result[d], item[d]);
            } else {
                result[d] = item[d];
            }
        });
    });
    return result;
};

// 将后端返回数据的区域名转为与echarts地图JSON同名
export const convertArea = ite => {
    switch (ite) {
        // 贵州省
    case '黔西南布依族苗族自治州':
        return '黔西南州';

    case '黔南布依族苗族自治州':
        return '黔南州';

    case '黔东南苗族侗族自治州':
        return '黔东南州';

        // 毕节市
    case '威宁彝族回族苗族自治县':
        return '威宁县';

        // 遵义市
    case '务川仡佬族苗族自治县':
        return '务川县';

        // 铜仁市
    case '沿河土家族自治县':
        return '沿河县';

        // 安顺市
    case '紫云苗族布依族自治县':
        return '紫云县';

        // 黔南州
    case '三都水族自治县':
        return '三都县';

    default:
        return ite;
    }
};

// 将地图JSON中各区域点转成echarts描effectScatter涟漪点数据
export const convertScatterData = data => {
    const features = data.features;
    let arr = [];

    if (features && features.length) {
        for (let i = 0; i < features.length; i++) {
            let ite = features[i];

            arr.push({
                name: ite.properties && ite.properties.name,
                value: ite.properties && ite.properties.cp
            });
        }
    }
    return arr;
};

// 将后端返回数据省名格式化和echarts一致
export const formatProvince = name => {
    return name.replace(/省|市|自治区|壮族自治区|回族自治区|维吾尔自治区/, '');
};

/**
 * 元素拖拽
 * import {Drag} from 'utils'
 * Drag(document.querySelector('#id'));
 * */
export const Drag = (ele, type) => {
    let MouseLeft = 0,
        MouseTop = 0;

    ele.onmousedown = function(e) {
        MouseLeft = e.pageX - ele.offsetLeft;
        MouseTop = e.pageY - ele.offsetTop;

        document.onmousemove = function(ev) {
            let oEvent = ev || event;
            let left = oEvent.clientX - MouseLeft;
            let right = oEvent.clientY - MouseTop;
            //判断左边是否过界
            /*if(left<0){
             left=0;
             }*/

            //判断上边是否过界
            /*if(right<0){
             right=0;
             }*/
            if (type === 'horizontal') {
                ele.style.left = left + 'px';
            } else if (type === 'vertical') {
                ele.style.top = right + 'px';
            } else {
                ele.style.left = left + 'px';
                ele.style.top = right + 'px';
            }
        };
        document.onmouseup = function() {
            document.onmousemove = null;
            document.onmouseup = null;
        };
        return false;
    };
};
// @todo 有时间优化一下 大数相加
export function sumStrings(a, b) {
    let res = '',
        c = 0;

    if (a === 0 && b === 0) {
        return 0;
    }
    if (typeof a !== 'number' || typeof b !== 'number') {
        return 0;
    }
    if (typeof a === 'number') {
        a = String(a);
    }
    if (typeof b === 'number') {
        b = String(b);
    }
    a = a.split('');
    b = b.split('');

    while (a.length || b.length || c) {
        c += ~~a.pop() + ~~b.pop();
        res = c % 10 + res;
        c = c > 9;
    }
    return res.replace(/^0+/, '');
}
// @todo 有时间优化一下 逗号分隔字符串 3位一逗号
export function formatNumByComma(a) {
    a = String(a);
    const temp = a
        .split('')
        .reverse()
        .join('')
        .match(/(\d{1,3})/g);

    return (
        (Number(a) < 0 ? '-' : '') +
        temp
            .join(',')
            .split('')
            .reverse()
            .join('')
    );
}

// 数组 => /value1/value2/value3
export const convertSlashString = params => {
    if (!params) {
        return '';
    }
    var query = '';

    params.map(ite => {
        query = query + '/' + ite;
    });

    return query;
};
/**
 * 用于生成uuid
 * import {guid} from 'utils'
 * var uuid = "cms"+guid();
 * */
export const guid = () => {
    return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
};
function S4() {
    return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
}

// 汉字转unicode
export const toUnicode = s => {
    return s.replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g, function(newStr) {
        return '\\u' + newStr.charCodeAt(0).toString(16);
    });
};
export const searchParmToJson = searchStr => {
    return JSON.parse(
        '{' +
            searchStr
                .replace('?', '"')
                .replace(new RegExp(/(&)/g), '","')
                .replace(new RegExp(/(=)/g), '":"') +
            '"}'
    );
};
