package kr.leedox;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.Test;
import org.junit.runner.RunWith;

import junitparams.JUnitParamsRunner;
import junitparams.Parameters;

@RunWith(JUnitParamsRunner.class)
public class UtilTest {
    @Test
    @Parameters({ "A, 4, AAAA", "B, 5, BBBBB" })
    public void repeatTest(String s, int c, String r) {
        assertThat(Util.repeat(s, c)).isEqualTo(r);
    }
}
