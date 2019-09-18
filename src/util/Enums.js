class Enums {
    constructor() {
        const enumMap = {
            nation: [
                "汉族", "满族", "回族", "蒙古族", "藏族", "维吾尔族", "苗族",
                "彝族", "壮族", "布依族", "朝鲜族", "侗族", "瑶族", "白族",
                "土家族", "哈尼族", "哈萨克族", "傣族", "黎族", "僳僳族", "佤族",
                "畲族", "高山族", "拉祜族", "水族", "东乡族", "纳西族", "景颇族",
                "柯尔克孜族", "土族", "达斡尔族", "仫佬族", "羌族", "布朗族",
                "撒拉族", "毛南族", "仡佬族", "锡伯族", "阿昌族", "普米族",
                "塔吉克族", "怒族", "乌孜别克族", "俄罗斯族", "鄂温克族", "德昂族",
                "保安族", "裕固族", "京族", "塔塔尔族", "独龙族", "鄂伦春族",
                "赫哲族", "门巴族", "珞巴族", "基诺族", "其他"
            ],
            politicsStatus: ['群众', '共青团员', '中共预备党员', '中共党员'],
            category: [
                '农村籍或自主就业退役士兵',
                '享受抚恤补助的优抚对象',
                '符合政策安置工作条件的退役士兵',
                '军转干部',
                '复员干部',
                '军休干部'
            ],
            homeAdress: [
                {
                    text: '雄县',
                    value: 137138000000
                }, {
                    text: '容城县',
                    value: 137129000000
                }, {
                    text: '安新县',
                    value: 137132000000
                }],
            provinces: [
                '辽宁', '吉林', '黑龙江', '河北', '山西', '陕西', '山东', '安徽', '江苏', '浙江',
                '河南', '湖北', '湖南', '江西', '台湾', '福建', '云南', '海南', '四川', '贵州', '广东',
                '甘肃', '青海', '西藏', '新疆', '广西', '内蒙古', '宁夏', '北京', '天津', '上海', '重庆',
                '香港', '澳门'
            ]

        };

        this.get = (key) => {
            return enumMap[key];
        }

        this.set = (key, value) => {
            enumMap[key] = value;
        }
    }
}

export default new Enums();
