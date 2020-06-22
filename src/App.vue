<template>
	<div id="app">
		<a-button type="primary">1</a-button>
		
		<div class="main-table" ref="main">
			<Table style="margin-bottom:300px;"  ref="table" @mouseleave="mouseleave" @mouseenter="mouseenter" @select-all="selectAll" :data="tableData" :opt="tableOpt" class="formBox" :columns="columns" :page="page"  @selection-change="selectionChange">
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
	const data = [];
	for (let i = 0; i < 8; i++) {
	  data.push({
	    key: i,
	    name: `Edrward ${i}`,
	    age: 32,
	    address: `London Park no. ${i}`,
	  });
	}
	export default {
		components: {
			Table
		},
		data() {
			return {
				value1:1,
				columns:[{ title: 'Full Name', width: 100, dataIndex: 'name', key: 'name', fixed: 'left' },
				  { title: 'Age', width: 100, dataIndex: 'age', key: 'age', fixed: 'left' },
				  { title: 'Column 1', dataIndex: 'address', key: '1', width: 150 },
				  { title: 'Column 2', dataIndex: 'address', key: '2', width: 150 },
				  { title: 'Column 3', dataIndex: 'address', key: '3', width: 150 },
				  { title: 'Column 4', dataIndex: 'address', key: '4', width: 150 },
				  { title: 'Column 5', dataIndex: 'address', key: '5', width: 150 },
				  { title: 'Column 6', dataIndex: 'address', key: '6', width: 150 },
				  { title: 'Column 7', dataIndex: 'address', key: '7', width: 150 },
				  { title: 'Column 8', dataIndex: 'address', key: '8', width: 150  },
				  {
					title: 'Action',
					key: 'operation',
					fixed: 'right',
					// scopedSlots: { customRender: 'action' }
					customRender: (value, row, index) =>{
						return <a-button type="primary" on-click={()=>this.click(row)}>1</a-button>
					}
				  }],
				columns2: [{
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
						dataIndex:'userName',
					}

				],
				tableData:data,
				tableData2: [{
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
					width:1300,
					rowKey:'key',
					spanMethod:true,
					border:true,
					stripe:true,
					tableTop:true,
					// showSummaryText:'你猜',
					showSelectText:true,
					showTextIndex:1,
					showSummaryIndex:[4],
					// loading:true,
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
			console.log(this.$refs.table)
		},
		methods: {
			mouseenter(row){
				// console.log(row)
			},
			click(row){
				console.log(row,'row')
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
