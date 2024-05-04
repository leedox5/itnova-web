class Msg {
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
    
    showMsgOnGrid = () => {
        var provider = this.grid.getDataProvider();
    	
    	provider.addItemAt(0, {
    		crt_date: this.result.crt_date,
    		code: this.result.code,
    		message: this.result.message,
    	}); 
    }
    
    showAlert = () => {
    	this.alert(this.result.message);
    }
    
    showMESG = () => {
    	this.alert(this.result.MESG);
    }
}


