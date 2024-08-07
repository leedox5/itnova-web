package kr.leedox;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class Pkcl {
    private PkclPK pkclPK;
    private int pkclSortNumb;
    private String pkclColmAlgn;
    private int pkclWithScrn;
    private String pkclUpdtDate;
    private String pkclUpdtCman;
}
