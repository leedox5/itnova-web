<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="itnova.EmpDao"%>
<%@page import="itnova.EmpVo"%>
<%@page import="java.util.List"%>
<%@page import="java.util.ArrayList"%>
<%
    List<EmpVo> list = new ArrayList<EmpVo>();
    ServletContext sc = request.getSession().getServletContext();
    EmpDao dao = (EmpDao) sc.getAttribute("empDao");

    list = dao.getList();	
%>
<!doctype html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>방명록</title>
</head>
<body>
<form action="add.jsp" method="post">
    <table border="1" width="500">
        <tr>
            <td>이름</td><td><input type="text" name="name"></td>
            <td>비밀번호</td><td><input type="password" name="pwd"></td>
        </tr>
        <tr>
            <td colspan=4><textarea name="content" cols=60 rows=5></textarea></td>
        </tr>
        <tr>
            <td colspan=4 align=right><input type="submit" VALUE=" 확인 "></td>
        </tr>
    </table>
</form>
<br>
    <% if(list != null){
        for(EmpVo vo : list){ %>
        <table width="510" border="1">
            <tr>
                <td><%= vo.getNum() %></td>
                <td><%= vo.getName() %></td>
                <td><%= vo.getDeptNum() %></td>
                <td><a href="/guestbook/deleteform.jsp?no=<%= vo.getNum() %>">삭제</a></td>
            </tr>
        </table>
        <br>
        <% } %>
    <% } %>
</body>
</html>