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

// A factory function is a function that returns a new object.
const createMsg = (data, parentId) => {
	const element = document.createElement("div");
	element.innerHTML = data.result.message;
	document.getElementById(parentId).appendChild(element);
	
	return {
		data,
		updateContent(newContent) {
			element.innerHTML = newContent;
		}
	}
}

