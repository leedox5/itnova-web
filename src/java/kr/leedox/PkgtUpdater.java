package kr.leedox;

import java.util.List;
import java.util.Map;

import javax.lang.model.type.NullType;

import org.hibernate.Criteria;
import org.hibernate.Hibernate;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.type.StringType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PkgtUpdater {
    private String come;
    private String pkgt;
    private String degr;

    public void chk() {
        Session session = HibernateHelper.getSession();
        String src = ScriptHelper.getFromXml(pkgt, "CREATE");
        System.out.println(src);
        Transaction tx = session.beginTransaction();
        SQLQuery query = session.createSQLQuery(src);
        query.executeUpdate();
        tx.commit();
    }

    public void execute() {
        Session session = HibernateHelper.getSession();

        String src = ScriptHelper.getPkgtScript(come, pkgt, degr, "select.240819");
        src = src.replaceAll("FROM DUAL", "");
        System.out.println(src);

        SQLQuery query = session.createSQLQuery(src);
        query.setResultTransformer(Criteria.ALIAS_TO_ENTITY_MAP);

        List<?> rows = query.list();
        System.out.println(rows.size());

        String insScript = ScriptHelper.getPkgtScript(come, pkgt, degr, "insert");

        int chk = 0;
        int add = 0;
        Transaction tx = session.beginTransaction();
        for (Object object : rows) {
            Map<?, ?> row = (Map<?, ?>) object;
            if (row.get("MG_MODE").equals("I")) {
                String tempSql = insScript;
                for (Object key : row.keySet()) {
                    String k = key.toString();
                    String v = String.format("'%s'", (String) row.get(key));
                    tempSql = tempSql.replace("#" + k.toLowerCase() + "#", v);
                }
                System.out.println(tempSql);
                SQLQuery insSql = session.createSQLQuery(tempSql);
                insSql.executeUpdate();
                add++;
            }
            chk++;
        }
        tx.commit();
        HibernateHelper.close();
        String stat = String.format(">> CHK: %2d ADD: %2d", chk, add);
        System.out.println(stat);
    }
}
