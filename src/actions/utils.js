import resource from '../util/resource';

/**
 * 通过手机号获取验证码
 * @param {string} phone
 */
function getCodeByPhone(phone) {
    return resource.get('/woodpecker-puser/securitys/phonecode?phone=' + phone).catch(err => {
        if (err.response) {
            throw new Error(err.response.data.message);
        } else {
            throw new Error('出错了');
        }
    });
}

export { getCodeByPhone };
