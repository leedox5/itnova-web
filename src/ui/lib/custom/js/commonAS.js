/**
 * 
 */
var commonAS = {
	/**
	 * 소수점 2자리 함수
	 */
	substr2num : function(str) {
			var index = 0;
			
			if(str != '' && str != null){
				str = str.toString(); //indexOf, substr은 string함수 이기 때문에 string으로 변환필요 (숫자로 넘어오는 경우가 있음)
				index = str.indexOf(".");
				
				if (index > -1 ) {
					if ((str.length - index) == 2 ) {
						return str.substr(0, (index+3)) + '0';
					} else {
						return str.substr(0, (index+3));
					}
				} else {
					return str + '.00';
				}
			} else {
				return '';
			}
	},
	
	/**
	 * 소수점 1자리 함수
	 */
	substr1num : function(str) {
			var index = 0;
			
			if(str != '' && str != null){
				str = str.toString();
				index = str.indexOf(".");
				
				if (index > -1 ) {
					if ((str.length - index) == 1 ) {
						return str.substr(0, (index+2)) + '0';
					} else {
						return str.substr(0, (index+2));
					}
				} else {
					return str + '.0';
				}
			} else {
				return '';
			}
	},	
	
	/**
	 * object merge 함수
	 */	
	mergeObj: function(obj1, obj2) {
        if (!UT.isObject(obj1) || !UT.isObject(obj2)) {
            return {};
        }
        var temp = {};
        
        for (var key in obj1) {
            if (obj1.hasOwnProperty(key)) {
            	temp[key] = UT.copy(obj1[key]);
            }
        }
        
        for (var key in obj2) {
            if (obj2.hasOwnProperty(key)) {
            	temp[key] = UT.copy(obj2[key]);
            }
        }        
        return temp;
    },

	/**
	 * 두 값 중 max값 추출
	 */	
	maxValue : function(obj1, obj2) {
		var temp1    = new Number();
		var temp2    = new Number();
		var maxValue = new Number();
		
        if (UT.isEmpty(obj1) || UT.isEmpty(obj2)) {
            return "NaN";
        }
        
        if (UT.isNumber(obj1)) {
        	temp1 = obj1;
        } else {
        	temp1 = UT.toNumber(obj1);
        }
        
        if (UT.isNumber(obj2)) {
        	temp2 = obj2;
        } else {
        	temp2 = UT.toNumber(obj2);
        }
        
        if (temp1 >= temp2) {
        	maxValue = temp1;
        } else {
        	maxValue = temp2;
        }
        
        return maxValue;
    },
    
    /**
     * Array 에 특정  필드에 특정 값이 필터값을 포함하고 있으면 Array를 재생성함.
     * @method : gridFilterChange
     * @param : {Array} array
     * @param : {Object} filter : {key : filter처리할키  , value : 값}
     * @example
     *             commonAS.gridFilterChange(me.codes.prcStlTypCd,{key : "dtl_cd_attr_val",value : me.rfxData.rfx_typ});
     *
     */
    gridFilterChange : function(array,filter){
        //배열에서 자료추출
    	var fKey = filter.key;
    	var fValue = filter.value;
    	var obj = {};
    	var retArr = [];
    	for (var i =0; i < array.length; i++) {
    		obj = array[i];
    		
    		if (obj.editstatus == "updated") {
    			obj.chk = "N";
    		}
    		
    		if(UT.isEmpty(obj[fKey])) {
    			continue;
    		}
    		
    		if (obj[fKey].indexOf(fValue) > -1) {
    			retArr.push(obj);
    		}
    	}
    	return retArr;
    },
    
    /**
     * Array 에 특정  필드에 특정 값이 필터값을 포함하고 있으면 Array를 재생성함.
     * @method : gridFilterChange
     * @param : {Array} array
     * @param : {Object} filter : {key : filter처리할키  , value : 값}
     * @example
     *             commonAS.gridFilterChange(me.codes.prcStlTypCd,{key : "dtl_cd_attr_val",value : me.rfxData.rfx_typ});
     *
     */
    likeFilter : function(array,filter){
        //배열에서 자료추출
    	var fKey = filter.key;
    	var fValue = filter.value;
    	var obj = {};
    	var retArr = [];
    	for (var i =0; i < array.length; i++) {
    		obj = array[i];
    		
    		if (obj[fKey].indexOf(fValue) > -1) {
    			retArr.push(obj);
    		}
    	}
    	return retArr;
    },    

	/**
	 * 표준 데이터 콤보 필터링 처리
	 */	
	makeComoboList: function(comboList,gubn,grp1,grp2,grp3,grp4){
		var me = this,
		    copyData = UT.copy(comboList),
		    retDataList = [];
        for(var i=0, len=copyData.length; i<len; i++) {
            var item = comboList[i];

			if (UT.isEmpty(grp1) && UT.isEmpty(grp2) && UT.isEmpty(grp3) && UT.isEmpty(grp4)) {
                if (item.cmpk_gubn_code == gubn) {
                	retDataList.push(item);
                }
			} else if (UT.isEmpty(grp2) && UT.isEmpty(grp3) && UT.isEmpty(grp4)) {
                if (item.cmpk_gubn_code == gubn && (item.cmpk_code_grp1 === grp1 || item.cmpk_code_grp1 == 'ALL')) {
                	retDataList.push(item);
                }
			} else if (UT.isEmpty(grp3) && UT.isEmpty(grp4)) {
                if (   item.cmpk_gubn_code == gubn
		            && (item.cmpk_code_grp1 === grp1 || item.cmpk_code_grp1 == 'ALL')
		            && (item.cmpk_code_grp2 === grp2 || item.cmpk_code_grp2 == 'ALL')) {
                	retDataList.push(item);
                }
			} else if (UT.isEmpty(grp4)) {
                if (   item.cmpk_gubn_code == gubn 
			        && (item.cmpk_code_grp1 === grp1 || item.cmpk_code_grp1 == 'ALL')
			        && (item.cmpk_code_grp2 === grp2 || item.cmpk_code_grp2 == 'ALL')
			        && (item.cmpk_code_grp3 === grp3 || item.cmpk_code_grp3 == 'ALL')) {
                	retDataList.push(item);
	            }
			} else {
                if (   item.cmpk_gubn_code == gubn 
    			    && (item.cmpk_code_grp1 === grp1 || item.cmpk_code_grp1 == 'ALL')
    			    && (item.cmpk_code_grp2 === grp2 || item.cmpk_code_grp2 == 'ALL')
			        && (item.cmpk_code_grp3 === grp3 || item.cmpk_code_grp3 == 'ALL')
			        && (item.cmpk_code_grp4 === grp4 || item.cmpk_code_grp4 == 'ALL')) {
                	retDataList.push(item);
	            }
			} 
        }				    
        return retDataList;
	},
	
	/**
	 * 금형표준 데이터 콤보 필터링 처리
	 */	
	makeMoldComoboList: function(comboList,gubn,grp1,grp2,grp3){
		var me = this,
		    copyData = UT.copy(comboList),
		    retDataList = [];
        for(var i=0, len=copyData.length; i<len; i++) {
            var item = comboList[i];

			if (UT.isEmpty(grp1) && UT.isEmpty(grp2) && UT.isEmpty(grp3)) {
                if (item.mtcd_gubn_code == gubn) {
                	retDataList.push(item);
                }
			} else if (UT.isEmpty(grp2) && UT.isEmpty(grp3)) {
                if (item.mtcd_gubn_code == gubn && (item.mtcd_appl_grop1 === grp1 || item.mtcd_appl_grop1 == 'ALL')) {
                	retDataList.push(item);
                }
			} else if (UT.isEmpty(grp3)) {
                if (   item.mtcd_gubn_code == gubn
		            && (item.mtcd_appl_grop1 === grp1 || item.mtcd_appl_grop1 == 'ALL')
		            && (item.mtcd_appl_grop2 === grp2 || item.mtcd_appl_grop2 == 'ALL')) {
                	retDataList.push(item);
                }
			} else {
                if (   item.mtcd_gubn_code == gubn 
    			    && (item.mtcd_appl_grop1 === grp1 || item.mtcd_appl_grop1 == 'ALL')
    			    && (item.mtcd_appl_grop2 === grp2 || item.mtcd_appl_grop2 == 'ALL')
			        && (item.mtcd_appl_grop3 === grp3 || item.mtcd_appl_grop3 == 'ALL')) {
                	retDataList.push(item);
	            }
			} 
        }				    
        return retDataList;
	},
	
	
	/**
	 * 콤보 필터링 처리
	 */	
	filterList: function(comboList,gubn,value){
		var me = this,
		    copyData = UT.copy(comboList),
		    retDataList = [];
        for(var i=0, len=copyData.length; i<len; i++) {
            var item = comboList[i];
            
            if (eval("item." + gubn) == value) {
            	retDataList.push(item);
            } 
        }				    
        return retDataList;
	},
	
    confirm: function(title, message, yesCallback, noCallback, i18nDisabled) {
        i18nDisabled = typeof i18nDisabled !== 'undefined' ? i18nDisabled : false;
        SCAlert.confirm( i18nDisabled ? I18N.translate(title) : title, message, function(btn) {
            if (btn === "yes") {
                if (UT.isFunction(yesCallback)) {
                    yesCallback.call(this);
                }
            } else { // no
                if (UT.isFunction(noCallback)) {
                    noCallback.call(this);
                }
            }
        }, null, i18nDisabled);
    },	
	
	/**
	 * 콤포넌트 ㅈ비활성화
	 */	
	compAllUnvisble: function(comp){
		var me = this;
        for(var i=0, len=comp.length; i<len; i++) {
            var item = comp[i];
            
            if (   item.data.toString().substring(0,2) == "tr"
            	|| item.data.toString().substring(0,2) == "td"
            	|| item.data.toString().substring(0,3) == "div"
            	|| item.data.toString().substring(0,5) == "table") {
            	var elements = Polymer.dom(eval(comp[i].data)).querySelectorAll("tr, th, td, sc-label, sc-text-field, sc-combobox-field, img, id");
            	
                for (var idx in elements) {
                    if (elements.hasOwnProperty(idx)) {
                    	elements[idx].setAttribute("hidden", "hidden");
                    }
                }
            } else {
            	eval(item.data + ".setAttribute('hidden', 'hidden');");
            }
        }				    
	},
	
	/**
	 * 콤포넌트 활성화
	 */	
	compAllvisble: function(comp){
		var me = this;
        for(var i=0, len=comp.length; i<len; i++) {
            var item = comp[i];
            
            if (   item.data.toString().substring(0,2) == "tr"
            	|| item.data.toString().substring(0,2) == "td"
            	|| item.data.toString().substring(0,3) == "div"
            	|| item.data.toString().substring(0,5) == "table") {
            	var elements = Polymer.dom(eval(comp[i].data)).querySelectorAll("tr, th, td, sc-label, sc-text-field, sc-combobox-field, img, id");
            	
                for (var idx in elements) {
                    if (elements.hasOwnProperty(idx)) {
                    	elements[idx].removeAttribute("hidden");
                    }
                }
            } else {
            	eval(item.data + ".removeAttribute('hidden');");
            }            
        }				    
	},
	
	/**
	 * TextField 필수입력 체크
	 * 알림창 문장 정상적으로 출력하기 위해서 sc-text-field내 name속성에 보여줄 라벨값 지정 ex) name="제품명"
	 */	
	validCheck: function(comp){
		var me = me;
        for(var i=0, len=comp.length; i<len; i++) {
            var item = comp[i];
            var formatType = "";
            var hidden = eval(item.data + ".getAttribute('hidden')");
            var val = eval(item.data + ".value");
            var name = eval(item.data + ".name");

            // format-type 속성이 있는 경우에 set
            if (eval(item.data + ".hasAttribute('format-type')") == true) {
            	formatType = eval(item.data + ".getAttribute('format-type')");
            }
            
            if (hidden != "") {
            	// 숫자
            	if (formatType == "number") {
            		if (UT.isEmpty(val)) {
            			UT.alert(name + "은(는) 필수입력 항목입니다.", function() {
            				eval(item.data + ".focus();");
            			});
            			return false;
            			
            		} else {
            			if (parseFloat(val) <= 0) {
            				UT.alert(name + "은(는) 0보다 큰 수치만 가능합니다.", function() {
            					eval(item.data + ".focus();");
            				});
            				return false;
            			}
            		}
            		
        		// 개수 (0허용)
            	} else if (formatType == "zeroNumber") {
            			if (UT.isEmpty(val)) {
            				UT.alert(name + "은(는) 필수입력 항목입니다.", function() {
            					eval(item.data + ".focus();");
            				});
            				return false;
            			}
            		
            		// 나머지 경우 빈값 여부만 체크 필요시 로직 추가 구성
            	} else {
            		if (UT.isEmpty(val)) {
            			UT.alert(name + "은(는) 필수입력 항목입니다.", function() {
            				eval(item.data + ".focus();");
            			});
            			return false;
            		}
            	}
            }
        }
        return true;
	},
	
	/**
	 * TextField 숫자 유효성 체크(입력범위)
	 * 알림창 문장 정상적으로 출력하기 위해서 sc-text-field내 name속성에 보여줄 라벨값 지정 ex) name="제품명"
	 * 유효한 최소,최대값 인자로 보내줘야함.
	 */	
	rangeCheck: function(comp, min, max){
		var me = this;
		for(var i=0, len=comp.length; i<len; i++) {
			var item = comp[i];
			var formatType = eval(item.data + ".getAttribute('format-type')");
			var val = eval(item.data + ".value");
			var name = eval(item.data + ".name");
			
			if (UT.isNotEmpty(val)) {
				if (parseFloat(val) < parseFloat(min) || parseFloat(val) > parseFloat(max)) {
					UT.alert(name + "의 입력가능 범위는" + min + " ~ " + max + " 입니다.");
					return false;
				}
			}
		}
		return true;
	},
	
	/**
	 * 공법 메세지
	 */	
	comeAlert: function(result){
		if (UT.isNotEmpty(result)) {
			UT.alert( "PRGM : "+ result['PRGM_ID'] + "<br>"
					+"CODE : "+ result['MESG_CODE']+"<br>"
					+"LINE : "+ result['LINE_NO']+"<br>"
					+"MESG : "+ result['MESG'].replace("\r", "<br>") +" " , null, null, {autoGrowMessageBox:true});
		}
	},
	
	/**
	 * PART NO를 포함한 메세지
	 */	
	partAlert: function(result){
		
		if (UT.isNotEmpty(result)) {
			UT.alert( "PART : "+ result['CURR_PART'] + "<br>"
					+"CODE : "+ result['MESG_CODE']+"<br>"
					+"LINE : "+ result['LINE_NO']+"<br>"
					+"MESG : "+ result['MESG'].replace("\r", "<br>") +" " );			
		}
	},	
	
	/**
	 * 기본 콤보 선택
	 */	
	defaultYn: function(){
		var me = this;
        var array = [];
        array.push({data : "N", label : "미적용"});
        array.push({data : "Y", label : "적용"});
        return array;			    
	},
	
	/**
	 * 기본 콤보 선택
	 */	
	onlyYn: function(){
		var me = this;
		var array = [];
		array.push({data : "N", label : "N"});
		array.push({data : "Y", label : "Y"});
		return array;			    
	},
	
	/**
	 * 기본 콤보 선택
	 */	
	autoManu: function(){
		var me = this;
        var array = [];
        array.push({data : "A", label : "자동"});
        array.push({data : "M", label : "수동"});
        return array;			    
	},
	
	/**
	 * 표준/실사 콤보 선택
	 */	
	stndGubn: function(){
		var me = this;
		var array = [];
		array.push({data : "S", label : "표준"});
		array.push({data : "R", label : "실사"});
		return array;
	},
	
	stndGubn2: function(){
		var me = this;
		var array = [];
		array.push({data : "S", label : "표준"});
		array.push({data : "R", label : "실사"});
		array.push({data : "A", label : "자동계산"});
		return array;
	},
	
	/**
	 * 유무 콤보 선택
	 */	
	useYn: function(){
		var me = this;
		var array = [];
		array.push({data : "N", label : "무"});
		array.push({data : "Y", label : "유"});
		return array;
	},
	
	/**
	 * 제외/적용 콤보 선택
	 */	
	useYn2: function(){
		var me = this;
		var array = [];
		array.push({data : "N", label : "제외"});
		array.push({data : "Y", label : "적용"});
		return array;
	},	

	/**
	 * 기본 콤보 선택
	 */	
	stndYn: function(){
		var me = this;
        var array = [];
        array.push({data : "S", label : "표준"});
        array.push({data : "R", label : "직접입력"});
        return array;			    
	},
	
	/**
	 * 기본 콤보 선택2
	 */	
	stndYn2: function(){
		var me = this;
        var array = [];
        array.push({data : "N", label : "미적용"});
        array.push({data : "I", label : "직접입력"});
        array.push({data : "S", label : "산출식적용"});
        return array;			    
	},
	
	/**
	 * 원가계산관련 Tab 닫기 (chain, 공법선택, 공법전체)
	 */	
	closeAllTab: function(menuList){
		var me = this;
		
		for(var i=0, len=menuList.length; i<len; i++) {
			var menuId = menuList[i].comd_menu_id;
			SCMdiManager.removeWindow(menuId);
		}
		
	},
	
	/**
	 * Array 구성하기
	 */	
	makeArray : function(newItem,updateItem,deleteItem){
		var me = this,
		retDataList = [];
		
		if (!UT.isEmpty(newItem) && newItem.length > 0) {
	        for(var i=0, len=newItem.length; i<len; i++) {
	        	retDataList.push(newItem[i]);
	        }
		}
		
		if (!UT.isEmpty(updateItem) && updateItem.length > 0) {
	        for(var j=0, len=updateItem.length; j<len; j++) {
	        	retDataList.push(updateItem[j]);
	        }
		}
		
		if (!UT.isEmpty(deleteItem) && deleteItem.length > 0) {
	        for(var k=0, len=deleteItem.length; k<len; k++) {
	        	retDataList.push(deleteItem[k]);
	        }
		}		

        return retDataList;
	},	
	
	/**
	 * 소수점 3자리 함수
	 */
	substr3num : function(str) {
		var index = 0;
		index = str.indexOf('.');
		if(str != '' && str != null){
			if (index > -1 ) {
				if ((str.length - index) == 2 ) {
					return str.substr(0, (index+4)) + '00';
				} else if ((str.length - index) == 3 ) {
					return str.substr(0, (index+4)) + '0';
				} else {
					return str.substr(0, (index+4));
				}
			} else {
				return str + '.000';
			}
		} else {
			return '';
		}
	},
	
	/**
	 * 소수점 4자리 함수
	 */
	substr4num : function(str) {
		var index = 0;
		index = str.indexOf('.');
		if(str != '' && str != null){
			if (index > -1 ) {
				if ((str.length - index) == 2 ) {
					return str.substr(0, (index+5)) + '000';
				} else if ((str.length - index) == 3 ) {
					return str.substr(0, (index+5)) + '00';
				} else if ((str.length - index) == 4 ) {
					return str.substr(0, (index+5)) + '0';
				} else {
					return str.substr(0, (index+5));
				}
			} else {
				return str + '.0000';
			}
		} else {
			return '';
		}
	},		
	
	/**
	 * 소수점 설정
	 */
	setPrecision : function(str, precision) {
		if (str == undefined || str == null)
			return "";
		var ret    = "";
		var fir    = "";
		var pre    = "";
		var gapLen = 0;
		var idx    = -1;
		idx = str.indexOf(".");
		
		// 소수점 이하가 없는경우
		if (idx == -1)
		{
			// 미설정이므로 원스트링 그대로 반환
			if (str.length < 1 || precision == -1)
				return str;
			ret = str + "." + this.setStrLen("",precision,"0",false);
			return ret;
		}
		// 소수점 이하가 있는경우
		else {
			fir = str.substr(0,idx);
			pre = str.substr(idx+1,str.length);
			// 소수점 이하 자리수가 요구하는 자리수보다 길경우 자른다.
			if (pre.length > precision)
				pre = pre.substr(0,precision);
			// 소수점 이하 자리수가 요구하는 자리수보다 모자를 경우 자리수 채운다.
			else
				pre = this.setStrLen(pre,precision,"0",false);
			if (pre.length > 0)
				ret = fir + "." + pre;
			else
				ret = fir;
		}
		return ret;
	},

	/**
	 * 스트링 길이 채우기
	 * @param 	str 		스트링
	 * @param 	len 		문자 길이
	 * @param 	blkStr		길이 맞추기위한 포함 Char
	 * @param	appdPre		포함 Char를 앞으로 붙이기 여부(false 뒤에 붙이기)
	 * <p>
	 * Example<br>
	 * 		setStrLen("1",7)   					-->  "0001"
	 * 		setStrLen("test",6,"#",false)		-->  "test##"
	 */
	setStrLen : function(str, len, blkStr, appdPre) {
		if (len <= str.length)
			return str;
		var ret = str;
		var gapNum = len - str.length;
		for (var i = 0; i < gapNum; i++)
		{
			if (appdPre)
				ret = blkStr + ret;
			else
				ret += blkStr;
		}
		return ret;
	},
	
	/**
	 * 소수점 자리수 체크
	 */
	substrnum : function(str, header, n, f) {
		// str : 값, header : 컬럼명, n:정수 자리수, f:소수자리수
		var index = 0;
		if(str != '' && str != null){
			index = str.indexOf('.');
			if (index > -1 ) {
				if (str.substr(0,str.indexOf('.')).length > (n-f) ) {  //정수 자리수 체크
					return header+" 정수 자리수를 넘었습니다. \r정수는 "+ n + "자리까지 가능합니다.";
				} else if ((str.substr(str.indexOf('.')+1,str.length).length) >f ) {  //소수 자리수 체크
					return header+" 소수 자리수를 넘었습니다. \r소수는 " + f + "자리까지 가능합니다.";
				} else {
					return "ok";
				}
			} else {
				if(str.length > (n-f)) return header+" 정수 자리수를 넘었습니다.";
			}
		}
		return "ok";
	},
	
	/**
	 * A가 null이 아니면 A null이면 B를 리턴한다.
	 * value가 ""가 아니면 A값이 value일때 A, 아닐때 B를 리턴하도록 추가함
	 * 컨버전 후에도 필요하여 보존 2020.01.09
	 */
	nullAtoB : function(A, B, value) {
		var rValue = "";
		
		if (commonAS.isNull(A)) {
			rValue = B;
		} else {
			if (commonAS.isNull(value) == false) {
				if (A == value) {
					rValue = A;
				} else {
					rValue = B;
				}
			} else {
				rValue = A;
			}
		}
		
		return rValue;
	},
	
	/**
	 * NULL 문자 변환 : 기존 것을 변경하여 복원
	 */
	nullToSpace : function(sValue) {
		if (UT.isEmpty(sValue)) {
			return "";
		} else {
			return sValue;
		}
	},	
	
	/**
	 * 유효성 검사 날짜 값이 유효한지 검사
	 * 1. 자리수 체크 
	 * 2. 날짜 유효성 체크  
	 */
	validationDate : function(sDay){
		var arrEndDays  = new Array();
		var iYear    	= 0;
		var iMonth   	= 0;
		var iDay    	= 0;
	
		arrEndDays[0]  = 0;  // <- 아무런 의미가 없는 것임. 무시해도 좋음.
		arrEndDays[1]  = 31;
		arrEndDays[2]  = 28;
		arrEndDays[3]  = 31;
		arrEndDays[4]  = 30;
		arrEndDays[5]  = 31;
		arrEndDays[6]  = 30;
		arrEndDays[7]  = 31;
		arrEndDays[8]  = 31;
		arrEndDays[9]  = 30;
		arrEndDays[10] = 31;
		arrEndDays[11] = 30;
		arrEndDays[12] = 31;
	
		// 날짜 자리수 체크 
		if (sDay == null || sDay.length != 8) {
			return false;
		}
	
		iYear 	= parseInt(sDay.substring(0, 4));
		iMonth 	= parseInt(sDay.substring(4, 6));
		iDay 	= parseInt(sDay.substring(6, 8));
	
		// 윤달이 아니면...
		if ((((iYear % 4 == 0) && (iYear % 100 != 0)) || (iYear % 400 == 0))) {
			arrEndDays[2] = 29;
		}
	
		if ((iYear < 1800) || (iYear > 2100) ) {
			return false;
		} else if (iMonth > 12) {
			return false;
		} else if ((iDay < 1) || (iDay > arrEndDays[iMonth])) {
			return false;
		}
		return true;				
	},
	
	/**
	 * 율정보 유효성 검사 
	 * 1. 100보다 작아야 한다. 
	 * 2. 0보다 커야된다
	 * 3. 5자리 넘으면 안된다. 
	 */ 
	validationRate : function(sRate) {
		 
		// 일단 수치로 바꿈 					
		var nRate = parseFloat(sRate);
		
		// 5자리 넘으면 에러 
		if( sRate == null || sRate.length > 5){
			return false;					
		}   

		// 0보다 작거나  100 보다 크면 에러  
		if(0 > nRate || nRate > 100) {
			return false;
		}
		return true;
	},

	/**
	 * 음수입력 유효성 검사
	 */ 
	validationMinus : function(str) {
		var startIdx    = -2;
		var lastIdx     = -2;
		startIdx = str.indexOf('-');
		lastIdx  = str.lastIndexOf('-');
		
		if(str == null || str == ''){
			return '';
		}else{
			if(startIdx == -1){
				return str;
			}else if(startIdx == lastIdx){
				if(startIdx == 0){
					return str;
				}else{
					UT.alert("음수기호를 숫자 앞에 입력하세요.");
					return '';
				}
						
			}else{
				UT.alert("음수기호가 두개 이상 입력되었습니다.");
				return '';
			}
		}
		
	},
	
	/**
	 * 처리구분 콤보박스 데이터
	 */
	getCboData_proc_gubn : function(firstItm, lblField, dataField) {
		var ret = [];
		var itm;
		
		if (firstItm != null)
			ret.push( firstItm );
		
		itm = {};
		itm[lblField] = "합계";
		itm[dataField] = "SUM";
		ret.push( itm );
		
		itm = {};
		itm[lblField] = "평균";
		itm[dataField] = "AVG";
		ret.push( itm );
		
		return ret;
	},
		
	/**
	 *  공백 제거
	 */
	allTrim : function(str) {
		return str.replace(/([ ]{1})/g,"");
	},
	
	/**
	 *  공백 제거
	 */
	allTrim2 : function(str) {
		if (isNull(str)) {
			return "";
		}
		
		return ltrim(rtrim(str));
	},
	
	ltrim : function(str) {
		return str.replace(/(^[ ]*)/g, "");
	},
	
	rtrim : function(str) {
		return str.replace(/([ ]*$)/g, "");
	},
	
	trim : function(str) {
		return str.replace(/([ ]{1})/g,"");
	},
	
	/**
	 * 문자열 LPad 처리후 Return
	 */
	LPad : function(strSrc, iPadLength, strPadChar) {
		var strResult = strSrc.toString();
		
		for (var i = strResult.length; i < iPadLength; i++) {
			strResult = strPadChar + strResult;
		} 
		
		return strResult;
	},

	/**
	 * 문자열 RPad 처리후 Return
	 */
	RPad : function(strSrc, iPadLength, strPadChar) {
		var strResult = strSrc.toString();
		
		for (var i = strResult.length; i < iPadLength; i++) {
			strResult = strResult +  strPadChar;
		}
		
		return strResult;
	},
	
	/**
	 * 날짜유효성 검사
	 */
	isValidDate : function(value) {
		if (value == null || value.length != 8) return false;
		value = value.substring(0,4)+"/"+value.substring(4,6)+"/"+value.substring(6);
		var dateArray = value.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
		if(dateArray == null) return false;
		
		var date = new Date(dateArray[1],dateArray[3]-1,dateArray[4]);
		return (date.getFullYear()==dateArray[1]&&(date.getMonth()+1)==dateArray[3]&&date.getDate()==dateArray[4]);
	},			
	
	/**
	 * 계산된 년의 날짜 가져오기
	 */
	getGapYear : function(yyyymmdd, gap) {
		var formatter = new DateFormatter();
		formatter.formatString = "YYYYMMDD";
		
		var yyyy = parseInt(yyyymmdd.substring(0,4));
		var mm   = parseInt(yyyymmdd.substring(4,6));
		var dd   = parseInt(yyyymmdd.substring(6,8));
		
		return formatter.format(new Date(yyyy - 1, mm -1, dd));
	},
	
	/**
	 * 계산된 월의 날짜 가져오기
	 */
	getGapMonth : function(yyyymmdd, gap) {
		var formatter = new DateFormatter();
		formatter.formatString = "YYYYMMDD";
		
		var yyyy = parseInt(yyyymmdd.substring(0,4));
		var mm   = parseInt(yyyymmdd.substring(4,6));
		var dd   = parseInt(yyyymmdd.substring(6,8));
		
		return formatter.format(new Date(yyyy, mm + (gap) -1, dd));
	},
	
	
	/**
	 * 계산된 날의 날짜 가져오기
	 */
	getGapDay : function(yyyymmdd, gap) {
		var formatter = new DateFormatter();
		formatter.formatString = "YYYYMMDD";
		
		var yyyy = parseInt(yyyymmdd.substring(0,4));
		var mm   = parseInt(yyyymmdd.substring(4,6));
		var dd   = parseInt(yyyymmdd.substring(6,8));
		
		return formatter.format(new Date(yyyy, mm -1, dd + (gap)));
	},
	
	/**
	 * 입력된 말일 가져오기
	 */
	getEndDay : function(yyyymmdd) {
		var formatter = new DateFormatter();
		formatter.formatString = "YYYYMMDD";
		
		var yyyy = parseInt(yyyymm.substring(0,4));
		var mm   = parseInt(yyyymm.substring(4,6));
		
		return formatter.format(new Date(yyyy, mm, 0));
	},
	
	/**
	 * 계산된 월의 월만 가져오기
	 */
	getGapMonthOnly : function(yyyymmdd, gap) {
		var formatter = new DateFormatter();
		formatter.formatString = "YYYYMMDD";
		
		var yyyy = parseInt(yyyymmdd.substring(0,4));
		var mm   = parseInt(yyyymmdd.substring(4,6));
		var dd   = 1;
		
		return formatter.format(new Date(yyyy, mm + (gap) -1, dd)).substring(0,6);
	},
	
	
	/**
	 * 공통콤보 정보 설정 
	 */
	setCommCodeInfo : function(grp_cd, result_id_c, result_id_g) {
		var item = {};
		
		item.grp_cd       = grp_cd;
		item.result_id_c  = result_id_c;
		item.result_id_g  = result_id_g;
		
		return item;
	},
	
	/**
	 * 개별콤보 정보 설정 : GSROH_20150420
	 */
	setAddCodeInfo : function(sql_path, sql_id, result_id_c, result_id_g) {
		var item = {};
		
		item.sql_path     = sql_path;
		item.sql_id       = sql_id;
		item.result_id_c  = result_id_c;
		item.result_id_g  = result_id_g;
		
		return item;
	},

	/**
	 * 개별콤보 정보 설정 (param 있는 경우) : GSROH_20150420
	 */
	setAddCodeInfoParam : function(sql_path, sql_id, param, result_id_c, result_id_g) {
		var item = {};
		
		item.sql_path     = sql_path;
		item.sql_id       = sql_id;
		item.result_id_c  = result_id_c;
		item.result_id_g  = result_id_g;
		
		for (var key in param) {
			item[key] = param[key];
		}
		
		return item;
	},
	
	/**
	 * 소수점 버림처리
	 */
	trunc : function(value, pos) {
		var posVal = Math.pow(10, pos);
		
		value = value * posVal;
		value = Math.floor(value);
		value = value / posVal;
		
		return value;
	},
	
	/**
	 * 날자 포맷처리
	 */
	getFormatDate : function(date, formatter) {
		var rtnValue = date;
		
		if (isNull(rtnValue) == true) {
			return "";
		}
		
		if (rtnValue.length != 8) {
			return rtnValue;
		}
		
		// ====================================================
		// 날짜값이 정확하지 않으면 그냥 리턴
		// ====================================================
		if (date.length == 8) {
			rtnValue = date.substr(0, 4) + formatter + date.substr(4, 2) + formatter + date.substr(6, 2);
		} 
		
		return rtnValue;
	},
	
	/**
	 * 숫자 타입 체크 
	 * ex)  chkNumValue(item[data.dataField],7,2)
	 */		
    chkNumValue : function(txt, len, precision){
    	var firstLen = len - precision;
		if (txt == undefined || txt.length == 0)
			return true;
		// 앞자리수 확인
		if (txt.indexOf(".") != -1 && firstLen < txt.substr(0,txt.indexOf(".")).length)
			return false;
		if (txt.indexOf(".") == -1 && firstLen < txt.length)
			return false;
		// 소수점 뒷자리수 확인
		if (txt.indexOf(".") != -1 && txt.substr(txt.indexOf(".")+1,txt.length).length > precision)
			return false;
		return true;
    },

	/**
	 * Null 값 Check
	 */
	isNull : function(value) {
		if (value == null) {
			return true;
		}
		
		if (value == "undefined" || value == "" || this.allTrim(value) == "") {
			return true;
		}
		
		return false;
	},

    /**
	 * 날짜 변환  
	 * input date : 19901201 , 구분자값 : /
	 * output 1990/12/01
	 */		
    formatDate : function(date, exrp) {
    	
    	var year = date.substr(0, 4); 
    	var month = date.substr(4, 2); 
    	var day = date.substr(6, 2); 
    	
    	var resultDate = year+exrp+month+exrp+day;
    	
    	return resultDate;
    
    },
}

