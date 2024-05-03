const ci11 = {
    setConf: function(provider) {
  	    return new Promise((resolve, reject) => {
      	    UT.request(provider, (e, res) => {
          	  resolve(res.response);
            });
        });
    }
}	      

const gridUtil = {
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