package kr.leedox;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.Test;
import org.junit.runner.RunWith;

import junitparams.JUnitParamsRunner;
import junitparams.Parameters;

@RunWith(JUnitParamsRunner.class)
public class ScriptHelperTest {
    @Test
    @Parameters({ "GUIDE, Script", "CREATE, CREATE", "COLS, WITH" })
    public void scrptFromXmlTest(String id, String expected) {
        String script = ScriptHelper.getFromXml("CITBPKCL", id);
        assertThat(script).startsWith(expected);
    }

    @Test
    public void getPkgtScriptTest() {
        String src = ScriptHelper.getPkgtScript("TERM", "CATBTERT", "16-4", "select");
        System.out.println(src);
    }
}
