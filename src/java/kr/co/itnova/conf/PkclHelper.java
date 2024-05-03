package kr.co.itnova.conf;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;

import eswf.exception.FoundationException;

public class PkclHelper implements Chk {

    private Map<String, Object> result;
    private Map<String, String> message;


    public PkclHelper() {
        super();
        result = new HashMap<>();
        message = new HashMap<>();
    }


    @Override
    public void chk(HttpServletRequest req, HttpServletResponse res)
            throws JSONException, IOException, FoundationException {
        message.put("code", "Y");
        message.put("mesg", "OK");

        result.put("message", message);

        JSONObject json = new JSONObject(result);
        String str = json.toString(2);

        res.setContentType("application/json; charset=UTF-8");
        res.getWriter().write(str);
        res.flushBuffer();
    }

}
