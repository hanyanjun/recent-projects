<template>
<div id="editInfo">
              <reDialog title="编辑权限" :visible.sync="dialogShow" width="510px" @close="resetForm" @submit="submit('form1')">
                <div class="companyCommon examCheckbox" slot="body">
                  <el-form :model="baseInfo" label-width="114px" :rules="rules1" ref="form1">
                    <el-form-item class="dialogForm" label="可见范围" size="medium" prop="ctrlPermi">
                      <el-select v-model="baseInfo.ctrlPermi" @change="changeRange" placeholder="请选择可见范围">
                        <el-option v-for="item in processSeeType.list" :key="item.code" :label="item.name" :value="item.code"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item class="dialogForm resetMemSelect" label="指定人员" size="medium" v-show="baseInfo.ctrlPermi == '1' ">
                      <div class="el-select__tags mem_select_tag"><span>
                          <template v-for="(item,index) in memNames"><span class="el-tag el-tag--info el-tag--small" :key="index"><span class="el-select__tags-text">{{item}}</span><i class="el-tag__close el-icon-close" @click.stop="removeTag(index)"></i></span></template></span></div>
                             <i class="close-icon  pointer el-icon-circle-close"  @click.stop="clearMems" ></i>
                      <el-select class="formSelectNoTags" v-model="memNames" multiple placeholder="请选择指定人员">
                        <template slot-scope="scope">
                          <selectMems  :multiple="true" :initcheckbox="memInitObj" @select="selectMem" :clear.sync="mems"></selectMems>
                          <el-option v-for="(item,index) in [0]" :key="index" :value="item.id"></el-option>
                        </template>
                      </el-select>
                    </el-form-item>
                    <el-form-item class="dialogForm" label="指定部门" size="medium" v-show="baseInfo.ctrlPermi == '1' ">
                      <el-select v-model="baseInfo.deptIdList" multiple placeholder="请选择指定部门">
                        <el-option v-for="item in treeMem.arr" :key="item.id" :label="item.text" :value="item.id">
                          <template slot-scope="scope">
                            <h6 :style="`font-weight:normal;padding-left:${item._level*20}px;width:60%;`"><span :style="{'font-size' : '14px'}">{{item.text}}</span><i>{{item.index}}</i></h6>
                          </template>
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item class="dialogForm" label="" size="medium" prop="deptIdList">
                      <el-select v-model="baseInfo.deptIdList" multiple placeholder="" v-show="false">
                        <el-option v-for="item in treeMem.arr" :key="item.id" :label="item.text" :value="item.id">
                          <template slot-scope="scope">
                            <h6 :style="`font-weight:normal;padding-left:${item._level*20}px;width:60%;`"><span :style="{'font-size' : '14px'}">{{item.text}}</span><i>{{item.index}} </i></h6>
                          </template>
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-form>
                </div>
              </reDialog>
              <reDialog title="编辑权限" :visible.sync="dialogShow1" width="510px" @close="resetForm" @submit="submit('form2')">
                  <div class="companyCommon examCheckbox" slot="body">
                    <el-form :model="baseInfo" label-width="114px" :rules="rules1" ref="form2">
                      <el-form-item class="dialogForm" label="可见系统范围" size="medium" prop="deptIdList">
                        <el-select v-model="baseInfo.deptIdList" multiple placeholder="请选择可见系统范围">
                          <el-option v-for="item in sysTypes.list" :key="item.code" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-form>
                  </div>
              </reDialog>
              <reDialog title="编辑权限" :visible.sync="dialogShow2" width="510px" @close="resetForm" @submit="submit('form3')">
                  <div class="companyCommon examCheckbox" slot="body">
                    <el-form :model="baseInfo" label-width="114px" :rules="rules1" ref="form3">
                      <el-form-item class="dialogForm" label="可见部件范围" size="medium" prop="deptIdList">
                        <el-select v-model="baseInfo.deptIdList" multiple placeholder="请选择可见部件范围">
                          <el-option v-for="item in workbenchcard.list" :key="item.code" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-form>
                  </div>
              </reDialog>
  <div class="editInfoDiv">
    <div class="left">
      <el-tabs class="topTabs" v-model="activeName" @tab-click="topTabsClick">
        <el-tab-pane label="个人信息" name="personalInfo">
          <el-row>
            <el-col :span="24">
              <div class="topInfo">
                <el-form :model="personalInfoForm" ref="personalInfoForm" :rules="personalInfoRule" label-width="120px" size="mini">
                      <!-- 1.头像 -->
                      <div class="floatLeft">
                        <el-upload class="headerPic" :action="headerActionSrc" :headers="headersImg" :limit="limit" :file-list="headerList" list-type="picture-card" :on-preview="headerCardPreview" :before-upload="limitUpload" :before-remove="removePic" :on-success="headerSuccessUpload"><i class="el-icon-plus"></i></el-upload>
                        <el-dialog class="dialogPicEdit" :visible.sync="headerDialog"><img width="100%" :src="headerDialogImageUrl" alt="" /></el-dialog>
                        <p style="text-align: center;padding: 10px 0;display:inline-block;margin-left:48px;width: 98px;">工号 {{empNo}}</p>
                      </div>
                      <!-- 2.姓名：部门：职级： -->
                      <div class="floatLeft">
                        <el-form-item label="姓名：" prop="userName">
                          <el-input class="maxWidth390" v-model.trim="personalInfoForm.userName"></el-input>
                        </el-form-item>
                        <el-form-item label="部门：">
                          <!-- el-cascader(placeholder='可搜索',:options='distributeOptions', :props="props",  filterable, @change='distributeInfoChange',v-model="infoDistribute", change-on-select,style="width:100%")--><span class="disabledInput">{{deptName}}</span>
                        </el-form-item>
                        <el-form-item label="职级：">
                          <el-input class="maxWidth390" v-model.trim="personalInfoForm.level"></el-input>
                          <el-input class="width300" style="opacity: 0; position: absolute; z-index: -100;" ref="inputTest"></el-input>
                        </el-form-item>
                      </div>
                      <!-- 3.手机号：职位： 激活邮箱：-->
                      <div class="floatLeft">
                        <el-form-item label="手机号：" prop="mobile">
                          <el-input class="input-with-select maxWidth390" placeholder="请输入手机号" v-model="personalInfoForm.mobile">
                            <el-select class="noBorder" @change="mobileCodeC" v-model="personalInfoForm.mobileInterCode" slot="prepend" placeholder="请选择" style="width: 85px;">
                              <el-option class="codeOption" v-for="item in selAreaCodeArr" :value="item.code" :label="item.name" :key="item.code">{{item.name}}</el-option>
                            </el-select>
                          </el-input>
                        </el-form-item>
                        <el-form-item label="职位："><span class="disabledInput">{{position}}</span></el-form-item>
                        <el-form-item label="激活邮箱：" prop="email">
                          <el-input class="maxWidth390" v-model="personalInfoForm.email" @blur="blurEmail"></el-input>
                          <div class="spanEmail">@edaili.com</div>
                        </el-form-item>
                      </div>
                      <!--4 是否开启考勤：  -->
                      <div class="floatLeft" style="width: 410px">
                        <el-form-item class="padleft12" label="是否开启考勤：">
                          <el-switch v-model="ifAttend" active-text="是" inactive-text="否" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
                        </el-form-item>
                      </div>
                      <div class="floatLeft">
                        <el-form-item label="入职递交材料：">
                          <el-checkbox-group v-model="infoMaterial">
                            <el-checkbox v-for="item in selCheckboxArr" :value="item.code" :label="item.code" :key="item.code">{{item.name}}</el-checkbox>
                          </el-checkbox-group>
                        </el-form-item>
                      </div>
                      <div class="clearBoth">
                        <el-form-item>
                          <el-button type="primary" @click="submitForm('personalInfoForm',coreInfoSubmit)">保 存 修 改</el-button>
                        </el-form-item>
                      </div>
                   
                </el-form>
              </div>
              <div class="bottomInfo" style="margin: 20px 0px 20px 10px;clear:both;">
                <el-tabs type="border-card" @tab-click="bottomTabsClick">
                  <el-tab-pane label="基本信息">
                    <el-form :model="baseInfoForm" label-width="120px" ref="baseInfoForm" :rules="baseInfoFormRule" size="mini" style="padding-top: 20px;">
                      <el-form-item label="国家地区：">
                        <el-input class="width300" placeholder="请输入国家地区" v-model.trim="baseInfoForm.region"></el-input>
                      </el-form-item>
                      <el-form-item label="身份证号：">
                        <el-input class="width300" placeholder="请输入身份证号" v-model.trim="baseInfoForm.cardNo"></el-input>
                      </el-form-item>
                      <el-form-item label="身份证明：">
                        <div style="float:left;">
                          <el-upload class="identityPic" :action="identityFountSrc" :headers="headersImg" :limit="limit" :file-list="identityFountList" list-type="picture-card" :on-preview="identityFountPreview" :before-upload="limitUpload" :before-remove="identityFountRemove" :on-success="identityFountUpload"><i class="el-icon-plus"></i></el-upload>
                          <el-dialog class="dialogPicEdit" :visible.sync="identityFountDialog"><img width="100%" :src="identityFountDialogImageUrl" alt="" /></el-dialog>
                          <p style="text-align: center;">正面</p>
                        </div>
                        <div style="float:left;padding-left:20px;">
                          <el-upload class="identityPic" :action="identityOppSrc" :headers="headersImg" :limit="limit" :file-list="identityOppList" list-type="picture-card" :on-preview="identityOppPreview" :before-upload="limitUpload" :before-remove="identityOppRemove" :on-success="identityOppUpload"><i class="el-icon-plus"></i></el-upload>
                          <el-dialog class="dialogPicEdit" :visible.sync="identityOppDialog"><img width="100%" :src="identityOppDialogImageUrl" alt="" /></el-dialog>
                          <p style="text-align: center;">反面</p>
                        </div>
                      </el-form-item>
                      <div style="float:left;">
                        <el-form-item label="出生日期：">
                          <el-date-picker class="width300" v-model="baseInfoForm.birthday" type="date"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="籍贯：">
                          <el-input class="width300" placeholder="请输入籍贯" v-model.trim="baseInfoForm.nativePlace"></el-input>
                        </el-form-item>
                        <el-form-item label="英文名称：" prop="enName">
                          <el-input class="width300" v-model.trim="baseInfoForm.enName" placeholder="请输入英文名称"></el-input>
                        </el-form-item>
                        <el-form-item label="星座：">
                          <el-select class="width300" v-model="baseInfoForm.constellation" clearable="clearable" placeholder="请选择星座" @visible-change="selectData($event,'constellation')">
                            <el-option v-for="item in constellationArr" :key="item.code" :label="item.name" :value="item.code">{{item.name}}</el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="婚姻状况：">
                          <el-select class="width300" v-model="baseInfoForm.maritalStatus" clearable="clearable" placeholder="请选择婚姻状况" @visible-change="selectData($event,'marriage')">
                            <el-option v-for="item in marriageArr" :key="item.code" :label="item.name" :value="item.code">{{item.name}}</el-option>
                          </el-select>
                        </el-form-item>
                      </div>
                      <div style="float:left;">
                        <el-form-item label="性别：">
                          <el-select class="width300" v-model="baseInfoForm.sex" clearable="clearable" placeholder="请选择性别" @visible-change="selectData($event,'sex')">
                            <el-option v-for="item in sexArr" :key="item.code" :label="item.name" :value="item.code">{{item.name}}</el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="民族：">
                          <el-input class="width300" v-model.trim="baseInfoForm.nation" placeholder="请输入民族"></el-input>
                        </el-form-item>
                        <el-form-item label="属相：">
                          <el-select class="width300" v-model="baseInfoForm.zodiac" clearable="clearable" placeholder="请选择属相" @visible-change="selectData($event,'zodiac')">
                            <el-option v-for="item in zodiacArr" :key="item.value" :label="item.label" :value="item.value">{{item.label}}</el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="血型：">
                          <el-select class="width300" v-model="baseInfoForm.bloodType" clearable="clearable" placeholder="请选择血型" @visible-change="selectData($event,'bloodtype')">
                            <el-option v-for="item in bloodtypeArr" :key="item.code" :label="item.name" :value="item.code">{{item.name}}</el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="是否有小孩：">
                          <el-select class="width300" v-model="baseInfoForm.hasChild" clearable="clearable" placeholder="请选择" @visible-change="selectData($event,'children')">
                            <el-option v-for="item in childrenArr" :key="item.code" :label="item.name" :value="item.code">{{item.name}}</el-option>
                          </el-select>
                        </el-form-item>
                      </div>
                      <el-form-item style="clear:both;">
                        <el-button type="primary" @click="baseInfoSubmit('baseInfoForm')">保 存 修 改</el-button>
                      </el-form-item>
                    </el-form>
                  </el-tab-pane>
                  <el-tab-pane label="联系信息">
                    <el-form v-model="contractInfoForm" label-width="120px" size="mini" style="padding-top: 20px;">
                      <div style="float:left;">
                        <el-form-item label="分机号码：">
                          <el-input class="width300" placeholder="请输入分机号码" v-model.trim="contractInfoForm.extTelNum"></el-input>
                        </el-form-item>
                        <el-form-item label="工作城市：">
                          <el-select class="width300" v-model="contractInfoForm.cityId" clearable="clearable" placeholder="请选择所在城市">
                            <el-option v-for="item in citys" :key="item.name" :label="item.name" :value="item.code">{{item.name}}</el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="微信：">
                          <el-input class="width300" placeholder="请输入微信" v-model.trim="contractInfoForm.wechat"></el-input>
                        </el-form-item>
                        <el-form-item label="紧急联系人：">
                          <el-input class="width300" placeholder="请输入紧急联系人" v-model.trim="contractInfoForm.emerContact"></el-input>
                        </el-form-item>
                      </div>
                      <div style="float:left;">
                        <el-form-item label="工位：">
                          <el-input class="width300" placeholder="请输入工位" v-model.trim="contractInfoForm.station"></el-input>
                        </el-form-item>
                        <el-form-item label="QQ：">
                          <el-input class="width300" placeholder="请输入QQ" v-model.trim="contractInfoForm.qq"></el-input>
                        </el-form-item>
                        <el-form-item label="紧急联系号码：">
                          <el-input class="width300" placeholder="请输入紧急联系号码" v-model.trim="contractInfoForm.emerContPhone"></el-input>
                        </el-form-item>
                      </div>
                      <el-form-item label="现居住地址：" style="clear:both;">
                        <el-input class="width720" placeholder="请输入现居住地址" v-model.trim="contractInfoForm.curAddr" style="width:720px;"></el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" @click="contractInfoSubmit">保 存 修 改</el-button>
                      </el-form-item>
                    </el-form>
                  </el-tab-pane>
                  <el-tab-pane label="账户信息">
                    <el-form v-model="accountInfoForm" label-width="120px" size="mini" style="padding-top: 20px;">
                      <el-form-item label="公积金账号：">
                        <el-input class="width300" placeholder="请输入公积金账号" v-model.trim="accountInfoForm.fundAcc"></el-input>
                      </el-form-item>
                      <div style="float:left;">
                        <el-form-item label="银行卡号1：">
                          <el-input class="width300" placeholder="请输入银行卡号" v-model.trim="accountInfoForm.bankAcc1"></el-input>
                        </el-form-item>
                        <el-form-item label="银行卡号2：">
                          <el-input class="width300" placeholder="请输入银行卡号" v-model.trim="accountInfoForm.bankAcc2"></el-input>
                        </el-form-item>
                      </div>
                      <div style="float:left;">
                        <el-form-item label="开户行：">
                          <el-input class="width300" placeholder="请输入开户行" v-model.trim="accountInfoForm.deposit1"></el-input>
                        </el-form-item>
                        <el-form-item label="开户行：">
                          <el-input class="width300" placeholder="请输入开户行" v-model.trim="accountInfoForm.deposit2"></el-input>
                        </el-form-item>
                      </div>
                      <el-form-item label="银行卡照片：" style="clear:both;">
                        <el-upload class="bankPicDiv" :action="bankSrc" :headers="headersImg" :file-list="bankList" list-type="picture-card" :on-preview="bankPreview" :before-upload="limitUpload" :before-remove="bankImgRemove" :on-success="bankUploadSuccess"><i class="el-icon-plus"></i></el-upload>
                        <el-dialog class="dialogPicEdit" :visible.sync="bankDialog"><img width="100%" :src="bankDialogImageUrl" alt="" /></el-dialog>
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" @click="accountInfoSubmit">保 存 修 改</el-button>
                      </el-form-item>
                    </el-form>
                  </el-tab-pane>
                  <el-tab-pane label="教育信息">
                    <el-form v-model="educationInfoForm1" label-width="120px" size="mini" style="padding-top: 20px;">
                      <div style="float:left;">
                        <el-form-item label="毕业学校1：">
                          <el-input class="width300" placeholder="请输入毕业学校" v-model.trim="educationInfoForm1.graSch"></el-input>
                        </el-form-item>
                        <el-form-item label="专业：">
                          <el-input class="width300" placeholder="请输入专业" v-model.trim="educationInfoForm1.profession"></el-input>
                        </el-form-item>
                        <el-form-item label="毕业证书：" style="clear:both;">
                          <el-upload class="identityPic" :action="graCer1Src" :headers="headersImg" :limit="limit" :file-list="graCer1List" list-type="picture-card" :on-preview="graCer1Preview" :before-upload="limitUpload" :before-remove="graCer1Remove" :on-success="graCer1UploadSuccess"><i class="el-icon-plus"></i></el-upload>
                          <el-dialog class="dialogPicEdit" :visible.sync="graCer1Dialog"><img width="100%" :src="graCer1DialogImageUrl" alt="" /></el-dialog>
                        </el-form-item>
                      </div>
                      <div style="float:left;">
                        <el-form-item label="毕业时间：">
                          <el-date-picker class="width300" v-model="educationInfoForm1.graDate" type="date" value-format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="最高学历：">
                          <el-select class="width300" v-model="educationInfoForm1.hignestDegree" clearable="clearable" placeholder="请选择最高学历">
                            <el-option v-for="item in educationArr" :key="item.code" :label="item.name" :value="item.code">{{item.name}}</el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="学位证书：">
                          <el-upload class="identityPic" :action="degreeCer1Src" :headers="headersImg" :limit="limit" :file-list="degreeCer1List" list-type="picture-card" :on-preview="degreeCer1Preview" :before-upload="limitUpload" :before-remove="degreeCer1Remove" :on-success="degreeCer1UploadSuccess"><i class="el-icon-plus"></i></el-upload>
                          <el-dialog class="dialogPicEdit" :visible.sync="degreeCer1Dialog"><img width="100%" :src="degreeCer1DialogImageUrl" alt="" /></el-dialog>
                        </el-form-item>
                      </div>
                    </el-form>
                    <el-form v-model="educationInfoForm2" label-width="120px" size="mini" style="padding-top: 20px;clear:both;">
                      <div style="float:left;">
                        <el-form-item label="毕业学校2：">
                          <el-input class="width300" placeholder="请输入毕业学校" v-model.trim="educationInfoForm2.graSch"></el-input>
                        </el-form-item>
                        <el-form-item label="专业：">
                          <el-input class="width300" placeholder="请输入专业" v-model.trim="educationInfoForm2.profession"></el-input>
                        </el-form-item>
                        <el-form-item label="毕业证书：" style="clear:both;">
                          <el-upload class="identityPic" :action="graCer1Src" :headers="headersImg" :limit="limit" :file-list="graCer2List" list-type="picture-card" :on-preview="graCer2Preview" :before-upload="limitUpload" :before-remove="graCer2Remove" :on-success="graCer2UploadSuccess"><i class="el-icon-plus"></i></el-upload>
                          <el-dialog class="dialogPicEdit" :visible.sync="graCer2Dialog"><img width="100%" :src="graCer2DialogImageUrl" alt="" /></el-dialog>
                        </el-form-item>
                      </div>
                      <div style="float:left;">
                        <el-form-item label="毕业时间：">
                          <el-date-picker class="width300" v-model="educationInfoForm2.graDate" type="date" format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="最高学历：">
                          <el-select class="width300" v-model="educationInfoForm2.hignestDegree" clearable="clearable" placeholder="请选择最高学历">
                            <el-option v-for="item in educationArr" :key="item.code" :label="item.name" :value="item.code">{{item.name}}</el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="学位证书：">
                          <el-upload class="identityPic" :action="degreeCer1Src" :headers="headersImg" :limit="limit" :file-list="degreeCer2List" list-type="picture-card" :on-preview="degreeCer2Preview" :before-upload="limitUpload" :before-remove="degreeCer2Remove" :on-success="degreeCer2UploadSuccess"><i class="el-icon-plus"></i></el-upload>
                          <el-dialog class="dialogPicEdit" :visible.sync="degreeCer2Dialog"><img width="100%" :src="degreeCer2DialogImageUrl" alt="" /></el-dialog>
                        </el-form-item>
                      </div>
                      <el-form-item label="职业证书：" style="clear:both;">
                        <el-upload class="bankPicDiv" :action="profCerSrc" :headers="headersImg" :file-list="profCerList" list-type="picture-card" :on-preview="profCerPreview" :before-upload="limitUpload" :on-remove="profCerImgRemove" :on-success="profCerUploadSuccess"><i class="el-icon-plus"></i></el-upload>
                        <el-dialog class="dialogPicEdit" :visible.sync="profCerDialog"><img width="100%" :src="profCerDialogImageUrl" alt="" /></el-dialog>
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" @click="educationInfoSubmit">保 存 修 改</el-button>
                      </el-form-item>
                    </el-form>
                  </el-tab-pane>
                  <el-tab-pane label="从业信息">
                    <el-form v-model="employmentInfoForm" label-width="120px" size="mini" style="padding-top: 20px;">
                      <el-form-item label="上家公司：" style="clear:both;">
                        <el-input class="width300" placeholder="" v-model.trim="employmentInfoForm.lastComp"></el-input>
                      </el-form-item>
                      <el-form-item label="职称：">
                        <el-input class="width300" placeholder="" v-model.trim="employmentInfoForm.proTitle"></el-input>
                      </el-form-item>
                      <el-form-item label="简历：">
                        <!-- el-input.width300(placeholder='', v-model='employmentInfoForm.resumeUrl')-->
                        <!-- el-upload.identityPic(:action='LeavingCertSrc', :headers='headersImg',:limit='limit',:file-list="LeavingCertList", list-type='picture-card', :on-preview='LeavingCertPreview', :on-remove='handleRemove',:on-success="LeavingCertUploadSuccess")-->
                        <!--   i.el-icon-plus-->
                        <el-upload class="upload-demo width300" :action="resumeSrc" :headers="headersImg" :limit="1" :file-list="resumeList" :on-success="resumeUploadSuccess" :before-upload="limitUploadFile" :before-remove="resumeRemove" :on-exceed="resumeExceed" :on-preview="getresumePic">
                          <el-button size="mini" type="primary" plain="plain">点击上传</el-button>
                        </el-upload>
                      </el-form-item>
                      <el-form-item label="离职证明：">
                        <el-upload class="identityPic" :action="LeavingCertSrc" :headers="headersImg" :limit="limit" :file-list="LeavingCertList" list-type="picture-card" :on-preview="LeavingCertPreview" :before-upload="limitUpload" :before-remove="leavingJobRemove" :on-success="LeavingCertUploadSuccess"><i class="el-icon-plus"></i></el-upload>
                        <el-dialog class="dialogPicEdit" :visible.sync="LeavingCertDialog"><img width="100%" :src="LeavingCertDialogImageUrl" alt="" /></el-dialog>
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" @click="employmentInfoSubmit">保 存 修 改</el-button>
                      </el-form-item>
                    </el-form>
                  </el-tab-pane>
                  <el-tab-pane label="体检信息">
                    <testInfo></testInfo>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </el-col>
            <!-- <el-col :span="4">
              <changeRecord :record="changeRecord"> </changeRecord>
            </el-col> -->
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="岗位信息">
          <el-row>
            <el-col :span="24">
              <positionInfo></positionInfo>
            </el-col>
            <!-- <el-col :span="4">
              <changeRecord :record="changeRecord"> </changeRecord>
            </el-col> -->
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="离职信息" v-if="leavingJobTabShow">
          <el-row>
            <el-col :span="24">
              <div class="topInfo">
                <el-form :model="leavingJobForm" :rules="leavingJobRules" ref="leavingJobForm" label-width="120px" size="mini">
                  <el-form-item label="离职日期：" prop="leavingJobDate">
                    <el-date-picker class="width600" v-model="leavingJobForm.leavingJobDate" type="date"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="办理离职日期：">
                    <el-date-picker class="width600" v-model="leavingJobForm.resignDate" type="date"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="离职类型">
                    <el-select class="width600" v-model="leavingJobForm.leavingJobType" clearable="clearable" placeholder="请选择" @visible-change="selectData($event,'quittype')">
                      <el-option v-for="item in leaveTypeArr" :key="item.code" :label="item.name" :value="item.code">{{item.name}}</el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="离职原因：">
                    <el-input class="width600" type="textarea" v-model="leavingJobForm.leavingReason"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submitForm('leavingJobForm',leavingJobSubmit)">保 存 修 改</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
            <!-- <el-col :span="4">
              <changeRecord :record="changeRecord"> </changeRecord>
            </el-col> -->
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="角色权限">
          <el-row>
            <el-col :span="24">
             <editRoleLimit v-if='roleLimitShow'></editRoleLimit> 
            </el-col>
            <!-- <el-col :span="4">
              <changeRecord :record="changeRecord"> </changeRecord>
            </el-col> -->
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="数据查看权限">
          <el-row>
            <el-col :span="24">
              <div class="con">
                <div class="model pointer" v-for="(item,index) in dataacl.list" :key="index" @click.stop="editAva(item)">{{item.name}}<i class="el-icon-arrow-right"></i></div>
                <div class="model pointer" @click.stop="editSysTypes">统一框架多系统权限<i class="el-icon-arrow-right"></i></div>
                <div class="model pointer" @click.stop="editBenchTypes">工作台部件<i class="el-icon-arrow-right"></i></div>
                <!-- <div class="emptyText" v-if="dataacl.list.length == 0">无数据</div> -->
              </div>    
            </el-col>
            <!-- <el-col :span="4">
              <changeRecord :record="changeRecord"></changeRecord>
            </el-col> -->
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="考勤记录" name="timeRecord">
          <el-row>
            <el-col>
              <timeRecord v-if="timeRecordLoad" type="0"  :is_personal=false></timeRecord>
            </el-col>
            <!-- <el-col :span="4">
              <changeRecord :record="changeRecord"> </changeRecord>
            </el-col> -->
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="right">
      <changeRecord :record="changeRecord"> </changeRecord>
    </div>
  </div>
