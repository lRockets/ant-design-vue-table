<template>
	<div class="table" :style="{height:opt.height,width:opt.width,position:'relative'}" :class="[!opt.showSummary ? 'hideSummary' : '',`table${id}`]">
		<div class="table-top" v-if="opt.tableTop">
			<span style="margin-left: 8px" class="top-tool">
				<template v-if="opt.showSelectText">共{{page.total}}条数据,<span>已选择{{selectedRowKeys.length}}条</span></template>
			</span>
			<slot name="pannel-top"></slot>
		</div>
		<slot name="paginationLeft" v-if="opt.paginationLeft">
			 <a-checkbox @change="checkedChange" class="checkAll" v-model="checkAll">全选</a-checkbox>
		</slot>
		<a-config-provider :locale="locale" >
			<template  #renderEmpty>
				<div style="text-align: center">
					<p>Data Not Found</p>
				</div>
			</template>
			<a-table 
				:columns="columns" 
				:data-source="data" 
				:pagination="opt.page ? computedPagination : false" 
				:bordered="opt.border" 
				:size="opt.size"
				:rowSelection="opt.multiple ? {type:'checkbox',onChange:onSelectChange,selectedRowKeys,onSelectAll} : undefined"
				:loading="opt.loading" 
				:row-key="opt.rowKey || 'id'"
				:scroll="opt.height ? { x: '100%', y: computedHeight } : {x:'100%'}"
				 @change="pageChange"
				 :rowClassName="rowClass"
				:customRow="onClickRow">
				<template slot="footer" slot-scope="scope" v-if="opt.showSummary">
					<template v-if="$slots.footer">
						<div style="padding:16px;">
							<slot name="footer"></slot>
						</div>
					</template>
					<table class="footer" :class="[opt.border ? 'border' : '']" v-else style="margin-right:17px;">
						<tr>
							<template v-if="!opt.showSummaryVal">
								<td v-for="(item,index) in computedColumn" :key="item.key" :align="item.align || 'left'" :width="item.width">
									{{getSummaries(scope)[index] || ''}}
								</td>
							</template>
							<template v-else>
								<td :title="opt.showSummaryVal[index] || ''" v-for="(item,index) in computedColumn" :key="item.key" :align="item.align || 'left'" :width="item.width">
									{{opt.showSummaryVal[index] || ''}}
								</td>
							</template>
						</tr>
					</table>
				 </template>
			</a-table>
		</a-config-provider>
	</div>
</template>

