package kr.co.itnova.conf;

import java.util.List;
import java.util.Map;

import eswf.exception.FoundationException;

public class BaseServiceImpl {

	protected BaseDaoImpl dao;

	public BaseServiceImpl() {
		super();
	}

	public List<?> getList(String queryId, String sqlId) throws FoundationException {
		return dao.getList(queryId, sqlId);
	}

	public List<?> getList(String queryId, String sqlId, Map<?, ?> param) throws FoundationException {
		return dao.getList(queryId, sqlId, param);
	}
	
	public int save(String queryId, String sqlId, Map<?, ?> map) throws FoundationException {
		return dao.save(queryId, sqlId, map);
	}

	public int update(String queryId, String sqlId, Map<?, ?> map) throws FoundationException {
		return dao.update(queryId, sqlId, map);
	}

	public void create(Map<?, ?> param) throws FoundationException {
		String queryId = "bp/tcams/common/" + param.get("comd_tabl_id");
		dao.update(queryId, "create", null);
	}

}