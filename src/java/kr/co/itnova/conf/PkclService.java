package kr.co.itnova.conf;

import eswf.jdbc.JdbcAgency;

public class PkclService extends BaseServiceImpl {

	public PkclService(JdbcAgency jdbc) {
		this.dao = new PkclDao(jdbc);
	}
}
