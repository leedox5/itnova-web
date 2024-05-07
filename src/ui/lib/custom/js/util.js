/**
 * Util
 *
 * @class UT
 */
var UT = {
	serviceRequest : function(descriptor, service, data, setting){
		var csrf = this.csrf();
		if(csrf) {
			if(!setting.headers){
				setting.headers = {}
			}
			setting.headers[csrf.csrfHeader] = csrf.csrf;
		}
		return $.ajax({
			type: setting.type || "POST",
			url: service+".do",
			data: JSON.stringify({
				"descriptor": descriptor,
				"service": service,
				"data": $.isEmptyObject(data) ? {} : data
			}),
			dataType: setting.dataType || "json",
			contentType: setting.contentType || "application/json",
			headers: setting.headers || {}
		});
	
	},
		
	
    /**
     * 날짜 객체의 복사
     * @method dateCopy
     * @param {Date} dateInfo - 복사하려는 날짜 객체
     * @returns {Date} 복사된 날짜 객체
     */
    dateCopy : function(dateInfo) {
    	var newDate = new Date();
    	newDate.setTime(dateInfo.getTime());
    	return newDate;
    },

    /**
     * 상위 노드에서 화면 삭제
     *
     * @method removeModule
     * @param {object} parentNode 삭제할 객체의 상위 객체
     * @param {object} event      이벤트 객체
     * @example
     *     someFunction: function(e) {
     *         var me = this;
     *         UT.removeModule(me.$.pages, e);
     *     }
     */
    removeModule: function(parentNode, event) {   	
        Polymer.dom(parentNode).removeChild(event.currentTarget);
        
    	// 메모리 해제
    	event.currentTarget.destroy();        
    },

    /**
     * alert dialog
     *
     * @method alert
     * @param {string}   message      출력할 메시지
     * @param {function} [okCallback] ok 버튼 클릭 후 콜백 함수
     * @param {Boolean} 다국어 처리 비활성화 여부 (기본 false:활성화)
     * @async
     * @example
     *     someFunction: function() {
     *         var me = this;
     *         UT.alert("Hello World!");
     *     }
     */
    alert: function(message, okCallback, i18nDisabled, options) {
        i18nDisabled = typeof i18nDisabled !== 'undefined' ? i18nDisabled : false;
        options = options || {};
        options.autoGrowMessageBox = options.autoGrowMessageBox || false;
        SCAlert._messagebox.autoGrowMessageBox = options.autoGrowMessageBox;
        
        return SCAlert.show( i18nDisabled ? I18N.translate("알림") : "알림", message, function(btn) {
            if (UT.isFunction(okCallback)) {
                okCallback.call(this);
            }
        }, null, i18nDisabled);
    },

    /**
     * confirm dialog
     *
     * @method confirm
     * @param {string}   message       출력할 메시지
     * @param {function} [yesCallback] ok 버튼 클릭 후 콜백 함수
     * @param {function} [noCallback]  no 버튼 클릭 후 콜백 함수
     * @param {Boolean} 다국어 처리 비활성화 여부 (기본 false:활성화)
     * @async
     * @example
     *     someFunction: function() {
     *         var me = this;
     *         UT.confirm("Hello World!", function() {
     *             // yes
     *             ...
     *         }, function() {
     *             // no
     *             ...
     *         });
     *     }
     */
    confirm: function(message, yesCallback, noCallback, i18nDisabled) {
        i18nDisabled = typeof i18nDisabled !== 'undefined' ? i18nDisabled : false;
        SCAlert.confirm( i18nDisabled ? I18N.translate("확인") : "확인", message, function(btn) {
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
     * ajax 요청 (SCLoadMask 사용 및 에러 핸들링을 위함)
     *
     * @method request
     * @param {object}  ajax                      sc-ajax 객체
     * @param {function}[responseCallback(res)]   삭제 완료 후 콜백 함수
     * @param {object}  responseCallback(res).res 처리 결과 정보
     * <pre>
     * &lt;sc-ajax url="url" on-response="func">&lt;/sc_ajax>
     * on-response 에 함수를 지정하지 않은 경우 : responseCallback 을 정의하여 response를 받을 수 있다
     * </pre>
     * @async
     * @example
     *     someFunction: function() {
     *         var me = this;
     *         UT.request(me.$.findInfo);
     *     }
     *     someFunction: function() {
     *         var me = this;
     *         UT.request(me.$.findInfo, function(e, res) {
     *             ...
     *         });
     *     }
     */
    _requestedCount : 0,
    request: function(ajax, responseCallback) {
    	if(UT._requestedCount === 0) {
    		SCLoadMask.show('__utrequest__');
    	}
        UT._requestedCount++;
        
        var listener = function(e) {
        	UT._requestedCount--;
        	if(UT._requestedCount === 0) {
        		SCLoadMask.hide('__utrequest__');
        	}
            ajax.removeEventListener("response", listener);
            ajax.removeEventListener("error", listener);
            if (UT.isFunction(responseCallback)) {
                var result;
                if(e.detail.error){
                    result = e.detail;
                }else{
                    result = e.detail.parseResponse();
                }
                responseCallback.call(this, e, {response: result});
            }
        };
        ajax.addEventListener("response", listener);
        ajax.addEventListener("error", listener);
        if(SCUtil.isFunction(ajax.request)){
        	ajax.request();
        }
        else{
        	ajax.generateRequest();
        }
    },

    /**
     * clone object
     *
     * @method copy
     * @param  {object} object 복사할 대상 object
     * @return {object} new object
     * @example
     *     someFunction: function(param) {
     *         var me = this;
     *         me.set("findInfo.param", UT.copy(param));
     *     }
     */
    copy: function(object) {
        if (!UT.isObject(object)) {
            return object;
        }
        if (SCUtil.isDate(object)) {
            var copy = new Date();
            copy.setTime(object.getTime());
            return copy;
        }
        if (Array.isArray(object)) {
            return object.concat();
        }
        var copy = {};
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                copy[key] = UT.copy(object[key]);
            }
        }
        return copy;
    },

    /**
     * uuid 만들기
     *
     * @method generateUUID
     * @return {string} uuid
     * @example
     *     someFunction: function() {
     *         var me = this;
     *         ...
     *         var uuid = UT.generateUUID();
     *         ...
     *     }
     */
    generateUUID: function() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0;
            var v = (c === "x") ? r : (r & 3 | 8);
            return v.toString(16);
        });
    },

    /**
     * 팝업
     * <br>
     * 팝업의 close 이벤트는 기본적으로 설정된다.
     *
     * @method popup
     * @param {string} popupTagName                팝업으로 사용할 tag name
     * @param {object} element                     element
     * @param {number} width                       가로크기
     * @param {number} height                      세로크기
     * @param {object} [events]                    팝업에서 발생되는 event의 리스너 목록,
     * @param {object} [options]                   팝업 설정 옵션
     * @param {object} [options.modal=true]        모달 여부
     * @param {object} [options.maximizable=false] 최대화 여부
     * @param {object} [options.draggable=true]    이동 여부
     * @param {object} [options.resizable=false]   리사이징 여부
     * @param {object} [options.collapsible=false] 접기/펴기 여부
     * @example
     *     someFunction: function() {
     *         var me = this;
     *         ...
     *         UT.popup("ep-approval", me, 900, 800, {
     *             "attached": function(popup, e) {
     *                 popup.getContent().setParam({
     *                     app_id: param.app_id || "",
     *                     aprv_id: param.aprv_id || "",
     *                     aprv_typcd: param.aprv_typcd || ""
     *                 });
     *             },
     *             "saved-approval": function(popup, e) {
     *                 if (UT.isFunction(savedCallback)) {
     *                     savedCallback.call(this, e.detail);
     *                 }
     *             }
     *         }, {maximizable: true});
     *     }
     */
    popup: function(popupTagName, element, width, height, events, options) {
        options = options || {};
        var modal = UT.isBoolean(options.modal) ? options.modal : true;
        var maximizable = UT.isBoolean(options.maximizable) ? options.maximizable : false;
        var draggable = UT.isBoolean(options.draggable) ? options.draggable : true;
        var resizable = UT.isBoolean(options.resizable) ? options.resizable : true;
        var closable = UT.isBoolean(options.closable) ? options.closable : true;
        var collapsible = UT.isBoolean(options.collapsible) ? options.collapsible : false;
        var titleText = UT.isString(options.titleText) ? options.titleText : "";
        var title = titleText ? titleText : (UT.isString(options.title) ? options.title : "");
        var i18nDisabled = UT.isString(options.i18nDisabled) ? options.i18nDisabled : false;
        var resizeOnBrowserResize = UT.isBoolean(options.resizeOnBrowserResize) ? options.resizeOnBrowserResize : true;
        var refitOnBrowserResize = UT.isBoolean(options.refitOnBrowserResize) ? options.refitOnBrowserResize : true;
        var destroyOnHided = UT.isBoolean(options.destroyOnHided) ? options.destroyOnHided : false;
        
        var popup = SCPopupManager.popup(popupTagName, element, width, height, {
	            modal : modal,
	            closable : closable,
	            maximizable : maximizable,
	            draggable : draggable,
	            resizable : resizable,
	            collapsible : collapsible,
                i18nDisabled : i18nDisabled,
                resizeOnBrowserResize : resizeOnBrowserResize, //브라우저 리사이즈시 팝업 리사이즈
                refitOnBrowserResize : refitOnBrowserResize, //브라우저 리사이즈시 팝업 위치 변경
                destroyOnHided: destroyOnHided
        });
			
        var content = popup.getWindowContent();
        //팝업내 콘텐츠가 initialized 되기 전에 팝업이 보이기 때문에 disabled를 속성을 주어 사용자 인터랙션을 방지
        content.setAttribute("disabled", true);
        var initializedHandler = function() {
        	content.removeEventListener("initialized", initializedHandler);
        	content.removeAttribute("disabled");
        };
        content.addEventListener("initialized", initializedHandler);
        
        if(UT.isNotEmpty(title)){
            popup.titleText = title;
        }
        else if(UT.isNotEmpty(content.titleText) && UT.isEmpty(popup.titleText)){
            popup.titleText = content.titleText;
        }

        var fn = {};
        if (UT.isObject(events)) {
            for (var eventName in events) {
                if (UT.isFunction(events[eventName]) && eventName !== "close") { //close 이벤트는 별도로 제어
                    fn[eventName] = events[eventName].bind(null, popup);
                    content.addEventListener(eventName, fn[eventName]);
                }
            }
        }
        
        //close 이벤트가 발생하면 팝업을 닫아줌
        var closeHandler = function(e) {
            popup.close();
            if (UT.isObject(events) && UT.isFunction(events["close"])) {
                events["close"].call(this, popup, e);
            }
        };
        popup.addEventListener("close", closeHandler);

        //팝업이 보여질 때 scroll이 내려가 있는 경우 맨위로 변경  
        var scWindowShowedHandler = function(e) {
        	var eles = e.target.querySelectorAll('.flex,.vbox,.hbox,.page,.fit') || [];
        	for(var i=0;i<eles.len;i++) {
        		var d = eles[i];
        		if(d.scrollTop) {
            		d.scrollTop = 0;
            	}
        	}
        };
        popup.addEventListener("sc-window-showed", scWindowShowedHandler);
        
        //팝업이 숨겨질 때 Reset을 호출
        var scWindowHidedHandler = function(e) {
            if(content.reset)
                content.reset();

            if (UT.isObject(events) && UT.isFunction(events["sc-window-hided"])) {
                events["sc-window-hided"].call(this, popup, e);
            }
        };
        popup.addEventListener("sc-window-hided", scWindowHidedHandler);

        //팝업 컨텐츠 리사이즈 - 팝업내 차트는 별도 리사이즈 해주어야 함
        var resizeHandler = function(e) {
        	content.fire('content-resize', e);
        };
        popup.addEventListener("interact-resize-end", resizeHandler);

        popup.$_destroy = popup._destroy;
        popup._destroy = function() {
            popup.$_destroy();

            popup.removeEventListener("close", closeHandler);
            popup.removeEventListener("sc-window-hided", scWindowHidedHandler);
            popup.removeEventListener("sc-window-showed", scWindowShowedHandler);
            popup.removeEventListener("interact-resize-end", resizeHandler);

            if (UT.isObject(events)) {
                for (var eventName in events) {
                    if (UT.isFunction(events[eventName]) && eventName !== "close") { //close 이벤트는 별도로 제어
                        content.removeEventListener(eventName, fn[eventName]);
                    }
                }
            }
        }

        return popup;
    },

    /**
     * 팝업
     * <br>
     * scpopup에 iframe을 이용하여 jsp, html등 파일을 호출한다.
     * 호출된 jsp에서 팝업창을 제어할 수 있도록 closePopup 펑션 추가
     *
     * @method popupJsp
     * @param {string} url                           호출할 파일 url
     * @param {object} element                     element
     * @param {number} width                       가로크기
     * @param {number} height                      세로크기
     * @param {object} [events]                    팝업에서 발생되는 event의 리스너 목록,
     * @param {object} [options]                   팝업 설정 옵션
     * @param {object} [options.modal=true]        모달 여부
     * @param {object} [options.maximizable=false] 최대화 여부
     * @param {object} [options.draggable=true]    이동 여부
     * @param {object} [options.resizable=false]   리사이징 여부
     * @param {object} [options.collapsible=false] 접기/펴기 여부
     * @example
     *     someFunction: function() {
     *         var me = this;
     *         ...
     *         UT.popupJsp("test.jsp", me, 900, 800, {maximizable: true});
     *     }
     */

    popupJsp: function(url, element, width, height, events, options) {
        options = options || {};
        events = events || {};
        var modal = UT.isBoolean(options.modal) ? options.modal : true;
        var maximizable = UT.isBoolean(options.maximizable) ? options.maximizable : false;
        var draggable = UT.isBoolean(options.draggable) ? options.draggable : true;
        var resizable = UT.isBoolean(options.resizable) ? options.resizable : true;
        var closable = UT.isBoolean(options.closable) ? options.closable : true;
        var collapsible = UT.isBoolean(options.collapsible) ? options.collapsible : false;
        var titleText = UT.isString(options.titleText) ? options.titleText : "";
        var title = titleText ? titleText : (UT.isString(options.title) ? options.title : "");

        var popup = SCPopupManager.create(null, element, width, height, modal, closable, maximizable, draggable, resizable, collapsible);
        popup.titleText = title;

        var iframe = document.createElement('iframe');
        iframe.id = "poupJspIFrame";
        iframe.src = encodeURI(url);
        iframe.frameborder = 0;
        iframe.scrolling = UT.isString(options.scrolling) ? options.scrolling : 'yes';
        iframe.width = '100%';
        iframe.height = '100%';


        popup._contentElement.appendChild(iframe);
        popup.show();

        var content = iframe.contentWindow;
        iframe.onload = function(){
            iframe.contentWindow.fire = function(event, detail) {
                popup.fire(event, detail);
            };
        };

        var fn = {};
        if (UT.isObject(events)) {
            for (var eventName in events) {
                if (UT.isFunction(events[eventName]) && eventName !== "close") {
                    fn[eventName] = events[eventName].bind(null, popup);
                    popup.addEventListener(eventName, fn[eventName]);
                }
            }
        }

        var closeHandler = function(e) {
            popup.close();
            if (UT.isFunction(events["close"])) {
                events["close"].call(this, iframe.contentWindow, e);
            }
        };
        popup.addEventListener("close", closeHandler);

        var scWindowHidedHandler = function(e) {
            if(UT.isObject(events) && UT.isFunction(events["sc-window-hided"])){
                events["sc-window-hided"].call(this, popup, e);
            }
            popup.destroy();
        };
        popup.addEventListener("sc-window-hided", scWindowHidedHandler);
        
        var resizeAndDragStartHandler = function(e) {
            var contents = document.getElementById("poupJspIFrame");
            contents.style.visibility ="hidden";
        };
        popup.addEventListener("interact-resize-start", resizeAndDragStartHandler);
        popup.addEventListener("interact-drag-start", resizeAndDragStartHandler);

        var resizeAndDragEndHandler = function(e) {
            var contents = document.getElementById("poupJspIFrame");
            contents.style.visibility ="visible";
        };
        popup.addEventListener("interact-resize-end", resizeAndDragEndHandler);
        popup.addEventListener("interact-drag-end", resizeAndDragEndHandler);
        

        popup.$_destroy = popup._destroy;
        popup._destroy = function() {
            popup.$_destroy();
            popup.removeEventListener("close", closeHandler);
            popup.removeEventListener("sc-window-hided", scWindowHidedHandler);
            popup.removeEventListener("interact-resize-start", resizeAndDragStartHandler);
            popup.removeEventListener("interact-drag-start", resizeAndDragStartHandler);
            popup.removeEventListener("interact-resize-end", resizeAndDragEndHandler);
            popup.removeEventListener("interact-drag-end", resizeAndDragEndHandler);

            if (UT.isObject(events)) {
                for (var eventName in events) {
                    if (UT.isFunction(events[eventName]) && eventName !== "close") { //close 이벤트는 별도로 제어
                        popup.removeEventListener(eventName, fn[eventName]);
                    }
                }
            }
        };

        content.focus();

        return iframe.contentWindow;
    },
    
    /**
      * 팝업
     * <br>
     * scpopup에 iframe을 이용하여 jsp, html등 파일을 호출한다.
     * post 방식으로 호출된 jsp에서 팝업창을 제어할 수 있도록 closePopup 펑션 추가
     *
     * @method popupJsp
     * @param {string} url                           호출할 파일 url
	 * @param {}   	   param                       전달받을 Object
     * @param {object} element                     element
     * @param {number} width                       가로크기
     * @param {number} height                      세로크기
     * @param {object} [events]                    팝업에서 발생되는 event의 리스너 목록,
     * @param {object} [options]                   팝업 설정 옵션
     * @param {object} [options.modal=true]        모달 여부
     * @param {object} [options.maximizable=false] 최대화 여부
     * @param {object} [options.draggable=true]    이동 여부
     * @param {object} [options.resizable=false]   리사이징 여부
     * @param {object} [options.collapsible=false] 접기/펴기 여부
     */
    popupJspByPost: function(url, param, element, width, height, events, options) {
        options = options || {};
        events = events || {};
        var modal = UT.isBoolean(options.modal) ? options.modal : true;
        var maximizable = UT.isBoolean(options.maximizable) ? options.maximizable : false;
        var draggable = UT.isBoolean(options.draggable) ? options.draggable : true;
        var resizable = UT.isBoolean(options.resizable) ? options.resizable : true;
        var closable = UT.isBoolean(options.closable) ? options.closable : true;
        var collapsible = UT.isBoolean(options.collapsible) ? options.collapsible : false;
        var titleText = UT.isString(options.titleText) ? options.titleText : "";
        var title = titleText ? titleText : (UT.isString(options.title) ? options.title : "");

        var popup = SCPopupManager.create(null, element, width, height, modal, closable, maximizable, draggable, resizable, collapsible);
        popup.titleText = title;

        var iframe = document.createElement('iframe');
        //iframe.src = encodeURI(url);
        iframe.id = 'poupJspIFrame';
        iframe.name = 'poupJspIFrame';
        iframe.frameborder = 0;
        iframe.scrolling = UT.isString(options.scrolling) ? options.scrolling : 'yes';
        iframe.width = '100%';
        iframe.height = '100%';

        var form = document.createElement('form');
        form.method = 'POST';
        form.action = url;
        form.target = iframe.name;
        form.style.display = 'none';
        
		var input = document.createElement('input');
        
		var csrfObj = this.csrf();
			csrfObj._csrf = csrfObj.csrf;
		
		//CSRF 
		var input = document.createElement("input");
		input.name = csrfObj.csrfParameter;
		input.value = csrfObj.csrf;
		input.type = "hidden";
	
		form.appendChild(input);

		for(var i = 0; i < param.length; i++){
			var key = Object.keys(param[i]).slice();
			
			for(var j = 0; j < key.length; j++){
				input = document.createElement('input');
				input.setAttribute('name', key[j]);
				input.setAttribute('value', param[i][key[j]]);
				form.appendChild(input);
			}
		}
		
        popup._contentElement.appendChild(iframe);
        document.body.appendChild(form);
        popup.show();
        form.submit();
        document.body.removeChild(form);

        var content = iframe.contentWindow;
        iframe.onload = function(){
            iframe.contentWindow.fire = function(event, detail) {
                popup.fire(event, detail);
            };
        };
        var fn = {};
        if (UT.isObject(events)) {
            for (var eventName in events) {
                if (UT.isFunction(events[eventName]) && eventName !== "close") {
                    fn[eventName] = events[eventName].bind(null, popup);
                    popup.addEventListener(eventName, fn[eventName]);
                }
            }
        }

        var closeHandler = function(e) {
            popup.close();
            if (UT.isFunction(events["close"])) {
                events["close"].call(this, iframe.contentWindow, e);
            }
        };
        popup.addEventListener("close", closeHandler);

        var scWindowHidedHandler = function(e) {
        	if(UT.isObject(events) && UT.isFunction(events["sc-window-hided"])){
        		events["sc-window-hided"].call(this, popup, e);
        	}
        	popup.destroy();
        };
        popup.addEventListener("sc-window-hided", scWindowHidedHandler);

        var resizeAndDragStartHandler = function(e) {
            var contents = document.getElementById("poupJspIFrame");
            contents.style.visibility ="hidden";
        };
        popup.addEventListener("interact-resize-start", resizeAndDragStartHandler);
        popup.addEventListener("interact-drag-start", resizeAndDragStartHandler);

        var resizeAndDragEndHandler = function(e) {
            var contents = document.getElementById("poupJspIFrame");
            contents.style.visibility ="visible";
        };
        popup.addEventListener("interact-resize-end", resizeAndDragEndHandler);
        popup.addEventListener("interact-drag-end", resizeAndDragEndHandler);

        content.focus();

        popup.$_destroy = popup._destroy;
        popup._destroy = function() {
            popup.$_destroy();
            popup.removeEventListener("close", closeHandler);
            popup.removeEventListener("sc-window-hided", scWindowHidedHandler);
            popup.removeEventListener("interact-resize-start", resizeAndDragStartHandler);
            popup.removeEventListener("interact-drag-start", resizeAndDragStartHandler);
            popup.removeEventListener("interact-resize-end", resizeAndDragEndHandler);
            popup.removeEventListener("interact-drag-end", resizeAndDragEndHandler);

            if (UT.isObject(events)) {
                for (var eventName in events) {
                    if (UT.isFunction(events[eventName]) && eventName !== "close") {
                        popup.removeEventListener(eventName, fn[eventName]);
                    }
                }
            }
        }

        return iframe.contentWindow;
    },
    
    /**
     * 브라우저 팝업
     * 브라우저 팝업 생성하는 API
     *
     * @method popupWindowByPost
     * @param {string} url                         호출할 url (ex:http://www.emro.co.kr)
     * @param {string} target                      팝업을 생성할 window (ex:_self, _blank) default: _blank
     * @param {string} option                      팝업 옵션
     */
    popupWindowByPost : function(url, param, option){
        if(url == ""){
            console.error('url is empty.');
            return;
        }
        
        // 새창 사이즈--> width=100, height=100, scrollbars=no
        if(option != "") {
            options = option + ",";
        }
        options = options + "toolbar=no,location=no,menubar=no,status=no";
        
        var form = document.createElement('form');
        form.method  = 'POST';
        form.action  = url;
        form.target  = "_blank";
        // CSRF 
        var csrfObj = this.csrf();
            csrfObj._csrf = csrfObj.csrf;
        var input = document.createElement("input");
        input.name = csrfObj.csrfParameter;
        input.value = csrfObj.csrf;
        input.type = "hidden";
        form.appendChild(input);
        
        for(var i = 0; i < param.length; i++){
            var key = Object.keys(param[i]).slice();
            for(var j = 0; j < key.length; j++){
                input = document.createElement('input');
                input.setAttribute('name', key[j]);
                input.setAttribute('value', param[i][key[j]]);
                form.appendChild(input);
            }
        }
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    },
    
    /**
     * 브라우저 팝업
     * 브라우저 팝업 생성하는 API
     *
     * @method popupJsp
     * @param {string} url                         호출할 url (ex:http://www.emro.co.kr)
	 * @param {string} target                      팝업을 생성할 window (ex:_self, _blank) default: _blank
     * @param {string} option                      팝업 옵션
     */
    popupWindow: function(url, target, option){
		var options = "";
		target = typeof target !== 'undefined' ? target : "_blank";
		
		if(url == ""){
			console.error('url is empty.');
			return;
		}
	
		// 새창 사이즈--> width=100,height=100,scrollbars=no
		if(option != "") options = option + ",";
	
		options = options + "toolbar=no,location=no,menubar=no,status=no";
	
		if(target == "_self")
			window.open(url, target);
		else
			window.open(url, target, options);
	},

    /**
     * 결재 팝업
     *
     * @method popupApproval
     * @param {object}   element                    element
     * @param {object}   param                      결재 팝업으로 전달할 파라미터
     * @param {string}   [param.app_id]             해당 모듈의 APP 아이디(신규작성시)
     * @param {string}   [param.aprv_typcd]         결재 유형코드(신규작성시)
     * @param {string}   [param.aprv_id]            결재 아이디
     * @param {function} [savedCallback(stsCd)]     결재 작성시(resultView=false) 결재정보가 저장된 후 콜백 함수
     * @param {string}   savedCallback(stsCd).stsCd 결재상태코드
     * @async
     * @example
     *     someFunction: function() {
     *         var me = this;
     *         UT.popupApproval(me, {aprv_id: data.aprv_id}, function() {
     *             ...
     *         });
     *     }
     */
    popupApproval: function(element, param, savedCallback, isViewMode) {
    	var loadParam = {
                app_id: param.app_id || "",
                aprv_id: param.aprv_id || "",
                aprv_stscd: param.aprv_stscd || "",
                aprv_typcd: param.aprv_typcd || "",
                tmp_param : param.tmp_param || {},
                is_view_mode: isViewMode === true,
                doc_tit: UT.isNotEmpty(param.doc_tit) ? param.doc_tit + "_결재요청" : ""
            };
        var approvalPopup = SCPopupManager.get('ep-approval');

        var savedApprovalHandler = function(e) {
            approvalPopup.removeEventListener('saved-approval', savedApprovalHandler);
            approvalPopup.removeEventListener('sc-window-hided', closeHandler);
            if (UT.isFunction(savedCallback)) {
                savedCallback.call(this, e.detail, approvalPopup);
            }
            approvalPopup.getWindowContent().reset();
            approvalPopup.close();
        };
        
        //팝업이 보여질 때 scroll이 내려가 있는 경우 맨위로 변경  
        var scWindowShowedHandler = function(e) {
        	var eles = e.target.querySelectorAll('.flex,.vbox,.hbox,.page,.fit') || [];
        	for(var i=0;i<eles.len;i++) {
        		var d = eles[i];
        		if(d.scrollTop) {
            		d.scrollTop = 0;
            	}
        	}
        };

        var closeHandler = function(e) {
            approvalPopup.removeEventListener('saved-approval', savedApprovalHandler);
            approvalPopup.removeEventListener('sc-window-hided', closeHandler);
            // 결재팝업에서 아무 처리 없이 닫기를 했을 때는 savedCallback 을 호출한다.
            // saved-approval 이벤트 발생후 close되는 것과의 구별을 위함. savedCallback 이 두번 호출되는 것 방지
            if (e.detail === "callback" && UT.isFunction(savedCallback)) {
                savedCallback.call(this, "", approvalPopup);
            }
            approvalPopup.getWindowContent().reset();
            approvalPopup.close();
        };

    	if(!approvalPopup){
            element.importLink('../../../../../ui/bp/shared/ep-approval.html', function(moduleId) {
                SCPopupManager.register("ep-approval", "ep-approval", 1000, "95%", {
                    modal: true,
                    maximizable: true,
                    draggable: true,
                    //브라우저 리사이즈시 팝업 리사이즈
                    resizeOnBrowserResize : true,
                    //브라우저 리사이즈시 팝업 위치이동
                    refitOnBrowserResize : true
                });

                approvalPopup = SCPopupManager.get('ep-approval');

                approvalPopup.titleText = "결재";

                approvalPopup.addEventListener("_resetAuthCheck",function(e){
                    var authChecker = approvalPopup.getWindowContent().querySelector('cc-auth-checker');
                    if(authChecker){
                        authChecker.applyAuthorization();
                    }
                });

                approvalPopup.addEventListener("saved-approval", savedApprovalHandler);
                approvalPopup.addEventListener("sc-window-hided", closeHandler);
                approvalPopup.addEventListener("sc-window-showed", scWindowShowedHandler);

                approvalPopup.show();
                approvalPopup.getWindowContent().load(loadParam);
            });
        }
        else{
            approvalPopup.addEventListener("saved-approval", savedApprovalHandler);
            approvalPopup.addEventListener("sc-window-hided", closeHandler);

            approvalPopup.show();
            approvalPopup.fire('_resetAuthCheck');
            approvalPopup.getWindowContent().load(loadParam);
        }
    },
    
    /**
     * 첨부파일 업로드 팝업
     * <br>
     * 콜백함수로부터 첨부파일 그룹코드와 파일 개수가 전달된다.
     *
     * @method popupAttach
     * @param {object}   element                                 element
     * @param {string}   grpCd                                   첨부파일 그룹코드
     * @param {function} [savedCallback(result)]                 파일 저장 후 콜백 함수
     * @param {object}   savedCallback(result).result            콜백함수로부터 전달 되는 파라미터 - (예) {grp_cd: "xxx", file_count: 2}
     * @param {string}   savedCallback(result).result.grp_cd     첨부파일 그룹코드
     * @param {number}   savedCallback(result).result.file_count 업로드된 파일 총 수
     * @param {object}   [options]                               업로더 설정 옵션
     * @param {number}   [options.maxTotalFileCount=0]           객최대 파일 개수, 0 : 제한없음.
     * @param {string}   [options.maxTotalFileSize=0]            업로드 될 파일의 총 용량. 단위 - B(byte), KB(kilobyte), MB(megabyte), GB(gigabyte)
     * @async
     * @example
     *     someFunction: function() {
     *         var me = this;
     *         me.gridView.onDataCellClicked = function(grid, cell) {
     *             var fieldName = cell.fieldName;
     *             if(fieldName == "field1"){
     *                 UT.popupAttach(me, me.data.field2, function(result) {
     *                     grid.setValues(cell.itemIndex, {
     *                         field2: result.grp_cd,
     *                         field1: result.file_count
     *                     }, true);
     *                 });
     *             }
     *         };
     *     }
     */
    popupAttach: function(element, grpCd, savedCallback, options) {
        var param = {
            grp_cd: grpCd || "",
            options: options
        };

        var attachPopup = SCPopupManager.get('ep-attach');

        var savedAttachHandler = function(e){
            attachPopup.removeEventListener("saved-attach", savedAttachHandler);
            attachPopup.removeEventListener("sc-window-hided", closeHandler);
            if (UT.isFunction(savedCallback)) {
                savedCallback.call(this, e.detail);
            }
            attachPopup.getWindowContent().reset();
            attachPopup.close();
        };

        var closeHandler = function(){
            attachPopup.removeEventListener("saved-attach", savedAttachHandler);
            attachPopup.removeEventListener("sc-window-hided", closeHandler);
            attachPopup.getWindowContent().reset();
            attachPopup.close();
        };

        if(!attachPopup){
            element.importLink('../../../../../ui/bp/shared/ep-attach.html', function(moduleId) {
                SCPopupManager.register("ep-attach", "ep-attach", 800, 400,{
                    modal: true,
                    maximizable: true
                });

                attachPopup = SCPopupManager.get('ep-attach');

                attachPopup.addEventListener("saved-attach", savedAttachHandler);
                attachPopup.addEventListener("sc-window-hided", closeHandler);

                attachPopup.show();
                attachPopup.getWindowContent().load(param);
            });
        }
        else{
            attachPopup.addEventListener("saved-attach", savedAttachHandler);
            attachPopup.addEventListener("sc-window-hided", closeHandler);

            attachPopup.getWindowContent().reset();     // sc-upload 초기화 위해 추가 2017.06.08 mgpark
            attachPopup.show();
            attachPopup.getWindowContent().load(param);
        }
    },
    
    /**
	 * 이미지 뷰어를 불러온다.
	 * @param {Object} param 이미지 뷰어를 불러올 때 설정
	 * @param {Array} param.items 이미지 정보를 담고 있는 배열
	 * @param {Number} param.index 초기 선택 인덱스
	 */
	showImageViewerPopup: function(params) {
		// overlay와 imageviewer를 생성하고 기초 설정을 수행
		var overlay = document.createElement('sc-overlay');
		var imageViewer = document.createElement('sc-image-viewer');
		imageViewer.setAttribute('allow-zoom', true);
		imageViewer.setAttribute('show-controller', true);
		imageViewer.setAttribute('info-field', 'desc');
		imageViewer.setAttribute('thumbnail-size', 50);
		overlay.classList.add('imageviewer-overlay');
		
		// 빈영역 클릭시 삭제하는 동작 수행
		var clickHandler = function(event){
			var targetEl = event.currentTarget;
			targetEl.close();
			targetEl.removeEventListener('click', clickHandler);
			Polymer.dom(document.body).removeChild(targetEl);
	    };
		overlay.addEventListener('click', clickHandler);
		
		// 보여줄 데이터 초기화
		overlay.appendChild(imageViewer);
		Polymer.dom(document.body).appendChild(overlay);
		imageViewer.initData(params.items, params.index);
		
		// 보여주기
		overlay.show();
		
		return overlay;
	},
	
	/**
	 * 이미지 뷰어를 제거한다.
	 * @param {Element} popup 제거하려는 팝업 엘리먼트
	 */
	hideImageViewerPopup: function(popup) {
		Polymer.dom(document.body).removeChild(popup);
	},

    /**
     * date를 format의 형태로 출력한다.
     *
     * @method  formatDate
     * @param   {date|number} date 날짜 객체 | 날짜의 time값
     * @param   {string} [format=DEF.styles.formatDate.datetimeFormat] 변환할 format
     * @return  {string} 변환된 문자열
     * @example
     *     someFunction: function() {
     *         var me = this;
     *         UT.formatDate(new Date(), "yyyy/MM/dd"); // 2016/04/20
     *     }
     */
    formatDate: function(date, format) {
        if (UT.isNumber(date)) {
            date = new Date(date);
        }
        if (!(SCUtil.isDate(date))) {
            return date;
        }
        var me = date;
        
        if(format == null){
        	return SCFormatter.format('date', date);
        }
        else{
        	return format.replace(/(yyyy|yy|MM|M|dd|d|HH|H|mm|m|ss|s)/g, function(match) {
                switch (match) {
                	case "YYYY":
                    case "yyyy":
                        return me.getFullYear();
                    case "yy":
                        var v = me.getFullYear() % 100;
                        return v > 10 ? v : "0" + v;
                    case "MM":
                    case "M":
                        var v = me.getMonth() + 1;
                        return match.length === 1 || v >= 10 ? v : "0" + v;
                    case "DD":
                    case "dd":
                    case "d":
                        var v = me.getDate();
                        return match.length === 1 || v >= 10 ? v : "0" + v;
                    case "HH":
                    case "H":
                        var v = me.getHours();
                        return match.length === 1 || v >= 10 ? v : "0" + v;
                    case "mm":
                    case "m":
                        var v = me.getMinutes();
                        return match.length === 1 || v >= 10 ? v : "0" + v;
                    case "ss":
                    case "s":
                        var v = me.getSeconds();
                        return match.length === 1 || v >= 10 ? v : "0" + v;
                    default:
                        return match;
                }
            });
        }
    },

    /**
     * string에 values를 replace 한다
     *
     * @method formatString
     * @param  {string}       string 대상 문자열
     * @param  {string|array} values 바꿀 문자열
     * @return {string}              replace 된 문자열
     * @example
     *     someFunction: function() {
     *         var me = this;
     *         UT.formatString("{0} / {1}", "a", "b");                       // a / b
     *         UT.formatString("{0} / {1}", ["a", "b"]);                     // a / b
     *         UT.formatString("{name} / {value}", {name: "a", value: "b"}); // a / b
     *     }
     */
    formatString: function(string, values) {
    	string = I18N.translate(string); //formatString의 key값을 translate
        values = UT.isObject(values) ? values : Array.prototype.slice.call(arguments, 1);
        return string.replace(/\{([^{}]+)\}/gm, function(matched, key) {
            return typeof values[key] === "undefined" ? matched : values[key];
        });
    },

    /**
     * 숫자형으로.
     *
     * @method toNumber
     * @param  {string} s
     * @return {number} n : param 이 숫자형이 아니면 0
     */
    toNumber: function(s) {
        if (UT.isString(s)) {
            s = s.replace(/[\,]/g, "");
        }
        return isNaN(s) ? 0 : Number(s);
    },

    /**
     * 숫자인 경우 문자열로 변환
     *
     * @private
     * @method toString
     * @param  {object} v
     * @return {string}
     */
    toString: function(v) {
        if (UT.isNumber(v)) {
            return v.toString();
        }
        return v;
    },
    
    /**
     * 날짜의 time 값으로 변환
     *
     * @private
     * @method toTime
     * @param  {object} v
     * @return {number}
     */
    toTime: function(v) {
        if (UT.isDate(v)) {
            return v.getTime();
        }
        return null;
    },
    
    /**
    * 패스워드 정규표현식 반환
    *
    * @private
    * @method passwordRegExp
    * @return {object}
    */
   passwordRegExp: function() {
   	var regExp = {};

       regExp.lengthRe = new RegExp("^.{8,20}$");	//길이 8~20자
       regExp.letterRe = new RegExp("^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])","i"); //영문, 특수문자, 숫자 포함 여부
       regExp.repeatRe = new RegExp("(.)\\1{3,}");	// 4번 이상연속된 문자

       return regExp;
   },
   
   /**
    * 이메일 정규표현식 반환
    *
    * @private
    * @method emailRegExp
    * @return {object}
    */
   emailRegExp: function() {
   	var regExp = {};
   	
   	regExp.allRe = new RegExp("^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$", "i");	//길이 8~20자
   	
   	return regExp; 
   },
   
    /**
     * format 형태의 string을 date 로 변환한다.
     *
     * @method toDate
     * @param  {string} str 날짜 string
     * @param  {string} [format=DEF.styles.formatDate.datetimeFormat] str의 format
     * @return {date} 변환된 date
     * @example
     *     someFunction: function() {
     *         var me = this;
     *         UT.toDate("20160420", "yyyyMMdd"); // 2016/04/20
     *     }
     */
    toDate: function(str, format) {
        format = format || "yyyyMMdd";
        
        if(UT.isDate(str)){
        	return str;
        }
		if(UT.isString(str)) {
			str = str.replace(/\//g, "");
		}
        if(!UT.isString(str) || str.length !== format.length) {
            return null;
        }
        
        var y = 0, m = 0, d = 0, h = 0, mi = 0, s = 0;
        format.replace(/(yyyy|yy|MM|M|dd|d|HH|H|mm|m|ss|s)/g, function(match) {
            var offset = arguments[arguments.length - 2];
            switch (match) {
                case "yyyy":
                case "yy":
                    y = parseInt(str.substring(offset, offset + match.length), 10);
                    break;
                case "MM":
                case "M":
                    m = parseInt(str.substring(offset, offset + match.length), 10) - 1;
                    break;
                case "dd":
                case "d":
                    d = parseInt(str.substring(offset, offset + match.length), 10);
                    break;
                case "HH":
                case "H":
                    h = parseInt(str.substring(offset, offset + match.length), 10);
                    break;
                case "mm":
                case "m":
                    mi = parseInt(str.substring(offset, offset + match.length), 10);
                    break;
                case "ss":
                case "s":
                    s = parseInt(str.substring(offset, offset + match.length), 10);
                    break;
                default:
                    break;
            }
        });
        return new Date(y, m, d, h, mi, s);
    },

    /**
     * Array 여부
     *
     * @method isArray
     * @param  {object}  object
     * @return {boolean} true is array
     * @example
     *     someFunction: function() {
     *         var me = this;
     *         ...
     *         if (UT.isArray(dataRows)) {
     *             ...
     *         }
     *     }
     */
    isArray: function(object) {
        return Array.isArray(object);
        // return Object.prototype.toString.call(object) === "[object Array]";
    },

    /**
     * String 여부
     *
     * @method isString
     * @param  {object}  object
     * @return {boolean} true is string
     * @example
     *     someFunction: function() {
     *         var me = this;
     *         ...
     *         if (UT.isString(usrId)) {
     *             ...
     *         }
     *     }
     */
    isString: function(object) {
        return "string" === typeof object;
    },

    /**
     * Boolean 여부
     *
     * @method isBoolean
     * @param  {object}  object
     * @return {boolean} true is boolean
     * @example
     *     someFunction: function() {
     *         var me = this;
     *         ...
     *         me.set("singleSelect", UT.isBoolean(options.singleSelect) ? options.singleSelect : false);
     *     }
     */
    isBoolean: function(object) {
        return "boolean" === typeof object;
    },

    /**
     * Number 여부
     *
     * @method isNumber
     * @param  {object}  object
     * @return {boolean} true is number
     * @example
     *     someFunction: function() {
     *         var me = this;
     *         ...
     *         if (UT.isNumber(count)) {
     *             ...
     *         }
     *     }
     */
    isNumber: function(object) {
        return "number" === typeof object;
    },

    /**
     * Function 여부
     *
     * @method isFunction
     * @param  {object}  object
     * @return {boolean} true is function
     * @example
     *     someFunction: function() {
     *         var me = this;
     *         if (UT.isFunction(callback)) {
     *             callback.call(this);
     *         }
     *     }
     */
    isFunction: function(object) {
        return "function" === typeof object;
    },

    /**
     * Object 여부
     * <br>
     * (주의: null 도 object이지만, 편의상 null 은 object에서 제외 한다)
     *
     * @method isObject
     * @param  {object}  object
     * @return {boolean} true is object
     * @example
     *     someFunction: function() {
     *         var me = this;
     *         ...
     *         if (UT.isObject(options.defaultParam)) {
     *             me.set("findList.param", options.defaultParam);
     *         }
     *     }
     */
    isObject: function(object) {
        return object !== null && "object" === typeof object;
    },

    /**
     * Date 여부
     *
     * @method isDate
     * @param  {object}  object
     * @return {boolean} true is date
     * @example
     *     someFunction: function() {
     *         var me = this;
     *         ...
     *         if (UT.isDate(param)) {
     *             ...
     *         }
     *     }
     */
    isDate: function(object) {
        return UT.isObject(object) && typeof object.getTime === "function";
    },

    /**
     * 데이터의 empty 여부
     * <br>
     * string일 경우 trim 후 empty 검사한다
     *
     * @method isEmpty
     * @param  {string|array} object
     * @return {boolean}      true is empty
     * @example
     *     someFunction: function() {
     *         var me = this;
     *         ...
     *         if (!UT.isEmpty(item)) {
     *             ...
     *         }
     *     }
     */
    isEmpty: function(object) {
        return object === null || "undefined" === typeof object || (UT.isObject(object) && !Object.keys(object).length && !UT.isDate(object)) || (UT.isString(object) && object.trim() === "") || (UT.isArray(object) && object.length === 0);
    },

    /**
     * !UT.isEmpty(object)
     *
     * @method isNotEmpty
     * @param  {string|array} object
     * @return {boolean}      true is not empty
     */
    isNotEmpty: function(object) {
        return !UT.isEmpty(object);
    },
    
    /**
     * json 여부 판별
     */
    isJson : function(obj) {
        if (typeof obj == "object"){
            obj = JSON.stringify(obj);
        }
         
        if(typeof obj == "string" && obj.length > 0){
            var json = "";
            var isValid = false;
            try {
                json = JSON.parse(obj);
                isValid = true;
            } catch (e) {
                isValid = false;
            }
            if (!json || typeof json !== "object") isValid = false;
            return isValid;
        }
    },

    /**
     * input element에서 enter key가 눌렸을 때의 이벤트
     *
     * @method enter
     * @param {object} element
     * @param {function} callback enter key가 눌린 후 콜백 함수
     * @example
     *     someFunction: function() {
     *         var me = this;
     *     }
     */
    enter: function(element, callback) {
        $(element).find("input").keypress(function(key) {
            if (key.keyCode === 13) {
                if (UT.isFunction(callback)) {
                    callback.call(this);
                }
            }
        });
    },

    /**
     * 부모를 탐색하며 selector와 동일한 엘리먼트를 찾아줌
     *
     * @method closest
     * @param {object} element
     * @param {string} selector
     * @return {object}
     * @example
     *     someFunction: function() {
     *         var me = this;
     *     }
     */
    closest: function(element, selector) {
        while(element) {
            if (Polymer.DomApi.matchesSelector.call(element, selector)) {
                return element;
            } else {
                element = element.parentElement;
            }
        }
    },

    /**
     * 현재 화면의 MenuId를 return
     *
     * @method getMenuId
     * @param {object} element
     * @return {string} menuId
     * @example
     *     someFunction: function() {
     *         var me = this;
     *     }
     */
    getMenuId: function(element) {
        return SCMdiManager.getCurrentMenuId(element);
    },

    /**
     * 현재 화면의 authList를 return
     *
     * @method getAuthList
     * @param {object} element
     * @return {array} authList
     * @example
     *     someFunction: function() {
     *         var me = this;
     *     }
     */
    getAuthList: function(element) {
        var menuId = UT.getMenuId(element);
        if (menuId) {
            return SCRoleManager.getUserFuncs(menuId);
        }
    },

    /**
     * menuId를 통해 메뉴생성
     *
     * @method createWindowByMenuId
     * @param {string} menuId 메뉴아이디
     * @example
     *     someFunction: function() {
     *         var me = this;
     *     }
     */
    createWindowByMenuId: function(menuId, params, callback) {
        var mdiMain = document.querySelector("sc-mdi");
        var menuList = SCMdiManager.getMenuList();//mdiMain.$.mdiTopMenu.menuList;

        var windowIndex = mdiMain.$.mdiContent.createdWindows.indexOf(menuId);
        var moduleWindow = null;
        if(windowIndex > -1){
        	mdiMain.$.mdiContent.removeWindow(menuId);
        }
        
        for (idx in menuList) {
            if (menuId == menuList[idx].menu_id) {
                moduleWindow =  mdiMain.$.mdiContent.createWindow(menuList[idx].menu_id, menuList[idx].menu_nm, menuList[idx].menu_url,{params: params, callback: callback});
                /*if(UT.isFunction(callback)) {
                	moduleWindow.addEventListener("window-module-loaded", function(e) {
                		callback.call(moduleWindow.module, moduleWindow.module);
                		moduleWindow.removeEventListener("window-module-loaded");
                	});
                }*/
                break;
            }
        }

        return moduleWindow;
    },

    /**
     * 메뉴 생성
     *
     * @method createWindow
     * @param {string} menuId    메뉴아이디
     * @param {string} menuName  메뉴명
     * @param {string} menuUrl   메뉴URL
     * @example
     *     someFunction: function() {
     *         var me = this;
     *     }
     */
    createWindow: function(menuId, menuName, menuUrl, callback) {
        var mdiMain = document.querySelector("sc-mdi");

        var windowIndex = mdiMain.$.mdiContent.createdWindows.indexOf(menuId);
        var moduleWindow = null;
        if(windowIndex > -1){
        	mdiMain.$.mdiContent.removeWindow(menuId);
        }
        
        moduleWindow = mdiMain.$.mdiContent.createWindow(menuId, menuName, menuUrl);
        if(UT.isFunction(callback)) {
        	moduleWindow.addEventListener("window-module-loaded", function(e) {
        		callback.call(moduleWindow,e.detail);
                moduleWindow.removeEventListener("window-module-loaded", arguments.callee);
        	});
        }
        return moduleWindow;
    },
    /**
     * Array 에 특정  필드에 특정 값이 필터값과 같으면 Array를 재생성함.
     * @method : arrayFilterChange
     * @param : {Array} array
     * @param : {Object} filter : {key : filter처리할키  , value : 값}
     * @example
     *             UT.arrayFilterChange(me.codes.prcStlTypCd,{key : "dtl_cd_attr_val",value : me.rfxData.rfx_typ});
     *
     */
    arrayFilterChange : function(array,filter){
        //배열에서 자료추출
        if(UT.isArray(array)){
            var datas = array.filter(function (element) {
                if (element[filter.key] === filter.value) {
                    return true;
                }
            });
            return datas;
        }else{
            return array;
        }
    },
    getArrayValuesByKey: function(array, searchKey) {
    	var values = [];
        if(UT.isArray(array)){
            array.forEach(function(data) {
                if(data[searchKey]) {
                	values.push(data[searchKey]);
                }
            });
        }
        return values;
    },
    getHour : function(){
        var array = [];
        for(var i = 0 ; i< 24 ; i++){
        	var label = (i<10) ? ("0"+i) : i;
            array.push({data : i, label : label});
        }
        return array;
    },
    getMin : function(){
        var array = [];
        for(var i = 0 ; i< 60 ; i++){
        	var label = (i<10) ? ("0"+i) : i;
            array.push({data : i, label : label});
        }
        return array;
    },
    /**
     * TODO : 날짜,시간,분이 있는 component의 값을 date로
     * dt.hour.min이 있는 data의 경우 dt로 date를 만들어서 셋팅
     *
     * ynkim
     */
    convertDayHourMinToDt : function(obj){
        for (var key in obj) {
            if (obj.hasOwnProperty(key) && /_dt$/.test(key)) {
                var val = obj[key];
                if(Date.parse(val)){
                     var day  = obj[key],
                         hour = obj[key +"_hour"],
                         min  = obj[key +"_min"];

                     if((UT.isDate(day) || !UT.isEmpty(day)) && !UT.isObject(hour) && !UT.isObject(min)){
                         var date = new Date(day);
                          date.setHours(!!hour?hour:0, !!min?min:0, 0, 0);
                          obj[key] = date;
                     }
                }
            }
        }
        return obj;
    },
    /**
     * TODO: 추가개발필요 )))) date의 값을 날짜,시간,분이 있는 값으로 셋팅
     * data에 dt가 있는  데이타의 경우 dt,hour,min data를 만들어서 셋팅
     *
     * ynkim
     */
    convertDtToDayHourMin : function(obj){
        for (var key in obj) {
            if (obj.hasOwnProperty(key) && /_dt$/.test(key)) {
                var val = obj[key];
                if(Date.parse(val)){
                    var newKey = key+"_dt";
                     obj[newKey] = val;
                     newKey = key +"_hour";
                     obj[newKey] = val.getHours();
                     newKey = key +"_min";
                     obj[newKey] = val.getMinutes();
                }
            }
        }
        return obj;
    },

    //트리 변환 메서드
    listToTree : function (arrayList, idKey,parentIdKey) {
        var rootNodes = [];
        var traverse = function (nodes, item, index) {
            if (nodes instanceof Array) {
                return nodes.some(function (node) {
                    if (node[idKey] === item[parentIdKey]) {
                        node.children = node.children || [];
                        return node.children.push(arrayList.splice(index, 1)[0]);
                    }

                    return traverse(node.children, item, index);
                });
            }
        };

        while (arrayList.length > 0) {
            arrayList.some(function (item, index) {
                if (item[parentIdKey] === "ROOT") {
                    return rootNodes.push(arrayList.splice(index, 1)[0]);
                }

                return traverse(rootNodes, item, index);
            });
        }

        return rootNodes;
    },

    /**
     * 협력사 profile 팝업 호출
     * @param element
     * @param param
     * @param savedCallback
     */
    popupVendor: function(element, param, savedCallback) {
        var vendorPopup = SCPopupManager.get('ep-vendor-profile-tab');

        var completeSaveHandler = function(e){
            vendorPopup.removeEventListener("complete-save", completeSaveHandler);
            vendorPopup.removeEventListener("sc-window-hided", closeHandler);
            if (UT.isFunction(savedCallback)) {
                savedCallback.call(this, e.detail);
            }
            vendorPopup.getWindowContent().reset();
            vendorPopup.close();
        };

        var closeHandler = function(e){
            vendorPopup.removeEventListener("complete-save", completeSaveHandler);
            vendorPopup.removeEventListener("sc-window-hided", closeHandler);
            vendorPopup.getWindowContent().reset();
            vendorPopup.close();
        };

        if(!vendorPopup){
            element.importLink('../../../../../ui/bp/esourcing/vendorInfoMgt/ep-vendor-profile-tab.html', function(moduleId) {
                SCPopupManager.register("ep-vendor-profile-tab", "ep-vendor-profile-tab", "90%", "90%", {
                	modal: true,
                    maximizable: true,
                    //브라우저 리사이즈시 팝업 리사이즈
                    resizeOnBrowserResize : true,
                    //브라우저 리사이즈시 팝업 위치이동
                    refitOnBrowserResize : true
                });

                vendorPopup = SCPopupManager.get('ep-vendor-profile-tab');
                vendorPopup.titleText = "협력사 Profile";

                vendorPopup.addEventListener("complete-save", completeSaveHandler);
                vendorPopup.addEventListener("sc-window-hided", closeHandler);

                vendorPopup.show();
                vendorPopup.getWindowContent().load(param);
            });
        }
        else{
            vendorPopup.addEventListener("complete-save", completeSaveHandler);
            vendorPopup.addEventListener("sc-window-hided", closeHandler);

            vendorPopup.show();
            vendorPopup.getWindowContent().load(param);
        }
    },
    
    /**
     * moment.js의 date를 javascript date object로 변환
     * @param {object} momentDate 변경하려는 momentjs 객체
     * @returns {Date} 변환된 데이트 객체
     */
    moment2Date : function(momentDate) {
    	
    	var targetDate = new Date();
    	targetDate.setYear(momentDate.year());
    	targetDate.setMonth(momentDate.month());
    	targetDate.setDate(momentDate.date());
    	targetDate.setHours(momentDate.hour());
    	targetDate.setMinutes(momentDate.minute());
    	
    	return targetDate;
    },
    
    /**
     * 부동소수 수량의 곱 (소수점 3자리까지 입력가능. 결과는 소수점 6자리까지 나올수 있음)
     * Round 값을 넣지 않으면 Scale 값은 무시
     * @param _numberPrc 계산할 숫자1
     * @param _numberQty 계산할 숫자2
     * @param Round (ROUND: 반올림, CEIL: 올림, FLOOR: 내림, 입력안함: 전부표시)
     * @param Scale 소수점 몇째자리에서 처리
     * @returns {String}
     */
    toFixedMultiply : function(_numberPrc, _numberQty, Round, Scale) {
        var _divisor = Math.pow(10, 8);
        var sign = 1;
        var _multip, _multipPrc, _multipQty;
        var _idxPrc, _idxQty;
        
        if(Round === null || typeof Round === 'undefined'){
        	Round = "NONE";
        }
        if(Scale === null || typeof Scale === 'undefined'){
        	Scale = 4;
        }
        
        if(_numberPrc < 0) {
            sign *= -1; _multipPrc = (_numberPrc * -1).toString();
        }
        else {
            _multipPrc = _numberPrc.toString();
        }
        
        if(_numberQty < 0) {
            sign *= -1; _multipQty = (_numberQty * -1).toString();
        }
        else {
            _multipQty = _numberQty.toString();
        }
        
        _idxPrc = _multipPrc.indexOf(".");
        _idxQty = _multipQty.indexOf(".");
        
        if(_idxPrc == -1) {
            _multipPrc = (_multipPrc + "0000");
        }
        else {
            _multipPrc = (_multipPrc + "0000");
            _multipPrc = _multipPrc.substring(0, _idxPrc) + _multipPrc.substring(_idxPrc+1, _idxPrc+5);
        }
        
        if(_idxQty == -1) {
            _multipQty = (_multipQty + "0000");
        }
        else {
            _multipQty = (_multipQty + "0000");
            _multipQty = _multipQty.substring(0, _idxQty) + _multipQty.substring(_idxQty+1, _idxQty+5);
        }
        
        switch(Round) {
            case "ROUND" :
                _multip = ( (Number(_multipPrc) * Number(_multipQty) + (5*Math.pow(10, 8-Scale))) / _divisor * sign).toString();
                _multip = (_multip.indexOf(".") == -1)? _multip : _multip.substring(0, _multip.indexOf(".") + Scale);
                break;
            case "CEIL":
                _multip = ( (Number(_multipPrc) * Number(_multipQty) + (Math.pow(10, 9-Scale)-1)) / _divisor * sign).toString();
                _multip = (_multip.indexOf(".") == -1)? _multip : _multip.substring(0, _multip.indexOf(".") + Scale);
                break;
            case "FLOOR": 
                _multip = ( (Number(_multipPrc) * Number(_multipQty)) / _divisor * sign).toString();
                _multip = (_multip.indexOf(".") == -1)? _multip : _multip.substring(0, _multip.indexOf(".") + Scale);
                break;
            default:
                _multip = ( (Number(_multipPrc) * Number(_multipQty)) / _divisor * sign).toString();
                break;
        }
        
        return _multip;
    },

    /**
     * 부동소수 수량의 나눗셈 (소수점 3자리까지 입력가능. 결과가 소수점 무한대로 나올수있으므로 Round 파라미터 입력필요 )
     * Round 값을 넣지 않으면 Scale 값은 무시
     * @param _number1 계산할 숫자1
     * @param _number2 계산할 숫자2
     * @param Round (ROUND: 반올림, CEIL: 올림, FLOOR: 내림, 입력안함: 전부표시)
     * @param Scale 소수점 몇째자리에서 처리
     * @returns {String}
     */
    toFixedDivide : function(_number1, _number2, Round, Scale) {
        var _multip1 = _number1.toString();
        var _multip2 = _number2.toString();
        var _idx1, _idx2;
        
        if(Round === null || typeof Round === 'undefined'){
        	Round = "NONE";
        }
        if(Scale === null || typeof Scale === 'undefined'){
        	Scale = 4;
        }
        
        // 소수점 몇째자리까지 있는지 확인
        _idx1 = _multip1.indexOf(".");
        _idx2 = _multip2.indexOf(".");
        
        //정수화된 값
        var _multip1Num = "";
        var _multip2Num = "";
        
        //소수점 길이
        var _multip1Len = 0;
        var _multip2Len = 0;
        if(_idx1 != -1)
            _multip1Len = _multip1.length - _idx1 -1;
        if(_idx2 != -1)
            _multip2Len = _multip2.length - _idx2 -1;
        
        // 각 수 정수로 바꾸기 
        if(_multip1Len == _multip2Len){
            // 둘다 정수일때
            if(_multip1Len == 0){
                _multip1Num = _multip1;
                _multip2Num = _multip2;
            }
            else{
                _multip1Num = _multip1.substring(0, _idx1) + _multip1.substring(_idx1+1, _multip1.length);
                _multip2Num = _multip2.substring(0, _idx2) + _multip2.substring(_idx2+1, _multip2.length);
            }
        }
        else if(_multip1Len > _multip2Len){
            // 소수점뒤 길이가 긴건 소수점만 없애고 짧은건 짧은 수만큼 0 붙이기
            var powLen = Math.pow(10,_multip1Len-_multip2Len).toString();
            _multip1Num = _multip1.substring(0, _idx1) + _multip1.substring(_idx1+1, _multip1.length);
            if(_multip2Len == 0){
                _multip2Num = _multip2 + powLen.substring(1,powLen.length);
            }else{
                _multip2Num = _multip2.substring(0, _idx2) + _multip2.substring(_idx2+1, _multip2.length) + powLen.substring(1,powLen.length);
            }
        }else{
            // 소수점뒤 길이가 긴건 소수점만 없애고 짧은건 짧은 수만큼 0 붙이기
            var powLen = Math.pow(10,_multip2Len-_multip1Len).toString();
            _multip2Num = _multip2.substring(0, _idx2) + _multip2.substring(_idx2+1, _multip2.length);
            if(_multip1Len == 0){
                _multip1Num = _multip1 + powLen.substring(1,powLen.length);
            }else{
                _multip1Num = _multip1.substring(0, _idx1) + _multip1.substring(_idx1+1, _multip1.length) + powLen.substring(1,powLen.length);
            }
        }
        
        // 결과값 
        var _result = Number(_multip1Num) / Number(_multip2Num);

        //반올림 함수 호출부분 
        return this.toFixedRound(_result,Round,Scale);
    },
    
    /**
     * 반올림 올림 내림 함수 
     * @param _number1 계산할 숫자
     * @param Round (ROUND: 반올림, CEIL: 올림, FLOOR: 내림, 입력안함: 전부표시)
     * @param Scale 소수점 몇째자리에서 처리
     * @returns {String}
     */
    toFixedRound : function(_number1, Round, Scale){
        
        // String 변환
        var _num = _number1.toString();
        
        var sign = "";

        if(Round === null || typeof Round === 'undefined'){
        	Round = "NONE";
        }
        if(Scale === null || typeof Scale === 'undefined'){
        	Scale = 4;
        }

        if(_number1 < 0){
            sign = "-";
            _num = _num.substring(1,_num.length);
        }
        //소수점 위치
        var indexdot = _num.indexOf(".");
        
        // 곱한 10의 n 승
        var muxcnt = _num.length - indexdot -1;

        // 정수가 들어왔거나 소수점처리 안한다면 그냥 리턴
        if(indexdot == -1 || Round == "NONE" || muxcnt < Scale)
            return _number1.toString();
        
        // 소수점 제거된 입력값
        var _numX = Number(_num.substring(0, indexdot) + _num.substring(indexdot+1, _num.length));
        
        var _numS = "";
        
        switch(Round) 
        {
            case "ROUND" :
                _numS = ( (Number(_numX) + (5*Math.pow(10, muxcnt-Scale))) / Math.pow(10,muxcnt) ).toString();
                _numS = (_numS.indexOf(".") == -1)? _numS : _numS.substring(0, _numS.indexOf(".") + Scale);
                break;
            case "CEIL":
                _numS = ( (Number(_numX) + (Math.pow(10, muxcnt+1-Scale)-1)) / Math.pow(10,muxcnt)).toString();
                _numS = (_numS.indexOf(".") == -1)? _numS : _numS.substring(0, _numS.indexOf(".") + Scale);
                break;
            case "FLOOR": 
                _numS = ( Number(_numX) / Math.pow(10,muxcnt)).toString();
                _numS = (_numS.indexOf(".") == -1)? _numS : _numS.substring(0, _numS.indexOf(".") + Scale);
                break;
            default: //아무것도 아닐 경우
                return _number1.toString();
                break;
        }

        return Number(sign+_numS).toString();
    },

    /**
     * 부동소수 수량의 합. (소수점 4째자리까지 입력 가능)
     * @param _numQtyA 계산할 숫자1
     * @param _numQtyB 계산할 숫자2
     * @returns {String}
     */
    toFixedAdd : function(_numQtyA, _numQtyB) {
        var _divisor = Math.pow(10, 4);
        var _addition;
        
        var _addQtyA = _numQtyA.toString();
        var _addQtyB = _numQtyB.toString();
        
        var _idxQtyA = _addQtyA.indexOf(".");
        var _idxQtyB = _addQtyB.indexOf(".");
        
        if(_idxQtyA == -1)
            _addQtyA = (_addQtyA + "0000");
        else
        {
            _addQtyA = (_addQtyA + "0000");
            _addQtyA = _addQtyA.substring(0, _idxQtyA) + _addQtyA.substring(_idxQtyA+1, _idxQtyA+5);
        }
        
        if(_idxQtyB == -1)
            _addQtyB = (_addQtyB + "0000");
        else
        {
            _addQtyB = (_addQtyB + "0000");
            _addQtyB = _addQtyB.substring(0, _idxQtyB) + _addQtyB.substring(_idxQtyB+1, _idxQtyB+5);
        }
        

        _addition = ( (Number(_addQtyA) + Number(_addQtyB) ) / _divisor).toString();
        
        return _addition;
    },
    
    /**
     * 부동소수 수량의 차. (소수점 4째자리까지 입력 가능)
     * @param _numQtyA 계산할 숫자1
     * @param _numQtyB 계산할 숫자2
     * @returns {String}
     */
    toFixedSub : function(_numQtyA, _numQtyB) {
        var _divisor = Math.pow(10, 4);
        var _addition;
        
        var _addQtyA = _numQtyA.toString();
        var _addQtyB = _numQtyB.toString();
        
        var _idxQtyA = _addQtyA.indexOf(".");
        var _idxQtyB = _addQtyB.indexOf(".");
        
        if(_idxQtyA == -1) {
            _addQtyA = (_addQtyA + "0000");
        }
        else {
            _addQtyA = (_addQtyA + "0000");
            _addQtyA = _addQtyA.substring(0, _idxQtyA) + _addQtyA.substring(_idxQtyA+1, _idxQtyA+5);
        }
        
        if(_idxQtyB == -1) {
            _addQtyB = (_addQtyB + "0000");
        }
        else {
            _addQtyB = (_addQtyB + "0000");
            _addQtyB = _addQtyB.substring(0, _idxQtyB) + _addQtyB.substring(_idxQtyB+1, _idxQtyB+5);
        }
        
        _addition = ( (Number(_addQtyA) - Number(_addQtyB) ) / _divisor).toString();

        return _addition;
    },
    
    csrf: function() {
    	var doc = document,
		meta = doc.querySelector('meta[name=_csrf]'), _csrf;
	
		if(meta) {
			_csrf = {
				csrf : meta.content,
				csrfHeader : doc.querySelector('meta[name=_csrf_header]').content,
				csrfParameter : doc.querySelector('meta[name=_csrf_parameter]').content
			}
		}
		return _csrf;
    },
    
    /**
     * 큰 숫자 정렬을 위한 함수
     * @param val1
     * @param val2
     * @returns val1가 크면 1, 같으면 0, 작으면 -1
     */
    sortBigNumber: function (val1, val2) {
        if (val1 === undefined || val1 === null) {
            return (val2 === undefined || val2 === null) ? 0 : -1;
        }
        if (val2 === undefined || val2 === null) {
            return 1;
        }

        var bigVal1 = new BigNumber(val1);
        var bigVal2 = new BigNumber(val2);

        return bigVal1.comparedTo(bigVal2);
    },

    /**
     * 큰 숫자 합계를 위한 함수
     * @param dataField
     * @param datas
     * @returns val1가 크면 1, 같으면 0, 작으면 -1
     */
    plusBigNumber: function (dataField, datas) {
        var result = new BigNumber('0');

        for(var i=0; i<datas.length; ++i){
            result = result.plus(new BigNumber(datas[i][dataField] || 0));
        }
        return result.toFixed();
    },
    
    templateColumns: function(scope, templateId, columnsId){
    	var me = scope, columnsCts, columns,
    		template = me.querySelector(templateId);
    	
    	me.templatize(template);
		instance = me.stamp(null);
		me.appendChild(instance.root);
		columnsCts = me.querySelectorAll(columnsId);
		columns = Array.prototype.slice.call(columnsCts[columnsCts.length-1].children);
		
		if(columnsCts.length > 1){
			for(var i=0; i<columnsCts.length-1; i++){
				me.removeChild(columnsCts[i]);
			}
		}
		
		return columns;
	},
	
	/**
     * Array Editstatus Flag 설정(7 -> 9 Conversion) 
     * @param Array
     * @param String
     * @returns Array
     */
	setEditStatusValue : function(array, editstatus) {
		
		if(UT.isArray(array) && UT.isNotEmpty(array)) {
			if(array.length > 0) {
	            var length = array.length;
	            for(var i = 0; i < length; i++) {
	            	array[i].editstatus = editstatus;
	            }
	        }
		}
		
        return array;
	},
	/** [Volcano Support] SCAlert API */
	alertShow: function(message, title, autoTranslate, flags, parent, fn, iconCls) {
		var i18nDisabled = !autoTranslate;

		!UT.isFunction(fn) && (fn = function(){});
		if(flags == 3){ // Yes / No
			return SCAlert.confirm(title, message, function(btn){
				var e = {};
				e.detail = (btn === "yes") ? 1 : 2;
				fn.call(this, e);
			}, iconCls, i18nDisabled);
		}else{ // Default
			return SCAlert.show(title, message, fn, iconCls, i18nDisabled);
		}
	},
	
	/** [Volcano Support] Alert API */
	_alertShow: function(message, title, flags, parent, fn, iconCls) {
		return UT.alertShow(message, title, false, flags, parent, fn, iconCls);
	},
};

