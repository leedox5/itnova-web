package kr.co.itnova.util;

import eswf.dataobject.Map;
import eswf.exception.FoundationException;
import eswf.jdbc.JdbcAgency;

public class DlogDao {

	private JdbcAgency jdbc;
	
	public DlogDao(JdbcAgency jdbc) throws FoundationException {
		this.jdbc = jdbc;
	}

	public Dlog save(Dlog dlog) throws FoundationException {
		Map param = new Map();
		param.put("table_id", dlog.getDlogKey());
		jdbc.executeUpdate("bp/tcams/common/DLOG", "insert", param);
		return dlog;
	}

	public int save(java.util.Map<String, String> log) throws FoundationException {
		return jdbc.executeUpdate("bp/tcams/common/DLOG", "insert", log);
	}

}
