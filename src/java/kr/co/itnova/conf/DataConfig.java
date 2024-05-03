package kr.co.itnova.conf;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.OutputStreamWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import emro.util.CalendarUtil;
import emro.util.StringUtil;
import eswf.exception.FoundationException;
import eswf.jdbc.JdbcAgency;

public class DataConfig implements Config {

	private static final String VERSION = "1110.11";
	
	private Map<String, String> result;
	private Map<String, Object> param;
	private JdbcAgency jdbc;
	
	private String comeCode;
	private String tableId;
	private String degr;
	private String queryId;
	
	private String actionId;
	private int rowIndex;
	
	private String colsStr;
	private String dataStr;
	private String selectStr;
	private String valStr;
	private String updStr;
	private String joinStr;
	private String whereStr;

	public DataConfig() throws FoundationException {
		
		this.jdbc = new JdbcAgency();
	
		this.colsStr = "";
		this.dataStr = "";
		this.valStr = "";
		this.updStr = "";
		this.joinStr = "";
		this.whereStr = "";
		
		this.rowIndex = -1;
		
		this.result = new HashMap<>();
		this.result.put("code", "Y");
		this.result.put("message", "OK::" + this.getClass().getSimpleName() + ":" + VERSION);
	}
	
	@Override
	public Map<String, String> check(Map<String, Object> param) throws FoundationException {
		this.param = param;
		System.out.println(this.param);
		this.comeCode = (String) param.get("mtcd_come_code");
		this.tableId = (String) param.get("comd_tabl_id");
		this.degr = (String) param.get("mtcd_stnd_degr");
		this.queryId = "bp/tcams/ca/" + comeCode + "/" + tableId + "/" + degr;
		this.actionId = (String) this.param.get("action_id");
		
		if(this.param.get("row_index") != null) {
			this.rowIndex = (Integer) this.param.get("row_index");
		}
		
		setColsStr();
		setDataStr();
		setSelectStr();
		setWhereStr();
		
		if("crt".equals(this.actionId)) {
			createSrcFile();
		} else {
			chk();
		}
		
		result.put("crt_date", CalendarUtil.formatNow("yyyyMMdd HH:mm:ss"));
		
		return result;
	}


	private void setSelectStr() {
		String sel_str =   "SELECT CASE                                                   ";               
	    sel_str    += "\n        WHEN B.XXXX_CORP_CODE IS NULL THEN 'I'             ";
	    sel_str    += "\n        WHEN A.XXXX_UPDT_DATE > B.XXXX_UPDT_DATE THEN 'U'  ";
	    sel_str    += "\n       END MG_MODE                                         ";
	    sel_str    += "\n      ,A.*                                                 ";
	    sel_str    += "\n  FROM T1 A                                                ";
	    sel_str    += "\n      LEFT OUTER JOIN                                      ";
	    sel_str    += "\n       CATBXXXX B                                          ";
	    
	    selectStr = StringUtil.replace(sel_str, new String[] { "XXXX" }, new  String[] { tableId.substring(4)});
	    selectStr += "\n" + joinStr;
	}

	private void setDataStr() {
		String sqlStr = "";
		List<?> items = (List<?>) param.get("items");
		for(int i = 0 ; i < items.size() ; i++) {
			if(i > 0)
				sqlStr += "\n";
			Map<?, ?> str = (Map<?, ?>)items.get(i);
			sqlStr += str.get("row_str");
		}
		dataStr = sqlStr;
	}

	private void setWhereStr() throws FoundationException {
        String pkStr = "";
		String queryId = "bp/tcams/common/PKCL";
		
		param.put("pkcl_tabl_id", tableId);
		
		List<?> pkList = jdbc.executeQueryList(queryId, "PK", param);

		for(int i = 0 ; i < pkList.size() ; i++) {
			if(i == 0) {
				pkStr +=   "     ";
			} else {
				pkStr += "\n    ,";
			}
			Map<?, ?> str = (Map<?, ?>)pkList.get(i);
			pkStr += str.get("column_name");
		}
		if(!pkStr.isEmpty()) {
			whereStr = pkStr;
		}
	}
	