</div>    
       
</template>
<script>
import utilDetail from '../../components/treeTable/utils/index'
import core from '@/api/core'
import util from '../../util'
import validate from "../../util/validate.js"
import axios from 'axios'
import positionInfo from '../employeeList/positionInfo'
import testInfo from '../employeeList/testInfo'
import timeRecord from '../employeeList/timeRecord'
import reDialog from "../../components/reDialog.vue"
import selectMems from "../../components/seletMems.vue"
import tree from "../../components/tree.vue"
import leaveEmployeeList from '../employeeList/leaveEmployeeList'
import { debuggerStatement } from 'babel-types'
import changeRecord from "../personalCenter/changeRecord"
import editRoleLimit from "./editRoleLimit"
import {mapState} from "vuex"
export default {
  name: 'editInfo',
  components: {
    reDialog,
    selectMems,
    positionInfo,
    leaveEmployeeList,
    changeRecord,
    tree,
    timeRecord,
    testInfo,
    editRoleLimit
  },
  data () {
      var deptIds = (rule, value, callback) => {
        if (
          this.baseInfo.ctrlPermi == 1 &&
          this.baseInfo.userIds.length == 0 &&
          value.length == 0
        ) {
          callback(new Error("请选择指定人员或者指定部门"));
        } else {
          if(this.dialogShow){
              this.$refs.form1.clearValidate(['deptIdList'])
          }
          callback();
        }
      };
    return {
      dialogShow : false,
      dialogShow1 : false,
      dialogShow2 : false,
        baseInfoObj : {},
        baseInfo : {},
        mems: [], //人员id数组
        memNames: [], //人员name数组
        // treeMem : {list : [], arr : [], obj: {}},
        memInitObj: {},
        rules1: {
          ctrlPermi: [
            { required: true, message: "请选择可见范围", trigger: "change" }
          ],
        },
        sysTypes : {
          list : [],
          obj : {}
        },
      userId:'',
      valueShow: '',
      changeRecord:{},
      id : '',
      CheckedKeys : {},
      CheckedKeysLoad : false,
      isChangeData : false,
      uploadSrc: '/admin/file/upload/pic/',
      uploadFileSrc: '/admin/file/upload/file/',
      headersImg: {
        'enctype': 'multipart/form-data',
        'auth': this.$store.state.auth,
        'sign' : ''
      },
      limit: 1,
      // 修改头像照片
      // 参数路径
      headPicParam:'',
      headerActionSrc: '',
      headerDialogImageUrl: '',
      headerDialog: false,
      headerList:[],
      // 离职信息隐藏
      leavingJobTabShow: false,
      // 编辑核心个人信息
      editInfoDivShow: false,
      activeName: 'personalInfo',
      DateValue2: '',
      DateValue1: '',
      infoMaterial: [],
      // 个人信息
      // 找回密码-手机
      mobilePhone:'mobile',
      mobileShow:true,
      mobile1Show:false,
      personalInfoForm: {
        deptId: '',
        userName: '',
        mobileInterCode: '0086',
        mobile: '',
        mobileHk: '',
        portraitUrl: '',
        level: '',
        email: '',
        entryMeterial:'',
      },
      ifAttend:'',
      personalInfoRule:{
        userName: [
          {required: true, message: '请输入姓名', trigger: 'change' }
        ],
        mobile: [
          {required:true,message:'手机号码必填',trigger:'change'},
          {pattern:/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$|^(5|6|8|9)\d{7}$/, message: '请输入正确的手机号',trigger:'change' }
        ],
        mobileHk: [
          {required:true,message:'手机号码必填',trigger:'change'},
          {pattern:/^(5|6|8|9)\d{7}$/, message: '请输入正确的8位手机号',trigger:'change' }
        ],
        email: [
          {required:true,message:'邮箱必填',trigger:'blur'},
          // {pattern:/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/, message: '请输入正确的邮箱',trigger:'change' }
          {pattern:/^[a-zA-Z0-9\s_.-]+/, message: '请输入正确的邮箱',trigger:'change' }
        ]
      },
      deptName: '',
      position: '',
      // 工号
      empNo: '',
      infoDistribute: [],
      // 部门
      // distributeOptions: [],
      props:{
        value: 'id',
        label: 'text',
        children: 'children'
      },
      // 角色
      // addEmployeeRoleArr: [],
      // 1.基本信息
      baseInfoForm: {
        region:'',
        cardNo: '',
        cardImgOpp: '',
        cardImgFront: '',
        birthday: '',
        nativePlace: '',
        enName: '',
        constellation: '',
        maritalStatus: '',
        sex: '',
        nation: '',
        zodiac: '',
        bloodType: '',
        hasChild: '',
        userId: ''
      },
      baseInfoFormRule: {
        enName:[
          // {required:true,message:'邮箱必填',trigger:'blur'},
          // {pattern:/[^A-Za-z]/, message: '请输入正确的英文',trigger:'change' }
          { validator: validate.validateEn, trigger: 'change' }
        ]
      },
      // 联系信息
      contractInfoForm: {
        extTelNum: '',
        wechat: '',
        emerContact: '',
        emerContPhone: '',
        station: '',
        qq: '',
        emerContPhone: '',
        curAddr: '',
        // provinceId: '',
        cityId: '',
        userId:''
      },
      // contractCitysModel: [],
      // 3.账户信息
      accountInfoForm: {
        fundAcc: '',
        bankAcc1: '',
        bankAcc2: '',
        deposit1: '',
        deposit2: '',
        bankImgs: [],
        userId:''
      },
      // 4.教育信息-学位证书1
      educationInfoForm1: {
        graSch: '',
        profession: '',
        graDate: '',
        hignestDegree: '',
        graCer: '',
        degreeCer: '',
        profCer:[],
        userId:'',
        id:'',
      },
      // 4.教育信息-学位证书2
      educationInfoForm2: {
        graSch: '',
        profession: '',
        graDate: '',
        hignestDegree: '',
        graCer: '',
        profCer:[],
        degreeCer: '',
        userId:'',
        id:'',
      },
      // 5.从业信息
      employmentInfoForm: {
        lastComp: '',
        proTitle: '',
        resumeUrl: '',
        leavingJobCer: '',
        userId:''
      },
      // 离职信息
      leavingJobForm: {
        leavingJobDate: '',
        resignDate: '',
        leavingJobType: '',
        leavingReason: '',
        userId:''
      },
      leavingJobRules:{
        leavingJobDate: [
          {type:'date', required: true, message: '请选择离职日期', trigger: 'change' }
        ]
      },
      leavingTypeArr: [],
      // 角色权限
      roleLimitShow:false,
      // 身份证正面
      identityFountParam:'',
      identityFountSrc: '',
      identityFountDialogImageUrl: '',
      identityFountDialog: false,
      identityFountList:[],
      // 身份证反面
      identityOppParam:'',
      identityOppSrc: '',
      identityOppDialogImageUrl: '',
      identityOppDialog: false,
      identityOppList:[],
      // 银行卡
      bankParam:'',
      bankSrc: '',
      bankDialogImageUrl: '',
      bankDialog: false,
      bankList:[],
      bankList2:[],
      // 离职信息正面
      LeavingCertParam:'',
      LeavingCertSrc: '',
      LeavingCertDialogImageUrl: '',
      LeavingCertDialog: false,
      LeavingCertList:[],
      // 简历附件
      resumeParam:'',
      resumeSrc: '',
      // resumeList:[{name:'',url: ''}],
      resumeList:[],
      // 毕业证书1
      graCer1Param:'',
      graCer1Src: '',
      graCer1DialogImageUrl: '',
      graCer1Dialog: false,
      graCer1List:[],
      // 学位证书1
      degreeCer1Param:'',
      degreeCer1Src: '',
      degreeCer1DialogImageUrl: '',
      degreeCer1Dialog: false,
      degreeCer1List:[],
      // 毕业证书2
      graCer2Param:'',
      graCer2Src: '',
      graCer2DialogImageUrl: '',
      graCer2Dialog: false,
      graCer2List:[],
      // 学位证书2
      degreeCer2Param:'',
      degreeCer2Src: '',
      degreeCer2DialogImageUrl: '',
      degreeCer2Dialog: false,
      degreeCer2List:[],
      // 职业证书
      profCerParam:'',
      profCerSrc: '',
      profCerDialogImageUrl: '',
      profCerDialog: false,
      profCerList:[],
      profCerList2:[],
      optionsCitys : [],
      // tab切换
      contact:true,
      account:true,
      education:true,
      employment:true,
      leavingInfo:true,
      // roleInfo:true,
      // 考勤记录
      timeRecordLoad: false,
      // 设置可见系统范围的表单信息
    }
  },
  computed: {
    ...mapState({
      "selAreaCodeArr" : state => state.selectData.areacode.list,
      "constellationArr" : state => state.selectData.constellation.list,
      "marriageArr" : state => state.selectData.marriage.list,
      "sexArr" : state => state.selectData.sex.list,
      "zodiacArr" : state => state.selectData.zodiac.list,
      "bloodtypeArr" : state => state.selectData.bloodtype.list,
      "educationArr" : state => state.selectData.education.list,
      "childrenArr" : state => state.selectData.children.list,
      "leaveTypeArr" : state => state.selectData.quittype.list,
      "selCheckboxArr" : state => state.selectData.entrymaterials.list,
      // "employeeRoleArr" : state => state.selectData.idsAndNames,
      "citys" : state => state.selectData.city.list,
      "auth" : state => state.auth,
      'dataacl': state => state.selectData.dataacl,
      'processSeeType': state => state.selectData.processSeeType,
      'treeData': state => state.selectData.orgPersonTree,
      'treeMem': state=>state.selectData.orgTreeBaseInfo,
      'workbenchcard': state=>state.selectData.workbenchcard
      })
  },
  watch :{
    // 再入职code
    'personalInfoForm.mobileInterCode' (val) {
      if(val === '00852'){
        this.mobilePhone = 'mobileHk'
        this.mobileShow = false
        this.mobile1Show = true
      }else if(val === '0086'){
        this.mobilePhone = 'mobile'
        this.mobileShow = true
        this.mobile1Show = false
      }
    },
  },
  created () {
    window.forUploadTransferValue = true
    // 获取参数userId
    
    this.userId = localStorage.getItem('editUserId')
    window.localStorage['myself'] = '';
    let allTreeInfo = {};
    this.$store.dispatch("getOrgTreeInfo");
    this.valueShow = localStorage.getItem('editValueShow')
    // 点击编辑时：在职时离职信息不存在
    if(this.valueShow === 'in'){
      this.leavingJobTabShow = false
    }else if(this.valueShow === 'leave'){
      this.leavingJobTabShow = true
    }
    this.$store.commit('userIdGet', this.userId)
    //  获取个人记录
    core.getChangeRecord(this.userId).then(obj=>{
        this.changeRecord = obj.data.data;
    })
    // 1.初始化-核心信息
    core.getEmpCoreData({userId:this.userId}).then((res) => {
      if(res.data.code === '200' && res.data.data !== null){
        this.personalInfoForm = res.data.data
        if(this.personalInfoForm.ifAttend === 'Y'){
            this.ifAttend = true
          }else{
            this.ifAttend = false
          }
        let emali = res.data.data.email
        this.personalInfoForm.email = emali.substring(0,emali.length-11)

        window.localStorage['empNo'] = res.data.data.empNo
        if(this.personalInfoForm.mobileInterCode === '00852'){
          // this.personalInfoForm.mobileHk = this.personalInfoForm.mobile
        }
        // 头像
        // 1.初始化图片接口
        this.headerActionSrc = this.uploadSrc + res.data.data.type + '/' + this.userId + '/149/149'
        // 2.初始化图片路径参数
        this.headPicParam = res.data.data.portraitUrl
        // 3.不为空说明有路径，才去加载图片
        if(this.headPicParam !== ""){
          this.getHeadPic(this.headPicParam,this.headerList)
        }
        // 部门
        this.deptName = res.data.data.deptName
        // 职位
        this.position = res.data.data.position
        // 工号
        this.empNo = res.data.data.empNo
        // 材料
        if(res.data.data.entryMeterial !=="" && res.data.data.entryMeterial !== null){
          // 字符串逗号分隔
          let value = res.data.data.entryMeterial.split(",")
          this.infoMaterial = value
        }
        
      }
      this.personalInfoForm.userId = this.userId
    }).catch(util.errorHandle)
    // 1.初始化-基本信息
    core.getEmpExtBase({userId:this.userId}).then((res) => {
      if(res.data.code === '200' && res.data.data !== null){
        this.baseInfoForm = res.data.data
        // 正面
        // 1.初始化图片接口
        this.identityFountSrc = this.uploadSrc + res.data.data.type + '/' + this.userId + '/280/175'
        // 2.初始化图片路径参数
        this.identityFountParam = res.data.data.cardImgFront
        // 3.不为空说明有路径，才去加载图片
        if(this.identityFountParam !== ""){
          this.getHeadPic(this.identityFountParam,this.identityFountList)
        }
        // 反面
        // 1.初始化图片接口
        this.identityOppSrc = this.uploadSrc + res.data.data.type + '/' + this.userId + '/280/175'
        // 2.初始化图片路径参数
        this.identityOppParam = res.data.data.cardImgOpp
        // 3.不为空说明有路径，才去加载图片
        if(this.identityOppParam !== ""){
          this.getHeadPic(this.identityOppParam,this.identityOppList)
        }
        // 去除基本信息英文名称的必填框
        this.$nextTick(()=>{
          this.$refs['baseInfoForm'].clearValidate(['enName'])
        })
      }
      this.baseInfoForm.userId = this.userId
    }).catch(util.errorHandle)
    // this.roleNameForm.userId = this.userId
    // 初始化上传图片cookie
    this.headersImg.auth =  this.$store.state.auth
    // 切换到考勤记录
    let empNoClick = window.localStorage['empNoClick']
    if(empNoClick == 'true'){
      this.activeName = 'timeRecord'
      this.timeRecordLoad = true
    }else{
      this.activeName = 'personalInfo'
    }
    
  },
  methods: {
      editAva(item){
        this.mems = [];
        this.memNames = [];
        let obj =  {
          ctrlPermi : '',
          ctrlType : item.code,
          deptIdList : [],
          userIdList : [],
          userIds : []
        };
        if(this.baseInfoObj[item.code]){
          obj = this.baseInfoObj[item.code];
          if(obj.userIdList.length > 0){
            obj.userIdList.forEach(v => {
              this.mems.push(String(v.userId));
              this.memNames.push(v.userName);
              this.memInitObj[v.userId] = v.userName;
            });
          }
          if(obj.deptIdList.length > 0){
            let arr = obj.deptIdList.map(v=>{
              return Number(v);
            })
            obj.deptIdList = [...arr];
          }
        }
        this.baseInfo = Object.assign({},obj);
        this.baseInfo.userIds= [...this.mems];
        this.dialogShow = true;
        this.$nextTick(() => {
          if (this.$refs["form1"]) {
            this.$refs["form1"].clearValidate(['ctrlPermi','deptIdList']);
          }
        });
      },
      editSysTypes(){
        this.dialogShow1 = true;
        this.baseInfo = Object.assign({},this.baseInfoObj['unifyMenu']);
      },
      editBenchTypes(){
        this.dialogShow2 = true;
        this.baseInfo = Object.assign({},this.baseInfoObj['workbenchcard']);
      },
      resetForm(){
        this.$nextTick(() => {
          if (this.$refs["form1"]) {
            this.$refs["form1"].resetFields();
            this.baseInfo = Object.assign({},{
            ctrlPermi : '',
            ctrlType : '',
            deptIdList : [],
            userIdList : [],
            userIds : []
          });
          }
          if (this.$refs["form2"]) {
            this.$refs["form2"].resetFields();
            this.baseInfo = Object.assign({},{
            ctrlPermi : '',
            ctrlType : 'unifyMenu',
            deptIdList : [],
            userIdList : [],
            userIds : []
          });
          }
          if (this.$refs["form3"]) {
            this.$refs["form3"].resetFields();
            this.baseInfo = Object.assign({},{
            ctrlPermi : '',
            ctrlType : 'workbenchcard',
            deptIdList : [],
            userIdList : [],
            userIds : []
          });
          }
        });
      },
      init(){
          // 获取数据权限中所选取的数据
        this.$api.userDataAclQuery({userId : this.userId}).then(obj=>{
          if(obj.data.data){
            obj.data.data.forEach((v,i)=>{
              this.baseInfoObj[v.ctrlType] = v;
            })
          }
        })
        this.$api.getCommonAuthMenu().then(obj=>{
          if(obj.data.data){
            let sysTypes = {list :[] , obj : {}}
            obj.data.data.forEach((v)=>{
              sysTypes.obj[v.code] = v.name;
            })
            sysTypes.list = [...obj.data.data];
            this.sysTypes  = Object.assign({},sysTypes);
          }
        })
        
      },
      changeRange() {
        this.baseInfo.userIds = [];
        this.mems = [];
        this.memNames = [];
        this.baseInfo.deptIdList = [];
      },
      // 增加指定人员的一键清除
      clearMems(){
        this.memNames = [];
        this.mems = [];
        this.baseInfo.userIds = [];
        this.baseInfo.userIdList = [];
      },
      removeTag(index) {
        this.mems.splice(index, 1);
        this.memNames.splice(index, 1);
        this.baseInfo.userIds = [...this.mems];
      },
      selectMem(item) {
        this.baseInfo.userIds = item.checkIds;
        this.memNames = item.checkMems;
        if(this.dialogShow){   
          if(this.memNames.length > 0){
            this.$refs.form1.clearValidate(['deptIdList'])
          }
        }
      },
      submit(formName){    
        this.$refs[formName].validate(valid => {
          if (valid) {
              let base = Object.assign({},this.baseInfo);
              base.userId = this.userId;
              this.dialogShow = false;
              if(formName == 'form2'){
                base.ctrlType = 'unifyMenu';
                base.ctrlPermi = '1';
                this.dialogShow1 = false;
              }
              if(formName == 'form3'){
                base.ctrlType = 'workbenchcard';
                base.ctrlPermi = '1';
                this.dialogShow2 = false;
              }
              base.deptIds = base.deptIdList;
              this.$api.userDataAclEdit(base).then(obj=>{
                this.$message.success('修改成功!');
                this.init();
              }).catch(obj=>{
                this.$message.error('保存失败!');
              })
            }
          });
        },
    // code切换
    mobileCodeChange(val){
      switch(val){
        case '0086':
          this.mobilePhone = 'mobile'
          this.mobileShow = true
          this.mobile1Show = false
        break;
        case '00852':
          this.mobilePhone = 'mobileHk'
          this.mobileShow = false
          this.mobile1Show = true
        break;
      }
    },
    mobileCodeC(){
      this.personalInfoForm.mobile = ''
    },
    // top-tab点击加载
    topTabsClick(tab, event){
      switch (tab.label) {
        case "岗位信息":
          console.log('1212')
        break;
        case "离职信息":
          // 3.初始化-离职信息
          if(this.leavingInfo){
            core.getEmpLeavingInfo({userId:this.userId}).then((res) => {
              util.codeConfirm(res.data,this)
              if(res.data.code === '200' && res.data.data !== null){
                this.leavingJobForm = res.data.data
                this.leavingJobForm.leavingJobDate = new Date(res.data.data.leavingJobDate)
                this.leavingInfo = false
              }
              this.leavingJobForm.userId = this.userId
            }).catch(util.errorHandle)
          }
        break;
        case "角色权限":
          this.roleLimitShow = true
        break
        case "数据查看权限":
          this.init();
        break;
        case "考勤记录":
          this.timeRecordLoad = true
        break;
      }
    },
    // bottom-tab点击加载
    bottomTabsClick(tab, event){
      switch (tab.label) {
        case "联系信息":
          // 2.初始化-联系信息
          if(this.contact){
            core.getEmpExtContact({userId:this.userId}).then((res) => {
              util.codeConfirm(res.data,this)
              if(res.data.code === '200' && res.data.data !== null){
                this.contractInfoForm = res.data.data
                this.contact = false
              }
              this.contractInfoForm.userId = this.userId
            }).catch(util.errorHandle)
          }
        break;
        case "账户信息":
          // 3.初始化-账户信息
          if(this.account){
            core.getEmpExtAccount({userId:this.userId}).then((res) => {
              util.codeConfirm(res.data,this)
              if(res.data.code === '200' && res.data.data !== null){
                this.account = false
                this.accountInfoForm = res.data.data
                // 银行卡
                // 1.初始化图片接口
                this.bankSrc = this.uploadSrc + res.data.data.type + '/' + this.userId + '/280/175'
                // 2.初始化图片路径参数-多图片上传
                // 3.不为空说明有路径，才去加载图片
                if(res.data.data.bankImgs !== ""){
                  let bankImgArr = res.data.data.bankImgs
                  for (let i in bankImgArr) {
                    if(bankImgArr[i] !== ""){
                      this.getHeadPic(bankImgArr[i],this.bankList)
                      var obj={}
                      obj.img = bankImgArr[i]
                      this.bankList2.push(obj) 
                    }
                  }
                }
              }
              this.accountInfoForm.userId = this.userId
            }).catch(util.errorHandle)
          }
        break;
        case "教育信息":
          // 4.初始化-教育信息
          if(this.education){
            core.getEmpExtEducation({userId:this.userId}).then((res) => {
              util.codeConfirm(res.data,this)
              if(res.data.code === '200' && res.data.data !== null && res.data.data.length !== 0){
                this.education = false
                if(res.data.data[0] === undefined){
                  res.data.data[0] =  {
                    graSch: '',
                    profession: '',
                    graDate: '',
                    hignestDegree: '',
                    graCer: '',
                    profCer: [],
                    degreeCer: '',
                    userId:'',
                    id:'',
                  }
                }
                if(res.data.data[1] === undefined){
                  res.data.data[1] =  {
                    graSch: '',
                    profession: '',
                    graDate: '',
                    hignestDegree: '',
                    profCer: [],
                    graCer: '',
                    degreeCer: '',
                    userId:'',
                    id:'',
                  }
                }
                this.educationInfoForm1 = res.data.data[0]
                this.educationInfoForm2 = res.data.data[1]
                this.educationInfoForm1.profCer = res.data.data[0].profCer
                // 1.毕业证书图片接口
                this.graCer1Src = this.uploadSrc + res.data.data[0].typeGraCer + '/' + this.userId + '/280/175'
                // 2.初始化图片路径参数
                this.graCer1Param = res.data.data[0].graCer
                this.graCer2Param = res.data.data[1].graCer
                // 3.不为空说明有路径，才去加载图片
                if(this.graCer1Param !== "" && this.graCer1Param !== undefined){
                  this.getHeadPic(this.graCer1Param,this.graCer1List)
                }
                if(this.graCer2Param !== "" && this.graCer2Param !== undefined){
                  this.getHeadPic(this.graCer2Param,this.graCer2List)
                }
                // 1.学位证书图片接口
                this.degreeCer1Src = this.uploadSrc + res.data.data[0].typeDegreeCer + '/' + this.userId + '/280/175'
                // 2.学位证书图片路径参数
                this.degreeCer1Param = res.data.data[0].degreeCer
                this.degreeCer2Param = res.data.data[1].degreeCer
                // 3.不为空说明有路径，才去加载图片
                if(this.degreeCer1Param !== "" && this.graCer1Param !== undefined){
                  this.getHeadPic(this.degreeCer1Param,this.degreeCer1List)
                }
                if(this.degreeCer2Param !== "" && this.graCer2Param !== undefined){
                  this.getHeadPic(this.degreeCer2Param,this.degreeCer2List)
                }
              }
              // 职业证书多图片上传
              // 1.初始化图片接口
              this.profCerSrc = this.uploadSrc + res.data.data[0].typeProfCer + '/' + this.userId + '/280/175'
              // 2.初始化图片路径参数-多图片上传
              // 3.不为空说明有路径，才去加载图片
              if(res.data.data[0].profCer !== []){
                let profCerImgArr = res.data.data[0].profCer
                for (let i in profCerImgArr) {
                  this.getHeadPic(profCerImgArr[i],this.profCerList)
                  var obj={}
                  obj.img = profCerImgArr[i]
                  this.profCerList2.push(obj) 
                }
              }
              this.educationInfoForm1.userId = this.userId
              this.educationInfoForm2.userId = this.userId
            }).catch(util.errorHandle)
          }
        break;
        case "从业信息":
          // 5.初始化-从业信息
          if(this.employment){
            core.getEmpExtEmployment({userId:this.userId}).then((res) => {
              util.codeConfirm(res.data,this)
              if(res.data.code === '200' && res.data.data !== null){
                this.employment = false
                this.employmentInfoForm = res.data.data
                this.employmentInfoForm.userId = this.userId
                // 1.初始化图片接口
                this.LeavingCertSrc = this.uploadSrc + res.data.data.typeLeavingJobCer + '/' + this.userId + '/280/175'
                // 2.初始化图片路径参数
                this.LeavingCertParam = res.data.data.leavingJobCer
                // 3.不为空说明有路径，才去加载图片
                if(this.LeavingCertParam !== ""){
                  this.getHeadPic(this.LeavingCertParam,this.LeavingCertList)
                }
                // 1.初始化简历接口
                this.resumeSrc = this.uploadFileSrc + res.data.data.typeResumeUrl + '/' + this.userId
                // 2.初始化简历路径参数
                this.resumeParam = res.data.data.resumeUrl
                // 3.不为空说明有路径，才去加载图片
                if(this.resumeParam !== ""){
                  var tOrW = this.resumeParam.split(".")
                  var obj = {}
                  obj.name = '简历.' + tOrW[tOrW.length-1]
                  this.resumeList.push(obj) 
                }
              }
              this.employmentInfoForm.userId = this.userId
            }).catch(util.errorHandle)
          }
        break;
      }
    },
    // 核心信息提交
    coreInfoSubmit () {
      // code 如果11位0086 8位 00852
      let personalInfoForm = Object.assign({},this.personalInfoForm)
      let codeL = personalInfoForm.mobileInterCode.length
      let mobileL = personalInfoForm.mobile.length
      if(codeL===5&&mobileL===11){
        this.$message.error('请选择正确的区号')
        return;
      }else if(codeL===4&&mobileL===8){
        this.$message.error('请选择正确的区号')
        return;
      }
      // 邮箱
      // personalInfoForm.email = personalInfoForm.email + '@edaili.com'
      // 过滤邮箱
      let email = personalInfoForm.email.replace(/\s*/g,"")//空格
      email = email.toLowerCase()//大写转化为小写
      let emailLast = email.substring(email.length-11,email.length)
      if(emailLast == '@edaili.com'){ //去掉末尾的 @edaili.com
        email = email.substring(0,email.length-11)
      }
      personalInfoForm.email = email + '@edaili.com'
      // 是否参与考勤
      if(this.ifAttend === true){
        personalInfoForm.ifAttend = "Y"
      }else{
        personalInfoForm.ifAttend = "N"
      }
      // 部门为空 不能参与考勤
      if(personalInfoForm.deptId==''|| personalInfoForm.deptId==null){
        if(this.ifAttend === true){
          this.$message.error('该员工未分配部门,不能参与考勤！')
          return
        }
      }
      // 材料
      personalInfoForm.entryMeterial = ""
      personalInfoForm.entryMeterial = this.infoMaterial
      core.empCoreDataSave(personalInfoForm).then((res) => {
        util.codeConfirm(res.data,this)
        if(res.data.code === '200'){
          this.$message.success(res.data.messages)
        }
      }).catch(util.errorHandle)
    },
    selectData(v1,v2){
      if(v1){
        this.$store.dispatch('getData',v2);
      }
    },
    // 1.基本信息保存
    baseInfoSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          core.empExtBaseDataSave(this.baseInfoForm).then((res) => {
            util.codeConfirm(res.data,this)
            if(res.data.code === '200'){
              this.$message.success(res.data.messages)
              this.$nextTick(()=>{
                this.$refs['baseInfoForm'].clearValidate(['enName'])
              })
            }
          }).catch(util.errorHandle)
        } else {
          console.log('格式 error')
          return false
        }
      })
    },
    // 2.联系信息保存
    contractInfoSubmit () {
      // 城市
      // this.contractInfoForm.provinceId = String(this.contractCitysModel[0])
      // this.contractInfoForm.cityId = String(this.contractCitysModel[1])
      core.empExtContractDataSave(this.contractInfoForm).then((res) => {
        util.codeConfirm(res.data,this)
        if(res.data.code === '200'){
          this.$message.success(res.data.messages)
        }
      }).catch(util.errorHandle)
    },
    // 3.账户信息保存
    accountInfoSubmit () {
      core.empExtAccountDataSave(this.accountInfoForm).then((res) => {
        util.codeConfirm(res.data,this)
        if(res.data.code === '200'){
          this.$message.success(res.data.messages)
        }
      }).catch(util.errorHandle)
    },
    // 4.教育信息保存
    educationInfoSubmit () {
      // 参数为数组-两个对象
      var arr=[]
      arr.push(this.educationInfoForm1)
      arr.push(this.educationInfoForm2)
      core.empExtEducationDataSave(arr).then((res) => {
        util.codeConfirm(res.data,this)
        if(res.data.code === '200'){
          this.$message.success(res.data.messages)
        }
      }).catch(util.errorHandle)
    },
    // 5.从业信息保存
    employmentInfoSubmit () {
      core.empExtEmploymentDataSave(this.employmentInfoForm).then((res) => {
        util.codeConfirm(res.data,this)
        if(res.data.code === '200'){
          this.$message.success(res.data.messages)
        }
      }).catch(util.errorHandle)
    },
    // 3.离职信息
    leavingJobSubmit () {
      this.$nextTick(()=>{
        this.$refs['leavingJobForm'].clearValidate()
      })
      core.leavingInfoSave(this.leavingJobForm).then((res) => {
        util.codeConfirm(res.data,this)
        if(res.data.code === '200'){
          this.$message.success(res.data.messages)
        }
      }).catch(util.errorHandle)
    },
    // 4.角色权限
    roleNameSubmit () {
      this.roleNameForm.roleId=this.roleIdString
      core.empRoleSave(this.roleNameForm).then((res) => {
        util.codeConfirm(res.data,this)
        if(res.data.code === '200'){
          this.$message.success(res.data.messages)
        }
      }).catch(util.errorHandle)
    },
    // 必填项，提交校验格式
    submitForm (formName, callBack) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          return callBack()
        } else {
          console.log('格式 error')
          return false
        }
      })
    },
    // 获取部门id
    distributeInfoChange (value) {
      this.personalInfoForm.deptId = String(value[value.length-1])
    },
    // 1.头像初始化
    getHeadPic (param,This) {
      // 头像初始化下载图片接口--load各个图片不同根据参数
      axios.get('/admin/file/download/file',
        {params: {filePath:param},responseType: 'blob' , data : {'filePath' : param}}).then(function (response) {
          // 头部头像的初始化加载
          var blob = new Blob([response.data]);
          var obj = {img:param}
          obj.url = window.URL.createObjectURL(blob)
          This.push(obj)
        }).catch(util.errorHandle)
    },
    // 2.头像上传成功
    headerSuccessUpload (res, file) {
      this.personalInfoForm.portraitUrl = res.data.filePath
    },
    // 3.头像-保存
    // 4.弹出框-顶部头像
    headerCardPreview(file) {
      this.headerDialogImageUrl = file.url
      this.headerDialog = true
    },
    // 1.正面上传成功
    identityFountUpload (res, file) {
      this.baseInfoForm.cardImgFront = res.data.filePath
    },
    // 2.弹出框-正面
    identityFountPreview(file) {
      this.identityFountDialogImageUrl = file.url
      this.identityFountDialog = true
    },
    
    // 1.反面上传成功
    identityOppUpload (res, file) {
      this.baseInfoForm.cardImgOpp = res.data.filePath
    },
    // 2.弹出框-反面
    identityOppPreview(file) {
      this.identityOppDialogImageUrl = file.url
      this.identityOppDialog = true
    },
    // 1.银行卡上传成功
    bankUploadSuccess (res, file) {
      this.accountInfoForm.bankImgs.push(res.data.filePath)
      var obj = {}
      obj.img = res.data.filePath
      this.bankList2.push(obj)
    },
    // 2.弹出框-银行卡
    bankPreview(file) {
      this.bankDialogImageUrl = file.url
      this.bankDialog = true
    },
    // 1.离职证明上传成功
    LeavingCertUploadSuccess (res, file) {
      this.employmentInfoForm.leavingJobCer = res.data.filePath
    },
    // 2.弹出框-离职证明图片
    LeavingCertPreview(file) {
      this.LeavingCertDialogImageUrl = file.url
      this.LeavingCertDialog = true
    },
    // 1.简历文件初始化
    getresumePic () {
      // 头像初始化下载图片接口--load各个图片不同根据参数
      var This = this
      var tOrW = This.resumeParam.split(".")
      var aType = tOrW[tOrW.length-1]
      this.$store.dispatch('downFile',{url : '/admin/file/download/file', data : {'filePath' : this.resumeParam} ,  fileName :'简历.'+aType})
      // axios.get('/admin/file/download/file',
      //   {params: {filePath: this.resumeParam},responseType: 'blob' , data : {'filePath' : this.resumeParam}}).then(function (response) {
      //     var blob = new Blob([response.data]);
      //     // 头部头像的初始化加载
      //     var tOrW = This.resumeParam.split(".")
      //     const resumeLink = document.createElement('a')
      //     resumeLink.download = '简历.' + tOrW[tOrW.length-1]
      //     resumeLink.style.display = 'none'
      //     resumeLink.href = window.URL.createObjectURL(blob)
      //     document.body.appendChild(resumeLink)
      //     resumeLink.click()
      //   }).catch(util.errorHandle)
    },
    // 2.简历文件上传成功
    resumeUploadSuccess (res, file) {
      if(res.code === '403'){
        this.$message.error(res.messages)
        return
      }else{
        this.employmentInfoForm.resumeUrl = res.data.filePath
        this.resumeParam = res.data.filePath
      }
      
    },
    // 3.限制条数-简历文件
    resumeExceed(files, fileList) {
      this.$message.warning('当前限制选择 1 个文件')
    },
    // 1.学历证书1上传成功
    graCer1UploadSuccess (res, file) {
      this.educationInfoForm1.graCer = res.data.filePath
    },
    graCer2UploadSuccess (res, file) {
      this.educationInfoForm2.graCer = res.data.filePath
    },
    // 2.学历证书1-弹出框
    graCer1Preview(file) {
      this.graCer1DialogImageUrl = file.url
      this.graCer1Dialog = true
    },
    graCer2Preview(file) {
      this.graCer2DialogImageUrl = file.url
      this.graCer2Dialog = true
    },
    // 1.学位证书1上传成功
    degreeCer1UploadSuccess (res, file) {
      this.educationInfoForm1.degreeCer = res.data.filePath
    },
    degreeCer2UploadSuccess (res, file) {
      this.educationInfoForm2.degreeCer = res.data.filePath
    },
    // 2.学位证书1-弹出框
    degreeCer1Preview(file) {
      this.degreeCer1DialogImageUrl = file.url
      this.degreeCer1Dialog = true
    },
    degreeCer2Preview(file) {
      this.degreeCer2DialogImageUrl = file.url
      this.degreeCer2Dialog = true
    },
    // 1.职业证书上传成功-多图片
    profCerUploadSuccess (res, file) {
      if(this.educationInfoForm1.profCer === ''){
        this.educationInfoForm1.profCer = []
      }
      this.educationInfoForm1.profCer.push(res.data.filePath)
      var obj = {}
      obj.img = res.data.filePath
      this.profCerList2.push(obj)
    },
    // 2.弹出框-职业证书
    profCerPreview(file) {
      this.profCerDialogImageUrl = file.url
      this.profCerDialog = true
    },
    
    // 删除图片
    headerRemove () {
      this.removePic(this.personalInfoForm.portraitUrl,this.headerList)
      // this.personalInfoForm.portraitUrl = ""
    },
    identityFountRemove () {
      if (window.forUploadTransferValue) {
        return Promise.reject(
          this.$confirm("确定要删除此图片吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.baseInfoForm.cardImgFront = ""
            this.identityFountList = []
          }).catch(() => {
            this.$refs.inputTest.focus()
          })
        )
      }
      // this.baseInfoForm.cardImgFront = ""
    },
    identityOppRemove () {
      if (window.forUploadTransferValue) {
        return Promise.reject(
          this.$confirm("确定要删除此图片吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.baseInfoForm.cardImgOpp = ""
            this.identityOppList = []
          }).catch(() => {
            this.$refs.inputTest.focus()
          })
        )
      }
      // this.baseInfoForm.cardImgOpp = ""
    },
    graCer1Remove () {
      if (window.forUploadTransferValue) {
        return Promise.reject(
          this.$confirm("确定要删除此图片吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.educationInfoForm1.graCer = ""
            this.graCer1List = []
          }).catch(() => {
            this.$refs.inputTest.focus()
          })
        )
      }
      // this.educationInfoForm1.graCer = ""
    },
    degreeCer1Remove () {
      if (window.forUploadTransferValue) {
        return Promise.reject(
          this.$confirm("确定要删除此图片吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
             this.educationInfoForm1.degreeCer = ""
            this.degreeCer1List = []
          }).catch(() => {
            this.$refs.inputTest.focus()
          })
        )
      }
      // this.educationInfoForm1.degreeCer = ""
    },
    graCer2Remove () {
      if (window.forUploadTransferValue) {
        return Promise.reject(
          this.$confirm("确定要删除此图片吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.educationInfoForm2.graCer = ""
            this.graCer2List = []
          }).catch(() => {
            this.$refs.inputTest.focus()
          })
        )
      }
      // this.educationInfoForm2.graCer = ""
    },
    degreeCer2Remove () {
      if (window.forUploadTransferValue) {
        return Promise.reject(
          this.$confirm("确定要删除此图片吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.educationInfoForm2.degreeCer = ""
            this.degreeCer2List = []
          }).catch(() => {
            this.$refs.inputTest.focus()
          })
        )
      }
      // this.educationInfoForm2.degreeCer = ""
    },
    // 从业信息的离职图片删除上传图片
    leavingJobRemove () {
      if (window.forUploadTransferValue) {
        return Promise.reject(
          this.$confirm("确定要删除此图片吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.employmentInfoForm.leavingJobCer = ""
            this.LeavingCertList = []
          }).catch(() => {
            this.$refs.inputTest.focus()
          })
        )
      }
      // this.employmentInfoForm.leavingJobCer = ""
    },
    // 3.弹出框-银行卡删除
    bankImgRemove (file, fileList) {
      // if (window.forUploadTransferValue) {
      //   return Promise.reject(
      //     this.$confirm("确定要删除此图片吗?", "提示", {
      //       confirmButtonText: "确定",
      //       cancelButtonText: "取消",
      //       type: "warning"
      //     }).then(() => {
            var arr = []
            this.accountInfoForm.bankImgs = []
            this.bankList2.forEach(val => {
              if(file.response === undefined){
                if(val.img !== file.img){
                  arr.push(val)
                  this.accountInfoForm.bankImgs.push(val.img)
                  // this.bankList = this.accountInfoForm.bankImgs
                }
              }else{
                if(val.img !== file.response.data.filePath){
                  arr.push(val)
                  this.accountInfoForm.bankImgs.push(val.img)
                  // this.bankList = this.accountInfoForm.bankImgs
                }
              }
            })
            this.bankList2 = arr
            // this.bankList = arr
          // }).catch(() => {
          //   this.$refs.inputTest.focus()
          // })
        // )
      // }
    },
    // 3.弹出框-职业证书删除
    profCerImgRemove (file, fileList) {
      var arr = []
      this.educationInfoForm1.profCer = []
      this.profCerList2.forEach(val => {
        if(file.response === undefined){
          if(val.img !== file.img){
            arr.push(val)
            this.educationInfoForm1.profCer.push(val.img)
          }
        }else{
          if(val.img !== file.response.data.filePath){
            arr.push(val)
            this.educationInfoForm1.profCer.push(val.img)
          }
        }
      })
      this.profCerList2 = arr
    },
    resumeRemove () {
      if (window.forUploadTransferValue) {
        return Promise.reject(
          this.$confirm("确定要删除此简历吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.employmentInfoForm.resumeUrl = ""
            this.resumeList = []
          }).catch(() => {
            this.$refs.inputTest.focus()
          })
        )
      }
      // this.employmentInfoForm.resumeUrl = ""
    }, 
    // 删除图片-头像
    removePic (obj, list) {
      if (window.forUploadTransferValue) {
        return Promise.reject(
          this.$confirm("确定要删除此头像吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.personalInfoForm.portraitUrl = ''
            this.headerList = []
            // obj = ''
            // list = []
          }).catch(() => {
            this.$refs.inputTest.focus()
          })
        )
      }
    },
    // 照片-上传限制
    limitUpload (file) {
      // util.uploadImgLimit(file)
      window.forUploadTransferValue = false
      setTimeout(() => {
        window.forUploadTransferValue = true
      }, 500)
      let testmsg = file.name.substring(file.name.lastIndexOf('.')+1)                 
      const extension1 = testmsg === 'jpg'  
      const extension2 = testmsg === 'jpeg'
      const extension3 = testmsg === 'png'  
      const isLt2M = file.size / 1024 / 1024 < 2  
      if(!((extension1) || (extension2) || (extension3) )) {
        return Promise.reject(
          this.$message({
              message: '上传文件只能是jpg/jpeg/png 格式!',  
              type: 'warning'  
          })
        )
        return false
      }
      if(!isLt2M) {
        return Promise.reject(
          this.$message({  
              message: '上传文件大小不能超过 2MB!',  
              type: 'warning'  
          })
        )
        return false
      }
      this.headersImg['sign'] =   this.$util.newHeadersSign('post',{});
      return true
    },
    // 文件-上传限制
    limitUploadFile (file) {
      // util.uploadImgLimit(file)
      window.forUploadTransferValue = false
      setTimeout(() => {
        window.forUploadTransferValue = true
      }, 500)
      let testmsg = file.name.substring(file.name.lastIndexOf('.')+1)
      // DOC/DOCX/PDF/ZIP/RAR               
      const extension1 = testmsg === 'doc'  
      const extension2 = testmsg === 'docx'
      const extension3 = testmsg === 'pdf'  
      const extension4 = testmsg === 'zip'  
      const extension5 = testmsg === 'rar'  
      const isLt2M = file.size / 1024 / 1024 < 2  
      if(!((extension1) || (extension2) || (extension3) || (extension4) || (extension5) )) {
        return Promise.reject(
          this.$message({
              message: '上传文件只能是doc/docx/pdf/zip/rar 格式!',  
              type: 'warning'  
          })
        )
        return false
      }
      if(!isLt2M) {
        return Promise.reject(
          this.$message({  
              message: '上传文件大小不能超过 2MB!',  
              type: 'warning'  
          })
        )
        return false
      }
      this.headersImg['sign'] =   this.$util.newHeadersSign('post',{});
      return true
    },
    // 邮箱失去焦点
    blurEmail(){
      let val = this.personalInfoForm.email
      let emailLast = val.substring(val.length-11,val.length)
      if(emailLast == '@edaili.com'){ //去掉末尾的 @edaili.com
        this.personalInfoForm.email = val.substring(0,val.length-11)
      }
    },
  }
}
</script>
<style lang="sass"  scoped>
#editInfo
  width: 100%
  .tabDiv
    height: calc(100vh - 171px)
  .left
    float: left
    margin-right: 20px
    width: calc(100% - 284px)
  .right
    float: left
    padding-top: 53px
    width: 263px