<script>
	import zhCN from 'ant-design-vue/es/locale/zh_CN';
	function ___getDeep(data, prop){
		let arr = prop?prop.split('.'):[];
		let data_ = data;
		for(let item of arr){
			if(data_[item]){
				data_ = data_[item];
			}else{
				data_ = [];
				break;
			}
		}
		return data_;
	}
	export default {
		props: {
			opt: {
				type: Object,
				default: () => {}
			},
			columns: {
				type: Array,
				required: true
			},
			page: {
				type: Object,
				default:function(){
					return {};
				}
			},
			data: {
				type: Array,
				required: true
			}
		},
		model: {
		    prop: 'data',
		    event: 'getdata'
		},
		watch: {
		    data(val) {
		        this.mydata = val;
		    },
		    mydata(val) {
		        this.$emit("getdata", val);
		    }
		},
		data() {
			return {
				checkAll:false,
				page_: {},
				computedHeight:300,
				//存放上一次的参数和url
				oldParams: {},
				oldUrl: '',
				locale:zhCN,
				pageProp: this.opt.page && this.page.pageProp ? this.page.pageProp : {
				    pageSize: "pageSize",
				    currentPage: "pageNo"
				},
				//定义url接口的返回数据参数名
				dataProp: this.opt.dataProp ? this.opt.dataProp : {
				    data: "rows",
				    total: "totalCount"
				},
				selectedRowKeys: [],
				pagination:{
					defaultPageSize:10,
					total:0, //总条数
					current:1,
					showTotal: total => `共 ${total} 条`,
					showSizeChanger:true,
					pageSizeOptions: ['5', '10', '15', '20'],
					showQuickJumper:true,
					onShowSizeChange:(current, pageSize)=>{
						// this.page_[this.pageProp.currentPage] = current
						this.page_[this.pageProp.pageSize] = pageSize
					}
				},
				columnv:[]
			}
		},
		computed: {
			id(){
				return +new Date();
			},
			hasSelected(){
				return this.selectedRowKeys.length;
			},
			computedPagination(){
				return Object.assign({},this.pagination,this.page);
			},
			computedColumn(){
				if(this.opt.multiple){
					return [{key: 'selection',width:60}].concat(this.columns);
				}
				return this.columns;
			}
		},
		mounted() {
			if(this.opt.height){
				this.setTableHeight();
				window.addEventListener('resize',this.setTableHeight,false);
			}
			if (!this.opt.mountedNotLoad) { //mountedNotLoad 安装时不请求接口
				this.reload();
			}
		},
		created: function() {
			if (typeof this.page == "object") {
				this.page.pageSize = typeof this.page.pageSize === "string" || typeof this.page.pageSize === "number" ? this.page
					.pageSize : 10;
				this.page.total = typeof this.page.total === "string" || typeof this.page.total === "number" ? this.page.total :
					0;
				this.page.currentPage = typeof this.page.currentPage === "string" || typeof this.page.currentPage === "number" ?
					this.page.currentPage : 1;
			}
			if (typeof this.opt == "object") {
				this.opt.width = typeof this.opt.width === "number"  ? this.opt.width+'px' :
					"100%";
					
				// this.opt.height = typeof this.opt.height === "string" || typeof this.opt.height === "number"?this.opt.height:"500px";
				typeof this.opt.height === "number" ? this.opt.height = this.opt.height + "px" : null;
				this.opt.stripe = typeof this.opt.stripe === "boolean" ? this.opt.stripe : true;
				this.opt.border = typeof this.opt.border === "boolean" ? this.opt.border : true;
			}
		},
		beforeDestroy(){
			window.removeEventListener('resize',this.setTableHeight,false);
		},
		methods: {
			setTableHeight(){
				
				let headerHeight=0,footerHeight=0,tableTop=0;
				if(document.querySelector(`.table${this.id}`).querySelector('.table-top')){
					tableTop=document.querySelector(`.table${this.id}`).querySelector('.table-top').offsetHeight;
				}
				if(document.querySelector(`.table${this.id}`).querySelector('.ant-table-fixed')){
					headerHeight=document.querySelector('.ant-table-fixed').offsetHeight;
				}
				if(document.querySelector(`.table${this.id}`).querySelector('.ant-table-footer')){
					footerHeight=this.opt.showSummary ? document.querySelector('.ant-table-footer').offsetHeight : 0
				}
				let pagination=this.opt.page ? 64 : 0;
				// this.computedHeight=parseFloat(this.opt.height) - headerHeight - footerHeight - pagination -tableTop;  //计算表格高度
				this.computedHeight=Math.abs(document.querySelector(`.table${this.id}`).offsetHeight - headerHeight - footerHeight - pagination -tableTop);  //计算表格高度
				if(document.querySelector(`.table${this.id}`).querySelector('.ant-table-placeholder')){
					document.querySelector(`.table${this.id}`).querySelector('.ant-table-placeholder').style.height=this.computedHeight+'px';
					return;
				}
				console.log(this.computedHeight,document.querySelector(`.table${this.id}`).offsetHeight)
				// console.log(this.opt.height,'height')
				document.querySelector(`.table${this.id}`).querySelector('.ant-table-body').style.height=this.computedHeight+'px';
			},
			reload: function(data) {
			    if (!this.opt.url || (typeof this.opt.readyLoad != "undefined" && !this.opt.readyLoad)) {
			        //重置页数和页显示数
			        this.page_[this.pageProp.currentPage] = 1;
			        this.page.currentPage = 1;
			        this.page_[this.pageProp.pageSize] = this.page.pageSize;
			        return false;
			    }
			    if (!data) {
			        data = {};
			    }
			    this.opt.extendParams = this.opt.extendParams || {};
			    //判断参数或者url是否变化，如果改变了则把页数和页显示数重置
			    if (JSON.stringify(this.opt.extendParams) != JSON.stringify(this.oldParams) || this.opt.url != this.oldUrl) {
			        this.page_[this.pageProp.currentPage] = 1;
			        this.page.currentPage = 1;
			        this.page_[this.pageProp.pageSize] = this.page.pageSize;
			    }
			    data = this.$assign(data, this.page_, this.opt.extendParams)
			    var vm = this;
			    this.oldUrl = this.opt.url;
			    this.oldParams = this.$deepCopy(this.opt.extendParams);
				if(typeof this.opt.loading !== 'undefined') this.opt.loading=true;
			    this.$ajax({
			        url: this.opt.url,
			        emulateJSON: typeof this.opt.emulateJSON === "boolean" ? this.opt.emulateJSON : true,
			        method: this.opt.method ? this.opt.method : "post",
			        data: data,
			        success: function(re) {
			            if (re[vm.dataProp.data] && re[vm.dataProp.data].length == 0 && vm.page_[vm.pageProp.currentPage] != 1) {
			                vm.page_[vm.pageProp.currentPage] -= 1;
			                vm.page.currentPage -= 1;
			                vm.$nextTick(() => {
			                    vm.reload();
			                })
			            } else {
			                if (vm.dataProp.data == "") {
			                    Vue.set(vm, "mydata", re ? re : []);
			                } else {
			                    Vue.set(vm, "mydata", ___getDeep(re, vm.dataProp.data) ? ___getDeep(re, vm.dataProp.data) : []);
			                }
			                Vue.set(vm.page, "total", re[vm.dataProp.total] ? re[vm.dataProp.total] : 0);
			                vm.selected = [];
			            }
			            vm.$emit('reloadSuccess', re[vm.dataProp.data] && re[vm.dataProp.data].length);
						if(typeof vm.opt.loading !== 'undefined') vm.opt.loading=false;
			        },
					error:function(err){
						if(typeof vm.opt.loading !== 'undefined') vm.opt.loading=false;
					}
			    });
			},
			onSelectChange(selectedRowKeys, data) {
				this.selectedRowKeys = selectedRowKeys;
				this.selectedRowKeys.length == this.data.length ? this.checkAll=true : this.checkAll=false;
				this.$emit('selection-change', data);
			},
			onSelectAll(val, selection) {
				this.$emit('select-all', selection);
			},
			getSummaries(tableData){
				let that=this;
				// 显示合计的位置
				let showTextIndex=this.opt.showTextIndex || 0; 
				// 合计的标题
				let showSummaryText=this.opt.showSummaryText || '合计：';
				let columnKeys=this.columns.map(item=>item.key),sums=Array(columnKeys.length).fill('');
				let cloneTableData=this.$deepCopy(tableData);
				let indexArr=[];  // 获取columns有money字段的数据，如果有格式化数据
				this.columns.forEach((item,index)=>{
					if(item.money){
						indexArr.push(this.opt.multiple ? index+1 : index)
					}
				});
				
				// let indexArr=this.columns.map(item=>item.money)
				columnKeys.forEach((key,index)=>{
					let curIndex=this.opt.multiple ? index+1 : index;
					if(index == showTextIndex){
						sums[index]=showSummaryText;
						return;
					}
					let values=this.data.map(item=>Number(item[key]));
					// 如果有value,并且不为NaN,并且showSummaryIndex配置项有该索引 才显示
					if(values && !values.every(item=>isNaN(item))){
						if(this.opt.showSummaryIndex.includes(curIndex)){
							sums[curIndex]=values.reduce((total,cur)=>{
								return total+cur;
							},0);
						}else{
							sums[curIndex]='';
						}
						
						if(indexArr.includes((curIndex)) && this.opt.showSummaryIndex.includes(curIndex)){
							sums[curIndex]=Number(sums[curIndex]).toFixed(2).replace(/(\d)(?=(\d{3})+(\.|$))/g, '$1,')
						}
					}else{
						sums[curIndex] = '';
					}
				})
				// console.log(sums)
				return sums;
			},
			rowClass(record,index){
				if(this.opt.stripe){
					return index % 2 !== 0 ? 'row--striped' : '';
				}
			},
			checkedChange(){
				if(this.checkAll){
					this.selectedRowKeys=this.data.map(item=>item[this.opt.rowKey || 'id']);
				}else{
					this.selectedRowKeys=[];
				}
			},
			onClickRow(record) {
			    return {
			        on: {
			            click: () => {
							if(this.opt.checkOnSelect){
								let rowKeys=this.selectedRowKeys
						         if(rowKeys.length>0 && rowKeys.includes(record.id)){
						            rowKeys.splice(rowKeys.indexOf(record.id),1)
						         }else{
						           rowKeys.push(record.id)
						         }
						         this.selectedRowKeys = rowKeys;
								// 修改全选状态
								 this.selectedRowKeys.length == this.data.length ? this.checkAll=true : this.checkAll=false;
							}
			            },
						mouseenter: (event) => {
							this.$emit('mouseenter',record);
						},  
						mouseleave: (event) => {
							this.$emit('mouseleave',record);
						}
			        }
			    }
			},
			
			pageChange(page) {
				this.page_[this.pageProp.currentPage]=page.current;
				this.reload();
				this.$emit('pageChange',page);
			}
		}
	}
