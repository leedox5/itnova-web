package kr.leedox;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

public class PkclDataProvider {
    public static Object[] readPkclData(String come, String pkgt) {
        FileResourcesUtil util = new FileResourcesUtil();
        Object[] pkcls = new Object[] { };

        String dictName = "txt/kr/leedox/DICT.txt";
        InputStream inputStream = util.getFileFromResourceAsStream(dictName);

        try(InputStreamReader streamReader = new InputStreamReader(inputStream, StandardCharsets.UTF_8);
                BufferedReader reader = new BufferedReader(streamReader)) {
            String line;
            while((line = reader.readLine()) != null) {
                String[] arr = line.split(",");
                pkcls = Util.append(pkcls, new Object[] {"K1", come, "CATB" + pkgt, pkgt + "_" + arr[0].trim(), Integer.parseInt(arr[1].trim()), arr[2].trim()});
            }
        } catch(IOException e) {
            e.printStackTrace();
        }

        String fileName = String.format("txt/kr/leedox/%s.txt", pkgt);

        try {
            inputStream = util.getFileFromResourceAsStream(fileName);
            try(InputStreamReader streamReader = new InputStreamReader(inputStream, StandardCharsets.UTF_8);
                    BufferedReader reader = new BufferedReader(streamReader)) {
                String line;
                while((line = reader.readLine()) != null) {
                    String[] arr = line.split(",");
                    pkcls = Util.append(pkcls, new Object[] {arr[0].trim(), arr[1].trim(), arr[2].trim(), Integer.parseInt(arr[3].trim()), arr[4].trim()});
                }
            } catch(IOException e) {
                e.printStackTrace();
            }
        } catch(Exception e) {
            System.err.println(e.getMessage());
            System.out.println("SKIP: " + fileName);
        }


        /* ---
        return new Object[] {
            new Object[] {"MDIE", "PFRAMDIN", "MDIN_STND_DEGR",  40, "R"},
            new Object[] {"MDIE", "PFRAMDIN", "MDIN_SORT_NUMB",  60, "R"},
            new Object[] {"MDIE", "PFRAMDIN", "MDIN_MGUB_CODE", 100, "L"},
            new Object[] {"MDIE", "PFRAMDIN", "MDIN_HAMC_YN"  ,  70, "L"},
            new Object[] {"MDIE", "PFRAMDIN", "MDIN_GRIN_YN"  ,  70, "L"},
        };
        --- */
        return pkcls;
    }

    public static Object[] providePkclData() {
        return readPkclData("MDIE", "MDIN");
    }
}
