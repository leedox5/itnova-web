package kr.co.itnova.conf;

import java.util.List;
import java.util.Map;

import eswf.exception.FoundationException;

public interface BaseDao {
	public List<?> getList(String queryId, String sqlId) throws FoundationException;
	public int save(String queryId, String sqlId, Map<?, ?> map) throws FoundationException; 
	public int update(String queryId, String sqlId, Map<?, ?> map) throws FoundationException;
}