/**
* 다국어 변환
*
* @class I18N
*/
var I18N = {
    /**
     * 다국어 처리 instance
     */
    instance: null,

    /**
     * 다국어 변환
     *
     * @private
     * @method translate
     * @param  {string}
     * @return {string}
     */
    translate: function() {
        var me = this;
        if (me.instance === null) {
            me.instance = new SCI18n();
        }
        return me.instance.translate.apply(this, arguments);
    }
};





var CrytoUtil = {
	
	aesDefaultSalt : 'db898233adc9cb441456afe030b2dcb2',
	
	encrypt : function(word, salt){
		var saltKey = this.aesDefaultSalt;
		
		if(UT.isString(salt)){
			saltKey = salt;
		}
		
		return CryptoJS.AES.encrypt(word, CryptoJS.enc.Hex.parse(saltKey), {
	        mode: CryptoJS.mode.ECB,
	        padding: CryptoJS.pad.Pkcs7
	    }).toString()
	},
	decrypt : function(word, salt){
		var saltKey = this.aesDefaultSalt;
		
		if(UT.isString(salt)){
			saltKey = salt;
		}
		
		if(!word){
			return;
		}
		
		return CryptoJS.AES.decrypt(word, CryptoJS.enc.Hex.parse(saltKey),{
	        mode: CryptoJS.mode.ECB,
	        padding: CryptoJS.pad.Pkcs7
	    }).toString(CryptoJS.enc.Utf8)
	},
	hash : function(value){
		return CryptoJS.MD5(value).toString(CryptoJS.enc.Base64);
	}
};


