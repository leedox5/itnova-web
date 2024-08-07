package itnova;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

@WebListener
public class ContextLoaderListener implements ServletContextListener {
	Connection conn;
	@Override
	public void contextDestroyed(ServletContextEvent sce) {
		// Connection 해제
        try {
            conn.close();
        } catch (SQLException e) { }	
	}

	@Override
	public void contextInitialized(ServletContextEvent sce) {
	   ServletContext sc = sce.getServletContext();
        try {
            // Connection 준비
            Class.forName(sc.getInitParameter("driver"));
            conn = DriverManager.getConnection(sc.getInitParameter("url"));
 
            // Dao 준비
            EmpDao empDao = new EmpDao();
            empDao.setConnection(conn);
 
            // Dao 저장
            sc.setAttribute("empDao", empDao);
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
        }
	}

}
