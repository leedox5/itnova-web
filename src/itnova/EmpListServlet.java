package itnova;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/emp")
public class EmpListServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public EmpListServlet() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setCharacterEncoding("utf-8");
        List<EmpVo> list = new ArrayList<EmpVo>();
        ServletContext sc = request.getSession().getServletContext();
        EmpDao dao = (EmpDao) sc.getAttribute("empDao");

        list = dao.getList();	

        request.setAttribute("list", list);

        String action = request.getParameter("a");
        if("add".equals(action)) {
            request.setCharacterEncoding("utf-8");

            String num = request.getParameter("code");
            String name = request.getParameter("name");

            EmpVo vo = new EmpVo();

            vo.setNum(num);
            vo.setName(name);

            dao.insert(vo);

            response.sendRedirect("/itnova-web/emp");
        } else if("delete".equals(action)) {
        	String num = request.getParameter("code");
        	dao.delete(num);
            response.sendRedirect("/itnova-web/emp");
        } else {
            RequestDispatcher rd = request.getRequestDispatcher("/WEB-INF/views/emp.jsp");
            rd.forward(request, response);
        }
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		 doGet(request, response);
	}

}
