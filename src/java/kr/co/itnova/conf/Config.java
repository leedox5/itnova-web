package kr.co.itnova.conf;

import java.util.Map;

public interface Config {
	Map<String, String> check(Map<String, Object> param) throws Exception;
}
