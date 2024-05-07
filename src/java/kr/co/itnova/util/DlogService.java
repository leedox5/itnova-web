package kr.co.itnova.util;

import java.util.HashMap;
import java.util.Map;

import eswf.exception.FoundationException;
import eswf.jdbc.JdbcAgency;

public class DlogService {

	private DlogDao dlogDao;
	
	public DlogService(JdbcAgency jdbc) throws FoundationException {
		this.dlogDao = new DlogDao(jdbc);
	}

	public Dlog save(Dlog dlog) throws FoundationException {
		return dlogDao.save(dlog);
	}

	public int save(Map<String, String> log) throws FoundationException {
		return dlogDao.save(log);
	}
	
	public int save(String key, String conts, String userId) throws FoundationException {
		Map<String, String> log = new HashMap<>();
     	log.put("table_id",	key);
     	log.put("conts", conts);
     	log.put("crt_user", userId);
		return dlogDao.save(log);
	}
}
