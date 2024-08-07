package kr.leedox;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

public class ScriptHelper {

    public static String getFromXml(String id) {
        String str = "";
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();

        try {
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.parse("./src/volcano-conf/sqls/tcams/sql-bp-tcams-init-CITBPKCL.xml");

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
