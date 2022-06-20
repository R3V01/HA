export default {
	dateTime(e){
		let old = new Date(e);
		let now = new Date();
		
		let d = old.getTime();
		let h = old.getHours();
		let m = old.getMinutes();
		let y = old.getFullYear();
		let M = old.getMonth()+1;
		let D = old.getDate();
		
		let nd = now.getTime();
		let nh = now.getHours();
		let nm = now.getMinutes();
		let ny = now.getFullYear();
		let nM = now.getMonth()+1;
		let nD = now.getDate();
		
		if(D===nD && y===ny && M===nM){
			if(h<10){
				h= '0'+h;
			}
			if(m<10){
				m= '0'+m;
			}
			return h+':'+m;
		}
		
		if(D+1===nD && y===ny && M===nM){
			if(h<10){
				h= '0'+h;
			}
			if(m<10){
				m= '0'+m;
			}
			return '昨天'+h+':'+m;
		}else{
			return y+'/'+M+'/'+D;
		}
	},
	
	dateTime1(e){
		let old = new Date(e);
		let now = new Date();
		
		let d = old.getTime();
		let h = old.getHours();
		let m = old.getMinutes();
		let Y = old.getFullYear();
		let M = old.getMonth()+1;
		let D = old.getDate();
		
		let nd = now.getTime();
		let nh = now.getHours();
		let nm = now.getMinutes();
		let nY = now.getFullYear();
		let nM = now.getMonth()+1;
		let nD = now.getDate();
		
		if(D===nD && Y===nY && M===nM){
			if(h<10){
				h= '0'+h;
			}
			if(m<10){
				m= '0'+m;
			}
			return h+':'+m;
		}
		
		if(D+1===nD && Y===nY && M===nM){
			if(h<10){
				h= '0'+h;
			}
			if(m<10){
				m= '0'+m;
			}
			return '昨天'+h+':'+m;
			
		}else if(Y === nY){
			if(h<10){
				h= '0'+h;
			}
			if(m<10){
				m= '0'+m;
			}
			return M+'月'+D+'日'+h+':'+m;
			
		}else{
			if(h<10){
				h= '0'+h;
			}
			if(m<10){
				m= '0'+m;
			}
			return Y+'年'+M+'月'+D+'日'+h+':'+m;
		}
	},
	spaceTime(old,now){
		old = new Date(old);
		now = new Date(now);
		var oldt= old.getTime();
		var nowt= now.getTime();
		if(nowt>(oldt+1000*60*5)){
			return now;
		}else{
			return '';
		}
	},
	
	
	paixu:function(arr,obj,tip){
		var s;
		if(tip == 0){
			for(let i=1; i<arr.length;i++){
				for(let j=i;j>0;j--){
					if(arr[j][obj]>arr[j-1][obj]){
						s = arr[j];
						arr[j] = arr[j-1];
						arr[j-1] = s;
					}
				}
			}
			return arr;
		}else if(tip ==1){
			for(let i=1; i<arr.length;i++){
				for(let j=i;j>0;j--){
					if(arr[j][obj]<arr[j-1][obj]){
						s = arr[j];
						arr[j] = arr[j-1];
						arr[j-1] = s;
					}
				}
			}
			return arr;
		}
		
	},
	
	
	fileName(e){
		let old = new Date(e);
		
		let Y = old.getFullYear();
		let M = old.getMonth()+1;
		let D = old.getDate();
		
		if(M<10){
			M = '0' + M;
		}
		if(D<10){
			D = '0'+D;
		}
		return Y+M+D;
	},
	
}