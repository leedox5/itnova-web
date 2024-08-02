package kr.leedox;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

public class FileResourcesUtil {

    public static void main(String[] args) {
        FileResourcesUtil app = new FileResourcesUtil();

        String fileName = "kr/leedox/resources/MDIN.txt";
        InputStream is = app.getFileFromResourceAsStream(fileName);

        try(InputStreamReader streamReader = new InputStreamReader(is, StandardCharsets.UTF_8);
            BufferedReader reader = new BufferedReader(streamReader)) {
            String line;
            while((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        } catch(IOException e) {
            e.printStackTrace();
        }
    }

    InputStream getFileFromResourceAsStream(String fileName) {
        ClassLoader classLoader = getClass().getClassLoader();
        InputStream inputStream = classLoader.getResourceAsStream(fileName);

        if (inputStream == null) {
            throw new IllegalArgumentException("File not found: " + fileName);
        } else {
            return inputStream;
        }

    }
}
