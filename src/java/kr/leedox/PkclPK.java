package kr.leedox;

import java.io.Serializable;

public class PkclPK implements Serializable {
    private String key1;
    private String key2;
    private String key3;
    private String key4;
    public PkclPK() {
        super();
    }
    public String getKey4() {
        return key4;
    }
    public void setKey4(String key4) {
        this.key4 = key4;
    }
    public PkclPK(String key1, String key2, String key3, String key4) {
        super();
        this.key1 = key1;
        this.key2 = key2;
        this.key3 = key3;
        this.key4 = key4;
    }
    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((key1 == null) ? 0 : key1.hashCode());
        result = prime * result + ((key2 == null) ? 0 : key2.hashCode());
        result = prime * result + ((key3 == null) ? 0 : key3.hashCode());
        return result;
    }
    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        PkclPK other = (PkclPK) obj;
        if (key1 == null) {
            if (other.key1 != null)
                return false;
        } else if (!key1.equals(other.key1))
            return false;
        if (key2 == null) {
            if (other.key2 != null)
                return false;
        } else if (!key2.equals(other.key2))
            return false;
        if (key3 == null) {
            if (other.key3 != null)
                return false;
        } else if (!key3.equals(other.key3))
            return false;
        return true;
    }
    public String getKey1() {
        return key1;
    }
    public void setKey1(String key1) {
        this.key1 = key1;
    }
    public String getKey2() {
        return key2;
    }
    public void setKey2(String key2) {
        this.key2 = key2;
    }
    public String getKey3() {
        return key3;
    }
    public void setKey3(String key3) {
        this.key3 = key3;
    }

}
