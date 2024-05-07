package kr.co.itnova.conf;

import java.util.List;
import java.util.Map;

import eswf.exception.FoundationException;

public class MtdgService {

	private MtdgDao mtdgDao;
	
	public MtdgService(MtdgDao mtdgDao) {
		this.mtdgDao = mtdgDao;
	}

	public List<?> getProcSrc(Map<?, ?> param) throws FoundationException {
		return mtdgDao.getProcSrc(param);
	}

}
