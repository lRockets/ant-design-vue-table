<template>
	<div id="app">
		<a-button type="primary">1</a-button>
		<div class="main-table" ref="main">
			<Table style="margin-bottom:300px;" ref="table" @mouseleave="mouseleave" @mouseenter="mouseenter" @select-all="selectAll" :data="tableData" :opt="tableOpt" class="formBox" :columns="columns" :page="page"  @selection-change="selectionChange">
				<template slot="pannel-top">
					我是slot
				</template>
				<template slot="paginationLeft">
					<!-- foot_left -->
				</template>
				<!-- <template slot="footer">footer</template> -->
			</Table>
		</div>
	</div>
</template>

<script>
	import Table from '@/components/fant-table';
	import {mergeCell} from '@/utils/tools';
	export default {
		components: {
			Table
		},
		data() {
			return {
				value1:1,
				columns: [{
						key: 'edit',
						title: '操作',
						align: 'center',
						width:94
					},
					{
						key: 'name',
						title: '名称',
						dataIndex:'name',
						ellipsis: true,
						width:200,
						customRender: (value, row, index) =>{
							const obj = {
								children: value,
								attrs: {},
							};
							obj.attrs.rowSpan = mergeCell(this.tableData,'name')[index];
							return obj;
						}
					},
					{
						key: 'type',
						title: '类型',
						ellipsis: true,
						align: 'center',
						dataIndex:'type',
						width:100,
						customRender:(value,row,index)=>{
							const obj = {
								children: value,
								attrs: {},
							};
							obj.attrs.rowSpan = mergeCell(this.tableData,['type'])[index];
							return obj;
						}
					},
					// { prop:'equipment',label:'设备',minWidth:'70px'},
					{
						key: 'floor',
						title: '楼层',
						width:200,
						align: 'right',
						money:true,
						dataIndex:'floor'
					},
					// { prop:'code',label:'编号',minWidth:'50px',align:'right' },
					// { prop:'maxClazzAmount',label:'最大容纳班数',minWidth:'70px' },
					{
						key: 'maxStudentAmount',
						title: '最大容纳人数',
						align: 'right',
						width:200,
						dataIndex:'maxStudentAmount'
					},
					{
						key: 'roomStatus',
						title: '状态',
						align: 'center',
						width:100,
						dataIndex:'roomStatus'
					},
					{
						key: 'userName',
						title: '使用人员',
						dataIndex:'userName'
					}

				],
				tableData: [{
					name: "教学楼",
					id:1,
					floor:1,
					type: "教学楼",
					equipment: 3,
					layer: "9层3室",
					number: "NO:86512663",
					bed: ''
				},{
					name: "教学楼",
					id:2,
					type: "教学楼",
					floor:3000,
					equipment: 3,
					layer: "9层3室",
					number: "NO:86512663",
					bed: ''
				}],
				tableOpt: {
					// size: "middle",
					width:1200,
					spanMethod:true,
					border:true,
					stripe:true,
					tableTop:true,
					// showSummaryText:'你猜',
					showSelectText:true,
					showTextIndex:1,
					showSummaryIndex:[4],
					loading:true,
					customize:true,
					page: true,
					multiple: true,
					showSummary:true,
					paginationLeft:true,
					checkOnSelect: true,
					// showSummaryVal:[1,2,3,4,5,6,7],
					url: '/web/room/page',
					height: "100%",
					extendParams: {
						buildingId: ''
					}
				},
				tableOpt2:{
					spanMethod:true,
					border:true,
					showSelectText:true,
					// loading:true,
					page: true,
					multiple: true,
					showSummary:false,
					checkOnSelect: true,
					// url: '/web/room/page',
					height: "600px",
					extendParams: {
						buildingId: ''
					}
				},
				showView: true,
				value: [],
				page:{
					total:100,
					pageSize:20,
					pageNum:20
				},
				options: [{
						value: 'zhinan',
						label: '指南',
						children: [{
							value: 'shejiyuanze',
							label: '设计原则1',
							children: [{
								value: 'shejiyuanze',
								label: '设计原则11',
							}]
						}]
					},
					{
						value: 'zhinan',
						label: '指南',
						children: [{
							value: 'shejiyuanze',
							label: '设计原则2',
							children: [{
								value: 'shejiyuanze',
								label: '设计原则22',
							}]
						}]
					}
				],
			}
		},
		mounted(){
		},
		methods: {
			mouseenter(row){
				// console.log(row)
			},
			mouseleave(row){
				// console.log(row,'mouseleave')
			},
			selectionChange(selection) {
				this.selection=selection;
				console.log(selection)
			},
			selectAll(val){
				console.log(val,'val')
			}
		}
	}
</script>
<style lang="scss">
#app{
	display:flex;
	height:100vh;
	flex-direction: column;
	.main-table{
		flex:1;
		overflow: hidden;
	}
}
</style>