// 上传头像
.avatar-uploader .el-upload
  border: 1px dashed #d9d9d9
  border-radius: 50%
  cursor: pointer
  position: relative
  overflow: hidden
.avatar-uploader .el-upload:hover
  border-color: #409EFF
.avatar-uploader-icon
  font-size: 28px
  color: #8c939d
  width: 178px
  height: 178px
  line-height: 178px
  text-align: center
.avatar
  width: 178px
  height: 178px
  display: block
.topTabs
  width: 100%
  .topInfo
    min-height: 240px
    border: 1px solid #dcdfe6
    background: #fff
    padding: 30px 20px 0 20px
    -moz-box-shadow: 0 0 10px #d9d9d9
    -webkit-box-shadow: 0 0 10px #d9d9d9
    box-shadow: 0 0 10px #d9d9d9
    margin: 20px 0px 20px 10px
    .el-checkbox + .el-checkbox
      margin-left: 0
    .el-checkbox
      margin-right: 30px
.width300
  width: 300px
.width600
  width: 500px
.width720
  width: 600px
.maxWidth390
  width: 290px
.spanEmail 
  position: absolute
  right: 8px
  top: 0
  color: #606266
  font-size: 12px
  float: left
.headerPic
  height: 150px
  width: 150px
  overflow: hidden
  padding-left: 20px
.identityPic
  height: 176px
  width: 280px
  overflow: hidden
.disabledInput
  color: #666666
.con
  background: white
  padding-bottom: 20px
  border: 1px solid #dcdfe6
  -moz-box-shadow: 0 0 10px #d9d9d9
  -webkit-box-shadow: 0 0 10px #d9d9d9
  box-shadow: 0 0 10px #d9d9d9
  margin: 20px 0px 20px 10px

  // width: 95%

.emptyText
    text-align: center
    background: white
    height: 100px
    width: 95%
    line-height: 100px
    font-size: 13px
    margin-top: 24px
.model
    display: inline-block;
    width: 400px;
    height: 50px;
    background: white;
    border: 1px solid #ebeef5;
    padding-left: 10px;
    padding-right: 10px;
    position: relative;
    box-sizing: border-box;
    font-size: 13px;
    color: #303133;
    line-height: 50px;
    margin: 20px 60px 0 20px;
    i
      position: absolute;
      right: 10px;
      top: 18px;
</style>