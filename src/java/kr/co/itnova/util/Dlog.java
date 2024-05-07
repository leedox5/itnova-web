package kr.co.itnova.util;

public class Dlog {
	private Integer id;
	private String dlogKey;
	private String conts;
	private String initCman;
	private String initDate;

	public Dlog(Integer id, String dlogKey, String conts, String initCman, String initDate) {
		super();
		this.id = id;
		this.dlogKey = dlogKey;
		this.conts = conts;
		this.setInitCman(initCman);
		this.setInitDate(initDate);
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getConts() {
		return conts;
	}
	public void setConts(String conts) {
		this.conts = conts;
	}
	public String getDlogKey() {
		return dlogKey;
	}
	public void setDlogKey(String dlogKey) {
		this.dlogKey = dlogKey;
	}
	public String getInitCman() {
		return initCman;
	}
	public void setInitCman(String initCman) {
		this.initCman = initCman;
	}
	public String getInitDate() {
		return initDate;
	}
	public void setInitDate(String initDate) {
		this.initDate = initDate;
	}
	
	
}
