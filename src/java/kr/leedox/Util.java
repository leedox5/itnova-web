package kr.leedox;

import java.util.ArrayList;

import org.assertj.core.util.Arrays;

public class Util {

    public static String repeat(String str, int count) {
        StringBuffer sb = new StringBuffer();
        for (int j = 0; j < count; j++) {
            sb.append(str);
        }
        return sb.toString();
    }

    public static Object[] append(Object[] obj, Object[] newObj) {
        ArrayList<Object> temp = new ArrayList<Object>(Arrays.asList(obj));
        temp.add(newObj);
        return temp.toArray();
    }
}
