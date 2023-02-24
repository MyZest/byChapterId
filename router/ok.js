const axios = require('axios');
const md5 = require('js-md5');
const _ = require('lodash');

function getSign(params) {
  let timestamp = Date.parse(new Date()).toString().substr(0, 13);
  const query = Object.keys({ ...params, timestamp })
    .sort()
    .map(
      (x) =>
        `${x}=${encodeURIComponent(_.isNil(params[x]) ? timestamp : params[x])}`
    )
    .join('&');
  const sign = md5(query + '&key=Cartoon$2019&#')
    .toString()
    .toUpperCase();

  return {
    timestamp,
    data: query,
    sign,
  };
}

async function requests({ chapterId = 1012265 }) {
  const getHeaderParams = getSign({
    type: 8,
    refid: '',
    linkid: '',
    recommend: '',
    from: '',
  });
  const { data: getHeader } = await axios({
    url: `http://api.uxprj.com/3/cartoon/domain/get`,
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,zh-CN;q=0.7,zh;q=0.6',
      'Access-token': 'QwxflJ3J3FKoTwIzfhZCEy1f737GSrFU',
      'cache-control': 'no-cache',
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      ..._.pick(getHeaderParams, ['sign', 'timestamp']),
      Referer: 'http://11dm2fd1.ag3vyd8sv9h.com/',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'User-Agent':
        'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
    },
    method: 'post',
    data: _.get(getHeaderParams, 'data'),
  });
  const baseUrl = _.get(
    getHeader,
    'data[0].domain',
    `http://api.uxprj.com/3/cartoon/domain/get`
  );
  const params = getSign({
    chapterId: String(chapterId),
    app: '1',
    refid: '',
    linkid: '',
    recommend: '',
    from: '',
  });
  const { data } = await axios({
    url: `http://api.uxprj.com/3/cartoon/chapter/chapterWithNext`,
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,zh-CN;q=0.7,zh;q=0.6',
      'Access-token': 'QwxflJ3J3FKoTwIzfhZCEy1f737GSrFU',
      'cache-control': 'no-cache',
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      ..._.pick(params, ['sign', 'timestamp']),
      Referer: 'http://11dm2fd1.ag3vyd8sv9h.com/',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'User-Agent':
        'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
    },
    method: 'post',
    data: _.get(params, 'data'),
  });
  let urls = _.map(_.get(data, 'data', []), (x) => x.image);
  urls = urls.reduce((x, y) => {
    return (x = [...x, ...y.map((n) => baseUrl + n.replace(/jpg/g, 'html'))]);
  }, []);

  const imgData = await Promise.allSettled(
    urls.map((n) =>
      axios({
        url: n,
        headers: {
          accept: '*/*',
          'accept-language': 'en-GB,en;q=0.9',
          'cache-control': 'no-cache',
          pragma: 'no-cache',
          Referer: 'http://11dm2fd1.ag3vyd8sv9h.com/',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'User-Agent':
            'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
        },
      })
    )
  );
  const res = _.map(imgData, (n) => _.get(n, 'value.data')).filter(Boolean);
  return res.map((element) => {
    var t = element?.replace(/\+/g, '*');
    t = (t = t.replace(/\//g, '+')).replace(/\*/g, '/');
    return t;
  });
}

module.exports = requests;
