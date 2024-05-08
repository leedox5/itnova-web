package kr.co.itnova.conf;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;

import eswf.exception.FoundationException;

public interface Chk {
	void chk(HttpServletRequest req, HttpServletResponse res) throws JSONException, IOException, FoundationException;
}
