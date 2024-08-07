package itnova;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class MtcdServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public MtcdServlet() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("driver:" + this.getInitParameter("driver"));
		EmpDao dao = new EmpDao();
		try {
			dao.setConnection(getConnectionInit());
		} catch (SQLException e) {
			e.printStackTrace();
		}
		List<EmpVo> list = new ArrayList<EmpVo>();
		list = dao.getList();
		request.setAttribute("list", list);

		RequestDispatcher rd = request.getRequestDispatcher("/WEB-INF/views/emp.jsp");
        rd.forward(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	}
	
	private Connection getConnection() throws SQLException {
		Connection con = null;
		try {
			Class.forName(this.getInitParameter("driver"));
			con = DriverManager.getConnection(this.getInitParameter("url"));
		}catch(ClassNotFoundException e){
			System.err.println(e.getClass().getName() + ": " + e.getMessage());
			System.exit(0);
		}
		return con;
	}

	private Connection getConnectionCont() throws SQLException {
		Connection con = null;
		ServletContext sc = this.getServletContext();
		try {
			Class.forName(sc.getInitParameter("driver"));
			con = DriverManager.getConnection(sc.getInitParameter("url"));
		}catch(ClassNotFoundException e){
			System.err.println(e.getClass().getName() + ": " + e.getMessage());
			System.exit(0);
		}
		return con;
	}
	private Connection getConnectionInit() throws SQLException {
		ServletContext sc = this.getServletContext();
		return (Connection)sc.getAttribute("conn");
	}
}
