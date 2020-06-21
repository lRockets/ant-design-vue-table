export function mergeCell(data,attr){
	var arr=[],pos;
	for (var i = 0; i < data.length; i++) {
	    if(i === 0) {
	        arr.push(1);
	        pos = 0
	    }else {
	        // 判断当前元素与上一个元素是否相同
	        if(Array.isArray(attr)){
	            let num=0;
	            attr.forEach(item=>{
	                if (data[i][item] && data[i - 1][item] && data[i][item] === data[i - 1][item]){
	                    num++;
	                }
	            })
	            if(num == attr.length){
	                arr[pos] += 1;
	                arr.push(0);
	            }else{
	                arr.push(1);
	                pos = i;
	            }
	        }else if (data[i][attr] && data[i - 1][attr] && data[i][attr] === data[i - 1][attr]) {
	            arr[pos] += 1;
	            arr.push(0);
	        }else {
	            arr.push(1);
	            pos = i;
	        }
	    }
	}
	return arr;
}