</script>

<style scoped lang="scss">
	
.table{
	display:flex;
	position:relative;
	flex-direction: column;
	::v-deep .ant-table-wrapper{
		flex:1;
	}
	.table-top{
		padding:10px 0;
		width:100%;
		display: block;
	}
	.top-tool{
		font-size:14px;
		color:#454545;
		span{
			color:#1890ff;
		}
	}
	.checkAll{
		position:absolute;
		left:0;
		bottom:23px;
		z-index:10;
	}
	&.hideSummary{
		::v-deep .ant-table-footer{
			border-bottom:none !important;
		}
	}
	::v-deep .ant-table-scroll{
		overflow: hidden !important; 
	}
	::v-deep .ant-table-empty .ant-table-body{
		display: none;
	}
	::v-deep .ant-table-empty .ant-table-placeholder{
		display:flex;
		border-top:none;
		justify-content: center;
		align-items:center;
	}
	::v-deep .row--striped{
		background:#ddd;
	}
	::v-deep .ant-table-footer{
		padding:0 !important;
		margin-top:-1px;
	}
	::v-deep .ant-table-body{
		overflow:auto !important;
	}
	::v-deep .ant-table-body{
		// border-bottom:1px solid #e8e8e8;
	}
	::v-deep  .ant-table-footer::before{
		top:0px;
		display: block;
	}
	// ::v-deep .ant-table-body tr:last-child td{
	// 	border-bottom:none !important;
	// }
	::v-deep .ant-table::before{
		content:'';
		display: block;
		width:1px;
		position:absolute;
		left:0;
		top:0;
		z-index:100;
		height:100%;
		background: #e8e8e8;
	}
	::v-deep .ant-table-body::before{
		content:'';
		display: block;
		width:1px;
		position:absolute;
		right:0;
		top:0;
		height:100%;
		background: #e8e8e8;
	}
	::v-deep .ant-table-fixed{
		position:relative;
	}
	::v-deep .ant-table-fixed::after{
		content:'';
		display: block;
		width:100%;
		position:absolute;
		left:0;
		bottom:0px;
		height:1px;
		z-index:100;
		background:#e8e8e8;
	}
	.footer{
		&.border td{
			border-right:1px solid #e8e8e8;
		}
		td{
			padding:16px;
			&:last-child{
				border:none;
			}
		}
	}
}

</style>
