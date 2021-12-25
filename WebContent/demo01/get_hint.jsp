<%@ page language="java" contentType="text/plain; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.itnova.util.*" %>
<%
	String[] hints = {
			"Anna"
		,	"Brittany"  
		,	"Cinderella"
		,	"Diana"     
		,	"Eva"       
		,	"Fiona"     
		,	"Gunda"     
		,	"Hege"      
		,	"Inga"      
		,	"Johanna"   
		,	"Kitty"     
		,	"Linda"     
		,	"Nina"      
		,	"Ophelia"   
		,	"Petunia"   
		,	"Amanda"    
		,	"Raquel"    
		,	"Cindy"     
		,	"Doris"     
		,	"Eve"       
		,	"Evita"     
		,	"Sunniva"   
		,	"Tove"      
		,	"Unni"      
		,	"Violet"    
		,	"Liza"      
		,	"Elizabeth" 
		,	"Ellen"     
		,	"Wenche"    
		,	"Vicky"     
		,   "강감찬"
	};

	String source = request.getParameter("str") == null ? "A" : new String(request.getParameter("str").getBytes("8859_1"),"KSC5601");
	out.println(StringUtility.hintList(source, hints));
%>