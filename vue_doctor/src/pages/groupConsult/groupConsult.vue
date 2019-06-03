<template>
  <div class="container groupConsult" :style="containerStyle">
    <div class="backTip"  v-show="backTip">
      <div class="backCon">
        <h6>您还未回复此患者</h6>
        <button @click.stop="$router.routeBack()">稍后回答</button>
        <button @click.stop="replayed" >不用回答</button>
        <button @click.stop="otherAsk">请团队其他成员回答</button>
        <img  src="../../assets/media/img/group_consult_close.png" alt="" @click.stop="backTip = false">
      </div>
    </div>
    <div class="chatContent">
      <div :class="['chatnav','groupChatNav',{'groupChatNavDoc' : patId == 'empty'}] ">
        <b @click.stop="isBack"></b>
        <div class="sele" >
          <a href="javascript:;" class="teamInfo">{{teamInfo.team.title}}</a>
          <i class="icon" ><router-link :to="`/${patId}/${id}/teamDocChartList`" v-show="patId == 'empty'" class="a"></router-link>
          <router-link :to="`/${id}/teamSetPreview`" v-show="patId == 'empty'"  class="set"></router-link></i>
        </div>
      </div>
      <div class="unreadnum" v-show="unreadnum > 0" @click.stop="backUnread">
        {{unreadnum > 99 ?  '99+' : unreadnum}}条新消息
      </div>
      <template  v-if="is_certified">
        <div class="invite_certified">
          <i class="icon-certificate-tip" style="font-size: 0.36rem">
            <span class="path1"></span><span class="path2"></span>
          </i>
          您还未成为认证医生,<router-link to="/certificate/addInfo">点击此处去认证</router-link>
        </div>
      </template>
      <!--已认证显示订单状态-->
      <template v-else-if="docInfo.long_free_switch != '2' && patInfo.account != 'empty'">
        <!--订单在进行中-->
        <template v-if="service.order_status == '2'" >
          <div class="invite_certified">
            <!--订单类型  随访类型  图文咨询（按次） 图文咨询（按期）-->
            <template v-if="service.order_type == '8'">
              <div class="hFreeIng">
                <i class="icon-chat-time" style="font-size: 0.36rem"></i>
                图文咨询（团队）服务
              </div>
            </template>
          </div>
        </template>
        <!--订单在已取消和已结束-->
        <template v-else>
          <!--订单在已取消-->
          <div class="invite_certified"  v-show="(service.order_status == '3'  && service.order_type == '8') || service.order_status == '4'">
            <template v-if="service.order_status == '3'">
                <i class="icon-certificate-tip" style="font-size: 0.36rem">
                  <span class="path1"></span><span class="path2"></span>
                </i>
                会员的图文咨询（团队）订单已取消
            </template>
            <!--订单在已结束-->
            <template v-else-if="service.order_status == '4'">
                <i class="icon-certificate-tip" style="font-size: 0.36rem">
                  <span class="path1"></span><span class="path2"></span>
                </i>
                会员的图文咨询（团队）已结束
                <!--<router-link :to="`/freeSetting?acc=${$route.params.chat_hx_account}`">设置随访</router-link>-->
            </template>
          </div>
        </template>
      </template>
      <router-link  :style="{marginTop : (!service.order_status && !is_certified)  ? '0.8rem' : '0'}"  :to="`/${teamInfo.notice.id}/teamNoticeDetail`" class="teamNotice" tag="div" v-show="teamInfo.notice.title && teamInfo.notice.is_read == 2 && patId == 'empty'">
        <div class="teamNoticeCon">
          <h6 class="title">{{teamInfo.notice.title}}</h6>
          <h6 class="tip"><span class="info"><i class="t">{{docInfo.technical}}</i><i class="name">{{teamInfo.owner.name}}</i><i class="time">{{teamInfo.notice.created ? teamInfo.notice.created.substring(0,16) : ''}}</i></span><span class="read">{{teamInfo.notice.read_count}}人已读</span></h6>
        </div>
      </router-link>
      <div :class="['chatWrap']" >
        <div :class="['content','loadWrapper']"  :style="contentStyle"  ref="content" data="copy">
          <loading-more :pulldownLoad="true" @pulldown="load" :data="chatData"  :tip="isTip" @scroll="onScroll"   :scrollTo="scrollTo" :scrollStyle="scrollStyle" >
            <template  v-for="(item,index) in chatData" v-show="chatData.length != 0"  v-if="item">
              <template v-if="item && item.data">
                <!--温馨提示状态   订单进行中-->
                <template v-if="item.data.type == 'chat_replay_tip' && item.order_status == '2'">
                  <!--回复状态  新咨询-->
                  <template v-if="item.replay_status == '1'">
                    <!--12-24  24-46  46-48-->
                    <div class="fServiceTip1"  v-show="item.hour > 12">
                      <template v-if="item.hour < 24">
                        <h6><i></i><span>温馨提醒</span><i></i></h6>
                        <p>会员在耐心等待您的回复，您已<span class="blue">超过12小时</span>未回复,<span class="blue">超过48小时</span>未回复将自动取消该订单</p>
                      </template>
                      <template v-else>
                        <template v-if="item.hour < 46">
                          <h6><i></i><span>温馨提醒</span><i></i></h6>
                          <p>会员在耐心等待您的回复，您已<span class="blue">超过24小时</span>未回复，请尽快回复。</p>
                        </template>
                        <template v-else-if="item.hour >= 46 && item.hour < 48">
                          <h6><i></i><span>温馨提醒</span><i></i></h6>
                          <p>会员在耐心等待您的回复，您已<span class="blue">超过46小时</span>未回复，<span class="blue">2小时内</span>未回复将自动取消该订单。</p>
                        </template>
                        <!--<template v-else-if="item.hour > 48">-->
                        <!--<h6 class="red"><i></i><span>标记提醒</span><i></i></h6>-->
                        <!--<p>您已<span class="blue">超过48小时</span>未回复，如仍未及时回复会员可以申请取消订单</p>-->
                        <!--</template>-->
                      </template>
                    </div>
                  </template>
                  <!--待回复状态-->
                  <template v-else-if="item.replay_status == '2'">
                    <!--12-24  24-46  46-48-->
                    <div class="fServiceTip1"  v-show="item.hour > 12">
                      <template v-if="item.hour < 24">
                        <h6><i></i><span>温馨提醒</span><i></i></h6>
                        <p>会员在耐心等待您的回复，您已<span class="blue">超过12小时</span>未回复。</p>
                      </template>
                      <template v-else>
                        <template v-if="item.hour < 46">
                          <h6><i></i><span>温馨提醒</span><i></i></h6>
                          <pf>会员在耐心等待您的回复，您已 <span class="blue">超过24小时</span>未回复，请尽快回复。</pf>
                        </template>
                        <template v-else-if="item.hour >= 46">
                          <h6><i></i><span>温馨提醒</span><i></i></h6>
                          <p>您已<span class="blue">超过46小时</span>未回复，<span class="blue">请在2小时内回复。</span></p>
                        </template>
                        <!--<template v-else-if="item.hour > 48">-->
                        <!--<h6 class="red"><i></i><span>标记提醒</span><i></i></h6>-->
                        <!--<p>您已<span class="blue">超过48小时</span>未回复，如仍未及时回复会员可以申请取消订单</p>-->
                        <!--</template>-->
                      </template>
                    </div>
                  </template>
                </template>
                <template v-else-if="item.data.type == 'team_inquiry_service'" v-show="item.from == patInfo.hx_account">
                  <span class="chatTime" v-show="item.data.time"><span>{{item.data.time}}</span></span>
                  <i></i>
                  <div class="serviceInfo">
                    <h6 class="title">
            <span class="left">
              <i class="consult icon-chat-consult">
              <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span>
              </i> <span>图文咨询</span> <span class="price">(￥{{item.data.pay_amount}}/<span :data-id="`o${item.data.order_no}`">{{item.data.order_Datatext}}{{oderCount(item)}}</span>条)</span>
            </span>
                      <span class="status">已购买</span></h6>
                    <ul class="serviceBaseInfo">
                      <li><span>会员姓名：</span>{{item.data.member_name}}（{{item.data.relation}}）</li>
                      <li :class="['illDetail',{'illDetail-active' : item.show}]"><span>病情描述：</span>{{item.data.ill_desc ? item.data.ill_desc : '未填写'}}</li>
                      <div class="images"   v-show="item.show  && item.data.ill_imgs.length != 0">
                        <img v-img1="item1.path" src=""   @click.stop="preView(item1.path)"    alt="" v-for="item1 in item.data.ill_imgs">
                      </div>
                      <li class="line" v-show="item.show  && item.data.ill_imgs.length != 0 "></li>
                      <li :class="['illDetail',{'illDetail-active' : item.show}]"><span>用药记录：</span>{{item.data.drug_desc ? item.data.drug_desc : '未填写'}}</li>
                      <div class="images" v-show="item.show  && item.data.drug_imgs.length != 0">
                        <img v-img1="item1.path" alt="" src=""  @click.stop="preView(item1.path)"   v-for="item1 in item.data.drug_imgs">
                      </div>
                    </ul>
                    <h6 class="btn"  v-if="item.data.ill_imgs.length != 0 || item.data.drug_imgs.length != 0"><button @click.stop="scrollRefresh(item)">{{item.show ? '收起' : '展开详情'}}</button></h6>
                  </div>
                  <template v-if="item.data.question">
                    <div class="patient inquiry_service_text" v-show="JSON.parse(item.data.question).length != 0">
                      <img  class="patient-img" v-img1="item.data.fromHead" alt="" >
                      <span class="patient-text"  >
                希望您解决的问题：
                <template v-for="item2 in JSON.parse(item.data.question)">
                <span  v-html="`${item2};`"></span>
                </template>
                <b class="triangle"></b></span>
                    </div>
                  </template>
                  <div class="fServiceTip1">
                    <h6 class="title"><i></i><span>开始咨询</span><i></i></h6>
                    <p>会员在耐心等待您的回复，本订单<span class="blue">超过24小时未回复</span>自动取消。该平台仅为与会员线上咨询、交流，不能够替代处方、诊断和治疗方案使用。</p>
                  </div>
                </template>
                <template v-else-if="item.data.type == 'team_order'" >
                  <template v-if="item.from == patInfo.hx_account">
                    <!--订单状态  取消 结束-->
                    <!--取消订单-->
                    <template v-if="item.data.order_status == '3'">
                      <!--新咨询状态是系统取消 待回复状态是人工取消-->
                      <!--系统取消-->
                      <template v-if="item.data.replay_status == '1'">
                        <i></i>
                        <div class="fServiceTip" >
                          <h6 class="title red">订单已取消</h6>
                          <p>您<span class="red">已超过24小时</span>未回复，系统已经自动<span class="red">取消该订单</span>，继续回复将视为免费回复，不会有收入</p>
                        </div>
                      </template>
                      <!--人工取消-->
                      <template v-if="item.data.replay_status == '2'">

                      </template>
                    </template>
                    <!--超过48小时未回复-->
                    <template v-else-if="item.data.order_status == '2' && item.data.over_time == '48'">
                      <div class="fServiceTip1">
                        <h6 class="red"><i></i><span>温馨提醒</span><i></i></h6>
                        <p>您已<span class="blue">超过24小时</span>未回复，如仍未及时回复会员可以申请取消订单</p>
                      </div>
                    </template>
                    <!--结束订单-->
                    <!--<template v-else-if="item.data.order_status == '4'">-->
                    <!--<div class="fServiceTip1">-->
                    <!--<h6 class="title"><i></i><span>开始服务</span><i></i></h6>-->
                    <!--<p>会员在耐心等待您的回复，本订单<span class="blue">超过48小时未回复</span>自动取消。该平台仅为与会员线上咨询、交流，不能够完全替代处方、诊断和治疗方案使用。</p>-->
                    <!--</div>-->
                    <!--<div class="fServiceTip">-->
                    <!--<h6 class="title red">订单已取消</h6>-->
                    <!--<p>您<span class="red">已超过48小时</span>未回复，系统已经自动<span class="red">取消该订单</span>，继续回复将视为免费回复，不会有收入</p>-->
                    <!--</div>-->
                    <!--如果是图文咨询（按次） 需要有按钮-->
                    <!--{{orderStatus(item.data)}}-->
                    <!--</template>-->
                  </template>
                </template>
                <!--聊天消息-->
                <template v-else>
                  <span class="chatTime" v-show="item.data.time"><span>{{item.data.time}}</span></span>
                  <!--pos_{id}  用来实现 点未读消息 直接跳转至 未读位置-->
                  <!--团队用户咨询 医生的聊天数据渲染  或者  团队内部聊天 自己的聊天数据渲染-->
                  <!--医生加入团队操作肯定不在聊天页面  所以：加入消息时不需要更新用户是否属于团队的状态-->
                  <div class="doctor" :id="`pos_${item.id}`" v-if="(/doctor/g.test(item.from) && item.data.text && patId != 'empty') || (patId == 'empty' && item.from == docInfo.hx_account  && item.data.text)">
                    <span class="sendError" v-show="(item.data.relation || ( item.data.type == '@'  && (item.from == docInfo.hx_account || item.data.to == docInfo.hx_account))) && patId != 'empty'" >
                      <span class="tip">
                        <template v-if="item.data.relation == '1'">
                          你们已解除好友关系,请重新进行互加好友操作!
                        </template>
                        <template v-else-if="item.data.relation == '2'">
                           该会员还未加入工作室,点击<span class="send" @click.stop="inviteSubscribe">邀请会员</span>!
                        </template>
                        <template v-else-if="item.data.relation == '3'">
                          您已删除该会员,请到会员报到处重新添加!
                       </template>
                        <!--<template v-else-if="item.data.relation == '5'">-->
                          <!--您已被移除该团队！-->
                       <!--</template>-->
                      <!--@人只有@人和被@人才能看到-->
                       <template v-if="item.data.type == '@' && patId != 'empty'">
                           <template v-if="item.from == docInfo.hx_account">
                             你请<span class="send">{{item.data.text.substring(1)}}</span>回复患者!
                           </template>
                           <template v-else>
                             <span class="send">{{item.data.fromName}}</span>请你回复患者!
                           </template>
                       </template>
                    </span>
                </span>
                       <div class="doctor-content" v-show="!(item.data.type == '@' && patId != 'empty') &&  item.data.type != 'team_join' && item.action != 'teamDoctorRemoved' ">
                         <span class="team_doc_name">{{item.data.fromName || docInfo.name}}</span>
                         <span class="doctor-content_sendStatus">
                            <b class="send-status icon-verify-fail" v-show="item.data.relation || item.data.sendStatus == 'fail'"  @click.stop="reSendMsg(item,index)"></b>
                            <img src="../../assets/media/img/loading2.gif" alt="" class="text-process" v-show="item.data.sendStatus === false">
                         </span>
                         <template v-if="item.data.type == 'text' || (item.data.type == '@' && patId == 'empty')">
                        <span class="doc-text">
                          <template v-if="item.data.text.match('</br>') && item.data.timestamp<1524829057000">
                            <span v-html="item.data.text"></span>
                          </template>
                          <template v-else>
                            <pre>{{item.data.text}}</pre>
                          </template>
                           <b class="triangle"></b>
                        </span>
                         </template>
                         <template v-if="item.data.type == 'doctorOrderTime'">
                           <ul class="doctor-charts" @click.stop="orderTimeBtnShow = false; orderTimeShow = true">
                             <li class="title">{{docInfo.name}}门诊时间表</li>
                             <li class="text">
                               <i class="icon-chat-chart2 icon">
                                 <i class="path1"></i><i class="path2"></i><i class="path3"></i><i class="path4"></i>
                               </i>
                               可以根据我的门诊时间表,安排时间前来门诊就诊
                             </li>
                             <!--<b class="send-status" v-show="item.relation"></b>-->
                             <b class="triangle"></b>
                             <!--<img src="../../assets/media/img/loading2.gif" alt="" class="text-process" v-show="item.data.sendStatus === false">-->
                           </ul>
                         </template>
                         <template v-if="item.data.type == 'requestDeviceData'">
                           <ul class="doctor-charts">
                             <li class="title">邀请会员发送肺功能检测数据</li>
                             <li class="text">
                               <i class="icon-chat-chart1 icon">
                                 <i class="path1"></i><i class="path2"></i><i class="path3"></i><i class="path4"></i>
                               </i>
                               请对方提供近两周肺功能检测数据图表
                             </li>
                             <!--<b class="send-status" v-show="item.relation"></b>-->
                             <b class="triangle"></b>
                             <!--<img src="../../assets/media/img/loading2.gif" alt="" class="text-process" v-show="item.data.sendStatus === false">-->
                           </ul>
                         </template>
                         <template v-if="item.data.type == 'popularArticle'">
                           <ul class="doctor-charts" @click.stop="preViewArticle(item.data.text.id)">
                             <li class="title">{{item.data.text.title || '邀请会员阅读科普文章'}}</li>
                             <li class="text">
                               <span class="popularArticle icon"></span>
                               我给您发送了一篇文章，请仔细阅读，有什么问题请在线咨询我
                             </li>
                             <!--<b class="send-status" v-show="item.relation"></b>-->
                             <b class="triangle"></b>
                             <!--<img src="../../assets/media/img/loading2.gif" alt="" class="text-process" v-show="item.data.sendStatus === false">-->
                           </ul>
                         </template>
                         <template v-else-if="item.data.type == 'img'">
                           <div class="doc-text-img">
                             <div class="img-mask" v-show="item.data.sendStatus === false">
                               <img src="../../assets/media/img/loading1.gif" alt="">
                               <span class="process">{{item.data.process ? item.data.process : ''}}</span>
                             </div>
                             <img src=""  alt="" :style="chatImgData(item.data.text)"  class="doc-text-img" v-img1="item.data.text.src" @click.stop="preView(item.data.text.src)">
                             <!--<b class="send-status" v-show="item.relation"></b>-->
                           </div>
                         </template>
                         <template v-else-if="item.data.type == 'voice'" >
                           <span class="voice-time">{{item.data.text.time}}"</span>
                           <div class="chat-info"  :style="{width : (4.5 * item.data.text.time+70)/100+'rem'}" @click.stop="palyVoice(item)">
                             <b class="voice-bg"  :data-base="item.data.text.src"></b>
                             <b class="triangle"></b>
                             <!--<b class="send-status" v-show="item.relation"></b>-->
                             <!--<img src="../../assets/media/img/loading2.gif" alt="" class="text-process" v-show="item.data.sendStatus === false">-->
                           </div>
                         </template>
                         <img  class="doc-img" v-img1="item.data.fromHead" alt="">
                       </div>
                    <template v-if="item.action == 'teamDoctorRemoved'">
                      <b v-show="false">{{is_member = false}}</b>
                      <h6  class="joinTip remove"><i>您已被移除该团队</i></h6>
                    </template>
                  </div>
                  <div class="patient" :id="`pos_${item.id}`" v-else-if="item.id && ((/patient/g.test(item.from) && patId != 'empty') || (patId == 'empty' && item.from !=  docInfo.hx_account))">
                    <template v-if="(item.data.type == 'team_join' && docInfo.account == teamInfo.owner.account) || (item.data.type != 'team_join')">
                       <template v-if="item.data.type != 'team_join' && item.action != 'teamDoctorRemoved'">
                         <span class="team_pat_name">{{item.data.fromName || patInfo.name}}</span>
                         <img  class="patient-img" v-img1="item.data.fromHead" alt="" >
                         <template v-if="item.data.type == 'text' || (item.data.type == '@' && patId == 'empty')">
                            <span class="patient-text" >
                              <template v-if="item.data.text.match('</br>') && item.data.timestamp<1524829057000">
                                <span v-html="item.data.text"></span>
                              </template>
                              <template v-else>
                                <pre>{{item.data.text}}</pre>
                              </template>
                             <b class="triangle"></b></span>
                         </template>
                         <template v-else-if="item.data.type == 'img'">
                           <img alt="" class="patient-text-img" v-img1="item.data.text.src"   :style="chatImgData(item.data.text)" @click.stop="preView(item.data.text.src)">
                         </template>
                         <template v-else-if="item.data.type == 'voice'" >
                           <div class="chat-info"  :style="{width : (4.5 * item.data.text.time+70)/100+'rem'}" @click.stop="palyVoice(item)">
                             <b class="triangle"></b>
                             <!--<i class="icon"></i>-->
                             <b class="voice-bg"  :data-base="item.data.text.src"></b>
                           </div>
                           <span class="voice-time">{{item.data.text.time}}"</span>
                         </template>
                       </template>
                       <template v-else>
                         <template v-if="item.action == 'teamDoctorRemoved'">
                           <b v-show="false">{{is_member = false}}</b>
                           <h6  class="joinTip remove"><i>您已被移除该团队</i></h6>
                         </template>
                         <template v-else>
                           <h6 class="joinTip"><i>{{item.data.fromName}}医生加入本群聊</i></h6>
                         </template>
                       </template>
                    </template>
                  </div>
                </template>
              </template>
            </template>

          </loading-more>
        </div>
      </div>
      <template v-if="unReadTip.length > 0 || patId != 'empty'">
        <div :class="['unReadTipBtns',{'unReadTipBtns-active': fnShow}]"
             v-show=" unReadTip.length > 1 || unReadTipIndex > 0  || patId != 'empty'">
          <button v-show="unReadTip.length > 0 && unReadTipIndex > 1 && unReadTip[1].arr.length > 1" @click.stop="unReadSkipL">上一位</button>
          <button @click.stop="unReadSkipN" v-show="unReadTip.length > 0 && unReadTip[1].arr.length > 1  && unReadTipIndex < unReadTip[1].arr.length">下一位</button>
          <button @click.stop="otherAsk" v-show="patId != 'empty'">请他人回答</button>
          <button @click.stop="replayed"  :class="{'gray': service.replay_status == '3'}"  v-show="unReadTip.length > 0">不用回答</button>
        </div>
      </template>
      <div class="footer">
        <!--<div class="serviceEndFn" v-show="service.order_status == '4' && service.order_type == '2'">-->
        <!--&lt;!&ndash;v-show="service.order_status == '4' && service.order_type == '2'"&ndash;&gt;-->
        <!--<span class="serviceEndFnTip" >图文咨询已结束</span>-->
        <!--<button class="set-free" @click.stop="$router.push({path : `/freeSetting?acc=${$route.params.chat_hx_account}`})">设置随访</button>-->
        <!--<button @click.stop="$router.push({path : 'pathography'})">添加病例描述</button>-->
        <!--</div>-->
        <!--<div :class="['footer-fn',{'footer-fn-ios' : ver}]">-->
        <div :class="['footer-fn']" v-show=" !(
          inputChange && !this.ver) ">
          <i class="icon_sound icon-chat-voice3" @click.stop="soundShow"></i>
          <span class="text"   @click.stop="inputMaskChange(true)" readonly="true" >{{msgText}}</span>
          <i class="icon_more icon-chat-more" @click.stop="footerShow"></i>
          <!--<span :class="['send',{'send-active' : msgText}]" @click.stop="sendText">发送</span>-->
        </div>
        <div class="footer-select" v-show="fnShow">
          <div class="footer-fn-box footer-fn-box1">
        <span class="photo" @click.stop="$refs.photoFile.click()">
          <i class="icon-chat-footer-photo icon">
                <i class="path1"></i><i class="path2"></i>
          </i>
          <input type="file" name="" value="" ref="photoFile"  @change.stop="uploadImg($event)"><span class="fn-name">图片</span></span>
            <span class="camera" @click.stop="$refs.photoFiles.click()">
          <i class="icon-chat-footer-cerma icon">
                <i class="path1"></i><i class="path2"></i><i class="path3"></i><i class="path4"></i><i class="path5"></i>
          </i>
          <input type="file" name="" value=""  ref="photoFiles" accept="image/*"  capture @change.stop="uploadImg($event)"><span class="fn-name">拍照</span></span>
          <!--<span class="fn-order-time" @click.stop="sendScience">-->
            <!--<i class="icon-chat-footer-scienceing icon">-->
                  <!--<i class="path1"></i><i class="path2"></i><i class="path3"></i>-->
            <!--</i>-->
            <!--<span class="fn-name">科普文章</span>-->
          <!--</span>-->
          </div>
          <!--  调用相机-->
        </div>
        <!--开始录音-->
        <div class="voiceFn" v-show="vStatus == '1'"  @click.stop="startVoice">
          <span>点击录音</span>
        </div>
      </div>
      <div class="voiceRecord" v-show="vStatus != '0' && vStatus != '1'">
        <div class="voiceContent">
          <h6>
            <img src="../../assets/media/img/vGif1.gif" alt="" class="img1" v-show="vGif == '1'">
            <img src="../../assets/media/img/vGif2.gif" alt="" class="img1" v-show="vGif == '2'">
            00 : {{voiceTimeShow}}
            <img src="../../assets/media/img/vGif1.gif" alt="" class="img2" v-show="vGif == '1'">
            <img src="../../assets/media/img/vGif2.gif" alt="" class="img2" v-show="vGif == '2'">
          </h6>
          <img src="../../assets/media/img/voice2.png" alt="" v-show="vStatus == '2'" @click.stop="stopVoice">
          <img src="../../assets/media/img/play.png" alt="" v-show="vStatus == '3'" @click.stop="playWXvoice">
          <img src="../../assets/media/img/pause.png" alt="" v-show="vStatus == '4'" @click.stop="pauseWXvoice">
          <span v-show="vStatus == '2'" @click.stop="stopVoice">点击停止</span>
          <div class="btns" v-show="vStatus == '3' || vStatus == '4'">
            <button @click.stop="cancleSendVoice">取消</button>
            <button @click.stop="sendVoice">发送</button>
          </div>
        </div>
      </div>
      <div class="reply-dialog" v-show="replyShow">
        <ul class="reply-dialog-text">
          <li v-for="item in reply"  @click.stop="selectReply(item)">{{item.content}}</li>
        </ul>
        <button type="button" name="button" class="editReply_btn" @click.stop="skip">编辑</button>
        <button type="button" name="button" class="cancleReply_btn" @click.stop="replyShow = replyShow ? false : true">返回</button>
      </div>
    </div>
    <div :class="['textMask',{'textMask1' : textMask},{'textMask2' : !ver}]">
      <div class="textMaskContent">
        <div class="maskInputContent" >
          <div class="maskInput">
            <textarea class="text"  v-focus="fs"   v-model.trim="msgText"  ref="fText"></textarea>
          </div>
          <div class="fn">
            <button class="send cancle" @click.stop="inputMaskChange(false)">取消</button>
            <button :class="['send',{'send-active' : msgText}]" @click.stop="sendText">发送</button>
          </div>
        </div>
      </div>
    </div>
    <transition name="wear">
      <div class="mask" v-show="textMask" @click.stop="inputMaskChange(false)"></div>
    </transition>

  </div>