var StringUtil = {
    /**
     *  Removes all whitespace characters from the beginning and end
     *  of the specified string.
     *
     *  @param str The String whose whitespace should be trimmed.
     *
     *  @return Updated String where whitespace was removed from the
     *  beginning and end.
     */
    trim: function(str) {
        if (str == null) return '';
        var startIndex = 0;
        while (StringUtil.isWhitespace(str.charAt(startIndex))) {
            ++startIndex;
        }
        var endIndex = str.length - 1;
        while (StringUtil.isWhitespace(str.charAt(endIndex))) {
            --endIndex;
        }
        if (endIndex >= startIndex) return str.slice(startIndex, endIndex + 1);
        else return "";
    },
    /**
     *  Removes all whitespace characters from the beginning and end
     *  of each element in an Array, where the Array is stored as a String.
     *
     *  @param value The String whose whitespace should be trimmed.
     *
     *  @param separator The String that delimits each Array element in the string.
     *
     *  @return Updated String where whitespace was removed from the
     *  beginning and end of each element.
     */
    trimArrayElements: function(value, delimiter) {
        if (value != "" && value != null) {
            var items = value.split(delimiter);
            var len = items.length;
            for (var i = 0; i < len; i++) {
                items[i] = StringUtil.trim(items[i]);
            }
            if (len > 0) {
                value = items.join(delimiter);
            }
        }
        return value;
    },
    /**
     *  Returns <code>true</code> if the specified string is
     *  a single space, tab, carriage return, newline, or formfeed character.
     *
     *  @param str The String that is is being queried.
     *
     *  @return <code>true</code> if the specified string is
     *  a single space, tab, carriage return, newline, or formfeed character.
     */
    isWhitespace: function(character) {
        switch (character) {
            case " ":
            case "\t":
            case "\r":
            case "\n":
            case "\f":
                return true;
            default:
                return false;
        }
    },
    /**
     UT.formatString과 동일
     */
    substitute: function(str, rest) {
        return UT.formatString(str, rest);
    },

    /*********************************
     *  emro.lib.util.StringUtil
     ********************************/
    isnull: function(str, target) {
        if (str == null) return target;
        return str;
    },
    isValidString: function(str) {
        if (str == null) return false;
        if (str == "") return false;
        return true;
    },
    twoLength: function(str) {
        if (str.length == 1) return "0" + str;
        else return str;
    },
    substrArray: function(str, type) {
        var arr = new Array();
        while (str.indexOf(type, 0) > 0) {
            arr.push(str.substr(0, str.indexOf(type, 0)));
            str = str.substr(str.indexOf(type, 0) + 1, str.length);
        }
        return arr;
    },
    uccURL: function(path, name) {
        var url = path;
        if (url.substr(url.length - 1, 1) != "/") url += "/";
        url += name;
        return url;
    },
    formatDate: function(value) {
        var temp;
        temp = value.substring(0, 4) + "년";
        temp += value.substring(4, 6) + "월";
        temp += value.substring(6, 8) + "일";
        temp += value.substring(8, 10) + "시";
        temp += value.substring(10, 12) + "분";
        return temp;
    },
    ipCheck: function(__ip) {
        var str = "";
        var classCount = 0;
        if (__ip.substr(__ip.length - 1, 1) == ".") {
            __ip = __ip.substring(0, __ip.length - 1);
            str = __ip;
        } else {
            str = __ip;
        }
        while (__ip.indexOf(".", 0) > 0) {
            __ip = __ip.substr(__ip.indexOf(".", 0) + 1, __ip.length - __ip.indexOf(".", 0));
            classCount++;
        }
        if (classCount == 0) {
            return "error";
        }
        for (var i = classCount; i < 3; i++) {
            str += ".0";
        }
        return str;
    },
    dateFormat: function(str) {
        var result = str;
        if (result != "" || result != null) {
            result = str.substring(0, 4) + "-" + str.substring(4, 6) + "-" + str.substring(6, 8);
            if (str.length > 8) {
                result += " " + str.substring(8, 10) + ":" + str.substring(10, 12) + ":" + str.substring(12, 14);
            }
        }
        return result;
    },

    dateFormatByChar: function(str, char) {
        var result = str;
        if (result != "" || result != null) {
            result = str.substring(0, 4) + char + str.substring(4, 6);
            if (str.length > 6) {
                result += char + str.substring(6, 8);
            }
            if (str.length > 8) {
                result += " " + str.substring(8, 10) + ":" + str.substring(10, 12) + ":" + str.substring(12, 14);
            }
        }
        return result;
    },
    serchpa: function(str) {
        if (str == null) return "";
        var serc = str.search(str);
        return serc.toString();
    },
    lpad: function(str, target_length, ch) {
        var ch00 = "";
        for (var i = 0; i < target_length; i++) {
            ch00 = ch00 + ch;
        }
        str = ch00 + str;
        return str;
    },
    rpad: function(str, target_length, ch) {
        var ch00 = "";
        for (var i = 0; i < target_length; i++) {
            ch00 = ch00 + ch;
        }
        str = str + ch00;
        return str;
    },
    ltrim: function(str) {
        return str.replace(/(^[ ]*)/g, "");
    },
    rtrim: function(str) {
        return str.replace(/([ ]*$)/g, "");
    },
    replaceignoreCase: function(str, exp, rep) {
        while (str.indexOf(exp) > -1) {
            str = str.replace(exp, rep);
        }
        return str;
    },
    checkJuminNo: function(objResNo) {
        var sum = 0;
        var resNo_len = objResNo.length;
        if (objResNo == null) return 1;
        if (resNo_len == 14) {
            objResNo = objResNo.replace("-", "");
        }
        if (resNo_len != 13) {
            return 1;
        }
        for (var i = 0; i < 12; i++) {
            sum += parseInt(objResNo.substr(i, 1)) * (i % 8 + 2);
        }
        var achk = objResNo.substr(12, 1);
        var bchk = (11 - (sum % 11)) % 10;
        if (parseInt(achk) == bchk) {
            return 0;
        }
        return 1;
    },
    checkEmail: function(obj) {
        var obj_length = obj.length;
        var regexp = /^[a-z][\w.-]+@\w[\w.-]+\.[\w.-]*[a-z][a-z]$/i;
        if (obj_length > 0) {
            if (!regexp.test(obj)) {
                return 0;
            }
        }
        return 1;
    },
    isNumber: function(str) {
        return UT.isNumber(str);
    },
    stripComma: function(str) {
        if (str == null) return "";
        var str_num = str.replace(",", "");
        return str_num;
    },

    getInstance: function () {
        return StringUtil;
    },

    checknull: function(str) {
        if (str == "undefined" || str == null || StringUtil.trim(str) == "null" || StringUtil.trim(str) == "") return true;
        else return false;
    },

    getLastDay: function(day) {
        var lastDay = new Date(day);
        lastDay.setMonth(lastDay.getMonth() + 1, 0);
        return ("" + lastDay.getDate());
    },

    isNullTrim: function(str) {
        if (StringUtil.checknull(str) == true) return true;
        return StringUtil.checknull(StringUtil.trim(str));
    },

    /*********************************
     *  emro.lib.util.StringUtil
     ********************************/

    /**
     * 지원하지 않음
     */
    commaString: function () {},
    getByteLength_o: function () {},
    replacereplace: function () {},
    getByteLength: function () {},
    pad: function () {},
};

