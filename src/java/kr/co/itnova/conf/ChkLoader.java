package kr.co.itnova.conf;

import java.io.IOException;

import kr.co.itnova.util.CustomClassLoader;

import org.dom4j.Element;

import emro.util.StringUtil;
import eswf.description.ElementXMLDescriptor;
import eswf.managers.XMLManager;

public class ChkLoader {

    private String repoPath;

    public ChkLoader(String repoId) throws Exception {
        try {
            ElementXMLDescriptor exmld = XMLManager.getInstance().getDescriptor("conf");
            Element path = exmld.getDescriptorElement(repoId);
            if(path == null) {
                throw new Exception("Please check conf.xml file...");
            }
            this.repoPath =    path.getTextTrim();
        } catch(Exception ex) {
            ex.printStackTrace();
            throw ex;
        }
    }

    public Object getObj() throws ClassNotFoundException, InstantiationException, IllegalAccessException, IOException {
        ClassLoader parentClassLoader = ConfigLoader.class.getClassLoader();
        CustomClassLoader classLoader = new CustomClassLoader(parentClassLoader);

        Class<?> clazz = classLoader.loadClass(repoPath, getName());

        Chk obj = (Chk) clazz.newInstance();

        return obj;
    }

    private String getName() {
        int start = repoPath.indexOf("kr/co/itnova");
        int end = repoPath.indexOf(".class");
        String s = repoPath.substring(start, end);
        String[] a1 = {"/"};
        String[] a2 = {"."};
        String ret = StringUtil.replace(s, a1, a2);

        return ret;
    }

    public String getRepoPath() {
        return repoPath;
    }

    public void setRepoPath(String repoPath) {
        this.repoPath = repoPath;
    }

}
