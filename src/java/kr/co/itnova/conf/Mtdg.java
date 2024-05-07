package kr.co.itnova.conf;

public class Mtdg {

	private String degr;
	
	public Mtdg(String degr) {
		this.setDegr(degr);
	}

	public int getDegrNum() {
		int num = 0;
		int[] pos = {10, 1};
		int idx = 0;
		
		String[] degrStr = degr.split("-");
		for(String str : degrStr) {
			num += Integer.parseInt(str) * pos[idx++] ;
		}
		
		return num;
	}

	public String getDegr() {
		return degr;
	}

	public void setDegr(String degr) {
		this.degr = degr;
	}

}