	private void setColsStr() throws FoundationException {
		String queryId = "bp/tcams/common/"+ tableId;
		List<?> pkcls = jdbc.executeQueryList(queryId, "select", null);
		int idxUpdCol = 0;
		for(int i = 0 ; i < pkcls.size() ; i++) {
			Map<?, ?> pkcl = (Map<?, ?>)pkcls.get(i);
			String colmId = (String) pkcl.get("pkcl_colm_id");
			String updtCman = (String) pkcl.get("pkcl_updt_cman");
			if(i == 0) {
				colsStr += "  ";
				valStr += "  ";
				if("SYSTEMPK".equals(updtCman)) {
					whereStr += " WHERE ";
					joinStr += "      ON    " ;
				}
			} else {
				colsStr += "\n ,";
				valStr += "\n ,";
				if("SYSTEMPK".equals(updtCman)) {
					whereStr += "\n   AND ";
					joinStr += "\n        AND ";
				} else {
					if(idxUpdCol++ == 0) {
						updStr += "   SET ";
					} else {
						if( colmId.indexOf("INIT") < 0) {
							updStr += "\n      ,";
						}
					}
				}
			}
			colsStr += colmId;
			valStr += "#" + colmId.toLowerCase() + "#";
			if("SYSTEMPK".equals(updtCman)) {
				whereStr += colmId + " = " + "#" + colmId.toLowerCase() + "#";
				joinStr += "B." + colmId + " = " + "A." + colmId;
			} else {
				if( colmId.indexOf("INIT") < 0) {
					updStr += colmId + " = " + "#" + colmId.toLowerCase() + "#";
				}
			}
		}
	}

	private void chk() throws FoundationException {
		
		try {
			List<?> dataList = jdbc.executeQueryList(queryId, "select", null);
			
			int cntChk = 0;
			int cntAdd = 0;
			int cntUpd = 0;
			
			for(int i = 0 ; i < dataList.size() ; i++) {
				cntChk++;
				Map<?, ?> data = (Map<?, ?>)dataList.get(i);
				if("I".equals(data.get("mg_mode"))) {
					cntAdd += jdbc.executeUpdate(queryId, "insert", data);
				} else if("U".equals(data.get("mg_mode"))) {
					cntUpd += jdbc.executeUpdate(queryId, "update", data);
				}
			}
			
			result.put("code", "Y");
			result.put("message", comeCode + "." + tableId + " CHK" + cntChk + ",ADD" + cntAdd + ",UPD" + cntUpd);
		} catch(Exception ex) {
			ex.printStackTrace();
			result.put("code", "N");
			result.put("message", ex.getMessage());
		}
	}

	private void createSrcFile() {
		System.out.println(param.get("items"));
		String msg = "";
		
		try {
			File file = new File("C:/workspace1/TCAMS/src/volcano-conf/sqls/tcams/sql-bp-tcams-ca-XXXX-XXXXXXXX-XX.xml");
			BufferedReader br = new BufferedReader(new FileReader(file));
			
			String line;
			String xmlStr = "";
			int cnt = 0;
			while((line = br.readLine()) != null) {
				if(cnt++ > 0) {
					xmlStr += "\n";
				}
				xmlStr += StringUtil.replace(line
						     ,new String[] {
						         "#COME#",
						         "#TABL#", 
						         "#DEGR#", 
						         "#COLS_STR#", 
						         "#DATA_STR#",
						         "#SELECT_STR#",
						         "#VAL_STR#",
						         "#UPD_STR#",
						         "#WHERE_STR#"
						      }
			                 ,new String[] {
						         comeCode,
						         tableId, 
						         degr, 
						         colsStr, 
						         dataStr,
						         selectStr,
						         valStr,
						         updStr,
						         whereStr
						      });
			}
			br.close();
			
			System.out.println(xmlStr);
			
			String xmlFileName = "C:/workspace1/TCAMS/src/volcano-conf/sqls/tcams/sql-bp-tcams-ca-";
			xmlFileName += comeCode + "-" + tableId + "-" + degr  + ".xml";
					
			File xmlFile = new File(xmlFileName);
			if(xmlFile.createNewFile()) {
				msg += "Created: " + xmlFileName;
				BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(xmlFile.getPath()), "UTF-8"));
				bw.write(xmlStr);
				bw.close();
			} else {
				msg += "Exists: " + xmlFileName;
				if(rowIndex >= 9) {
					msg += "\nOVERWRITE:" + xmlFileName;
					BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(xmlFile.getPath()), "UTF-8"));
					bw.write(xmlStr);
					bw.close();
				}
			}
			
			result.put("code", "D");
			result.put("message", msg);
		} catch(Exception ex) {
			ex.printStackTrace();
			result.put("code", "N");
			result.put("message", ex.getMessage());
		}
	}

}
