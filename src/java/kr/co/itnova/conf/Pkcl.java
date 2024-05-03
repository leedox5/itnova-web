package kr.co.itnova.conf;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.OutputStreamWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import emro.util.CalendarUtil;
import emro.util.StringUtil;
import eswf.exception.FoundationException;
import eswf.jdbc.JdbcAgency;

public class Pkcl implements Config {

    PkclService pkclService;
    Map<String, String> result;
    Map<?, ?> param;

    public Pkcl() throws FoundationException {
        JdbcAgency jdbc = new JdbcAgency();
        this.pkclService = new PkclService(jdbc);
        this.result = new HashMap<>();
    }

    @Override
    public Map<String, String> check(Map<String, Object> param) throws FoundationException {
        this.param = param;
        String action_id = (String) this.param.get("action_id");

        if("src".equals(action_id)) {
            createSrc();
        } else if("crt".equals(action_id)) {
            createCrtSrc();
        } else if("type".equals(action_id)) {
            alterColumn();
        } else {
            chk();
        }

        result.put("crt_date", CalendarUtil.formatNow("yyyyMMdd HH:mm:ss"));

        return result;
    }

    private void alterColumn() throws FoundationException {
        List<?> items = (List<?>) param.get("items");

        for( int i = 0 ; i < items.size() ; i++) {
            Map<?, ?> item = (Map<?, ?>)items.get(i);
            System.out.println(item);

            String tablId = (String) item.get("comd_tabl_id");
            String queryId = "bp/tcams/common/" + tablId;
            String sqlId = "ALTER";

            pkclService.update(queryId, sqlId, item);

            chk();
        }
    }

