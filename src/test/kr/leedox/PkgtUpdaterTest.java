package kr.leedox;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.Test;

public class PkgtUpdaterTest {

    @Test
    public void executeTest() {
        PkgtUpdater pkgtUpdater = new PkgtUpdater("TERM", "CATBTERT", "16-4");
        assertThat(pkgtUpdater.getCome()).isEqualTo("TERM");

        pkgtUpdater.chk();

        pkgtUpdater.execute();
    }

}
