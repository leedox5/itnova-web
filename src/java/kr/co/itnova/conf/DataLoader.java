package kr.co.itnova.conf;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;

import eswf.exception.FoundationException;
import eswf.jdbc.JdbcAgency;

public class DataLoader implements Chk {

    private JdbcAgency jdbc;

    public DataLoader() throws FoundationException {
        jdbc = new JdbcAgency();
    }

    @Override
    public void chk(HttpServletRequest req, HttpServletResponse res) throws JSONException, IOException, FoundationException {
        Map<String, Object> result = new HashMap<>();
        Map<String, String> message = new HashMap<>();

        String come = req.getParameter("come");
        String pkgt = req.getParameter("pkgt");
        String degr = req.getParameter("degr");

        try {
            if(null == come) {
                throw new Exception("Param [come] is required.");
            }
            if(null == pkgt) {
                throw new Exception("Param [pkgt] is required.");
            }
            if(null == degr) {
                throw new Exception("Param [degr] is required.");
            }

            // loading
            String descId = String.format("bp/tcams/ca/%s/%s/%s", come, pkgt, degr);
            message.put("desc", descId);

            List<?> rows = jdbc.executeQueryList(descId, "SELECT", null);

            int chked = 0;
            int added = 0;
            for(int i = 0 ; i < rows.size() ; i++) {
                Map<?, ?> row = (Map<?, ?>) rows.get(i);
                if("Y".equals(row.get("chk_yn"))) {
                    chked++;
                } else {
                    jdbc.executeUpdate(descId, "INSERT", row);
                    added++;
                }
            }
            message.put("chked", Integer.toString(chked));
            message.put("added", Integer.toString(added));

            message.put("code", "Y");
            message.put("mesg", "OK");
        } catch(Exception e) {
            //e.printStackTrace();
            System.err.println(e.getMessage());
            message.put("code", "E");
            message.put("mesg", e.getMessage());
        }

        result.put("message", message);

        JSONObject json = new JSONObject(result);
        String str = json.toString(2);

        res.setContentType("application/json; charset=UTF-8");
        res.getWriter().write(str);
        res.flushBuffer();
    }

}
