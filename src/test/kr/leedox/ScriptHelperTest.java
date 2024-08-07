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
        String script = ScriptHelper.getFromXml(id);
        assertThat(script).startsWith(expected);
    }
}
