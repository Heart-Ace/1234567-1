/*
20210121
*/

const $ = new Env('步步寶')
let notice = ''
let bbb_ckArr = [], bbb_ck = "";
const notify = $.isNode() ? require('./sendNotify') : '';

if ($.isNode()) {

if (process.env.BBB_CK && process.env.BBB_CK.indexOf('\n') > -1) {
  bbb_ck = process.env.BBB_CK.split('\n');
  console.log(`您选择的是用换行隔开\n`)
  } 
  else
  {
  bbb_ck = process.env.BBB_CK.split()
  } 
  Object.keys(bbb_ck).forEach((item) => {
        if (bbb_ck[item]) {
          bbb_ckArr.push(bbb_ck[item])
        }
  })

      console.log(`============ 共${bbb_ckArr.length}个账号  =============\n`)
      console.log(`============ 脚本执行-国际标准时间(UTC)：${new Date().toLocaleString()}  =============\n`)
      console.log(`============ 脚本执行-北京时间(UTC+8)：${new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toLocaleString()}  =============\n`)
}



now = new Date(new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000);  

if (typeof $request !== 'undefined') {
   if ($request && $request.method != `OPTIONS` && $request.url.indexOf('user/profile') != -1) {
     const CookieVal = JSON.stringify($request.headers)
if(CookieVal)$.setdata(CookieVal,'bbb_ck')
     $.log(`CookieVal:${CookieVal}`)
     $.msg($.name,"获取Cookie成功")
     $.done()
   }
} 


!(async () => {

  if (!bbb_ckArr[0]) {
    console.log($.name, '【提示】请把CK填入Github 的 Secrets 中，请以回车隔开')
    return;
  }
  
    for (let i = 0; i < bbb_ckArr.length; i++) {
    if (bbb_ckArr[i]) {
      CookieVal = bbb_ckArr[i];
      notice = '';
      $.msg($.name,"開始🎉🎉🎉")
      await userInfo()
      await cash()
      /*
      for (let h = 0; h < 30; h++) {
      console.log(`🚴‍♀️开始执行第${h+1}次阅读🚴‍♀️\n`)    
      await news()
            } 
      */
      for (let k = 0; k < 4; k++) {
      console.log(`🚴‍♀️开始领取第${k+1}阶段步数奖励🚴‍♀️\n`)    
      await donejin()
            }       
      await collsteps()
      await userInfo()
      await showmsg()
      }  
            }  
     console.log(`🏃‍♂️🏃‍♂️🏃‍♂️所有任务已完成🏃‍♂️🏃‍♂️🏃‍♂️`)      

})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())

function showmsg(){
  if ($.isNode()){
     $.log(notice)

       notify.sendNotify($.name,notice)

   }else{
      $.log(notice)

    $.msg($.name, '', notice)
}

     }

var getBoxId = (function () {
    var i = 0;
    return function () {
        return ++i;
    };
})();



function userInfo() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let userInfo ={
    url: 'https://bububao.duoshoutuan.com/user/profile',
    headers: JSON.parse(CookieVal),
}
   $.post(userInfo,async(error, response, data) =>{
     const userinfo = JSON.parse(data)
     if(response.statusCode == 200 && userinfo.code != -1){
          $.log('\n🎉模擬登陸成功\n')
     notice += '🎉步步寶帳號: '+userinfo.username+'\n'+'🎉當前金幣: '+userinfo.jinbi+'💰 約'+userinfo.money+'元💸\n'
    }else{
     notice += '⚠️異常原因: '+userinfo.msg+'\n'
           }
          resolve()
    })
   })
  } 


function cash() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let tixian ={
    url: `https://bububao.duoshoutuan.com/user/tixian`,
    headers: JSON.parse(CookieVal),
    body:`tx=0.3&`
}
   $.post(tixian,async(error, response, data) =>{
     const cash = JSON.parse(data)
      if(cash.code == 1) {
          $.log('\n🎉提现:0.3元'+cash.tip+'💰\n')
         }else{
          $.log('\n⚠️提现:0.3元'+cash.msg+'\n')
         }
          resolve()
    })
   })
  } 

//开始阅读新闻/观看视频
function news() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let news ={
    url: `https://bububao.duoshoutuan.com/user/news`,
    headers: JSON.parse(CookieVal),
    body: `type_class=2&`,
}
   $.post(news,async(error, response, data) =>{
$.log('\n🔔開始查询阅读ID\n')
     const code = JSON.parse(data)
      if(code.code == 1) {
      newsStr = code.nonce_str
$.log('\n🔔查詢阅读ID成功${newsStr},等待30s後領取首頁紅包\n')
          await $.wait(30000)
          await donenews()
           }
          resolve()
    })
   })
  } 

//领取阅读新闻/观看视频奖励
function donenews() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let donenews ={
    url: `https://bububao.duoshoutuan.com/you/donenews`,
    headers: JSON.parse(CookieVal),
    body: `nonce_str=${newsStr}&`,
}
   $.post(donenews,async(error, response, data) =>{
     const read = JSON.parse(data)
$.log('\n🔔開始領取阅读奖励\n')
     $.log('\n${donenews}\n')
      if(read.code == 1) {
          $.log('\n🎉阅读金幣:'+read.jinbi+'金幣\n')
           }else{
          $.log('\n⚠️阅读金幣領取失敗:'+read.msg+'\n')
           }
          resolve()
    })
   })
  } 

//首页步数奖励
function donejin() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let donejin ={
    url: `https://bububao.duoshoutuan.com/user/donejin`,
    headers: JSON.parse(CookieVal),
}
   $.post(donejin,async(error, response, data) =>{
$.log('\n🔔開始领取步数奖励&查詢翻倍奖励ID\n')
     const code = JSON.parse(data)
      if(code.code == 1) {
$.log('\n🎉步数奖励金幣:'+code.jinbi+'\n')
      doubelStr = code.nonce_str
$.log('\n🔔查詢翻倍奖励ID成功,等待30s後領取翻倍奖励\n')
          await $.wait(30000)
          await donejinCallback()
           }else{
          $.log('\n⚠️步数奖励領取失敗:'+code.msg+'\n')
           }
          resolve()
    })
   })
  } 

//首页步数奖励翻倍
function donejinCallback() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let donejinCallback ={
    url: `https://bububao.duoshoutuan.com/you/callback`,
    headers: JSON.parse(CookieVal),
    body: `nonce_str=${doubelStr}&tid=20&pos=1&`,
}
   $.post(donejinCallback,async(error, response, data) =>{
     const code = JSON.parse(data)
$.log('\n🔔開始領取翻倍奖励\n')
      if(code.code == 1) {
          $.log('\n🎉翻倍奖励領取成功\n')
           }else{
          $.log('\n⚠️翻倍奖励領取失敗:'+code.msg+'\n')
           }
          resolve()
    })
   })
  } 


//首页步数兑换
function collsteps() {
return new Promise((resolve, reject) => {
  let timestamp=new Date().getTime();
  let collsteps ={
    url: `https://bububao.duoshoutuan.com/user/collsteps`,
    headers: JSON.parse(CookieVal),
    body:`duihuan_dialog=1&`
}
   $.post(collsteps,async(error, response, data) =>{
     const steps = JSON.parse(data)
      if(steps.code == 1) {
          $.log('\n🎉兑换步数:'+steps.jinbi+'金幣\n')
         }else{
          $.log('\n⚠️兑换步数:'+steps.msg+'\n')
         }
          resolve()
    })
   })
  } 



function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
