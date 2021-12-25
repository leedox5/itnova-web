package itnova;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class AppInitServlet
 */
@WebServlet("/AppInitServlet")
public class AppInitServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	public AppInitServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

	public void init(ServletConfig config) throws ServletException {
	    System.out.println("AppInitServlet.init() called");
	    super.init(config);
	 
	    // 모든 서블릿이 사용할 수 있도록 ServletContext 인스턴스에 저장
	    ServletContext sc = this.getServletContext();
	 
	    try {
	        Class.forName(sc.getInitParameter("driver"));
	        Connection conn = DriverManager.getConnection(sc.getInitParameter("url"));
	 
	        sc.setAttribute("conn", conn);
	    } catch (Throwable e) {
	        throw new ServletException(e);
	    }		
	}
	
	public void destroy() {
	     System.out.println("AppInitServlet.destroy() called");
	     super.destroy();
	     
	     Connection conn = (Connection) this.getServletContext().getAttribute("conn");
	
	     try {
	         if(conn != null && !conn.isClosed()) conn.close();
	     } catch (SQLException e) {
	         e.printStackTrace();
	     }
	}	
}
