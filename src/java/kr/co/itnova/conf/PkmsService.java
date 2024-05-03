package kr.co.itnova.conf;

import eswf.jdbc.JdbcAgency;

public class PkmsService extends BaseServiceImpl {

	public PkmsService(JdbcAgency jdbc) {
		this.dao = new PkmsDao(jdbc);
	}
}
