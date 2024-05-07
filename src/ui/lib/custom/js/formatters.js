//숫자관련 기본 포매터
var numberFormat = function(value,isRound) {
	//올림옵션 default round true
	var isRound = (typeof isRound === "boolean") ? isRound : true;
	if(isNaN(value) || SCUtil.isEmpty(value)) {
		return '';
	}
	if(isRound){
		return numeral(value).format(this.defaultFormat);
	}else{
		return numeral(value).format(this.defaultFormat,Math['floor']);
	}
};
//포매터 설정
var customFormatters = [
/*    {
    name : 'number',
    format : function(value) {
        return numberFormat.call(this, value);
    },
    defaultFormat : '0'
},
*/
{
    name : 'year',
    format : function(value) {
        if ((typeof value) === "undefined") {
            return "";
        }
        return numeral(value).format(this.defaultFormat);
    },
    defaultFormat : '0'
},
{
    name : 'number',
    format : function(value) {
        if(UT.isEmpty(value) || isNaN(value)){
            return "";
        }
        var bigNumber = new BigNumber((value) ? value.toString() : 0);
        return bigNumber.toFormat();
    },
    defaultFormat : ''
},{
    name : 'number2',
    format : function(value) {
        if(UT.isEmpty(value) || isNaN(value)){
            return "";
        }
        return numberFormat.call(this, value, false);
    },
    defaultFormat : '0,0'
},{
    name : 'zeroNumber',
    format : function(value) {
        if(UT.isEmpty(value) || isNaN(value)){
            return "";
        }
        var bigNumber = new BigNumber((value) ? value.toString() : 0);
        return bigNumber.toFormat();
    },
    defaultFormat : ''
},{
    name : 'amt',
    format : function(value) {
    	if(UT.isEmpty(value) || isNaN(value)){
    		return "";
    	}
    	//var bigNumber = new BigNumber(value || 0); //Uncaught Error: new BigNumber() number type has more than 15 significant digits
    	var bigNumber = new BigNumber((value) ? value.toString() : 0);
    	value = bigNumber.toFixed(2, BigNumber.ROUND_DOWN);
    	return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    defaultFormat : '0,00.00'
}, {
    name : 'rate',
    format : function(value) {
    	return numberFormat.call(this, value);
    },
    defaultFormat : '0.00'
}, {
	name : 'rate2',
	format : function(value){
		return numberFormat.call(this, value);
	},
	defaultFormat : '0,0.0'
},{
	name : 'rate3',
	format : function(value){
		return numberFormat.call(this, value);
	},
	defaultFormat : '0.000'
},{
    name : 'qty',
    format : function(value) {
    	return numberFormat.call(this, value);
    },
    defaultFormat : '0,0.000'
},{
    name : 'score',
    format : function(value){
    	return numberFormat.call(this, value);
    },
    defalutFormat : '0'
},{
	name : 'scoreDecimal',
    format : function(value){
        return numberFormat.call(this, value);
    },
    defalutFormat : '0.0000'
},{
    name: 'decimal',
    format: function(value){
    	return numberFormat.call(this, value);
    },
    defaultFormat : '0,0.00'
},{
    name: 'decimal2',
    format: function(value){
        return numberFormat.call(this, value);
    },
    defaultFormat : '0,0.0'
},{
    name: 'percent',
    format: function(value){
    	var val = numberFormat.call(this, value);
    	val += val ? ' %' : ''
    	return val;
    },
    defaultFormat: '0'
},{
    name: 'percent2',
    format: function(value){
    	var val = numberFormat.call(this, value);
    	val += val ? ' %' : ''
    	return val;
    },
    defaultFormat: '0,0.0'
},{
    name: 'percentDecimal',
    format: function(value){
    	var val = numberFormat.call(this, value);
    	val += val ? ' %' : ''
    	return val;
    },
    defaultFormat: '0,0.00'
},{
    name : 'integer',
    format : function(value) {
    	return numberFormat.call(this, value);
    },
    defaultFormat : '0,0'
},{
    name: 'date',
    format: function(value) {
        if ((typeof value) === "undefined") {
            return "";
        }
        var d = moment(value, "YYYYMMDD").toDate();
        return moment(d).format(this.defaultFormat);
    },
    defaultFormat : 'YYYY/MM/DD'
},{
	name : 'datetime',
	format : function(value){
		return moment(value).format(this.defaultFormat);
	},
	defaultFormat : 'YYYY/MM/DD HH:mm:ss'
},{
	name : 'decimalprecision1',
	format : function(value) {
		return numberFormat.call(this, value);
	},
	defaultFormat : '0,0.0'
},{
	name : 'decimalprecision2',
	format : function(value) {
		return numberFormat.call(this, value);
	},
	defaultFormat : '0,0.00'
},{
	name : 'decimalprecision2_1',
	format : function(value) {
		if(value == "0") {
			return "";
		}
		return numberFormat.call(this, value);
	},
	defaultFormat : '9,9.99'
},{
	name : 'decimalprecision3',
	format : function(value) {
		return numberFormat.call(this, value);
	},
	defaultFormat : '0,0.000'
},{
	name : 'decimalprecision4',
	format : function(value) {
		return numberFormat.call(this, value);
	},
	defaultFormat : '0,0.0000'
},{
	name : 'decimalprecision5',
	format : function(value) {
		return numberFormat.call(this, value);
	},
	defaultFormat : '0,0.00000'
},{
	name : 'decimalprecision6',
	format : function(value) {
		return numberFormat.call(this, value);
	},
	defaultFormat : '0,0.000000'
},{
	name : 'time',
	format : function(value){
		if ((typeof value) === "undefined") {
            return "";
        }
		var hh = value.substr(0,2);
		var mm = value.substr(2,2);
		var ss = value.substr(4,2);
		
		var time = hh+":"+mm+":"+ss;
		return time;
	},
	defaultFormat : ''
},{
    name: 'string-datetime',
    format: function(value) {
        if ((typeof value) === "undefined") {
            return "";
        }
        var d = moment(value, "YYYYMMDDHHmmss").toDate();
        return moment(d).format(this.defaultFormat);
    },
    defaultFormat : 'YYYY/MM/DD HH:mm:ss'
},{
    name: 'string-yyyymm',
    format: function(value) {
        if ((typeof value) === "undefined") {
            return "";
        }
        var d = moment(value, "YYYYMM").toDate();
        return moment(d).format(this.defaultFormat);
    },
    defaultFormat : 'YYYY/MM'
},{
    name: 'string-yyyymmdd',
    format: function(value) {
        if ((typeof value) === "undefined") {
            return "";
        }
        var d = moment(value, "YYYYMMDD").toDate();
        return moment(d).format(this.defaultFormat);
    },
    defaultFormat : 'YYYY/MM/DD'
},{
    name: 'biz_no',
    format: function(value) {
        if ((typeof value) === "undefined") {
            return "";
        }
        if (UT.isNotEmpty(value) && value.length === 10) {
            return value.replace(/(\d{3})(\d{2})(\d{5})/g, "$1-$2-$3");
        } else {
            return value;
        }
    },
    defaultFormat: ''
},{
    name: 'corp_no',
    format: function(value) {
        if ((typeof value) === "undefined") {
            return "";
        }
        if (UT.isNotEmpty(value) && value.length === 13) {
            return value.replace(/(\d{6})(\d{7})/g, "$1-$2");
        } else {
            return value;
        }
    },
    defaultFormat: ''
},{
    name : 'usd_rate',
    format : function(value) {
    	return numberFormat.call(this, value);
    },
    defaultFormat : '0.0000'
},{
    name : 'KRW',
    format : function(value){
        return "₩"+numeral(value).format(this.defaultFormat);
    },
    defaultFormat : '0,0.00'
},{
    name : 'USD',
    format : function(value){
        return "$"+numeral(value).format(this.defaultFormat);
    },
    defaultFormat : '0,0.00'
},{
    name : 'AMD',
    format : function(value){
        return "€"+numeral(value).format(this.defaultFormat);
    },
    defaultFormat : '0,0.00'
},{
    name : 'CNY',
    format : function(value){
        return "¥"+numeral(value).format(this.defaultFormat);
    },
    defaultFormat : '0,0.00'
},{
    name : 'JPY',
    format : function(value){
        return "¥"+numeral(value).format(this.defaultFormat);
    },
    defaultFormat : '0,0.00'
},{
    name : 'usg',
    format : function(value){
        return numberFormat.call(this, value);
    },
    defaultFormat : '0,0.000000'
}, {
    name : 'amt2',
    format : function(value) {
        if(UT.isEmpty(value) || isNaN(value)){
            return "";
        }
        var bigNumber = new BigNumber((value) ? value.toString() : 0);
        value = bigNumber.toFixed(3);
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    defaultFormat : '0,00.000'
}, {
    name : 'amt3',
    format : function(value) {
        if(UT.isEmpty(value) || isNaN(value)){
            return "";
        }
        var bigNumber = new BigNumber((value) ? value.toString() : 0);
        value = bigNumber.toFixed(1);
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    defaultFormat : '0,00.0'
},{
    name : 'amt4',
    format : function(value) {
        return numberFormat.call(this, value)
    },
    defaultFormat : '0,00.0000'
},{
	name : 'amt6',
	format : function(value) {
		return numberFormat.call(this, value)
	},
	defaultFormat : '0,00.000000'
},{
	name : 'text',
    format : function(value) {
        return value;
    }
}
];
for(var i=0, item; item = customFormatters[i]; i++){
    SCFormatter.factory(item);
}
