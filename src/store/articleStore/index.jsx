import { observable, useStrict, action } from 'mobx';
import _ from 'lodash'

useStrict(true);

class ArticleStore {
    // '00001e8880098895ff95c38c0a96787a'  测试用的id
    @observable battleList = [];

    @action addBettleItem(itemId) {
        //就存2个值
        if (this.battleList.length >= 2) {
            return false;
        }
        this.battleList = this.battleList.concat([itemId]);
        return true;
    }

    @action getBattleList() {
        return this.battleList;
    }

    @action clearAll() {
        this.battleList = []
    }

    @action
    removeBettleItem(itemId) {
        this.battleList = _.remove(this.battleList, item => item !== itemId)
        return true
    }
}

const articleStore = new ArticleStore();

export default articleStore;
