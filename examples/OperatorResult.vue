<template>
  <div class="app-container">
    <!-- 数据查询|按钮操作 -->
    <BasicForm
      ref="FormRef"
      label-width="100px"
      :form-list="formList"
      :slot-params="params"
      expand-or-collapse
      @ok="ok"
      @reset="reset"
    >
      <TimePicker slot="reportTime" :start-time.sync="params.startReportTime" :end-time.sync="params.endReportTime" />
      <TimePicker slot="updateTimeStart" :start-time.sync="params.lastUpdateTimeStart" :end-time.sync="params.lastUpdateTimeEnd" />
      <el-select slot="province" v-model="params.province" @change="changeProvince">
        <el-option label="全国" value="" />
        <el-option v-for="item in provinceList" :key="item.provinceName" :label="item.provinceName" :value="item.provinceName" />
      </el-select>
      <el-select v-if="params.province" slot="city" v-model="params.city">
        <el-option label="全部" value="" />
        <el-option v-for="item in cityList" :key="item.cityName" :label="item.cityName" :value="item.cityName" />
      </el-select>
    </BasicForm>
    <!-- <el-form label-width="100px">
      <el-row :gutter="15">
        <el-col :span="6">
          <el-form-item label="服务号">
            <el-input v-model.trim="queryParams.serviceCode" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="报备子端口号">
            <el-input v-model.trim="queryParams.subport" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="运营商">
            <el-select v-model="queryParams.operatorCode" placeholder="请选择">
              <el-option label="全部" value="" />
              <el-option v-for="item in operatorCodeOption" :key="item.key" :label="item.value" :value="item.key" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="亿美签约公司">
            <el-input v-model.trim="queryParams.customerName" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="签名归属公司">
            <el-input v-model.trim="queryParams.reportCustomerName" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="通道名称">
            <el-input v-model.trim="queryParams.channelName" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="通道号">
            <el-input v-model.trim="queryParams.channelNumber" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="签名扩展码">
            <el-input v-model.trim="queryParams.extendCode" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="服务号+签名扩展码" label-width="135px">
            <el-input v-model.trim="queryParams.trimChannelNumber" placeholder="可输入多个,英文逗号分隔" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="签名">
            <el-input v-model.trim="queryParams.sign" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="报备状态">
            <el-select v-model="queryParams.reportState" placeholder="请选择">
              <el-option label="全部" value="" />
              <el-option v-for="item in reportStateOption" :key="item.key" :label="item.value" :value="item.key" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否已下载">
            <el-select v-model="queryParams.downloadState" placeholder="请选择">
              <el-option label="全部" value="" />
              <el-option label="是" :value="1" />
              <el-option label="否" :value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <template v-if="showMoreSearch">
          <el-col :span="12">
            <el-form-item label="报备时间">
              <TimePicker :start-time.sync="queryParams.startReportTime" :end-time.sync="queryParams.endReportTime" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="更新时间">
              <TimePicker :start-time.sync="queryParams.lastUpdateTimeStart" :end-time.sync="queryParams.lastUpdateTimeEnd" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="销售工号">
              <el-input v-model.trim="queryParams.salesNumber" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="提交人">
              <el-input v-model.trim="queryParams.submitter" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="审核人">
              <el-input v-model.trim="queryParams.auditor" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="报备人">
              <el-input v-model.trim="queryParams.creator" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否为富媒体">
              <el-select v-model="queryParams.isVms" placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option v-for="item in isVmsOption" :key="item.key" :label="item.value" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="服务号扩展">
              <el-select v-model="queryParams.isServiceCodeExtend" placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="是" :value="1" />
                <el-option label="否" :value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="省份">
              <el-select v-model="queryParams.province" placeholder="请选择" @change="changeProvince">
                <el-option label="全国" value="" />
                <el-option v-for="item in provinceList" :key="item.provinceName" :label="item.provinceName" :value="item.provinceName" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item v-if="queryParams.province" label="地区/市">
              <el-select v-model="queryParams.city" placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option v-for="item in cityList" :key="item.cityName" :label="item.cityName" :value="item.cityName" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="签名来源">
              <el-select v-model="queryParams.signatureSource" placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option v-for="item in signatureSourceOption" :key="item.key" :label="item.value" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="数据来源">
              <el-select v-model="queryParams.dataSources" placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="签名" :value="1" />
                <el-option label="模板" :value="2" />
                <el-option label="引流" :value="3" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="模版">
              <el-input v-model.trim="queryParams.smsTemplate" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否有附件">
              <el-select v-model="queryParams.whetherAttachFile" placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="是" :value="1" />
                <el-option label="否" :value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="失败原因">
              <el-input v-model.trim="queryParams.errorDesc" />
            </el-form-item>
          </el-col>
        </template>
        <el-col style="margin-bottom: 18px">
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
          <el-button type="default" icon="el-icon-refresh" @click="clearSearch">清除</el-button>
          <el-button
            v-if="AuthUtils.hasAuth('SMS_CUSTOMER_REPORT_SUBPORT_EXPORT')"
            type="primary"
            icon="el-icon-download"
            @click="handleExport()"
          >
            导出
          </el-button>
          <el-button
            v-if="AuthUtils.hasAuth('SMS_SUBPORT_REPORT_STATE_IMPORT')"
            type="primary"
            icon="el-icon-upload2"
            @click="handleImport"
          >
            导入状态
          </el-button>
          <el-button
            v-if="AuthUtils.hasAuth('SMS_CUSTOMER_REPORT_SUBPORT_EXPORT')"
            type="primary"
            icon="el-icon-download"
            @click="handleCustomizeExport()"
          >
            一键导出
          </el-button>
          <el-button
            v-if="AuthUtils.hasAuth('SMS_SUBPORT_HISTORY_DATA_IMPORT')"
            type="primary"
            icon="el-icon-upload2"
            @click="handleHistoryImport()"
          >
            历史数据导入
          </el-button>
          <el-button
            type="primary"
            icon="el-icon-upload2"
            @click="handleSubportsImport()"
          >
            {{ queryParams.subportList.length > 0 ? '查看当前子端口号' : '批量上传子端口号' }}
          </el-button>
          <span style="float: right;cursor: pointer" @click="showMoreSearch = !showMoreSearch">
            <i :class="`el-icon-arrow-${showMoreSearch ? 'up' : 'down'}`" style="color: #409eff;font-size: 14px" />
            <el-button type="text" style="font-size: 14px">{{ showMoreSearch ? '收起' : '展开' }}</el-button>
          </span>
        </el-col>
      </el-row>
    </el-form> -->
    <!-- 表格数据 -->
    <TableContainer ref="TableContainerRef" class-name="OperatorResult" is-el-tab>
      <el-table v-loading="isTableLoading" :data="tableData" border stripe fit highlight-current-row
                style="width: 100%;"
      >
        <el-table-column label="序号" align="center" width="60" type="index" />
        <el-table-column label="报备时间" align="center">
          <template v-slot="{ row }">
            <span>{{ row.createTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center">
          <template v-slot="{ row }">
            <span>{{ row.lastUpdateTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="通道名" prop="channelName" align="center" />
        <el-table-column label="通道号" prop="channelNumber" align="center" />
        <!-- <el-table-column label="APPID" prop="appId" align="center" /> -->
        <el-table-column label="服务号" prop="serviceCode" align="center" show-overflow-tooltip />
        <el-table-column label="签名扩展码" prop="extendCode" align="center" />
        <el-table-column label="服务号+签名扩展码" prop="trimChannelNumber" align="center" />
        <el-table-column label="报备子端口号" prop="subport" align="center" />
        <el-table-column label="签名" width="150" prop="sign" align="center" />
        <el-table-column label="签名归属公司" width="150" prop="reportCustomerName" align="center" />
        <el-table-column label="签名来源" align="center">
          <template v-slot="{ row: { signatureSource } }">
            <ColumnTag str="signatureSource" :val="signatureSource">{{ signatureSource }}</ColumnTag>
          </template>
        </el-table-column>
        <el-table-column label="数据来源" align="center">
          <template v-slot="{ row }">
            <span v-if="row.dataSources === 1">签名</span>
            <span v-if="row.dataSources === 2">模板</span>
            <span v-if="row.dataSources === 3">引流</span>
          </template>
        </el-table-column>
        <el-table-column label="亿美签约公司名称" width="150" prop="customerName" align="center" />
        <el-table-column label="报备状态" align="center">
          <template v-slot="{ row: { reportState } }">
            <ColumnTag str="reportState" :val="reportState">
              {{ reportStateOption.find(i => i.key === reportState) && reportStateOption.find(i => i.key === reportState).value }}
            </ColumnTag>
          </template>
        </el-table-column>
        <el-table-column label="失败原因" prop="errorDesc" align="center" />
        <el-table-column label="运营商" align="center" width="100px">
          <template v-slot="{ row }">
            <Carrier :carrier="row.operatorCode" />
          </template>
        </el-table-column>
        <!-- <el-table-column label="发送大类" prop="businessCategory" align="center" />
      <el-table-column label="发送小类" prop="businessCategorySub" align="center" /> -->
        <el-table-column label="销售工号" prop="salesNumber" align="center" />
        <el-table-column label="提交人" prop="submitter" align="center" />
        <el-table-column label="审核人" prop="auditor" align="center" />
        <el-table-column label="报备人" prop="creator" align="center" />
        <el-table-column label="短信模版" prop="smsTemplate" width="250" align="center" show-overflow-tooltip />
        <el-table-column label="省份" prop="province" align="center" />
        <el-table-column label="地区/市" prop="city" align="center" />
        <el-table-column label="服务号扩展" align="center">
          <template v-slot="{ row }">
            <span v-if="row.isServiceCodeExtend === 1">是</span>
            <span v-if="row.isServiceCodeExtend === 0">否</span>
          </template>
        </el-table-column>
        <el-table-column label="是否为富媒体" align="center">
          <template v-slot="{ row }">
            <span>{{ isVmsOption.find(i => i.key === row.isVms) && isVmsOption.find(i => i.key === row.isVms).value
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否同步" align="center">
          <template v-slot="{ row }">
            <span v-if="row.operatorCode === 'CMCC' || row.operatorCode === 'CTCC'">-</span>
            <span v-else>{{ row.syncState ? '是' : '否' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否有附件" align="center" width="90">
          <template v-slot="{ row }">
            {{ row.attachFile ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column label="是否已下载" align="center" width="90">
          <template v-slot="{ row }">
            {{ row.downloadState === 1 ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column label="下载人" align="center" width="90">
          <template v-slot="{ row: { downloadUserName } }">
            <el-tooltip placement="top">
              <div slot="content">
                <template v-for="(item, i) in (downloadUserName || '').split(',')">
                  <span :key="i">{{ i + 1 }}：{{ item }}<br></span>
                </template>
              </div>
              <div class="ellipsis">{{ downloadUserName }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="下载时间" align="center" width="90">
          <template v-slot="{ row: { downloadTimes } }">
            <el-tooltip placement="top">
              <div slot="content">
                <template v-for="(item, i) in (downloadTimes || '').split(',')">
                  <span :key="i">{{ i + 1 }}：{{ item }}<br></span>
                </template>
              </div>
              <div class="ellipsis">{{ downloadTimes }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </TableContainer>
    <!-- 分页 -->
    <pagination v-show="total > 0" class="pagination" :total="total" :total-page="totalPage" :page="queryParams.pageNum"
                :start.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getTableList"
    />

    <el-dialog title="一键导出" :visible.sync="exportFormVisible" width="700px">
      <el-form ref="exportForm" :model="exportForm" label-width="120px">
        <el-form-item label="报备时间" prop="endReportTime"
                      :rules="[{ required: true, validator: updateTimeReg, trigger: 'change' }]"
        >
          <TimePicker :start-time.sync="exportForm.startReportTime" :end-time.sync="exportForm.endReportTime" />
        </el-form-item>
        <el-form-item label="报备状态" prop="reportState">
          <el-select v-model="exportForm.reportState" style="width: 60%">
            <el-option label="全部" :value="9" />
            <el-option label="未报备" :value="1" />
            <el-option label="报备中" :value="2" />
            <el-option label="报备成功" :value="3" />
            <el-option label="报备失败" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="地区" prop="addressList"
                      :rules="{ required: true, validator: positionReg, trigger: 'change' }"
        >
          <template>
            <div v-for="(item, index) in exportForm.addressList" :key="index">
              <el-select v-model="item.province" style="width: 40%" @change="changeFormProvince($event, item)">
                <el-option v-for="province in exportForm.provinceList" :key="province.province"
                           :label="province.province" :value="province.province"
                />
              </el-select>
              <el-select v-if="item.province !== '广西壮族自治区'" v-model="item.city" :disabled="!item.province"
                         style="width: 40%"
              >
                <el-option v-for="city in item.cityList" :key="city.cityName"
                           :disabled="!!exportForm.addressList.find(i => i.city === city.cityName)" :label="city.cityName"
                           :value="city.cityName"
                />
              </el-select>
              <i v-if="index === exportForm.addressList.length - 1 && index < 9" class="el-icon-plus"
                 style="cursor: pointer;" @click="handleAddPosition(index)"
              />
              <i v-if="exportForm.addressList.length > 1" class="el-icon-minus" style="cursor: pointer;"
                 @click="handleDeletePosition(index)"
              />
            </div>
          </template>
        </el-form-item>
        <el-form-item label="运营商" prop="operatorCode"
                      :rules="{ required: true, validator: (rule, value, callback) => { callback() }, trigger: 'change' }"
        >
          <el-select v-model="exportForm.operatorCode" placeholder="请选择">
            <el-option label="全部" value="" />
            <el-option v-for="item in operatorCodeOption" :key="item.key" :label="item.value" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否导出修改表" prop="whetherExportUpdate">
          <el-checkbox v-model="exportForm.whetherExportUpdate" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="exportFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="customizeExport">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 导入弹窗 -->
    <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" title="导入文件"
               :visible.sync="importFormVisible" width="580px"
    >
      <el-form ref="importForm" :model="importForm" label-width="130px" size="mini" :rules="importFormRules">
        <el-form-item label="运营商" prop="operatorCode"
                      :rules="{ required: true, validator: (rule, value, callback) => { callback() }, trigger: 'change' }"
        >
          <el-select v-model="importForm.operatorCode" placeholder="请选择">
            <el-option v-for="item in operatorCodeOption" :key="item.key" :label="item.value" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="请选择文件">
          <!-- 上传文件 -->
          <el-upload ref="upload" class="upload-demo" :action="uploadUrl" :headers="headers" accept=".xls, .xlsx"
                     :before-upload="beforeUpload" :on-success="uploadSuccess" :on-remove="removeFile"
                     :file-list="importForm.fileList" :limit="1"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <el-button type="text" @click="downloadExcelTemplate">
            导入模板下载
          </el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleImportCancel()">取消</el-button>
        <el-button size="small" type="primary" :disabled="importForm.buttonDisabled"
                   @click="handleFileSubmit()"
        >确定</el-button>
      </div>
    </el-dialog>

    <!-- 历史数据导入弹窗 -->
    <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" title="导入文件"
               :visible.sync="historyImportFormVisible" width="580px"
    >
      <el-form ref="historyImportForm" :model="historyImportForm" label-width="130px" size="mini"
               :rules="historyImportFormRules"
      >
        <el-form-item label="运营商" prop="operatorCode" :rules="{ required: true, message: '请选择运营商', trigger: 'change' }">
          <el-select v-model="historyImportForm.operatorCode" placeholder="请选择">
            <el-option v-for="item in operatorCodeOption" :key="item.key" :label="item.value" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="请选择文件">
          <!-- 上传文件 -->
          <el-upload ref="upload" class="upload-demo" :action="uploadUrl" :headers="headers" accept=".xls, .xlsx"
                     :before-upload="historyBeforeUpload" :on-success="historyUploadSuccess" :on-remove="historyRemoveFile"
                     :file-list="historyImportForm.fileList" :limit="1"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <el-button type="text" @click="downloadHistoryExcelTemplate">
            导入模板下载
          </el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleHistoryImportCancel()">取消</el-button>
        <el-button size="small" type="primary" :disabled="historyImportForm.buttonDisabled"
                   @click="handleHistoryFileSubmit()"
        >确定</el-button>
      </div>
    </el-dialog>

    <!-- 附件下载弹窗 -->
    <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" title="查看附件"
               :visible.sync="downloadFormVisible" width="580px"
    >
      <el-form ref="downloadForm" :model="downloadForm" label-width="0" size="mini">
        <el-form-item>
          <el-row :gutter="20">
            <el-col :offset="7" :span="10">
              <div style="margin: 20px 0px">
                <span style="margin-right: 30px;">已上传授权函</span>
                <el-button type="text" @click="downloadFile">下载</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="downloadFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <!-- 导入弹窗 -->
    <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" title="导入文件"
               :visible.sync="subportsImportFormVisible" width="580px"
    >
      <el-form ref="subportsImportForm" :model="subportsImportForm" label-width="130px" size="mini" :rules="importFormRules">
        <el-form-item label="请选择文件">
          <!-- 上传文件 -->
          <el-upload ref="upload" class="upload-demo" :action="uploadUrls" :headers="headers" accept=".xls, .xlsx"
                     :before-upload="beforeUpload" :on-success="uploadSubportsSuccess" :on-remove="removeSubportsFile"
                     :file-list="subportsImportForm.fileList" :limit="1"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <el-button type="text" @click="downloadExcelSubports">
            导入模板下载
          </el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleSubportsImportCancel()">取消</el-button>
        <el-button size="small" type="primary" :disabled="subportsImportForm.buttonDisabled"
                   @click="handleSubportsSubmit()"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import Pagination from '@/components/Pagination' // 分页
import TimePicker from '@/components/TimePicker/TimePicker' // 时间选择器
import TableContainer from '@/components/TableContainer/TableContainer' // 表格容器
import { apiImport, apiHistoryImport, apiList, subportsImportApi } from '@/api/sms/customerSubportReport' // api
import { apiChannelList } from '@/api/sms/channelMaintain' // api
import store from '@/store'
import province from '@/api/public/smsProvince' // 省市区列表
import tableContainerMixin from '@/mixins/tableContainerMixin'
import { mustHaveSearch } from '@/utils/CommonUtils'

export default {
  name: 'CmccPanel',
  mixins: [tableContainerMixin],
  components: { Pagination, TimePicker, TableContainer },
  data() {
    const validatePass = (rule, value, callback) => {
      console.log(value, this.params.endReportTime, 'endReportTime')
      if (!value || !this.params.endReportTime) {
        callback(new Error('选择时间'))
      } else {
        callback()
      }
    }

    return {
      params: {
        startReportTime: '',
        endReportTime: '',
        lastUpdateTimeStart: '',
        lastUpdateTimeEnd: '',
        province: '',
        city: ''
      },
      formList: [
        {
          type: 'input',
          formItemAttrs: {
            label: '服务号',
            prop: 'serviceCode'
          }
        },
        {
          type: 'input',
          formItemAttrs: {
            label: '报备子端口号',
            prop: 'subport'
          }
        },
        {
          type: 'select',
          formItemAttrs: {
            label: '运营商',
            prop: 'operatorCode'
          },
          attrs: {
            options: [
              {
                label: '男',
                value: 1
              },
              {
                label: '女',
                value: 0
              }
            ]
          }
        },
        {
          type: 'input',
          formItemAttrs: {
            label: '亿美签约公司',
            prop: 'customerName'
          }
        },
        {
          type: 'input',
          formItemAttrs: {
            label: '签名归属公司',
            prop: 'reportCustomerName'
          }
        },
        {
          type: 'input',
          formItemAttrs: {
            label: '通道名称',
            prop: 'channelName'
          }
        },
        {
          type: 'input',
          formItemAttrs: {
            label: '通道号',
            prop: 'channelNumber'
          }
        },
        {
          type: 'input',
          formItemAttrs: {
            label: '签名扩展码',
            prop: 'extendCode'
          }
        },
        {
          type: 'input',
          formItemAttrs: {
            label: '服务号+签名扩展码',
            prop: 'trimChannelNumber',
            labelWidth: '135px'
          }
        },
        {
          type: 'input',
          formItemAttrs: {
            label: '签名',
            prop: 'sign'
          }
        },
        {
          type: 'select',
          formItemAttrs: {
            label: '报备状态',
            prop: 'reportState'
          },
          attrs: {
            options: [
              {
                label: '男',
                value: 1
              },
              {
                label: '女',
                value: 0
              }
            ]
          }
        },
        {
          type: 'select',
          formItemAttrs: {
            label: '是否已下载',
            prop: 'downloadState'
          },
          attrs: {
            options: [
              {
                label: '男',
                value: 1
              },
              {
                label: '女',
                value: 0
              }
            ]
          }
        },
        {
          slot: 'reportTime',
          colAttrs: {
            span: 12
          },
          formItemAttrs: {
            label: '时间',
            prop: 'startReportTime',
            rules: [
              { required: true, message: '请选择时间', trigger: 'blur' },
              { validator: validatePass, trigger: 'blur' }
            ]
          }
        },
        {
          slot: 'updateTimeStart',
          colAttrs: {
            span: 12
          },
          formItemAttrs: {
            label: '时间',
            prop: 'lastUpdateTimeStart'
          }
        },
        {
          type: 'input',
          formItemAttrs: {
            label: '销售工号',
            prop: 'salesNumber'
          }
        },
        {
          type: 'input',
          formItemAttrs: {
            label: '提交人',
            prop: 'submitter'
          }
        },
        {
          type: 'input',
          formItemAttrs: {
            label: '审核人',
            prop: 'auditor'
          }
        },
        {
          type: 'input',
          formItemAttrs: {
            label: '报备人',
            prop: 'creator'
          }
        },
        {
          type: 'select',
          formItemAttrs: {
            label: '是否为富媒体',
            prop: 'isVms'
          },
          attrs: {
            options: [
              {
                label: '男',
                value: 1
              },
              {
                label: '女',
                value: 0
              }
            ]
          }
        },
        {
          type: 'select',
          formItemAttrs: {
            label: '服务号扩展',
            prop: 'isServiceCodeExtend'
          },
          attrs: {
            options: [
              {
                label: '男',
                value: 1
              },
              {
                label: '女',
                value: 0
              }
            ]
          }
        },
        {
          slot: 'province',
          formItemAttrs: {
            label: '省份',
            prop: 'province'
          }
        },
        {
          slot: 'city',
          formItemAttrs: {
            label: '城市',
            prop: 'city'
          }
        },
        {
          type: 'select',
          formItemAttrs: {
            label: '签名来源',
            prop: 'signatureSource'
          },
          attrs: {
            options: [
              {
                label: '男',
                value: 1
              },
              {
                label: '女',
                value: 0
              }
            ]
          }
        },
        {
          type: 'select',
          formItemAttrs: {
            label: '数据来源',
            prop: 'dataSources'
          },
          attrs: {
            options: [
              {
                label: '男',
                value: 1
              },
              {
                label: '女',
                value: 0
              }
            ]
          }
        },
        {
          type: 'input',
          formItemAttrs: {
            label: '模版',
            prop: 'smsTemplate'
          }
        },
        {
          type: 'select',
          formItemAttrs: {
            label: '是否有附件',
            prop: 'whetherAttachFile'
          },
          attrs: {
            options: [
              {
                label: '男',
                value: 1
              },
              {
                label: '女',
                value: 0
              }
            ]
          }
        },
        {
          type: 'input',
          formItemAttrs: {
            label: '失败原因',
            prop: 'errorDesc'
          }
        }
      ],
      showMoreSearch: false, // 是否显示更多搜索条件
      baseUrl: process.env.VUE_APP_BASE_API + '/s',
      uploadUrl: process.env.VUE_APP_BASE_API + '/o/sms/customerSubportReport/import',
      uploadUrls: process.env.VUE_APP_BASE_API + '/o/sms/customerSubportReport/batchQueryImportFile',
      headers: {
        'Accept': 'application/json',
        'AUTH-WEB-TOKEN': store.state.webToken.token,
        'AUTH-WEB-JOB-NUMBER': store.state.webToken.user.jobNumber
      },
      operatorCodeOption: [
        { key: 'CMCC', value: '中国移动' },
        { key: 'CUCC', value: '中国联通' },
        { key: 'CTCC', value: '中国电信' }
      ],
      reportStateOption: [
        { key: 0, value: '未报备' },
        { key: 1, value: '报备中' },
        { key: 2, value: '报备成功' },
        { key: 3, value: '报备失败' }
      ],
      isVmsOption: [
        { key: false, value: '否' },
        { key: true, value: '是' }
      ],
      signatureSourceOption: [
        { key: 0, value: '全称' },
        { key: 1, value: '简称' },
        { key: 2, value: '商标' },
        { key: 3, value: 'app' },
        { key: 4, value: '小程序' },
        { key: 5, value: '营业执照' },
        { key: 6, value: '其他' }
      ],
      queryParams: {
        errorDesc: '',
        whetherAttachFile: '',
        downloadState: '',
        serviceCode: '',
        appId: '',
        channelName: '',
        channelNumber: '',
        customerName: '',
        reportCustomerName: '',
        extendCode: '',
        trimChannelNumber: '',
        subport: '',
        sign: '',
        legalPerson: '',
        isVms: '',
        operatorCode: '',
        reportState: '',
        isServiceCodeExtend: '',
        province: '',
        city: '',
        saleName: '',
        salesNumber: '',
        creatorName: '',
        startReportTime: '',
        endReportTime: '',
        lastUpdateTimeStart: '',
        lastUpdateTimeEnd: '',
        dataSources: '',
        signatureSource: '',
        smsTemplate: '',
        submitter: '',
        auditor: '',
        creator: '',
        subportList: [],
        pageNum: 1,
        pageSize: 50
      },
      hasSubportList: false,
      isTableLoading: false, // 加载状态
      total: 0,
      totalPage: 0,
      tableData: [],
      provinceList: [],
      cityList: [],
      // 一键导出弹窗表单
      exportFormVisible: false,
      exportForm: {
        whetherExportUpdate: false,
        startReportTime: '',
        endReportTime: '',
        reportState: 9,
        provinceList: [],
        addressList: [
          {
            province: '',
            cityList: [],
            city: ''
          }
        ],
        operatorCode: ''
      },
      whetherExportUpdate: false,
      // 导入状态弹窗表单
      importFormVisible: false,
      importForm: {
        operatorCode: '',
        fileList: [],
        buttonDisabled: false
      },
      importFormRules: {
        fileList: { required: true, message: '请选择文件', trigger: 'change' }
      },
      // 历史数据导入弹窗表单
      historyImportFormVisible: false,
      historyImportForm: {
        operatorCode: '',
        fileList: [],
        buttonDisabled: false
      },
      historyImportFormRules: {
        fileList: { required: true, message: '请选择文件', trigger: 'change' }
      },
      // 附件下载弹窗表单
      downloadFormVisible: false,
      downloadForm: {
        attachFile: ''
      },
      subportsImportFormVisible: false,
      subportsImportForm: {
        fileList: [],
        buttonDisabled: false
      }
    }
  },
  created() {
    this.getTableList()
    this.getProvinceList()
  },
  methods: {
    async ok() {
      await this.$refs.FormRef.validate()
      console.log(this.$refs.FormRef.getFormData())
    },
    async reset() {
      this.params = {
        startReportTime: '',
        endReportTime: '',
        lastUpdateTimeStart: '',
        lastUpdateTimeEnd: '',
        province: '',
        city: ''
      }
      this.$refs.FormRef.resetFields()
      console.log(await this.$refs.FormRef.getFormDataAsync(), '111')
    },
    updateTimeReg(rule, value, callback) {
      if (this.exportForm.startReportTime && this.exportForm.endReportTime) {
        callback()
      } else {
        callback(new Error('请选择开始时间和结束时间'))
      }
    },

    positionReg(rule, value, callback) {
      for (let i = 0; i < this.exportForm.addressList.length; i++) {
        if (this.exportForm.addressList[i].province !== '广西壮族自治区' && (!this.exportForm.addressList[i].province || !this.exportForm.addressList[i].city)) {
          return callback(new Error('请完整填写省份与地区/市'))
        }
      }
      return callback()
    },

    // 获取表格信息
    async getTableList() {
      this.isTableLoading = true
      const res = await apiList(this.queryParams).catch(_ => { }).finally(_ => { this.isTableLoading = false })
      if (res && res.success) {
        this.total = res.result.totalCount
        this.totalPage = res.result.totalPage
        this.tableData = res.result.list
      }
    },

    handleSearch() {
      this.queryParams.pageNum = 1
      // 列表请求
      this.getTableList()
    },

    // 清除查询条件
    clearSearch() {
      Object.assign(this.queryParams, this.$options.data().queryParams)
      this.queryParams.subportList = []
      this.hasSubportList = false
      // this.importForm.fileList = []
      this.subportsImportForm = {
        fileList: [],
        buttonDisabled: false
      }
      this.getTableList()
    },

    // 导出
    async handleExport() {
      await mustHaveSearch(this.queryParams)
      const h = this.$createElement
      const _this = this
      const checkbox = Vue.component('checkbox', {
        data() {
          return { value: _this.whetherExportUpdate }
        },
        render(h) {
          return h('div', null, [
            h('span', { style: { 'margin-right': '10px' }}, '是否导出修改表'),
            h('el-checkbox', {
              props: { value: this.value },
              on: { 'input': (value) => { _this.whetherExportUpdate = this.value = value } }
            })
          ])
        }
      })

      this.$msgbox({
        title: '导出',
        type: 'warning',
        showCancelButton: true,
        message: h(checkbox)
      }).then(() => {
        const baseUrl = process.env.VUE_APP_BASE_API
        const token = this.$store.state.webToken.token
        const jobNumber = this.$store.state.webToken.user.jobNumber
        const url =
          '/o/sms/customerSubportReport/exportSubPort'
        const downloadUrl = baseUrl + url
        const params = JSON.stringify({ ...this.queryParams, whetherExportUpdate: this.whetherExportUpdate })
        var xhr = new XMLHttpRequest()
        xhr.open('post', downloadUrl, true) // get、post都可
        xhr.responseType = 'blob' // 转换流
        xhr.setRequestHeader('AUTH-WEB-TOKEN', token) // token键值对
        xhr.setRequestHeader('AUTH-WEB-JOB-NUMBER', jobNumber)
        xhr.setRequestHeader('Accept', 'application/json')
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.onload = function() {
          if (this.status === 200) {
            let fileName = '报备记录.zip'
            if (this.getResponseHeader('Content-disposition')) {
              fileName = this.getResponseHeader('Content-disposition').split(';')[1].split('=')[1]
            }
            var blob = this.response
            var a = document.createElement('a')
            var url = window.URL.createObjectURL(blob)
            a.href = url
            a.download = fileName // 文件名
            a.click()
            window.URL.revokeObjectURL(url)
            if (fileName === 'data.zip') {
              _this.getTableList()
            }
          }
        }
        xhr.send(params)
      }).finally(() => {
        this.whetherExportUpdate = false
      })
    },

    // 一键导出
    handleCustomizeExport() {
      Object.assign(this.exportForm, this.$options.data().exportForm)
      this.getExportProvinceList()
      this.exportFormVisible = true
      this.$nextTick(() => {
        this.$refs.exportForm && this.$refs.exportForm.clearValidate()
      })
    },

    // 一键导出可选择的地市列表
    getExportProvinceList() {
      apiChannelList().then(res => {
        if (res && res.success) {
          this.exportForm.provinceList = []
          if (res.result.length) {
            res.result.map(i => {
              if (this.exportForm.provinceList.some(province => province.province === i.province)) {
                // 如果存在同名省份，则在同名省份的city数组中添加城市
                if (!this.exportForm.provinceList.find(province => province.province === i.province).city.find(city => city.cityName === i.city)) {
                  // 该省份下已存在同名城市则不添加
                  this.exportForm.provinceList.find(province => province.province === i.province).city.push({ cityName: i.city })
                }
              } else {
                // 不存在该省份时直接添加省市数据
                this.exportForm.provinceList.push({ province: i.province, city: [{ cityName: i.city }] })
              }
            })
          }
        }
      })
    },

    // 导入状态
    handleImport() {
      Object.assign(this.importForm, this.$options.data().importForm)
      this.importFormVisible = true
    },

    // 获取全国省份列表
    async getProvinceList() {
      this.provinceList = province
    },

    // 修改省份信息时查询省份下的市/区信息
    changeProvince(val) {
      this.queryParams.city = ''
      if (val) {
        this.cityList = this.provinceList.find((item) => item.provinceName === val).cityList
      }
    },

    // 表单内修改省份查询省份下地区/市
    changeFormProvince(val, ele) {
      ele.city = ''
      if (val) {
        ele.cityList = this.exportForm.provinceList.find((item) => item.province === val).city
      }
    },

    // 查看附件
    async viewAttachment(r) {
      this.downloadForm.attachFile = r.attachFile
      this.downloadFormVisible = true
    },

    downloadFile() {
      window.open(this.baseUrl + this.downloadForm.attachFile, '_blank')
    },

    handleAddPosition(index) {
      if (this.exportForm.addressList.length > 9) {
        this.$message.warning('最多只能添加10个地区')
        return
      }
      this.exportForm.addressList.splice(index + 1, 0, { province: '', city: '', cityList: [] })
    },
    handleDeletePosition(index) {
      if (this.exportForm.addressList.length === 1) {
        this.$message.warning('至少需要一个地区')
        return
      }
      this.exportForm.addressList.splice(index, 1)
    },

    // 导出
    async customizeExport() {
      const _this = this
      const valid = await this.$refs.exportForm.validate().catch(_ => { })
      if (!valid) return
      this.$confirm('确认导出?', '导出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const baseUrl = process.env.VUE_APP_BASE_API
        const token = this.$store.state.webToken.token
        const jobNumber = this.$store.state.webToken.user.jobNumber
        const url =
          '/o/sms/customerSubportReport/exportSubPort'
        const downloadUrl = baseUrl + url
        const params = JSON.stringify({ ...this.exportForm })
        var xhr = new XMLHttpRequest()
        xhr.open('post', downloadUrl, true) // get、post都可
        xhr.responseType = 'blob' // 转换流
        xhr.setRequestHeader('AUTH-WEB-TOKEN', token) // token键值对
        xhr.setRequestHeader('AUTH-WEB-JOB-NUMBER', jobNumber)
        xhr.setRequestHeader('Accept', 'application/json')
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.onload = function() {
          if (this.status === 200) {
            let fileName = '报备记录.zip'
            if (this.getResponseHeader('Content-disposition')) {
              fileName = this.getResponseHeader('Content-disposition').split(';')[1].split('=')[1]
            }
            var blob = this.response
            var a = document.createElement('a')
            var url = window.URL.createObjectURL(blob)
            a.href = url
            a.download = fileName // 文件名
            a.click()
            window.URL.revokeObjectURL(url)
            if (fileName === 'data.zip') {
              _this.getTableList()
              _this.exportFormVisible = false
            }
          }
        }
        xhr.send(params)
      })
    },

    handleImportCancel() {
      this.importFormVisible = false
    },

    // 上传文件操作
    beforeUpload(file) {
      // 获取文件拓展名
      const filePath = file.name
      const index = filePath.lastIndexOf('.')
      const ext = filePath.substr(index + 1).toLowerCase()
      if ('xls.xlsx'.indexOf(ext) === -1) {
        this.$message.warning(`不支持${ext}文件上传`)
        return false
      }
    },

    uploadSuccess(res, file) {
      this.importForm.fileList = [file]
    },

    removeFile(file, fileList) {
      this.importForm.fileList = []
    },

    handleFileSubmit() {
      this.$refs.importForm.validate(valid => {
        if (valid) {
          if (this.importForm.fileList.length <= 0) {
            this.$message.error('请选择一个文件！')
            return
          }
          const Params = {
            importFile: {
              filePath: this.importForm.fileList[0].response.result.filePath,
              oldFileName: this.importForm.fileList[0].response.result.oldFileName
            },
            operatorCode: this.importForm.operatorCode
          }
          this.importForm.buttonDisabled = true
          apiImport(Params)
            .then(res => {
              if (res && res.success) {
                this.$message.success('上传成功!')
                this.handleImportCancel()
                this.getTableList()
              }
            }).catch(_ => { })
            .finally(_ => {
              this.importForm.buttonDisabled = false
            })
        } else {
          return false
        }
      })
    },

    // 下载Excel模版
    downloadExcelTemplate() {
      const baseUrl = process.env.VUE_APP_BASE_API
      const token = this.$store.state.webToken.token
      const jobNumber = this.$store.state.webToken.user.jobNumber
      const url =
        '/o/sms/customerSubportReport/getReportStateImportTemplate'
      const downloadUrl = baseUrl + url
      var xhr = new XMLHttpRequest()
      xhr.open('get', downloadUrl, true) // get、post都可
      xhr.responseType = 'blob' // 转换流
      xhr.setRequestHeader('AUTH-WEB-TOKEN', token) // token键值对
      xhr.setRequestHeader('AUTH-WEB-JOB-NUMBER', jobNumber)
      xhr.onload = function() {
        if (this.status === 200) {
          var blob = this.response
          var a = document.createElement('a')
          var url = window.URL.createObjectURL(blob)
          a.href = url
          a.download = '子端口报备状态-导入模板.xls' // 文件名
        }
        a.click()
        window.URL.revokeObjectURL(url)
      }
      xhr.send()
    },

    uploadSubportsSuccess(res, file) {
      this.subportsImportForm.fileList = [file]
    },

    removeSubportsFile(file, fileList) {
      this.subportsImportForm.fileList = []
      this.queryParams.subportList = []
    },

    downloadExcelSubports() {
      const baseUrl = process.env.VUE_APP_BASE_API
      const token = this.$store.state.webToken.token
      const jobNumber = this.$store.state.webToken.user.jobNumber
      const url =
        '/o/sms/customerSubportReport/getBatchQueryTemplate'
      const downloadUrl = baseUrl + url
      var xhr = new XMLHttpRequest()
      xhr.open('get', downloadUrl, true) // get、post都可
      xhr.responseType = 'blob' // 转换流
      xhr.setRequestHeader('AUTH-WEB-TOKEN', token) // token键值对
      xhr.setRequestHeader('AUTH-WEB-JOB-NUMBER', jobNumber)
      xhr.onload = function() {
        if (this.status === 200) {
          var blob = this.response
          var a = document.createElement('a')
          var url = window.URL.createObjectURL(blob)
          a.href = url
          a.download = '批量查询-导入模板.xls' // 文件名
        }
        a.click()
        window.URL.revokeObjectURL(url)
      }
      xhr.send()
    },

    handleSubportsSubmit() {
      if (this.hasSubportList) {
        this.subportsImportFormVisible = false
        if (this.queryParams.subportList.length <= 0) {
          this.hasSubportList = false
        }
        return
      }
      this.$refs.subportsImportForm.validate(valid => {
        if (valid) {
          if (this.subportsImportForm.fileList.length <= 0) {
            this.$message.error('请选择一个文件！')
            return
          }
          const Params = {

            filePath: this.subportsImportForm.fileList[0].response.result.filePath,
            oldFileName: this.subportsImportForm.fileList[0].response.result.oldFileName

          }
          this.subportsImportForm.buttonDisabled = true
          subportsImportApi(Params)
            .then(res => {
              if (res && res.success) {
                this.$message.success('上传成功!')
                this.handleImportCancel()
                this.queryParams.subportList = res.result
                this.hasSubportList = res.result.length > 0
                // this.getTableList()
              }
            }).catch(_ => { })
            .finally(_ => {
              this.subportsImportFormVisible = false
              this.subportsImportForm.buttonDisabled = false
            })
        } else {
          return false
        }
      })
    },

    // 历史数据导入
    handleHistoryImport() {
      Object.assign(this.historyImportForm, this.$options.data().historyImportForm)
      this.historyImportFormVisible = true
    },

    handleSubportsImport() {
      Object.assign(this.historyImportForm, this.$options.data().historyImportForm)
      this.subportsImportFormVisible = true
    },

    handleSubportsImportCancel() {
      this.subportsImportFormVisible = false
    },

    handleHistoryImportCancel() {
      this.historyImportFormVisible = false
    },

    // 上传文件操作
    historyBeforeUpload(file) {
      // 获取文件拓展名
      const filePath = file.name
      const index = filePath.lastIndexOf('.')
      const ext = filePath.substr(index + 1).toLowerCase()
      if ('xls.xlsx'.indexOf(ext) === -1) {
        this.$message.warning(`不支持${ext}文件上传`)
        return false
      }
    },

    historyUploadSuccess(res, file) {
      this.historyImportForm.fileList = [file]
    },

    historyRemoveFile(file, fileList) {
      this.historyImportForm.fileList = []
    },

    handleHistoryFileSubmit() {
      this.$refs.historyImportForm.validate(valid => {
        if (valid) {
          if (this.historyImportForm.fileList.length <= 0) {
            this.$message.error('请选择一个文件！')
            return
          }
          const Params = {
            importFile: {
              filePath: this.historyImportForm.fileList[0].response.result.filePath,
              oldFileName: this.historyImportForm.fileList[0].response.result.oldFileName
            },
            operatorCode: this.historyImportForm.operatorCode
          }
          this.historyImportForm.buttonDisabled = true
          apiHistoryImport(Params)
            .then(res => {
              if (res && res.success) {
                this.$message.success('上传成功!')

                this.handleHistoryImportCancel()
                this.getTableList()
              }
            }).catch(_ => { })
            .finally(_ => {
              this.historyImportForm.buttonDisabled = false
            })
        } else {
          return false
        }
      })
    },

    // 下载Excel模版
    downloadHistoryExcelTemplate() {
      const baseUrl = process.env.VUE_APP_BASE_API
      const token = this.$store.state.webToken.token
      const jobNumber = this.$store.state.webToken.user.jobNumber
      const url =
        '/o/sms/customerSubportReport/getHistoryDataExportTemplate'
      const downloadUrl = baseUrl + url
      var xhr = new XMLHttpRequest()
      xhr.open('get', downloadUrl, true) // get、post都可
      xhr.responseType = 'blob' // 转换流
      xhr.setRequestHeader('AUTH-WEB-TOKEN', token) // token键值对
      xhr.setRequestHeader('AUTH-WEB-JOB-NUMBER', jobNumber)
      xhr.onload = function() {
        if (this.status === 200) {
          var blob = this.response
          var a = document.createElement('a')
          var url = window.URL.createObjectURL(blob)
          a.href = url
          a.download = '历史数据-导入模板.xls' // 文件名
        }
        a.click()
        window.URL.revokeObjectURL(url)
      }
      xhr.send()
    }
  }
}
</script>

<style scoped lang="scss">
.download-list {
  padding: 10px 40px;

  div {
    margin: 10px 0;

    span {
      width: 200px;
    }

    button {
      margin-left: 20px;
    }
  }
}
::v-deep .el-date-editor {
  width: calc(50% - 11px);
}

.el-select {
  width: 100%;
}

.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
