package kr.leedox;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

public class ScriptHelper {

    public static String getFromXml(String pkgt, String id) {
        String src = String.format("./src/volcano-conf/sqls/tcams/sql-bp-tcams-init-%s.xml", pkgt);
        String str = "";
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();

        try {
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.parse(src);

            Element root = doc.getDocumentElement();

            NodeList nodes = root.getElementsByTagName("sql");
            for (int i = 0; i < nodes.getLength(); i++) {
                Element element = (Element) nodes.item(i);
                if (element.getAttribute("id").equals(id)) {
                    str = element.getTextContent().trim();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return str;
    }

    public static String getPkgtScript(String come, String pkgt, String degr, String id) {
        String src = String.format("./src/volcano-conf/sqls/tcams/sql-bp-tcams-ca-%s-%s-%s.xml", come, pkgt, degr);
        String str = "";
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();

        try {
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.parse(src);

            Element root = doc.getDocumentElement();

            NodeList nodes = root.getElementsByTagName("sql");
            for (int i = 0; i < nodes.getLength(); i++) {
                Element element = (Element) nodes.item(i);
                if (element.getAttribute("id").equals(id)) {
                    str = element.getTextContent().trim();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return str;
    }

}
