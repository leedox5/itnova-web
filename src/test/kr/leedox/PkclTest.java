package kr.leedox;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Map;

import junitparams.JUnitParamsRunner;
import junitparams.Parameters;

import org.hibernate.Criteria;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;

import emro.util.CalendarUtil;

@RunWith(JUnitParamsRunner.class)
public class PkclTest {

    private static SessionFactory sessionFactory;

    @BeforeClass
    public static void init() {
        try {
            Configuration conf = new Configuration().configure("hibernate.cfg.sqlite.xml");
            conf.setNamingStrategy(new CustomNamingStrategy());
            ServiceRegistry serviceRegistry = new StandardServiceRegistryBuilder().applySettings(conf.getProperties())
                    .build();
            sessionFactory = conf.buildSessionFactory(serviceRegistry);
        } catch (Throwable ex) {
            ex.printStackTrace();
        }
    }

    @Test
    @Parameters({ "K1, TERM, CATBTERT, TERT_CORP_CODE, 40" })
    public void withScrnTest(String k1, String k2, String k3, String k4, int expected) {
        PkclPK pkclPK = new PkclPK(k1, k2, k3, k4);
        assertThat(pkclPK).isNotNull();

        Session session = sessionFactory.openSession();
        assertThat(session).isNotNull();

        Pkcl pkcl = (Pkcl) session.get(Pkcl.class, pkclPK);
        assertThat(pkcl).isNotNull();

        assertThat(pkcl.getPkclWithScrn()).isEqualTo(expected);
    }

    @Test
    public void scriptTest() {
        Session session = sessionFactory.getCurrentSession();
        String script = ScriptHelper.getFromXml("SELECT");

        System.out.println(script);

        Transaction tx = session.beginTransaction();
        SQLQuery query = session.createSQLQuery(script);
        query.setResultTransformer(Criteria.ALIAS_TO_ENTITY_MAP);

        List<?> rows = query.list();

        assertThat(rows.size()).isEqualTo(14);

        for (Object object : rows) {
            Map<?, ?> row = (Map<?, ?>) object;
            System.out.println(row.get("PKCL_SORT_NUMB") + " " + row.get("CHK_YN") + " " + row.get("UPDATED_YN"));
            if (row.get("CHK_YN").equals("N") || row.get("UPDATED_YN").equals("N")) {
                String key1 = (String) row.get("PKCL_CORP_CODE");
                String key2 = (String) row.get("PKCL_COME_CODE");
                String key3 = (String) row.get("PKCL_TABL_ID");
                String key4 = (String) row.get("PKCL_COLM_ID");
                PkclPK pkclPK = new PkclPK(key1, key2, key3, key4);
                Pkcl pkcl = new Pkcl();
                pkcl.setPkclPK(pkclPK);
                pkcl.setPkclColmAlgn((String) row.get("PKCL_COLM_ALGN"));
                pkcl.setPkclSortNumb((int) row.get("PKCL_SORT_NUMB"));
                pkcl.setPkclWithScrn((int) row.get("PKCL_WITH_SCRN"));
                pkcl.setPkclUpdtDate(CalendarUtil.formatNow("yyyyMMdd HHmmss"));

                session.saveOrUpdate(pkcl);
            }
        }
        tx.commit();
    }
}
