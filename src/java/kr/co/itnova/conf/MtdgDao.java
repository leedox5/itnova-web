package kr.co.itnova.conf;

import java.util.List;
import java.util.Map;

import eswf.exception.FoundationException;
import eswf.jdbc.JdbcAgency;

public class MtdgDao extends BaseDaoImpl {

	public MtdgDao(JdbcAgency jdbc) {
		super(jdbc);
	}

	public List<?> getProcSrc(Map<?, ?> param) throws FoundationException {
        String queryId = "bp/tcams/common";
		return jdbc.executeQueryList(queryId, "proc.src", param);
	}

}