var ObjectUtil = {
    copy: function (value) {
        UT.copy(value);
    },
    /**
     *  Returns <code>true</code> if the object reference specified
     *  is a simple data type. The simple data types include the following:
     *  <ul>
     *    <li><code>String</code></li>
     *    <li><code>Number</code></li>
     *    <li><code>uint</code></li>
     *    <li><code>int</code></li>
     *    <li><code>Boolean</code></li>
     *    <li><code>Date</code></li>
     *    <li><code>Array</code></li>
     *  </ul>
     *
     *  @param value Object inspected.
     *
     *  @return <code>true</code> if the object specified
     *  is one of the types above; <code>false</code> otherwise.
     */
    isSimple: function(value) {
        var type = typeof(value);
        switch (type) {
            case "number":
            case "string":
            case "boolean":
            {
                return true;
            };
            case "object":
            {
                return (value instanceof Date) || (value instanceof Array);
            };
        }
        return false;
    },
    /**
     *  Compares two numeric values.
     *
     *  @param a First number.
     *
     *  @param b Second number.
     *
     *  @return 0 is both numbers are NaN.
     *  1 if only <code>a</code> is a NaN.
     *  -1 if only <code>b</code> is a NaN.
     *  -1 if <code>a</code> is less than <code>b</code>.
     *  1 if <code>a</code> is greater than <code>b</code>.
     */
    numericCompare: function(a, b) {
        if (isNaN(a) && isNaN(b)) return 0;
        if (isNaN(a)) return 1;
        if (isNaN(b)) return -1;
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    },
    /**
     *  Compares two String values.
     *
     *  @param a First String value.
     *
     *  @param b Second String value.
     *
     *  @param caseInsensitive Specifies to perform a case insensitive compare,
     *  <code>true</code>, or not, <code>false</code>.
     *
     *  @return 0 is both Strings are null.
     *  1 if only <code>a</code> is null.
     *  -1 if only <code>b</code> is null.
     *  -1 if <code>a</code> precedes <code>b</code>.
     *  1 if <code>b</code> precedes <code>a</code>.
     */
    stringCompare: function(a, b, caseInsensitive) {
        caseInsensitive = false || caseInsensitive;
        if (a == null && b == null) return 0;
        if (a == null) return 1;
        if (b == null) return -1;
        if (caseInsensitive) {
            a = a.toLocaleLowerCase();
            b = b.toLocaleLowerCase();
        }
        var result = a.localeCompare(b);
        if (result < -1) result = -1;
        else if (result > 1) result = 1;;
        return result;
    },
    /**
     *  Compares the two Date objects and returns an integer value
     *  indicating if the first Date object is before, equal to,
     *  or after the second item.
     *
     *  @param a Date object.
     *
     *  @param b Date object.
     *
     *  @return 0 if <code>a</code> and <code>b</code>
     *  are <code>null</code> or equal;
     *  1 if <code>a</code> is <code>null</code>
     *  or before <code>b</code>;
     *  -1 if <code>b</code> is <code>null</code>
     *  or before <code>a</code>.
     */
    dateCompare: function(a, b) {
        if (a == null && b == null) return 0;
        if (a == null) return 1;
        if (b == null) return -1;
        var na = a.getTime();
        var nb = b.getTime();
        if (na < nb) return -1;
        if (na > nb) return 1;
        return 0;
    },

    /** 미제공 Dummy Function **/
    compare: function() {},
    toString: function() {},
    getClassInfo: function() {},
    hasMetadata: function() {},
    isDynamicObject: function() {}
};