var commonJS = {
	callService: function(provider) {
	    return new Promise((resolve, reject) => {
	   	    UT.request(provider, (e, res) => {
	       	    resolve(res.response);
	        });
	    });
	}
}

var gridUtil = {
	getCols: function(opts, grid) {
		var columns = grid.getColumns();
		var cols = [];
		
		for(var i = 0 ; i < columns.length ; i++) {
			var col = {};
			for(var j = 0 ; j < opts.length ; j++) {
				col[opts[j].col] = columns[i][opts[j].property];
			}
			cols.push(col);
		}
		return cols;
	},
	
	resetCols: function(cols, grid){
	    var gridView = grid._gridView;
	    
	    var columns = gridView.columns();
	    
	    for(var i = 0 ; i < cols.length ; i++) {
	    	columns[i].setWidth(cols[i].width);
	    }
	    
	    layoutChange(grid.statefulLayout);
	    
	    function layoutChange(layout) {
	    	for(var i = 0 ; i < layout.length - 1 ; i++) {
	    		layout[i].width = cols[i].width;
	    	}
	    	return true;
	    }
	}
}

class ResponseHandler {
    constructor(data, alert, grid) {
    	console.log(data);
        this.data = data;
        this.alert = alert;
        this.grid = grid;
        
        this.reload = false;
        this.result = this.data.result;
        
        if(this.result.code == "Y") {
        	this.reload = true;
        }
        if(this.result.MESG_CODE == "SA-001") {
        	this.reload = true;
        }
    }
    
