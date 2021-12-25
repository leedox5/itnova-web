<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="itnova.EmpVo"%>
<%@page import="java.util.List"%>
<%@page import="java.util.ArrayList"%>
<%
    List<EmpVo> list = (List<EmpVo>)request.getAttribute("list");
%>
<!doctype html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>관리</title>
</head>
<body>
<form action="/itnova-web/emp" method="post">
    <input type="hidden" name="a" value="add">
    <table border="1" width="500">
        <tr>
            <td>코드</td><td><input type="text" name="code"></td>
            <td>이름</td><td><input type="text" name="name"></td>
        </tr>
        <tr>
            <td colspan=4 align=right><input type="submit" VALUE=" 확인 "></td>
        </tr>
    </table>
</form>
<br>
    <table width="500" border="1">
    <% 
    if(list != null){
        for(EmpVo vo : list){ %>
            <tr>
                <td><%= vo.getNum() %></td>
                <td><%= vo.getName() %></td>
                <td><%= vo.getDeptNum() %></td>
                <td><a href="/itnova-web/emp?a=delete&code=<%= vo.getNum() %>">삭제</a></td>
            </tr>
    <% 
        } 
    } 
    %>
    </table>
</body>
</html>