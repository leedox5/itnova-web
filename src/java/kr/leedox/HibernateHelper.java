package kr.leedox;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;

public class HibernateHelper {
    private static SessionFactory sessionFactory;

    static {
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

    public static Session getSession() {
        return sessionFactory.openSession();
    }

    public static void close() {
        sessionFactory.close();
    }
}
