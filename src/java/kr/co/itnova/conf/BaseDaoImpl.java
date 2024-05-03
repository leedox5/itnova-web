package kr.co.itnova.conf;

import java.util.List;
import java.util.Map;

import eswf.exception.FoundationException;
import eswf.jdbc.JdbcAgency;

public class BaseDaoImpl implements BaseDao {
	
	protected JdbcAgency jdbc;

	public BaseDaoImpl(JdbcAgency jdbc) {
		super();
		this.jdbc = jdbc;
	}

	public List<?> getList(String queryId, String sqlId) throws FoundationException {
		return jdbc.executeQueryList(queryId, sqlId, null);
	}
	
	public List<?> getList(String queryId, String sqlId, Map<?, ?> param) throws FoundationException {
		return jdbc.executeQueryList(queryId, sqlId, param);
	}

	public int save(String queryId, String sqlId, Map<?, ?> map) throws FoundationException {
		return jdbc.executeUpdate(queryId, sqlId, map);
	}

	public int update(String queryId, String sqlId, Map<?, ?> map) throws FoundationException {
		return jdbc.executeUpdate(queryId, sqlId, map);
	}
}