    setGrid = () => {
    	console.log(this.data);
    	const cols = this.data.result.cols;
    	
        var columns = [];

        for(var i = 0; i < cols.length ; i++) {
	        var col = document.createElement('sc-data-column');
            col.dataField  = cols[i].data_field;
            col.headerText = cols[i].header_text;
            col.width      = cols[i].width;
            col.textAlign  = cols[i].text_align;
            col.editable   = cols[i].editable == "true" ? true : false;
            col.mergeable  = cols[i].mergeable == "true" ? true : false;
            col.dataType   = cols[i].data_type;
            col.formatType = cols[i].format_type;
            col.textWrap  = "normal";
            col.useMultiLine = true;
            if(cols[i].header_type == "GS") {
            	var group = document.createElement('sc-group-column');
            	group.headerText = cols[i].grp_text;
            	group.width = cols[i].grp_width;
            	group.appendChild(col);
            } else if(cols[i].header_type == "GC") {
                group.appendChild(col);
            } else if(cols[i].header_type == "GE") {
                group.appendChild(col);
                columns.push(group);
            } else {
            	columns.push(col);
            }
        }
        
        this.grid.setColumns(columns);    	
    }
    
    
    showMsgOnGrid = () => {
        var provider = this.grid.getDataProvider();
    	
    	provider.addItemAt(0, {
    		id: "0",
    		table_id: this.result.code,
    		conts: this.result.message,
    		crt_date: this.result.crt_date
    	}); 
    }
    
    showAlert = () => {
    	this.alert(this.result.message);
    }
    
    showMESG = () => {
    	this.alert(this.result.MESG);
    }
}
