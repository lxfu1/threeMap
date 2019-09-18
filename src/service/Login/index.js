import resource from 'resource';
import API from 'api';
import { TOKEN, USER, TOCENTYPE, REFRESHTOKEN, ckTimes, refreshTimes, remerberTimes } from 'constants/storage';
import { message } from 'antd';

class LoginService {
    login = params => {
        return resource.post(API.login.post, params).then(res => {
            if (res.code === 200) {
                CK.setCookie(TOKEN, res.data.token, ckTimes);
                CK.setCookie(REFRESHTOKEN, res.data.retoken, params.record ? remerberTimes : refreshTimes);
                CK.setCookie('user', Base64.decode(res.data.token.split('.')[1]));
                if (params.remember) {
                    // 记住密码
                    localStorage.setItem('remerber', 1);
                } else {
                    localStorage.setItem('remerber', '');
                }
                return true;
            }
            message.info(res.message);
            return res;
        });
    };
}

export default new LoginService();
