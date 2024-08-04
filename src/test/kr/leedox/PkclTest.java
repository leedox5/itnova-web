package kr.leedox;

import static org.assertj.core.api.Assertions.assertThat;
import junitparams.JUnitParamsRunner;
import junitparams.Parameters;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;

@RunWith(JUnitParamsRunner.class)
public class PkclTest {

    private static SessionFactory sessionFactory;
    
    @BeforeClass
    public static void init() {
        try {
            Configuration conf = new Configuration().configure("hibernate.cfg.tibero.xml");
            conf.setNamingStrategy(new CustomNamingStrategy());
            ServiceRegistry serviceRegistry = new StandardServiceRegistryBuilder().applySettings(conf.getProperties()).build();
            sessionFactory = conf.buildSessionFactory(serviceRegistry);
        } catch(Throwable ex) {
            ex.printStackTrace();
        }
    }
    
    @Test
    @Parameters({"K1, TERM, CATBTERT, TERT_CORP_CODE, 40"})
    public void withScrnTest(String k1, String k2, String k3, String k4, int expected) {
        PkclPK pkclPK = new PkclPK(k1, k2, k3, k4);
        assertThat(pkclPK).isNotNull();
        
        Session session = sessionFactory.openSession();
        assertThat(session).isNotNull();
        
        Pkcl pkcl = (Pkcl) session.get(Pkcl.class, pkclPK);
        assertThat(pkcl).isNotNull();
        
        assertThat(pkcl.getPkclWithScrn()).isEqualTo(expected);
    }

}
