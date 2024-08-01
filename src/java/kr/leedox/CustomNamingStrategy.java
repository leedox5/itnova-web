package kr.leedox;

import org.hibernate.cfg.ImprovedNamingStrategy;

public class CustomNamingStrategy extends ImprovedNamingStrategy {

    private static final long serialVersionUID = 1L;

    @Override
    public String tableName(String tableName) {
        return tableName;
    }

    @Override
    public String columnName(String columnName) {
    	return columnName;
    }
}