</template>

<script>
  import api from '../../fetch/api'
  import Voice from '../../libs/voice'
  import BScroll from 'better-scroll'
  import {Toast,Indicator,MessageBox} from '../../components/hw-components'
  import loadingMore from '../../components/loadingMore.vue'
  import empty from '../../components/empty'
  export default{
    name : 'groupConsult',
    components :{loadingMore,empty},
    data(){return{
      page : 1, timestamp :'',
      id : '',
      fnShow : false,
      msgText :'',
      reply : '',
//      存储当前的音频
      voiceContext : '',
//      存储播放音频的dom
      dom : '',
      isTip : false,
      replyShow : false,
//      0不展开状态  1 点击录音状态 2 录音中状态 3 播放状态 4 暂停状态
      vStatus : '0',
      vGif : '0',
//        录音相关使用变量
      voice :{localId : '', time : 0},
//      计算录音时长的计时器
      timmer : '',
      voiceCount : 0,
//      一些状态的变更以及判断  1.当前时间
      currentTime :  '',
      orderSet : [],
      orderTimeShow : false,
      orderTimeBtnShow : true,
      c1 :false,
      c2 : false,
      actionsheetConfig :{
        show : false,
        btns :[
          {name:'重新发送',method:()=>{}},
          {name:'删除',method:()=>{}},
          {name:'取消',method:()=>{
              this.actionsheetConfig.show = false;
            }},
        ]
      },
//      是否弹出文字输入区域
      textMask : false,
//      是否改变container 及显示textmask的遮罩
      inputChange : false,
//      计算初始屏幕高度
      initHeight : '',
      teamInfo : {
        members : [],
        notice : {},
        owner : {},
        team : {},
        teamChatSet : {}
      },
      unreadnum : '',
      unreadtime : '',
      backTip : false,  //返回是否提示 稍后回答等等内容的弹窗
      is_member : false  //该成员是否是团队成员
    }},
    created(){
      this.init();
      this.unreadnum = this.$route.query.num;
      this.unreadtime = this.$route.query.time;
    },
    watch :{
      fnShow(){
        this.$store.state.chat.scrollTo = 'bottom';
        this.$store.commit('UPDATE_CHAT_DATA','');
      },
      vStatus(){
        if(this.vStatus != '0'){
          this.$store.state.chat.scrollTo = 'bottom';
          this.$store.commit('UPDATE_CHAT_DATA','');
        }
      },
      '$route' : 'routeChange'
    },
    computed:{
      //未认证医生功能是否可用
      uncertify_fn_click(){
        return !this.is_certified || this.service.order_status == '2';
      },
      patInfo (){
        return this.$store.state.chat.patInfo;
      },
      chatData(){
        return this.$store.state.chat.chatData;
      },
      chartLink(){
        let link;
        if(this.patInfo){
          link = `${BREATHE}/frontend/ui/day?isExternal=true&uid=${this.patInfo.breath.uid}`;
        }else{
          link = '';
        }
        return link;
      },
      ver(){
        return this.$store.state.isIOS;
      },
      docHead(){
        return this.$store.getters.docHead;
      },
      patHead(){
        return this.patInfo.headimg;
      },
      conn(){
        return this.$store.state.chat.conn;
      },
      scrollTo(){
        return this.$store.state.chat.scrollTo;
      },
      docInfo(){
        return this.$store.state.docInfo;
      },
      is_certified(){
        return this.$store.state.docInfo.is_certified != '1';
      },
      voiceTimeShow(){
        return  this.voiceCount == 0 ? ( this.voice.time < 10  ? `0${this.voice.time}` : this.voice.time) :  (this.voiceCount < 10 ?  `0${this.voiceCount}` : this.voiceCount);
      },
      service(){
        return this.$store.state.chat.patService;
      },
      unReadTip(){
        if(window.sessionStorage['unReadTipCount']){
          return JSON.parse(window.sessionStorage['unReadTipCount']);
        }else{
          return [];
        }
      },
      unReadTipIndex(){
        let index = 0;
        if(this.unReadTip.length > 0 && this.unReadTip[0].status == '4'){
          this.unReadTip[1].arr.forEach((v,i)=>{
            if(v.team_id == this.id && v.account == this.patInfo.account){
              index = i + 1;
            }
          })
        }
        return index;
      },
      //顶部是否有提示信息
      contentStyle(){
        let height = 0;
//          再加上  回复按钮
        let margin = 0.8;
        if(this.is_certified){
//                height = 0;
          height += 1.6;
          margin = 0;
        }else{
          height += 0.8;
          //终身免费随访的情况
          if(this.docInfo.long_free_switch == '2'){
            height  =  0.8;
          }else{
            //有头部提示的情况
            if(this.service.order_type){
              height += 0.8;
              margin = 0;
            }
          }
          if(this.teamInfo.notice.title && this.teamInfo.notice.is_read == 2 && this.patId == 'empty'){
            height += 1.8;
            margin -= 0.8;
          }
        }
        if(this.fnShow  || this.vStatus != '0'){
          margin += -4.4;
        }
        height += 'rem';
        margin += 'rem';
        this.$store.commit('UPDATE_CHAT_DATA','');
        return { height : `calc(100% - ${height} )` ,marginTop: margin};
      },
      containerStyle(){
        if(this.inputChange){
          if(this.ver){
//                  iso键盘弹起 聊天背景变化
            return { marginTop : `calc( 3.7rem - 100vh)`};
          }else{
//                   安卓键盘弹起 聊天背景变化
            return { marginTop : '-2rem'};
          }
        }else{
          return '';
        }
      },
      scrollStyle(){
        let  bottom;
        bottom = ( this.unReadTip.length > 0  || (this.unReadTip.length > 1 ||  this.unReadTipIndex > 0 ) || this.patId != 'empty') ? 1 : 0;
        if(bottom){
          bottom += 'rem';
          return {paddingBottom : bottom};
        }
      }
    },
    methods : {
      routeChange(){
        this.init();
      },
      //监听滑动位置信息
      onScroll(pos){
        let id = this.$route.query.id;
        if(id){
          let dom = document.querySelector(`#pos_${id}`);
          if(dom && dom.offsetTop >= Math.abs(pos.y)){
            this.unreadnum = 0;
          }
        }
      },
      isBack(){
        if(this.service.replay_status != '3' && this.patId != 'empty' ){
          this.backTip = true;
        }else{
          this.$router.routeBack();
        }
      },
      init(){
        this.$store.commit('UPDATE_NAV',{fShow : false, hShow : false});
        this.patId = this.$route.params.chat_hx_account;
        this.id = this.$route.params.chat_team_id;
        // this.$store.dispatch('updateChatSet').then(_=>{
        //   this.$store.dispatch('gainRecord'); //获取聊天记录
        // }); //更新聊天配置
        let time =  new Date();
        this.currentTime = new RegExp(time.getFullYear() +'/'+(time.getMonth()+1)+'/'+time.getDate());
        this.$store.commit('CLEAR_CHAT_STATE');
        //获取团队信息
        this.$api.teamDetail(this.id).then(obj=>{
          this.teamInfo = obj;
          //判断是否是团队成员 不是成员则返回到链接失效页面
          let arr = [...obj.members,obj.owner];
          let is_mem  = false;
          arr.forEach((v,i)=>{
            if(v.account == this.docInfo.account){
              is_mem = true;
              return;
            }
          })
          this.is_member = is_mem;
          if(!is_mem){
            this.$router.push({path : '/linkFail'});
          }
        })
        this.currentTime = Date.parse(new Date());
      },
      scrollRefresh (v){
        v.show = !v.show
        if(v){
          this.$store.state.chat.scrollTo = '';
          this.$store.commit('UPDATE_CHAT_DATA','');
        }
      },
      //请他人回答
      otherAsk(){
        this.$router.push({path : `/${this.patId}/${this.id}/teamDocChartList`});
      },
      preViewArticle(v){
        if(v){
          this.$router.push({path : `/${v}/2/collectScienceArticle`});
        }
      },
      sendScience(){
        window.sessionStorage['sendScienceing'] = JSON.stringify({acc : this.patInfo.account , hx_acc : this.patInfo.hx_account ,toName :this.patInfo.remark_name || this.patInfo.name || this.patInfo.nick});
        this.$router.push("/myScienceing");
      },
      reSendMsg(v,i){
        if(v.data.relation == '2'){
          this.inviteSubscribe();
        }else{
          if(this.is_member){
            this.actionsheetConfig.show = true;
            this.$store.commit('SET_ACTION_SHEET',this.actionsheetConfig);
            this.actionsheetConfig.btns[0].method = ()=>{
              let t = this.conn.createMsg(v);
              t.data.sendStatus = false;
              if(t.data.type == 'img'){
                this.deleteMsg(v,i);
              }else{
                this.$store.commit('UPDATE_CHAT_DATA',t);
                let index = this.$store.getters.chatDataIndex;
                this.storeMessage(t);
                this.deleteMsg(v,i);
                if(t.data.type == 'voice'){
                  if(t.data.text.localId){
                    wx.uploadVoice.call(this,{
                      localId: t.data.text.src, // 需要上传的音频的本地ID，由stopRecord接口获得
                      isShowProgressTips: 1, // 默认为1，显示进度提示
                      success: res=> {
                        var serverId = res.serverId; // 返回音频的服务器端ID
                        delete t.data.text.localId;
                        this.storeMessage(t);
                        Indicator.open('发送中...');
                        api.sendVoice(serverId)
                          .then(obj=>{
                            t.data.text.src = obj.media;
                            delete t.data.text.serverId;
                            this.storeMessage(t);
                            this.$store.dispatch('sendMsg',{msg : t, index : index })
                          })
                      },
                      fail : res=>{
                        Toast('该文件已损坏，请重新上传！');
                        t.data.sendStatus = 'fail';
                      }
                    })
                  }
                  else if(t.data.text.serverId){
                    Indicator.open('发送中...');
                    if(!/:\/\//g.test(t.data.text.src)){
                      api.sendVoice(t.data.text.src)
                        .then(obj=>{
                          t.data.text.src = obj.media;
                          delete t.data.text.serverId;
                          this.storeMessage(t);
                          this.$store.dispatch('sendMsg',{msg : t, index : index })
                        })
                    }else{
                      Indicator.close();
                      Toast('该文件已损坏，请重新上传！');
                      t.data.sendStatus = 'fail';
                    }
                  }else{
                    this.storeMessage(t);
                    this.$store.dispatch('sendMsg',{msg : t, index : index })
                  }
                }else{
                  this.$store.dispatch('sendMsg',{msg : t, index : index });
                }
              }
            }
            this.actionsheetConfig.btns[1].method = ()=>{
              this.deleteMsg(v,i);
            }
          }else{
            Toast('您已被移除该团队！');
          }
        }
      },
      deleteMsg(v,i){
        let m = JSON.parse(window.localStorage['errMessage']);
        this.$store.state.chat.scrollTo = 'bottom';
        this.$store.state.chat.chatData[i] = '';
        this.$store.commit('UPDATE_CHAT_DATA','');
        if(this.patId == 'empty'){
          delete m[this.docInfo.account][`team_${this.id}`][v.id];
        }else{
          delete m[this.docInfo.account][this.patInfo.account][v.id];
        }
        window.localStorage['errMessage'] = JSON.stringify(m);
        this.actionsheetConfig.show = false;
      },
      inviteSubscribe(){
        MessageBox.confirm('会员将收到邀请通知，是否发送？').then(()=>{
          this.$api.inviteSubscribe(this.$route.params.chat_hx_account).then();
        })
      },
      unReadSkipL(){
        let index = this.unReadTipIndex;
        if(index > 1){
          let o = this.unReadTip[1].arr[index - 2];
          this.$store.state.chat.scrollTo = 'bottom';
          this.$router.push({path : `/${o.account}/${o.team_id}/groupConsult`});
        }
      },
      unReadSkipN(){
        let index = this.unReadTipIndex;
        let o = this.unReadTip[1].arr[index];
        this.$store.state.chat.scrollTo = 'bottom';
        this.$router.push({path : `/${o.account}/${o.team_id}/groupConsult`});
      },
      replayed(){
        if(this.service.replay_status != '3'){
          this.$api.teamReplayed(this.id,this.patId).then(()=>{
            this.$store.state.chat.patService.replay_status = '3';
            this.backTip = false;
          });
        };
      },
      oderCount(v){
        if(v.data.order_Datatext){
          // console.log('订单卡片服务类型已有！');
        }else{
          v.data.order_Datatext = '-';
            this.$api.gTeamIndentDetail(v.data.order_no).then(obj=>{
              if(obj.data.order_type == '8'){
                v.data.order_Datatext = obj.data.count_usage;
                // this.$store.commit('UPDATE_CHAT_SERVICE',obj.data);
                this.$store.commit('UPDATE_CHAT_DATA','');
              }
            })
        }
        return '';
      },
//      聊天中图片的处理
      chatImgData(text){
        let arr3 = [];
        if (/@/.test(text)) {
          var arr1 = text.split('@');
          var arr2 = arr1[1].split('x');
          var width = parseInt(arr2[0]);
          var height = parseInt(arr2[1]);
          var scale = width/height;
          var imgHeight = height;
          var imgWidth = width;
          if (width > 300 || height > 300) {
            if (scale > 1) {
              imgHeight = 300/scale;
              imgWidth = 300;
            }else{
              imgWidth = 300*scale;
              imgHeight = 300;
            }
          }
          arr3 = [arr1[0],imgWidth,imgHeight];
        }else{
          if (text.hasOwnProperty('width')) {
            var scale1 = text.width/text.height;
            if (text.width > 400 || text.height > 400) {
              if (scale1 > 1) {
                text.height = 400/scale1;
                text.width = 400;
              }else{
                text.width = 400*scale1;
                text.height = 400;
              }
            }
            arr3 =  [text.src,text.width,text.height];
          }
        }
        if(arr3[1] == '0'  || !arr3[1]){
          return '';
        }else{
          return `width:${parseFloat(arr3[1])/100}rem;height:${parseFloat(arr3[2])/100}rem`
        }
      },
      soundShow(){
        if(this.uncertify_fn_click){
          this.vStatus = this.vStatus == '1' ?  '0' : '1';
          this.msgText = '';
          this.fnShow = false;
//            this.$refs.fText.style.height = '0.8rem';
        }else{
          Toast('您还未认证功能暂不可用！');
        }
      },
      playWXvoice(){
        this.vStatus = '4';
        this.vGif = '2';
        this.voiceCount = this.voiceCount == this.voice.time ? 0 : this.voiceCount;
        clearInterval(this.timmer);
        wx.playVoice.call(this,{
          localId : this.voice.localId
        })
        this.timmer = setInterval(()=>{
          if(this.voiceCount < this.voice.time){
            this.voiceCount++;
          }else{
            clearInterval(this.timmer);
          }
        },1000);
        wx.onVoicePlayEnd.call(this,{
          success: res => {
            clearInterval(this.timmer);
            this.vStatus = '3';
            this.vGif = '0';
          }
        });
      },
      pauseWXvoice(){
        this.vStatus = '3';
        this.vGif = '0';
        clearInterval(this.timmer);
        wx.pauseVoice.call(this,{
          localId: this.voice.localId
        });
      },
      cancleSendVoice(){
        this.voice.localId = '';
        this.voice.time = 0;
        this.vGif = '0';
        this.vStatus = '1';
        this.timmer =  '',
          this.voiceCount = 0
      },
      stopVoice(){
        clearInterval(this.timmer);
        wx.stopRecord.call(this,{
          success: res=> {
            this.voice.localId = res.localId;
            if(this.voiceCount < 1){
              Toast('当前录音时间过短,请重新录制!');
              this.vGif = '0';
              this.vStatus = '1';
            }else{
              this.voice.time = this.voiceCount;
              this.vGif = '0';
              this.vStatus = '3';
            }
          },
          fail: function (res) {
            console.log(JSON.stringify(res));
          }
        })
      },
      sendVoice(){
        let obj1;
        if(this.vStatus == '4'){
          Toast('请先暂停当前语音在进行发送!');
        }else{
          obj1 = this.conn.createMsg({
            from : this.docInfo.hx_account,
            to : this.patInfo.hx_account,
            data : {
              type : 'voice',
              text : {
                src : this.voice.localId,
                timestamp : Date.parse(new Date()),
                time : this.voice.time,
                localId : true,
                serverId : true
              },
              fromHead : this.docHead,
              sendStatus : false,
              relation : ''
            }
          });
          this.$store.commit('UPDATE_CHAT_DATA',obj1);
          let index = this.$store.getters.chatDataIndex;
//          发送时候不需要在播放录制语音  将所有状态清除掉
          this.vGif = '0';
          this.vStatus = '0';
          this.timmer =  '';
          this.voiceCount = 0;
          this.storeMessage(obj1);
          wx.uploadVoice.call(this,{
            localId: this.voice.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: res=> {
              var serverId = res.serverId; // 返回音频的服务器端ID
              delete obj1.data.text.localId;
              obj1.data.text.src = res.serverId;
              Indicator.open('发送中...');
              api.sendVoice(serverId)
                .then(obj=>{
                  obj1.data.text.src = obj.media;
                  delete obj1.data.text.serverId;
                  this.storeMessage(obj1);
                  this.$store.dispatch('sendMsg',{msg : obj1, index : index }).then(()=>{
                    this.voice.time = 0;
                    this.voice.localId = '';
                  })
                })
            }
          })
        }
      },
      startVoice(){
        this.fnShow = false;
        this.vGif = '1';
        wx.startRecord.call(this,{
          success: ()=>{
//                  同意授权变成录音状态
            setTimeout(()=>{
              this.vGif = '2';
            },500)
            this.vStatus = '2';
            this.timmer = setInterval(()=>{
              this.voiceCount++;
            },1000);
          },
          cancel:  ()=> {
//                   拒绝录音回到原始状态
            this.vStatus = '1';
          }
        });
        wx.onVoiceRecordEnd.call(this,{
          // 录音时间超过一分钟没有停止的时候会执行 complete 回调
          complete: res => {
            Toast('录音已59s自动停止录音!');
            clearInterval(this.timmer);
            this.voice.localId = res.localId;
            this.vGif = '0';
            this.voice.time = 60;
            this.vStatus = '3';
          }
        });
      },
      //未读消息
      backUnread(){
        if(this.unreadnum > 20){
          this.$api.teamChatDocHistory({
            id : this.id,
            acc : this.patInfo.account,
            page : 1,
            time : this.unreadtime
          }).then(obj=>{
            this.$store.state.chat.scrollTo = 'top';
            obj.chats.forEach((v,i)=>{
              this.unreadnum = 0;
              this.$store.commit('UPDATE_CHAT_DATA',[]); //删除之前所有聊天记录
              this.$store.dispatch('addRecord',v);
            })
          })
        }else{
          let id = this.$route.query.id;
          let dom = document.querySelector(`#pos_${id}`);
          let top =  - (dom.offsetTop) + 10;
          this.$store.state.chat.scrollTo = String(top);
          this.$store.commit('UPDATE_CHAT_DATA','');
          this.unreadnum = 0;
        }
      },
      load(v){
        if(v){
          let acc = this.patInfo.account;
          this.page++;
          if(acc && acc != 'empty'){
            this.$api.teamChatHistory({
              id : this.id,
              acc: this.patInfo.account,
              page : this.page
            }).then(obj1=>{
              this.$store.state.chat.scrollTo = 'keep';
              if(obj1.chats.length == 0){
                this.isTip = true;
              }else{
                obj1.chats.forEach((v,i)=>{
                  this.$store.dispatch('addRecord',v);
                })
              }
            })
          }else{
            this.$api.teamChatDocHistory({
              id : this.id,
              page : this.page
            }).then(obj1=>{
              this.$store.state.chat.scrollTo = 'keep';
              if(obj1.chats.length == 0){
                this.isTip = true;
              }else{
                obj1.chats.forEach((v,i)=>{
                  this.$store.dispatch('addRecord',v);
                })
              }
            })
          }
        }
      },
      changeTextarea(e){
        let target = e.target;
        target.style.height = '0.8rem';
        target.style.height = target.scrollHeight > this.$means.changePX(115) ? '1.2rem' : '0.80rem';
        target.style.lineHeight  = target.scrollHeight > this.$means.changePX(115) ? '0.60rem' : '0.80rem';
      },
      footerShow(){
        if(this.uncertify_fn_click){
          this.fnShow = this.fnShow ? false : true;
          this.vStatus = '0';
        }else{
          Toast('您还未认证,功能暂不可用!');
        }
      },
      skip(){
        this.$router.push({path : 'editReply'});
      },
      selectReply(item){
        this.msgText = item.content;
        this.replyShow = this.replyShow ? false : true;
      },
      preView(src){
        if(/^data/.test(src)){
          console.log('base64图片无法预览!');
        }else{
          this.$store.dispatch('wxImgView',src);
        }
      },
      fs(){
        this.fnShow = false;
        this.$store.state.chat.scrollTo = 'bottom';
        this.$store.commit('UPDATE_CHAT_DATA','');
        this.vStatus = '0';
      },
      inputMaskChange(v){
        window.sessionStorage['bodyScroll'] = !v;
        if(this.uncertify_fn_click){
          if(v){
//            为true表示键盘弹起
            setTimeout(()=>{
              this.inputChange = v;
            },160);
//            为true 聚焦  键盘立即弹起
            this.$refs.fText.focus();
          }else{
            this.$refs.fText.blur();
            this.inputChange = v;
          }
          this.textMask = v;
        }else{
          this.textMask = false;
          Toast('您还未认证，功能暂不可用！');
        }
      },
      palyVoice(item){
        if(!item.data.text.localId && !item.data.text.serverId){
          if(this.voiceContext){
            this.voiceContext.close();
            this.voiceContext = '';
          }
          if(this.dom){
            this.dom.classList.remove('voice-bg_active');
          }
          let src = item.data.text.src;
          let time = item.data.text.time.toString();
          let s = new Voice(src);
          s.play()
          this.voiceContext = s.context;
          let target = event.target;
          let dom;
          if(target.className == 'chat-info'){
            dom = target.children[1];
          }else if(target.className == 'voice-time'){
            console.log(target.nextNode);
          }else if(target.className == 'voice-bg'){
            dom = target;
          }
          dom.classList.add('voice-bg_active');
          this.dom = dom;
          setTimeout(function(){
            dom.classList.remove('voice-bg_active');
          },parseInt(time.replace(/"/g,''))*1000);
        }else{
          Toast('失败语音暂不支持播放，请重新发送！');
        }
      },
      storeMessage(data){
        let m1 = window.localStorage['errMessage'];
        let type = this.patId == 'empty';
        if(type){
          m1 = m1 ? JSON.parse(m1) : {[this.docInfo.account] : {[`team_${this.id}`] : {}}};
        }else{
          m1 = m1 ? JSON.parse(m1) : {[this.docInfo.account] : {[this.patInfo.account] : {}}};
        }
        if(!m1[this.docInfo.account]){
          if(type){
            m1[this.docInfo.account] = {[`team_${this.id}`] : {}};
          }else{
            m1[this.docInfo.account] = {[this.patInfo.account] : {}};
          }
        }
        if(type){
          if(!m1[this.docInfo.account][`team_${this.id}`]){
            m1[this.docInfo.account][`team_${this.id}`] = {[data.id] : data};
          }else{
            m1[this.docInfo.account][`team_${this.id}`][data.id] = data;
          }
        }else{
          if(!m1[this.docInfo.account][this.patInfo.account]){
            m1[this.docInfo.account][this.patInfo.account] = {[data.id] : data};
          }else{
            m1[this.docInfo.account][this.patInfo.account][data.id] = data;
          }
        }
        window.localStorage['errMessage'] = JSON.stringify(m1);
      },
      sendText(){
        let t = this.msgText;
        if(t){
          Indicator.open('发送中...');
          let obj1 = this.conn.createMsg({
            from : this.docInfo.hx_account,
            to : this.patInfo.hx_account,
            data : {
              type : 'text',
              text : this.msgText,
              sendStatus : false,
              fromHead : this.docHead,
              relation : ''
            }
          });
          this.$store.commit('UPDATE_CHAT_DATA',obj1);
          this.storeMessage(obj1);
          let index = this.$store.getters.chatDataIndex;
          this.$store.dispatch('sendMsg',{msg : obj1, index : index });
          this.msgText = '';
        }else{
          this.msgText = '';
          Toast('请输入内容!');
        }
      },
      uploadImg(e){
        let f = e.target.files[0];
        let src = window.URL.createObjectURL(f);
        let file = new FormData();
        let obj1;
        file.append('file',f);
        e.target.value = '';
        this.inputMaskChange(false);
//            //加载图片获取图片真实宽度和高度
//            var image = new Image();
//            image.src= src;
//            let _this = this;
//            image.onload = function(){
//              let f1 = new FileReader();
//              f1.onload = ()=>{
//                let obj1 = _this.conn.createMsg({
//                  from : _this.docInfo.hx_account,
//                  to : _this.patInfo.hx_account,
//                  data : {
//                    type : 'img',
//                    text : {
//                      src : f1.result,
//                      width : image.width,
//                      height : image.height
//                    },
//                    sendStatus : false,
//                    relation : ''
//                  }
//                });
//                _this.$store.commit('UPDATE_CHAT_DATA',obj1);
////                _this.storeMessage(obj1);
//                let index = _this.$store.getters.chatDataIndex;
//                _this.$store.dispatch('sendMsg',{msg : obj1, index : index });
//              }
//              f1.readAsDataURL(f);
////              setTimeout(()=>{
////                _this.$store.commit('UPDATE_CHAT_DATA','');
////              },300)
//            };
        obj1 = this.conn.createMsg({
          from : this.docInfo.hx_account,
          to : this.patInfo.hx_account,
          data : {
            type : 'img',
            text : {
              src : src,
              width : '',
              height : '',
            },
            process : '0%',
            fromHead : this.docHead,
            sendStatus : false,
          },
          relation : ''
        });
        this.$store.commit('UPDATE_CHAT_DATA',obj1);
        let index = this.$store.getters.chatDataIndex;
        this.$http.post('/chat/images',file,{
          onUploadProgress :  (progressEvent)=> {
            let pro = parseInt(progressEvent.loaded / progressEvent.total * 100) ;
            // 对原生进度事件的处理
            this.$store.state.chat.chatData[index].data.process = `${pro}%`;

          },
          headers:{'Content-Type':'multipart/form-data'}
        }).then(obj=>{
          if(obj.data.code == 0){
            let data = obj.data;
            obj1.data.text = {
              src :  data.images[0],
              width : data.width,
              height : data.height
            };
            this.$store.dispatch('sendMsg',{msg : obj1, index : index });
          }else{
            Toast(obj.data.errMsg);
            //    图片发送失败  删除到图片
            this.$store.state.chat.chatData.splice(index,1);
          }
        }).catch(_=>{
          this.$store.state.chat.chatData.splice(index,1);
        })
      }
    },
    mounted (){
      this.initHeight = document.body.clientHeight;
      this.$refs.content.addEventListener('touchstart',e=>{
        e.preventDefault();
        document.querySelector('.footer .text').blur();
        this.fnShow =false;
        this.vStatus = false;
      });
      this.$refs.content.addEventListener('touchend',e=>{
        e.preventDefault();
      });
//  ios 点完成收起键盘
      this.$refs.fText.addEventListener('blur',e=>{
        e.preventDefault();
        setTimeout(()=>{
          this.inputMaskChange(false);
        },0)
      });
//        ios 弹起键盘不滑动
      document.querySelector('body').addEventListener("touchmove",(e)=>{
        if(window.sessionStorage['bodyScroll'] == 'true'){
//                e.returnValue = true;
          document.querySelector('body').removeEventListener(e.type,arguments.callee,false);
        }else{
          e.preventDefault();
        }
      });
//        安卓调整背景对话页位置 及 收起键盘处理
      window.onresize = ()=>{
        if(parseInt(this.initHeight) <= (parseInt(document.body.clientHeight) + 20) && !this.ver){
          this.inputMaskChange(false);
        }
        this.$store.commit('UPDATE_CHAT_DATA','');
      };
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../chat/chat.scss";
</style>
