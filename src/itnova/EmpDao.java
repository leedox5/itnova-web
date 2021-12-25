package itnova;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class EmpDao {
	private Connection connection;
	
	/*
	private Connection getConnection() throws SQLException {
	
		try {
			Class.forName("org.sqlite.JDBC");
			con = DriverManager.getConnection("jdbc:sqlite:E:/workspace/adworks/KNDA.db");
		}catch(ClassNotFoundException e){
			System.err.println(e.getClass().getName() + ": " + e.getMessage());
			System.exit(0);
		}
		return con;
	}
	*/

    public List<EmpVo> getList(){
        List<EmpVo> list = new ArrayList<EmpVo>();
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            String sql = " SELECT ST_NUM, ST_NAME, D_NUM FROM STUDENT ";

            pstmt = connection.prepareStatement(sql);
            rs = pstmt.executeQuery();

            while(rs.next()) {
            	EmpVo vo = new EmpVo();
                vo.setNum(rs.getString(1));
                vo.setName(rs.getString(2));
                vo.setDeptNum(rs.getString(3));

                list.add(vo);
            }
        }
        catch (SQLException e) {
            System.out.println(e);
        }

        return list;
    }

	public void setConnection(Connection connection) {
		this.connection = connection;
	}

	public boolean insert(EmpVo emp) {
	    boolean result = false;
        PreparedStatement pstmt = null;

	    try {

	        String sql = "INSERT INTO STUDENT VALUES (?, ?, null)";
	        pstmt = connection.prepareStatement(sql);

	        pstmt.setString(1, emp.getNum());
	        pstmt.setString(2, emp.getName());
	        int count = pstmt.executeUpdate();

	        result = (count == 1);
	    }
	    catch (SQLException e) {
	        e.printStackTrace();
	    }
	    return result;
	}

	public boolean delete(String num) {
	    boolean result = false;
        PreparedStatement pstmt = null;

	    try {
	        String sql = "DELETE FROM STUDENT WHERE ST_NUM = ?";
	        pstmt = connection.prepareStatement(sql);

	        pstmt.setString(1, num);
	        int count = pstmt.executeUpdate();

	        result = (count == 1);
	    }
	    catch (SQLException e) {
	        e.printStackTrace();
	    }
	    return result;
	}
}
