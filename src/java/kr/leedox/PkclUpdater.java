package kr.leedox;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;
import org.hibernate.service.ServiceRegistryBuilder;

import emro.util.CalendarUtil;

public class PkclUpdater {

    private static SessionFactory sessionFactory;

    public static void init() {
        try {
            Configuration config = new Configuration().configure("hibernate.config.xml");
            config.setNamingStrategy(new CustomNamingStrategy());
            ServiceRegistry serviceRegistry = new ServiceRegistryBuilder().applySettings(config.getProperties()).buildServiceRegistry();
            sessionFactory = config.buildSessionFactory(serviceRegistry);
        } catch(Throwable ex) {
            System.err.println(ex.getMessage());
            ex.printStackTrace();
        }
    }

    private static Session getSession() {
        return sessionFactory.openSession();
    }


    public static void main(String[] args) {

        if(args.length < 2) {
            System.err.println("Usage: PkclUpdater MDIE CMPK");
            System.exit(0);
        }

        String come = args[0];
        String pkgt = args[1];

        Object[] pkcls = PkclDataProvider.readPkclData(come, pkgt);

        init();
        Session session = getSession();

        int chk = 0;
        int upd = 0;

        System.out.println("=================================================");
        System.out.println(">>> Checking ===> " + come + " " + pkgt);
        System.out.println("=================================================");

        for(int i = 0 ; i < pkcls.length ; i++) {
            Object[] pkclData = (Object[]) pkcls[i];
            String key1 = (String) pkclData[0];
            String key2 = (String) pkclData[1];
            String key3 = (String) pkclData[2];
            int scrnWidth = (int) pkclData[3];
            String align = (String) pkclData[4];

            PkclPK pkclPK = new PkclPK(key1, key2, key3);
            Pkcl pkcl = (Pkcl) session.get(Pkcl.class, pkclPK);

            if(pkcl == null) {
                continue;
            }

            chk++;

            if(pkcl.getPkclWithScrn() != scrnWidth || !align.equals(pkcl.getPkclColmAlgn())) {
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
    }

    private static void showPkcl(String chk, Pkcl pkcl) {
        String msg = String.format("%s: %2d %-15s ==> %s %3d %s",chk ,pkcl.getPkclSortNumb(), pkcl.getPkclPK().getKey3(), pkcl.getPkclColmAlgn(), pkcl.getPkclWithScrn(), pkcl.getPkclUpdtDate());
        System.out.println(msg);
    }
}
