package kr.co.itnova.conf;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import emro.util.CalendarUtil;
import eswf.exception.FoundationException;
import eswf.jdbc.JdbcAgency;

public class Pkms implements Config {

	BaseServiceImpl pkmsService;
	Map<String, String> result;
	Map<?, ?>	param;

	public Pkms() throws FoundationException {
		JdbcAgency jdbc = new JdbcAgency();
		this.pkmsService = new PkmsService(jdbc);
		this.result = new HashMap<>();
	}

	@Override
	public Map<String, String> check(Map<String, Object> param) throws FoundationException {
		this.param = param;

		String action = (String) this.param.get("action_id");
		if("create".equals(action)) {
			createTable();
		} else {
			chk();
		}
		return result;
	}

	private void chk() {
		String comeCode = (String) param.get("comd_come_code");
        String queryId = "bp/tcams/ca/" + comeCode + "/PKMS" ;

		try {
			List<?> pkmsList = pkmsService.getList(queryId, "select");

			String stat = "";
			for(int i = 0 ; i < pkmsList.size() ; i++) {
				Map<?, ?> pkms = (Map<?, ?>)pkmsList.get(i);
				if(i > 0) {
					stat += "\n";
				}
				stat += pkms.get("pkms_tabl_id") + " CHK";
				if("I".equals(pkms.get("mg_mode"))) {
					pkmsService.save(queryId, "insert", pkms);
					stat += " ADD";
				} else if("U".equals(pkms.get("mg_mocde"))) {
					pkmsService.update(queryId, "update", pkms);
					stat += " UPD";
				}
			}
			result.put("code", "Y");
			result.put("message", stat);
			result.put("crt_date", CalendarUtil.formatNow("yyyyMMdd HH:mm:ss"));
		} catch(Exception ex) {
			ex.printStackTrace();
			result.put("code", "N");
			result.put("message", ex.getMessage());
		}
	}

	private void createTable() {
		try {
			pkmsService.create(param);

			result.put("code", "Y");
			result.put("message", "OK");
			result.put("crt_date", CalendarUtil.formatNow("yyyyMMdd HH:mm:ss"));
		} catch(Exception ex) {
			ex.printStackTrace();
			result.put("code", "N");
			result.put("message", ex.getMessage());
		}
	}
}
