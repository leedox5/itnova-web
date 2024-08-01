package kr.leedox;

public class Util {

    public static String repeat(String str, int count) {
        StringBuffer sb = new StringBuffer();
        for (int j = 0; j < count; j++) {
            sb.append(str);
        }
        return sb.toString();
    }

}
