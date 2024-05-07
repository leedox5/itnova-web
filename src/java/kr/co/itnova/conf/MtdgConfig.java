package kr.co.itnova.conf;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import kr.co.itnova.util.DlogService;
import emro.util.CalendarUtil;
import eswf.exception.FoundationException;
import eswf.jdbc.JdbcAgency;

public class MtdgConfig implements Config {

    DlogService dlogService;
    MtdgDao mtdgDao;

    @Override
    public Map<String, String> check(Map<String, Object> param) throws FoundationException {
        Map<String, String> result = new HashMap<>();
        try {
            JdbcAgency jdbc = new JdbcAgency();
            dlogService = new DlogService(jdbc);
            mtdgDao = new MtdgDao(jdbc);

            String come = ((String) param.get("comd_come_code")).toLowerCase();
            String meth = ((String) param.get("comd_meth_gubn")).toLowerCase();
            String queryId = "bp/tcams/c" + meth + "/" + come + "/MTDG" ;

            dlogService.save(come + "." + "MTDG", "START...", (String)param.get("usr_id"));

            List<?> mtdgList = mtdgDao.getList(queryId, "select");

            String stat = "";
            for(int i = 0 ; i < mtdgList.size() ; i++) {
                Map<?, ?> mtdg = (Map<?, ?>)mtdgList.get(i);
                stat = mtdg.get("mtdg_stnd_degr") + " CHK";
                if("I".equals(mtdg.get("mg_mode"))) {
                    mtdgDao.save("bp/tcams/ca/conf", "insert.MTDG", mtdg);
                    stat += " ADD";
                } else if("U".equals(mtdg.get("mg_mode"))) {
                    mtdgDao.update("bp/tcams/ca/conf", "update.MTDG", mtdg);
                    stat += " UPD";
                }
                dlogService.save(come + "." + "MTDG", stat, (String) param.get("usr_id"));
            }

            dlogService.save(come + "." + "MTDG", "FINISH...", (String) param.get("usr_id"));

            result.put("code", "Y");
            result.put("message", stat);
            result.put("crt_date", CalendarUtil.formatNow("yyyyMMdd HH:mm:ss"));
        } catch(Exception ex) {
            ex.printStackTrace();
            result.put("code", "N");
            result.put("message", ex.getMessage());
        }
        return result;
    }
}