    private void createCrtSrc() {
        String msg = "";

        try {
            String pkclStr = getPkclStr();
            String sqlStr = getSqlStr("crt_str");
            String pkStr = getPkStr();

            File file = new File("C:/workspace1/TCAMS/src/volcano-conf/sqls/tcams/sql-bp-tcams-common-XXXXXXXX.xml");
            BufferedReader br = new BufferedReader(new FileReader(file));

            String line;
            String xmlStr = "";
            int cnt = 0;
            while((line = br.readLine()) != null) {
                if(cnt++ > 0) {
                    xmlStr += "\n";
                }
                xmlStr += StringUtil.replace(line, new String[] { "XXXXXXXX", "#PKCL_STR#", "#COLS_STR#", "#PK_STR#" }, new String[] { (String) param.get("pkcl_tabl_id"), pkclStr, sqlStr, pkStr });
            }
            br.close();

            System.out.println(xmlStr);

            String xmlFileName = "C:/workspace1/TCAMS/src/volcano-conf/sqls/tcams/sql-bp-tcams-common-";
            xmlFileName += param.get("pkcl_tabl_id") + ".xml";

            File xmlFile = new File(xmlFileName);
            if(xmlFile.createNewFile()) {
                msg += "Created: " + xmlFileName;
                BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(xmlFile.getPath()), "UTF-8"));
                bw.write(xmlStr);
                bw.close();
            } else {
                msg += "Exists: " + xmlFileName;
                String keep = getDispAllw();
                msg += "\nKEEP_YN : " + keep;
                if("N".equals(keep)) {
                    msg += "\nOVERWRITE:" + xmlFileName;
                    BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(xmlFile.getPath()), "UTF-8"));
                    bw.write(xmlStr);
                    bw.close();
                }
            }

            result.put("code", "D");
            result.put("message", msg);
        } catch(Exception ex) {
            ex.printStackTrace();
            result.put("code", "N");
            result.put("message", ex.getMessage());
        }
    }

    private String getPkStr() throws FoundationException {
        String pkStr = "";
        String queryId = "bp/tcams/common/PKCL";

        List<?> pkList = pkclService.getList(queryId, "PK", param);

        for(int i = 0 ; i < pkList.size() ; i++) {
            if(i == 0) {
                pkStr +=   "     ";
            } else {
                pkStr += "\n    ,";
            }
            Map<?, ?> str = (Map<?, ?>)pkList.get(i);
            pkStr += str.get("column_name");
        }
        return pkStr;
    }

    private void createSrc() {
        String msg = "";

        try {
            String sqlStr = getSqlStr("pkcl_str");

            File file = new File("C:/workspace1/TCAMS/src/volcano-conf/sqls/tcams/sql-bp-tcams-ca-conf-PKCL-XXXXXXXX.xml");
            BufferedReader br = new BufferedReader(new FileReader(file));

            String line;
            String xmlStr = "";
            int cnt = 0;
            while((line = br.readLine()) != null) {
                if(cnt++ > 0) {
                    xmlStr += "\n";
                }
                xmlStr += StringUtil.replace(line, new String[] { "XXXXXXXX", "#PKCL_STR#" }, new String[] { (String) param.get("pkcl_tabl_id"), sqlStr });
            }
            br.close();

            String xmlFileName = "C:/workspace1/TCAMS/src/volcano-conf/sqls/tcams/sql-bp-tcams-ca-conf-PKCL-";
            xmlFileName += param.get("pkcl_tabl_id") + ".xml";

            File xmlFile = new File(xmlFileName);
            if(xmlFile.createNewFile()) {
                msg += "Created: " + xmlFileName;
                BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(xmlFile.getPath()), "UTF-8"));
                bw.write(xmlStr);
                bw.close();
            } else {
                msg += "Exists: " + xmlFileName;
                String keep = getDispAllw();
                msg += ":KEEP==>" + keep;
            }

            result.put("code", "D");
            result.put("message", msg);
        } catch(Exception ex) {
            ex.printStackTrace();
            result.put("code", "N");
            result.put("message", ex.getMessage());
        }
    }

    private String getDispAllw() {
        List<?> items = (List<?>) param.get("items");
        Map<?, ?> item = (Map<?, ?>)items.get(0);
        return (String) item.get("comd_disp_allw");
    }

    private String getSqlStr(String key) {
        String sqlStr = "";
        List<?> pkclList = (List<?>) param.get("items");
        for(int i = 0 ; i < pkclList.size() ; i++) {
            if(i > 0)
                sqlStr += "\n";
            Map<?, ?> str = (Map<?, ?>)pkclList.get(i);
            sqlStr += str.get(key);
        }
        return sqlStr;
    }

    private String getPkclStr() throws FoundationException {
        String sqlStr = "";
        List<?> pkclList = (List<?>) param.get("items");
        List<?> dicts = pkclService.getList("bp/tcams/common/PKCL", "CHK.DICT");

        for(int i = 0 ; i < pkclList.size() ; i++) {
            Map<?, ?> map = (Map<?, ?>)pkclList.get(i);
            String pkclStr = (String) map.get("pkcl_str");
            String type = (String) map.get("comd_data_type");
            String updtDate = (String) map.get("comd_updt_date");

            if(i > 0)
                sqlStr += "\n";

            pkclStr = chkDict(map, dicts);

            if("VARCHAR2".equals(type)) {
                pkclStr = StringUtil.replace(pkclStr, new String[] {type, updtDate}, new String[] {"VARCHAR", CalendarUtil.formatNow("yyyyMMdd HH:mm:ss")});
                if(pkclStr.indexOf("'SYSTEMPG'") < 0) {
                    pkclStr = pkclStr.replaceFirst("'SYSTEM'", "'SYSTEMPG'");
                }
                sqlStr += pkclStr;
            } else {
                sqlStr += pkclStr;
            }
        }

        return sqlStr;
    }


    private String chkDict(Map<?, ?> map, List<?> dicts) throws FoundationException {
        String pkclStr = (String) map.get("pkcl_str");

        String key = ((String) map.get("comd_colm_id")).substring(5);
        String colmAlgn = (String) map.get("comd_colm_algn");
        String updtDate = (String) map.get("comd_updt_date");
        String withScrn = (String) map.get("comd_with_scrn");

        boolean chk = true;
        for(int i = 0 ; i < dicts.size() ; i++) {
            chk = true;
            Map<?, ?> dict = (Map<?, ?>)dicts.get(i);
            if(key.equals(dict.get("c1"))) {
                System.out.println(dict);
                if(!colmAlgn.equals(dict.get("c5"))) {
                    chk = false;
                }
                if(!withScrn.equals(dict.get("c6"))) {
                    chk = false;
                }
            }
            if(!chk) {
                System.out.println("1" + pkclStr);
                pkclStr = StringUtil.replace(pkclStr
                        ,new String[] {",'" + colmAlgn + "'", ",'" + withScrn + "'", updtDate}
                        ,new String[] {",'" + (String) dict.get("c5") + "'", ",'" + (String) dict.get("c6") + "'", CalendarUtil.formatNow("yyyyMMdd HH:mm:ss")});
                System.out.println("2" + pkclStr);
                if(pkclStr.indexOf("SYSTEMPG") < 0) {
                    pkclStr = pkclStr.replaceFirst("'SYSTEM'", "'SYSTEMPG'");
                    System.out.println("3" + pkclStr);
                }
            }
        }

        return pkclStr;
    }

    private void chk() {
        String comeCode = (String) param.get("pkcl_come_code");
        String tablId = (String) param.get("pkcl_tabl_id");
        String queryId = "bp/tcams/common/" + tablId;
        try {
            List<?> pkclList = pkclService.getList(queryId, "select");

            int cntChk = 0;
            int cntAdd = 0;
            int cntUpd = 0;

            for(int i = 0 ; i < pkclList.size() ; i++) {
                cntChk++;
                Map<?, ?> pkcl = (Map<?, ?>)pkclList.get(i);
                if("I".equals(pkcl.get("mg_mode"))) {
                    pkclService.save("bp/tcams/common/PKCL", "insert", pkcl);
                    cntAdd++;
                } else if("U".equals(pkcl.get("mg_mode"))) {
                    pkclService.update("bp/tcams/common/PKCL", "update", pkcl);
                    cntUpd++;
                }
            }

            result.put("code", "Y");
            result.put("message", comeCode + "." + "PKCL" + "." + tablId + " CHK" + cntChk + ",ADD" + cntAdd + ",UPD" + cntUpd);
        } catch(Exception ex) {
            ex.printStackTrace();
            result.put("code", "N");
            result.put("message", ex.getMessage());
        }
    }
}
