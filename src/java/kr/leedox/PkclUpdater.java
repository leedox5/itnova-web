package kr.leedox;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;
import emro.util.CalendarUtil;

public class PkclUpdater {

    private static SessionFactory sessionFactory;

    public static void init(String db) {
        try {
            String cfg = String.format("hibernate.cfg.%s.xml", db);
            Configuration config = new Configuration().configure(cfg);
            config.setNamingStrategy(new CustomNamingStrategy());
            ServiceRegistry serviceRegistry = new StandardServiceRegistryBuilder().applySettings(config.getProperties())
                    .build();
            sessionFactory = config.buildSessionFactory(serviceRegistry);
        } catch (Throwable ex) {
            System.err.println(ex.getMessage());
            ex.printStackTrace();
        }
    }

    private static Session getSession() {
        return sessionFactory.openSession();
    }

    public static void main(String[] args) {

        if (args.length < 3) {
            System.err.println("Usage: PkclUpdater sqlite MDIE CMPK");
            System.exit(0);
        }

        String db = args[0];
        String come = args[1];
        String pkgt = args[2];

        Object[] pkcls = PkclDataProvider.readPkclData(come, pkgt);

        init(db);
        Session session = getSession();

        int chk = 0;
        int upd = 0;

        System.out.println("=================================================");
        System.out.println(">>> Checking ===> " + come + " " + pkgt);
        System.out.println("=================================================");

        for (int i = 0; i < pkcls.length; i++) {
            Object[] pkclData = (Object[]) pkcls[i];
            String key1 = (String) pkclData[0];
            String key2 = (String) pkclData[1];
            String key3 = (String) pkclData[2];
            String key4 = (String) pkclData[3];
            int scrnWidth = (int) pkclData[4];
            String align = (String) pkclData[5];

            PkclPK pkclPK = new PkclPK(key1, key2, key3, key4);
            Pkcl pkcl = (Pkcl) session.get(Pkcl.class, pkclPK);

            if (pkcl == null) {
                continue;
            }

            chk++;

            if (pkcl.getPkclWithScrn() != scrnWidth || !align.equals(pkcl.getPkclColmAlgn())) {
                System.out.println("-------------------------------------------------");
                showPkcl("CHK", pkcl);
                Transaction tx = session.beginTransaction();
                pkcl.setPkclWithScrn(scrnWidth);
                pkcl.setPkclColmAlgn(align);
                pkcl.setPkclUpdtDate(CalendarUtil.formatNow("yyyyMMdd HHmmss"));
                session.save(pkcl);
                tx.commit();
                upd++;
                showPkcl("==>", pkcl);
                System.out.println("-------------------------------------------------");
            } else {
                showPkcl("CHK", pkcl);
            }
        }
        System.out.println("=================================================");
        System.out.println(String.format(">>> STAT ===> CHK: %2d, UPD: %2d", chk, upd));
        System.out.println("=================================================");

        sessionFactory.close();
        System.exit(0);
    }

    private static void showPkcl(String chk, Pkcl pkcl) {
        String msg = String.format("%s: %2d %-15s ==> %s %3d %s", chk, pkcl.getPkclSortNumb(),
                pkcl.getPkclPK().getKey3(), pkcl.getPkclColmAlgn(), pkcl.getPkclWithScrn(), pkcl.getPkclUpdtDate());
        System.out.println(msg);
    }
}
