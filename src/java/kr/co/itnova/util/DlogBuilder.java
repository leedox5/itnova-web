package kr.co.itnova.util;

public class DlogBuilder {
	private Integer id;
	private String dlogKey;
	private String conts;
	private String initCman;
	private String initDate;
	
	public DlogBuilder setId(Integer id) {
		this.id = id;
		return this;
	}
	
	public DlogBuilder setDlogKey(String dlogKey) {
		this.dlogKey = dlogKey;
		return this;
	}
	
	public DlogBuilder setConts(String conts) {
		this.conts = conts;
		return this;
	}
	
	public DlogBuilder setInitCman(String initCman) {
		this.initCman = initCman;
		return this;
	}
	
	public DlogBuilder setInitDate(String initDate) {
		this.initDate = initDate;
		return this;
	}
	
	public Dlog build() {
		Dlog dlog = new Dlog(id, dlogKey, conts, initCman, initDate);
		return dlog;
	}
}
