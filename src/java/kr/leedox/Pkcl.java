package kr.leedox;

public class Pkcl {
    private PkclPK pkclPK;

    private int pkclSortNumb;
    private String pkclColmAlgn;
    private int pkclWithScrn;
    private String pkclUpdtDate;

    public Pkcl() {
        super();
    }

    public PkclPK getPkclPK() {
        return pkclPK;
    }

    public void setPkclPK(PkclPK pkclPK) {
        this.pkclPK = pkclPK;
    }

    public int getPkclWithScrn() {
        return pkclWithScrn;
    }

    public void setPkclWithScrn(int pkclWithScrn) {
        this.pkclWithScrn = pkclWithScrn;
    }

    public String getPkclColmAlgn() {
        return pkclColmAlgn;
    }

    public void setPkclColmAlgn(String pkclColmAlgn) {
        this.pkclColmAlgn = pkclColmAlgn;
    }

    public String getPkclUpdtDate() {
        return pkclUpdtDate;
    }

    public void setPkclUpdtDate(String pkclUpdtDate) {
        this.pkclUpdtDate = pkclUpdtDate;
    }

    public int getPkclSortNumb() {
        return pkclSortNumb;
    }

    public void setPkclSortNumb(int pkclSortNumb) {
        this.pkclSortNumb = pkclSortNumb;
    }

}
